#!/usr/bin/env python3
"""The book and the audiobook on the Internet Archive (archive.org).

Run by the workflow "Internet Archive" (.github/workflows/internet-archive.yml).
Four items, one per kind and language, each with its title, description and
files in that language only; created the first time and updated after that:

    book  el  mindfulness-guide-neurodivergents-2nd-edition      workbook_el.pdf, .epub
    audio el  mindfulness-guide-neurodivergents-audiobook        el-NN.mp3, mindfulness-guide-el.mp3, .m4b
    book  en  mindfulness-guide-neurodivergents-2nd-edition-en   workbook_en.pdf, .epub
    audio en  mindfulness-guide-neurodivergents-audiobook-en     en-NN.mp3, mindfulness-guide-en.mp3, .m4b

The books come from public/, the audiobook from the GitHub Release "audiobook"
(<lang>-NN.mp3 one per chapter, mindfulness-guide-<lang>.mp3 and .m4b the whole
book). Every item also gets the book's cover as its picture (__ia_thumb.jpg).

Modes:

    list       the account's items on archive.org (to tell which are the first
               edition), and whether the four identifiers are taken
    dry-run    everything an upload would do, nothing sent
    upload     creates or updates the items
    point-old  a note at the top of the two first-edition items, in their own
               language, pointing to the new items of that language

What an upload deletes on archive.org: only the other language's original files
in an item that exists (the two Greek items held both languages until November
2026), and only by their exact names: workbook_<other>.pdf and .epub in a book
item; <other>-NN.mp3, mindfulness-guide-<other>.mp3 and .m4b in an audiobook
item; each with the files archive.org derived from it. Nothing else is ever
deleted. A file with the same name is replaced; a file whose MD5 matches the
one already there is not sent again; the item's metadata is set to the fields
below (other fields stay as they are).

The words of the descriptions come from the book itself (book/workbook_*.md:
title, subtitle, "Who Is This Book For?", the note before you begin) and from
the site's texts (scripts/llms-txt.ts, the audiobook's release notes).

Keys: IA_ACCESS_KEY and IA_SECRET_KEY (https://archive.org/account/s3.php).

    python3 tools/internet_archive.py list
    python3 tools/internet_archive.py dry-run --audio-dir /tmp/audiobook [--langs el,en]
    python3 tools/internet_archive.py upload  --audio-dir /tmp/audiobook [--langs el,en] \\
        [--summary "$GITHUB_STEP_SUMMARY"]
    python3 tools/internet_archive.py point-old [--langs el,en]
"""
import argparse
import hashlib
import html
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COVER = ROOT / 'book' / 'img' / '00-cover.jpg'
THUMB = '__ia_thumb.jpg'

LANGS = ('el', 'en')
KINDS = ('texts', 'audio')
OTHER_LANG = {'el': 'en', 'en': 'el'}
# One item per (kind, language). The Greek ones are the two items made on
# 19/11/2026 (then with both languages), kept so their links stay the same.
IDS = {
    ('texts', 'el'): 'mindfulness-guide-neurodivergents-2nd-edition',
    ('audio', 'el'): 'mindfulness-guide-neurodivergents-audiobook',
    ('texts', 'en'): 'mindfulness-guide-neurodivergents-2nd-edition-en',
    ('audio', 'en'): 'mindfulness-guide-neurodivergents-audiobook-en',
}
# The first edition (September 2026), one item per language.
OLD_IDS = {
    'el': 'httpsneurodivergent-mindfulness.org_202610',
    'en': 'httpsneurodivergent-mindfulness.org',
}

SITE_URL = 'https://neurodivergent-mindfulness.org'
# src/seo/head.ts (SITE_NAME), scripts/seo-meta.ts (LICENSE_URL)
SITE_NAME = {'el': 'Ενσυνειδητότητα για Νευροδιαφορετικούς', 'en': 'Neurodivergent Mindfulness'}
LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
# Both spellings, the item's own language first, so a search finds either.
CREATOR = {'el': ['Θεόδωρος Μπαϊρακτάρης', 'Theodoros Bairaktaris'],
           'en': ['Theodoros Bairaktaris', 'Θεόδωρος Μπαϊρακτάρης']}
DATE = '2026'
# MARC 21 language codes, as archive.org asks for (gre = Modern Greek).
LANGUAGE = {'el': 'gre', 'en': 'eng'}
SUBJECT = {'el': ['ενσυνειδητότητα', 'ΔΕΠΥ', 'αυτισμός', 'Τετραπλός Άξονας', 'mindfulness', 'neurodivergent'],
           'en': ['mindfulness', 'neurodivergent', 'ADHD', 'autism', 'trauma-informed', 'Fourfold Axis',
                  'self-regulation']}
AUDIO_SUBJECT = {'el': ['ακουστικό βιβλίο'], 'en': ['audiobook']}
# New items go to the community collections, open to every account.
COLLECTION = {'texts': 'opensource', 'audio': 'opensource_audio'}

# scripts/llms-txt.ts (notStudied, the licence line)
NOT_STUDIED = {'el': 'Η μέθοδος ως σύνολο δεν έχει μελετηθεί ακόμα.',
               'en': 'The method as a whole has not been studied yet.'}
LICENCE_WORD = {'el': 'Άδεια του βιβλίου', 'en': 'Licence of the book'}
# The audiobook's release notes (audiobook.yml) and tools/README.md
VOICE_LINE = {
    'el': 'Ακουστικό βιβλίο του οδηγού, με συνθετική φωνή (Google Chirp 3 HD, Gacrux). '
          'Ένα MP3 ανά κεφάλαιο, ένα MP3 όλο το βιβλίο και ένα M4B με κεφάλαια.',
    'en': 'Audiobook of the workbook, read by a synthetic voice (Google Chirp 3 HD, Sulafat). '
          'One MP3 per chapter, the whole book in one MP3, and an M4B with chapter marks.',
}
EDITION = {'el': '2η έκδοση', 'en': '2nd edition'}
AUDIOBOOK = {'el': 'ακουστικό βιβλίο', 'en': 'audiobook'}
# The same language's other item (book <-> audiobook).
SIBLING = {'texts': {'el': 'Το ακουστικό βιβλίο', 'en': 'The audiobook'},
           'audio': {'el': 'Το βιβλίο (PDF και EPUB)', 'en': 'The book (PDF and EPUB)'}}
# The other language's item of the same kind, named in that language.
OTHER_EDITION = {'el': 'English edition', 'en': 'Ελληνική έκδοση'}

AUDIO_NAME = re.compile(r'^(?:(el|en)-\d{2}\.mp3|mindfulness-guide-(el|en)\.(?:mp3|m4b))$')
RETRY_STATUS = {429, 500, 502, 503, 504}


# ---------------------------------------------------------------- identifiers

def check_identifier(identifier):
    """An archive.org identifier: 5 to 100 letters, digits, '.', '_' or '-',
    starting with a letter or digit (archive.org's own rule is 3 to 100; it
    advises against very short ones)."""
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]{4,99}', identifier or ''):
        raise ValueError(f'not a valid archive.org identifier: {identifier!r} '
                         '(5-100 characters: letters, digits, ".", "_", "-"; first a letter or digit)')
    return identifier


for _ident in list(IDS.values()) + list(OLD_IDS.values()):
    check_identifier(_ident)
assert len(set(IDS.values())) == len(IDS)


def mask_email(email):
    """t***@g***.com"""
    if not email or '@' not in email:
        return '***'
    local, domain = email.split('@', 1)
    host, _, tld = domain.rpartition('.')
    return f'{local[:1]}***@{(host or domain)[:1]}***' + (f'.{tld}' if host else '')


def kind_name(kind, lang):
    return f'{"Book" if kind == "texts" else "Audiobook"} ({lang})'


# ---------------------------------------------------------------- the book's words

def _paragraphs(lines):
    out, cur = [], []
    for line in lines:
        if line.strip():
            cur.append(line.strip())
        elif cur:
            out.append(' '.join(cur))
            cur = []
    if cur:
        out.append(' '.join(cur))
    return out


def _inline(text):
    """Markdown emphasis to HTML, the rest escaped."""
    text = html.escape(text, quote=False)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    return re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<i>\1</i>', text)


def book_words(lang, root=ROOT):
    """Title, subtitle, the axis line, author and edition, "Who Is This Book For?"
    and the note before you begin, as the book has them."""
    md = (root / 'book' / f'workbook_{lang}.md').read_text(encoding='utf-8')
    md = re.sub(r'\A---\n.*?\n---\n', '', md, flags=re.S)        # front matter (en)
    lines = md.split('\n')

    def first(pattern):
        for line in lines:
            m = re.match(pattern, line)
            if m:
                return m.group(1).strip()
        raise ValueError(f'workbook_{lang}.md: no line like {pattern!r}')

    def section(heading):
        start = next((i for i, l in enumerate(lines) if re.match(heading, l)), None)
        if start is None:
            raise ValueError(f'workbook_{lang}.md: no heading like {heading!r}')
        end = next((i for i in range(start + 1, len(lines)) if re.match(r'#{1,3}\s', lines[i])), len(lines))
        return _paragraphs(lines[start + 1:end])

    note_head = r'>\s*\*\*(Μια σημείωση πριν ξεκινήσεις|A note before you begin)'
    start = next((i for i, l in enumerate(lines) if re.match(note_head, l)), None)
    if start is None:
        raise ValueError(f'workbook_{lang}.md: no "note before you begin"')
    note = []
    for line in lines[start:]:
        if not line.startswith('>'):
            break
        note.append(line.lstrip('>').strip())

    return {
        'title': first(r'#\s+(.+)$'),
        'subtitle': first(r'##\s+(.+)$'),
        'axis': first(r'\*([^*].*[^*])\*\s*$'),
        'author': first(r'((?:Συγγραφέας|Author):.+)$'),
        'edition': first(r'((?:Έκδοση|Edition):.+)$'),
        'who_for': section(r'##\s+(Για Ποιον Είναι Αυτό το Βιβλίο;|Who Is This Book For\?)\s*$'),
        'note': ' '.join(note),
    }


# ---------------------------------------------------------------- metadata

def item_url(identifier):
    return f'https://archive.org/details/{identifier}'


def _link(label, identifier):
    return f'{label}: <a href="{item_url(identifier)}">{item_url(identifier)}</a>'


def description(kind, lang, w, sibling_id=None, other_lang_id=None):
    """The item's description, in its own language (HTML, as archive.org shows it).
    sibling_id: the same language's other item (book <-> audiobook);
    other_lang_id: the other language's item of the same kind."""
    p = [f'<b>{_inline(w["title"])}</b><br />{_inline(w["subtitle"])}<br /><i>{_inline(w["axis"])}</i>'
         f'<br />{_inline(w["author"])}<br />{_inline(w["edition"])}']
    if kind == 'audio':
        p.append(html.escape(VOICE_LINE[lang], quote=False))
    p += [_inline(x) for x in w['who_for']]
    p.append(_inline(w['note']))
    p.append(html.escape(NOT_STUDIED[lang], quote=False))
    p.append(f'{html.escape(SITE_NAME[lang])}: <a href="{SITE_URL}/{lang}">{SITE_URL}/{lang}</a>')
    if sibling_id:
        p.append(_link(SIBLING[kind][lang], sibling_id))
    p.append(f'{LICENCE_WORD[lang]}: <a href="{LICENSE_URL}">CC BY-NC-ND 4.0</a>')
    if other_lang_id:
        p.append(_link(OTHER_EDITION[lang], other_lang_id))
    return ''.join(f'<p>{x}</p>' for x in p)


def title(kind, lang, w):
    if kind == 'audio':
        return f'{w["title"]} ({AUDIOBOOK[lang]}, {EDITION[lang]})'
    return f'{w["title"]} — {w["subtitle"]} ({EDITION[lang]})'


def metadata(kind, lang, w, sibling_id=None, other_lang_id=None):
    """kind: 'texts' (the book) or 'audio' (the audiobook); all in `lang`."""
    return {
        'mediatype': kind,
        'collection': COLLECTION[kind],
        'title': title(kind, lang, w),
        'creator': list(CREATOR[lang]),
        'date': DATE,
        'language': LANGUAGE[lang],
        'licenseurl': LICENSE_URL,
        'subject': SUBJECT[lang] + (AUDIO_SUBJECT[lang] if kind == 'audio' else []),
        'description': description(kind, lang, w, sibling_id, other_lang_id),
    }


def update_fields(md):
    """What is set on an item that already exists: not its mediatype or collection
    (archive.org decides those once; a first-edition item keeps its own)."""
    return {k: v for k, v in md.items() if k not in ('mediatype', 'collection')}


def _as_list(v):
    if v is None:
        return []
    return [str(x) for x in v] if isinstance(v, (list, tuple)) else [str(v)]


def changed_fields(current, wanted):
    """The fields of `wanted` that differ from the item's `current` metadata."""
    return sorted(k for k, v in wanted.items() if _as_list(current.get(k)) != _as_list(v))


# ---------------------------------------------------------------- files

def book_files(public_dir, lang):
    """{name on archive.org: local path} of one language's book, and the names that are missing."""
    found, missing = {}, []
    for ext in ('pdf', 'epub'):
        name = f'workbook_{lang}.{ext}'
        path = Path(public_dir) / name
        (found.__setitem__(name, path) if path.is_file() else missing.append(name))
    return found, missing


def _audio_key(name):
    m = re.match(r'(el|en)-(\d{2})\.mp3$', name)
    if m:
        return (m.group(1), 0, int(m.group(2)), name)
    m = re.match(r'mindfulness-guide-(el|en)\.(mp3|m4b)$', name)
    return (m.group(1), 1, 0, name)


def audio_files(audio_dir, lang):
    """One language's audiobook files in audio_dir, in reading order."""
    d = Path(audio_dir) if audio_dir else None
    if not d or not d.is_dir():
        return {}
    picked = []
    for p in d.iterdir():
        m = AUDIO_NAME.match(p.name)
        if p.is_file() and m and (m.group(1) or m.group(2)) == lang:
            picked.append(p.name)
    return {n: d / n for n in sorted(picked, key=_audio_key)}


def deletable_names(kind, lang):
    """The only names that may ever be deleted from the item (kind, lang): the
    other language's original files of that kind, by their exact names."""
    o = OTHER_LANG[lang]
    if kind == 'texts':
        return frozenset({f'workbook_{o}.pdf', f'workbook_{o}.epub'})
    return frozenset({f'{o}-{n:02d}.mp3' for n in range(100)}
                     | {f'mindfulness-guide-{o}.mp3', f'mindfulness-guide-{o}.m4b'})


def plan_deletions(kind, lang, remote_files):
    """[(name, 'delete' | 'skip: not an original')] for the item's files that
    are in deletable_names(kind, lang); remote_files: the item's file list."""
    allowed = deletable_names(kind, lang)
    out = []
    for f in remote_files or []:
        name = f.get('name')
        if name in allowed:
            out.append((name, 'delete' if f.get('source') == 'original' else 'skip: not an original'))
    return sorted(out, key=lambda x: _audio_key(x[0]) if kind == 'audio' else x[0])


def md5(path):
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def plan_files(files, remote_md5):
    """[(name, path, 'new' | 'changed' | 'same')]; remote_md5: {name: md5} of the item."""
    out = []
    for name, path in files.items():
        have = remote_md5.get(name)
        action = 'new' if have is None else ('same' if have == md5(path) else 'changed')
        out.append((name, path, action))
    return out


def size_mb(path):
    return Path(path).stat().st_size / 1e6


# ---------------------------------------------------------------- archive.org

def with_retries(what, fn, tries=5, wait=30, sleep=time.sleep):
    """Calls fn(); on archive.org's busy answers (429, 5xx) or a dropped
    connection, waits (Retry-After, or 30 s, 60 s, 120 s, 240 s) and tries again."""
    import requests
    for attempt in range(1, tries + 1):
        try:
            return fn()
        except (requests.exceptions.RequestException, ConnectionError) as e:
            status = getattr(getattr(e, 'response', None), 'status_code', None)
            dropped = isinstance(e, (ConnectionError, requests.exceptions.ConnectionError, requests.exceptions.Timeout,
                                     requests.exceptions.ChunkedEncodingError, requests.exceptions.RetryError))
            busy = status in RETRY_STATUS or (status is None and dropped)
            if not busy or attempt == tries:
                raise
            after = getattr(getattr(e, 'response', None), 'headers', {}) or {}
            try:
                delay = int(after.get('Retry-After', ''))
            except ValueError:
                delay = min(wait * 2 ** (attempt - 1), 300)
            print(f'  {what}: archive.org answered {status or type(e).__name__}; '
                  f'again in {delay} s ({tries - attempt} more tries)', flush=True)
            sleep(delay)


def session(need_keys=True):
    import internetarchive as ia
    from urllib3.util.retry import Retry
    access, secret = os.environ.get('IA_ACCESS_KEY', ''), os.environ.get('IA_SECRET_KEY', '')
    if need_keys and not (access and secret):
        sys.exit('The repository secrets IA_ACCESS_KEY and IA_SECRET_KEY are missing. Make the keys at '
                 'https://archive.org/account/s3.php and add them under Settings → Secrets and variables → Actions.')
    config = {'s3': {'access': access, 'secret': secret}} if access and secret else {}
    # Quick retries of reads inside the library; the long waits are with_retries'.
    retry = Retry(total=3, connect=2, read=2, backoff_factor=3, status_forcelist=sorted(RETRY_STATUS),
                  allowed_methods={'GET', 'HEAD'}, respect_retry_after_header=True)
    return ia.get_session(config=config, http_adapter_kwargs={'max_retries': retry}), access, secret


def account(access, secret):
    """screenname, itemname (@name) and email of the keys' account."""
    import internetarchive as ia
    info = with_retries('account', lambda: ia.get_user_info(access, secret))
    email = info.get('username', '')
    if email and os.environ.get('GITHUB_ACTIONS'):
        print(f'::add-mask::{email}', flush=True)
    return {'screenname': info.get('screenname', ''), 'itemname': info.get('itemname', ''), 'email': email}


def get_item(sess, identifier):
    return with_retries(identifier, lambda: sess.get_item(identifier))


def remote_md5(item):
    return {f['name']: f.get('md5') for f in (item.files or []) if f.get('name')}


def delete_file(item, kind, lang, name):
    """Deletes one original file, and what archive.org derived from it, from the
    item (kind, lang). Refuses any name outside deletable_names(kind, lang)."""
    if name not in deletable_names(kind, lang):
        raise ValueError(f'{name!r} is not one of the files that may be deleted from {item.identifier}')

    def rm():
        import requests
        try:
            return item.get_file(name).delete(cascade_delete=True, retries=3)
        except requests.exceptions.HTTPError as e:
            if getattr(getattr(e, 'response', None), 'status_code', None) == 404:
                return None     # already gone (an earlier try went through)
            raise
    return with_retries(f'delete {name}', rm)


# ---------------------------------------------------------------- output

class Report:
    """Prints to the log and, when given, writes Markdown to the job summary."""

    def __init__(self, summary=None):
        self.summary = Path(summary) if summary else None
        self.md = []

    def line(self, text='', md=None):
        print(text, flush=True)
        self.md += [text if md is None else md, '']

    def table(self, head, rows):
        widths = [max(len(str(x)) for x in col) for col in zip(head, *rows)] if rows else [len(h) for h in head]
        for r in [head] + rows:
            print('  ' + '  '.join(str(x).ljust(w) for x, w in zip(r, widths)), flush=True)
        cell = lambda x: str(x).replace('|', '\\|').replace('\n', ' ')
        self.md += ['', '| ' + ' | '.join(head) + ' |', '|' + '---|' * len(head)]
        self.md += ['| ' + ' | '.join(cell(x) for x in r) + ' |' for r in rows]
        self.md.append('')

    def close(self):
        if self.summary:
            with open(self.summary, 'a', encoding='utf-8') as f:
                f.write('\n'.join(self.md) + '\n')


# ---------------------------------------------------------------- modes

def _state(item, acc):
    owner = _owner(item, acc)
    return ('free (would be created)' if not item.exists else
            'exists, this account\'s' if owner else
            'exists, ANOTHER account\'s' if owner is False else 'exists')


def do_list(sess, acc, rep):
    rep.line('## Internet Archive: the account\'s items')
    rep.line(f'Account: {acc["screenname"]} ({acc["itemname"]}), {mask_email(acc["email"])}')
    if acc['itemname']:
        rep.line(f'Page: https://archive.org/details/{acc["itemname"]}')
    query = f'uploader:"{acc["email"]}"'
    fields = ['identifier', 'title', 'mediatype', 'date', 'publicdate', 'licenseurl']
    found = with_retries('search', lambda: list(sess.search_items(query, fields=fields)))
    rows = []
    for r in sorted(found, key=lambda r: str(r.get('publicdate', '')), reverse=True):
        ident = r.get('identifier', '')
        item = get_item(sess, ident)
        files = item.files or []
        originals = sum(1 for f in files if f.get('source') == 'original')
        md = item.metadata or {}
        rows.append([ident, ' / '.join(_as_list(md.get('title', r.get('title')))), md.get('mediatype', r.get('mediatype', '')),
                     md.get('date', '') or str(r.get('publicdate', ''))[:10], f'{len(files)} ({originals} original)',
                     md.get('licenseurl', '') or '—'])
    rep.line(f'\n{len(rows)} items:')
    rep.table(['identifier', 'title', 'mediatype', 'date', 'files', 'licenseurl'], rows)
    for lang in LANGS:
        for kind in KINDS:
            ident = IDS[(kind, lang)]
            rep.line(f'{kind_name(kind, lang)} {ident}: {_state(get_item(sess, ident), acc)}')


def creation_fields(md):
    """The metadata sent with the first file of a new item: all but the description."""
    return {k: v for k, v in md.items() if k != 'description'}


def set_metadata(item, fields):
    """Metadata API (a form, not headers: any length)."""
    def patch():
        r = item.modify_metadata(fields, refresh=False)
        if r.status_code in RETRY_STATUS:
            r.raise_for_status()
        try:
            j = r.json()
        except ValueError:
            j = {}
        if not r.ok or j.get('success') is False:
            raise RuntimeError(f'metadata of {item.identifier}: {r.status_code} {j.get("error") or r.text[:300]}')
        return r
    return with_retries(f'metadata of {item.identifier}', patch)


def wait_for_item(sess, identifier, minutes=15, every=20, sleep=time.sleep):
    """The item once archive.org has made it (its first file starts that), or None."""
    for _ in range(int(minutes * 60 / every)):
        item = get_item(sess, identifier)
        if item.exists:
            return item
        sleep(every)
    return None


def _owner(item, acc):
    """True: the account's item; False: another account's; None: cannot tell
    (no keys, or archive.org has not written the uploader yet)."""
    up = str((item.metadata or {}).get('uploader', '')).strip().lower()
    if not (acc and acc.get('email') and up):
        return None
    return up == acc['email'].lower()


def do_items(sess, acc, files, words, rep, send, wait=wait_for_item):
    """dry-run (send=False) or upload (send=True) of the items in `files`:
    {(kind, lang): {name: path}} (only the languages asked for)."""
    failed = False
    items = {key: get_item(sess, IDS[key]) for key in IDS}

    def will_exist(key):
        return bool(files.get(key)) or items[key].exists

    for lang in LANGS:
        for kind in KINDS:
            key = (kind, lang)
            if key not in files:
                continue
            ident, these, item = IDS[key], files[key], items[key]
            rep.line(f'\n## {kind_name(kind, lang)}: {item_url(ident)}')
            if not these:
                rep.line('Nothing to upload for this item (no files); skipped.')
                continue
            sibling = ('audio' if kind == 'texts' else 'texts', lang)
            other = (kind, OTHER_LANG[lang])
            md = metadata(kind, lang, words[lang], IDS[sibling] if will_exist(sibling) else None,
                          IDS[other] if will_exist(other) else None)
            if item.exists and _owner(item, acc) is False:
                rep.line(f'::error::{ident} belongs to another archive.org account; left alone.',
                         md=f'**{ident} belongs to another archive.org account**; left alone.')
                failed = True
                continue
            if item.exists:
                wanted = update_fields(md)
                changes = changed_fields(item.metadata or {}, wanted)
                rep.line(f'The item exists (mediatype {item.metadata.get("mediatype")}); '
                         f'metadata to change: {", ".join(changes) or "none"}')
                if item.metadata.get('mediatype') != kind:
                    rep.line(f'Note: its mediatype stays {item.metadata.get("mediatype")} (archive.org sets it once).')
            else:
                wanted, changes = md, list(md)
                rep.line('A new item, made with this metadata (the description is set once archive.org has made it).')
            rep.line('\nMetadata:')
            for k, v in wanted.items():
                if k != 'description':
                    rep.line(f'  {k}: {v if isinstance(v, str) else "; ".join(v)}', md=f'- **{k}**: {v if isinstance(v, str) else "; ".join(v)}')
            rep.line(f'  description:\n{wanted["description"]}', md='- **description**:\n\n```html\n' + wanted['description'] + '\n```')

            plan = plan_files(these, remote_md5(item) if item.exists else {})
            rep.line('\nFiles:')
            rep.table(['file', 'MB', 'action'], [[n, f'{size_mb(p):.1f}', {'new': 'upload (new)', 'changed': 'upload (replaces)',
                                                  'same': 'unchanged, not sent'}[a]] for n, p, a in plan])
            deletions = plan_deletions(kind, lang, item.files if item.exists else [])
            if deletions:
                rep.line(f'\nThe other language\'s files in this item ({OTHER_LANG[lang]}), removed with their derivatives:')
                rep.table(['file', 'action'], [[n, a] for n, a in deletions])
            if not send:
                continue

            # An item that exists: its metadata first. A new one is made by its first
            # file, with the short fields (they travel as HTTP headers, and the
            # description is too long for one); the description follows once
            # archive.org has made the item.
            if item.exists and changes:
                set_metadata(item, wanted)
                rep.line(f'Metadata updated: {", ".join(changes)}')
            for n, a in deletions:
                if a == 'delete':
                    delete_file(item, kind, lang, n)
                    rep.line(f'  deleted {n} (and its derivatives)')
            to_send = [(n, p) for n, p, a in plan if a != 'same']
            for i, (n, p) in enumerate(to_send):
                create = not item.exists and i == 0
                last = i == len(to_send) - 1
                t0 = time.time()

                def put():
                    r = item.upload_file(str(p), key=n, metadata=creation_fields(md) if create else None, queue_derive=last,
                                         retries=10, retries_sleep=60, request_kwargs={'timeout': 600})
                    if getattr(r, 'status_code', 200) in RETRY_STATUS:
                        r.raise_for_status()
                    return r
                with_retries(n, put)
                rep.line(f'  uploaded {n} ({size_mb(p):.1f} MB, {time.time() - t0:.0f} s)')
            if not item.exists:
                made = wait(sess, ident)
                if made:
                    set_metadata(made, {'description': md['description']})
                    rep.line('Description set.')
                else:
                    rep.line(f'::warning::archive.org has not finished making {ident}; run the upload again later '
                             'to set its description (nothing is sent twice).',
                             md=f'**archive.org has not finished making {ident}**; run the upload again later to set its description.')
            rep.line(f'Done: {item_url(ident)}' + ('' if to_send else ' (no file changed)'))
    return not failed


# ---------------------------------------------------------------- point-old

# The words that mark the note (plain text: archive.org may clean a description's HTML).
NEWER_MARKS = ('Νεότερη έκδοση', 'Newer edition')
NEWER = {'el': ('Νεότερη έκδοση (2η, 2026)', 'Ακουστικό βιβλίο'),
         'en': ('Newer edition (2nd, 2026)', 'Audiobook')}
NOTE_WITHIN = 800       # characters from the start where an earlier note is looked for


def newer_note(lang):
    """The note put at the top of the older item of `lang`: where that language's
    book and audiobook are now."""
    book, audio = item_url(IDS[('texts', lang)]), item_url(IDS[('audio', lang)])
    head, audio_word = NEWER[lang]
    return (f'<p><b>{head}:</b> <a href="{book}">{book}</a><br />'
            f'{audio_word}: <a href="{audio}">{audio}</a></p>')


def _norm(fragment):
    """An HTML fragment with archive.org's small rewrites undone: entities,
    <br> spellings, quotes and spaces."""
    s = html.unescape(fragment)
    s = re.sub(r'<br\s*/?>', '<br>', s, flags=re.I)
    s = re.sub(r'<\s*(/?)\s*([a-z]+)', lambda m: f'<{m.group(1)}{m.group(2).lower()}', s, flags=re.I)
    s = s.replace("'", '"')
    s = re.sub(r'\s+', ' ', s).strip()
    return re.sub(r'\s*(/?>)', r'\1', s)


def find_note(desc):
    """(start, end) of an earlier note in the description: the first <p>...</p>
    that starts within NOTE_WITHIN characters and holds "Νεότερη έκδοση" or
    "Newer edition"; or None."""
    for m in re.finditer(r'<p\b[^>]*>.*?</p\s*>', desc, flags=re.I | re.S):
        if m.start() >= NOTE_WITHIN:
            break
        text = html.unescape(m.group(0))
        if any(mark in text for mark in NEWER_MARKS):
            return m.span()
    return None


def with_note(desc, lang):
    """(the new description, 'skip' | 'replace' | 'prepend')."""
    note = newer_note(lang)
    span = find_note(desc)
    if span:
        if desc[span[0]:span[1]] == note or _norm(desc[span[0]:span[1]]) == _norm(note):
            return desc, 'skip'
        return desc[:span[0]] + note + desc[span[1]:], 'replace'
    return note + desc, 'prepend'


def do_point_old(sess, acc, langs, rep, send=True):
    """Puts a note at the top of each first-edition item's description, in its
    language, pointing to the new items of that language; an earlier note is
    replaced. Changes nothing else; an item that already has this note is skipped."""
    rep.line('\n## Older items: a note pointing to the new edition')
    ok = True
    for lang in langs:
        ident = OLD_IDS[lang]
        missing = [IDS[(k, lang)] for k in KINDS if not get_item(sess, IDS[(k, lang)]).exists]
        if missing:
            rep.line(f'::error::{ident}: {", ".join(missing)} does not exist yet: upload first.')
            ok = False
            continue
        item = get_item(sess, ident)
        if not item.exists:
            rep.line(f'::error::{ident}: no such item.')
            ok = False
            continue
        if _owner(item, acc) is not True:
            rep.line(f'::error::{ident} is not this account\'s item; left alone.')
            ok = False
            continue
        current = str((item.metadata or {}).get('description', ''))
        new, action = with_note(current, lang)
        if action == 'skip':
            rep.line(f'{ident}: already points to the new edition.')
            continue
        if send:
            set_metadata(item, {'description': new})
        rep.line(f'{ident}: note {"replaced" if action == "replace" else "added"} ({item_url(ident)})')
    return ok


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('mode', choices=['list', 'dry-run', 'upload', 'point-old'])
    ap.add_argument('--langs', default='el,en', help='el, en or el,en: the languages whose items are processed')
    ap.add_argument('--book-dir', default=str(ROOT / 'public'))
    ap.add_argument('--audio-dir', default='', help='the files of the release "audiobook"')
    ap.add_argument('--summary', default='', help='Markdown file for the job summary')
    a = ap.parse_args(argv)

    langs = [l for l in re.split(r'[,\s]+', a.langs) if l]
    if not langs or any(l not in LANGS for l in langs):
        sys.exit(f'--langs: el, en or el,en (not {a.langs!r})')

    rep = Report(a.summary or None)
    try:
        # A dry run also works before the keys exist (it then cannot tell whose an item is).
        sess, access, secret = session(need_keys=a.mode != 'dry-run')
        acc = account(access, secret) if access and secret else None
        if a.mode == 'list':
            do_list(sess, acc, rep)
            return 0
        if a.mode == 'point-old':
            return 0 if do_point_old(sess, acc, langs, rep) else 1
        rep.line(f'# Internet Archive: {a.mode}, languages {", ".join(langs)}')
        if acc:
            rep.line(f'Account: {acc["screenname"]} ({acc["itemname"]}), {mask_email(acc["email"])}')
        else:
            rep.line('No keys: a dry run without an account (it cannot tell whose an existing item is).')
        words = {l: book_words(l) for l in langs}
        files = {}
        for lang in langs:
            book, missing = book_files(a.book_dir, lang)
            audio = audio_files(a.audio_dir, lang)
            if missing:
                rep.line(f'Not in the repository, so not uploaded: {", ".join(missing)}')
            if not audio:
                rep.line(f'No audiobook files for {lang} (the release "audiobook" has none).')
            # The book's cover as every item's picture (archive.org shows
            # __ia_thumb.jpg as an item's image); last, so it never makes an item alone.
            for these in (book, audio):
                if these and COVER.is_file():
                    these[THUMB] = COVER
            files[('texts', lang)], files[('audio', lang)] = book, audio
        ok = do_items(sess, acc, files, words, rep, send=a.mode == 'upload')
        return 0 if ok else 1
    finally:
        rep.close()


if __name__ == '__main__':
    sys.exit(main())
