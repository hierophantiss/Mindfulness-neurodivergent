#!/usr/bin/env python3
"""The book and the audiobook on the Internet Archive (archive.org).

Run by the workflow "Internet Archive" (.github/workflows/internet-archive.yml).
Two items, created the first time and updated after that:

    book    (mediatype texts)  public/workbook_{el,en}.{pdf,epub}
    audio   (mediatype audio)  the files of the GitHub Release "audiobook":
            <lang>-NN.mp3 (one per chapter), mindfulness-guide-<lang>.mp3
            and .m4b (the whole book)

Modes:

    list     the account's items on archive.org (to tell which are the first
             edition), and whether the two identifiers are taken
    dry-run  everything an upload would do, nothing sent
    upload   creates or updates the two items

An upload never deletes anything on archive.org. A file with the same name is
replaced; a file whose MD5 matches the one already there is not sent again;
the item's metadata is set to the fields below (other fields stay as they are).

The words of the descriptions come from the book itself (book/workbook_*.md:
title, subtitle, "Who Is This Book For?", the note before you begin) and from
the site's texts (scripts/llms-txt.ts, the audiobook's release notes).

Keys: IA_ACCESS_KEY and IA_SECRET_KEY (https://archive.org/account/s3.php).

    python3 tools/internet_archive.py list
    python3 tools/internet_archive.py dry-run --audio-dir /tmp/audiobook [--langs el,en]
    python3 tools/internet_archive.py upload  --audio-dir /tmp/audiobook \\
        [--book-id ID] [--audio-id ID] [--langs el,en] [--summary "$GITHUB_STEP_SUMMARY"]
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

BOOK_ID = 'mindfulness-guide-neurodivergents-2nd-edition'
AUDIO_ID = 'mindfulness-guide-neurodivergents-audiobook'
LANGS = ('el', 'en')

SITE_URL = 'https://neurodivergent-mindfulness.org'
# src/seo/head.ts (SITE_NAME), scripts/seo-meta.ts (LICENSE_URL)
SITE_NAME = {'el': 'Ενσυνειδητότητα για Νευροδιαφορετικούς', 'en': 'Neurodivergent Mindfulness'}
LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
CREATOR = ['Θεόδωρος Μπαϊρακτάρης', 'Theodoros Bairaktaris']
DATE = '2026'
# MARC 21 language codes, as archive.org asks for (gre = Modern Greek).
LANGUAGE = ['gre', 'eng']
SUBJECT = ['mindfulness', 'ενσυνειδητότητα', 'neurodivergent', 'ADHD', 'ΔΕΠΥ', 'autism',
           'αυτισμός', 'trauma-informed', 'Fourfold Axis', 'Τετραπλός Άξονας', 'self-regulation']
AUDIO_SUBJECT = SUBJECT + ['audiobook', 'ακουστικό βιβλίο']
# New items go to the community collections, open to every account.
COLLECTION = {'texts': 'opensource', 'audio': 'opensource_audio'}

# scripts/llms-txt.ts (notStudied, the licence line)
NOT_STUDIED = {'el': 'Η μέθοδος ως σύνολο δεν έχει μελετηθεί ακόμα.',
               'en': 'The method as a whole has not been studied yet.'}
LICENCE_WORD = {'el': 'Άδεια του βιβλίου', 'en': 'Licence of the book'}
# The audiobook's release notes (audiobook.yml) and tools/README.md
VOICE_LINE = {
    'el': 'Ακουστικό βιβλίο του οδηγού, με συνθετική φωνή (Google Chirp 3 HD: Gacrux στα ελληνικά, '
          'Sulafat στα αγγλικά). Ένα MP3 ανά κεφάλαιο, ένα MP3 όλο το βιβλίο και ένα M4B με κεφάλαια.',
    'en': 'Audiobook of the workbook, read by a synthetic voice (Google Chirp 3 HD: Gacrux in Greek, '
          'Sulafat in English). One MP3 per chapter, the whole book in one MP3, and an M4B with chapter marks.',
}
EDITION = {'el': '2η έκδοση', 'en': '2nd edition'}
AUDIOBOOK = {'el': 'ακουστικό βιβλίο', 'en': 'audiobook'}
OTHER_ITEM = {'texts': {'el': 'Το ακουστικό βιβλίο', 'en': 'The audiobook'},
              'audio': {'el': 'Το βιβλίο (PDF και EPUB)', 'en': 'The book (PDF and EPUB)'}}

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


def mask_email(email):
    """t***@g***.com"""
    if not email or '@' not in email:
        return '***'
    local, domain = email.split('@', 1)
    host, _, tld = domain.rpartition('.')
    return f'{local[:1]}***@{(host or domain)[:1]}***' + (f'.{tld}' if host else '')


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


def description(kind, words, other_id=None):
    """The item's description: Greek, then English (HTML, as archive.org shows it)."""
    parts = []
    for lang in LANGS:
        w = words[lang]
        p = [f'<b>{_inline(w["title"])}</b><br />{_inline(w["subtitle"])}<br /><i>{_inline(w["axis"])}</i>'
             f'<br />{_inline(w["author"])}<br />{_inline(w["edition"])}']
        if kind == 'audio':
            p.append(html.escape(VOICE_LINE[lang], quote=False))
        p += [_inline(x) for x in w['who_for']]
        p.append(_inline(w['note']))
        p.append(html.escape(NOT_STUDIED[lang], quote=False))
        p.append(f'{html.escape(SITE_NAME[lang])}: <a href="{SITE_URL}/{lang}">{SITE_URL}/{lang}</a>')
        if other_id:
            p.append(f'{OTHER_ITEM[kind][lang]}: <a href="{item_url(other_id)}">{item_url(other_id)}</a>')
        p.append(f'{LICENCE_WORD[lang]}: <a href="{LICENSE_URL}">CC BY-NC-ND 4.0</a>')
        parts.append(''.join(f'<p>{x}</p>' for x in p))
    return '<hr />'.join(parts)


def title(kind, words):
    el, en = words['el']['title'], words['en']['title']
    if kind == 'audio':
        return f'{el} — {en} ({AUDIOBOOK["el"]}, {EDITION["el"]} / {AUDIOBOOK["en"]}, {EDITION["en"]})'
    return f'{el} — {en} ({EDITION["el"]} / {EDITION["en"]})'


def metadata(kind, words, other_id=None):
    """kind: 'texts' (the book) or 'audio' (the audiobook)."""
    return {
        'mediatype': kind,
        'collection': COLLECTION[kind],
        'title': title(kind, words),
        'creator': list(CREATOR),
        'date': DATE,
        'language': list(LANGUAGE),
        'licenseurl': LICENSE_URL,
        'subject': list(AUDIO_SUBJECT if kind == 'audio' else SUBJECT),
        'description': description(kind, words, other_id),
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

def book_files(public_dir, langs):
    """{name on archive.org: local path} and the names that are missing."""
    found, missing = {}, []
    for lang in langs:
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


def audio_files(audio_dir, langs):
    """The audiobook's files in audio_dir for these languages, in reading order."""
    d = Path(audio_dir) if audio_dir else None
    if not d or not d.is_dir():
        return {}
    picked = []
    for p in d.iterdir():
        m = AUDIO_NAME.match(p.name)
        if p.is_file() and m and (m.group(1) or m.group(2)) in langs:
            picked.append(p.name)
    return {n: d / n for n in sorted(picked, key=_audio_key)}


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

def do_list(sess, acc, ids, rep):
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
    for kind, ident in ids.items():
        item = get_item(sess, ident)
        owner = _owner(item, acc)
        state = ('free (would be created)' if not item.exists else
                 'exists, this account\'s' if owner else
                 'exists, ANOTHER account\'s: choose another identifier' if owner is False else 'exists')
        rep.line(f'{"Book" if kind == "texts" else "Audiobook"} identifier {ident}: {state}')


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


def do_items(sess, acc, ids, files, words, rep, send):
    """dry-run (send=False) or upload (send=True) of the two items."""
    failed = False
    for kind in ('texts', 'audio'):
        ident, these = ids[kind], files[kind]
        name = 'Book' if kind == 'texts' else 'Audiobook'
        rep.line(f'\n## {name}: {item_url(ident)}')
        if not these:
            rep.line('Nothing to upload for this item (no files for these languages); skipped.')
            continue
        other = 'audio' if kind == 'texts' else 'texts'
        md = metadata(kind, words, ids[other] if files[other] else None)
        item = get_item(sess, ident)
        if item.exists and _owner(item, acc) is False:
            rep.line(f'::error::{ident} belongs to another archive.org account. Give another identifier.',
                     md=f'**{ident} belongs to another archive.org account.** Give another identifier.')
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
        if not send:
            continue

        # An item that exists: its metadata first. A new one is made by its first
        # file, with the short fields (they travel as HTTP headers, and the
        # description is too long for one); the description follows once
        # archive.org has made the item.
        if item.exists and changes:
            set_metadata(item, wanted)
            rep.line(f'Metadata updated: {", ".join(changes)}')
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
            made = wait_for_item(sess, ident)
            if made:
                set_metadata(made, {'description': md['description']})
                rep.line('Description set.')
            else:
                rep.line(f'::warning::archive.org has not finished making {ident}; run the upload again later '
                         'to set its description (nothing is sent twice).',
                         md=f'**archive.org has not finished making {ident}**; run the upload again later to set its description.')
        rep.line(f'Done: {item_url(ident)}' + ('' if to_send else ' (no file changed)'))
    return not failed


# Plain text, not an HTML attribute: archive.org may clean a description's HTML.
NEWER_MARK = 'Newer edition (2nd, 2026)'


def newer_note(ids):
    """The note put at the top of an older item: where the current edition is."""
    book, audio = item_url(ids['texts']), item_url(ids['audio'])
    return (f'<p><b>Νεότερη έκδοση (2η, 2026) / {NEWER_MARK}:</b> '
            f'<a href="{book}">{book}</a><br />'
            f'Ακουστικό βιβλίο / Audiobook: <a href="{audio}">{audio}</a></p>')


def do_point_old(sess, acc, ids, old_ids, rep):
    """Puts a note at the top of each older item's description, pointing to the
    current items. Changes nothing else; an item that already has it is skipped."""
    rep.line('\n## Older items: a note pointing to the new edition')
    for name in ('texts', 'audio'):
        if not get_item(sess, ids[name]).exists:
            rep.line(f'::error::{ids[name]} does not exist yet: upload first.')
            return False
    ok = True
    for ident in old_ids:
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
        if NEWER_MARK in current:
            rep.line(f'{ident}: already points to the new edition.')
            continue
        set_metadata(item, {'description': newer_note(ids) + current})
        rep.line(f'{ident}: note added ({item_url(ident)})')
    return ok


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('mode', choices=['list', 'dry-run', 'upload', 'point-old'])
    ap.add_argument('--old-ids', default='', help='point-old: older items, comma-separated')
    ap.add_argument('--book-id', default='')
    ap.add_argument('--audio-id', default='')
    ap.add_argument('--langs', default='el,en', help='el, en or el,en')
    ap.add_argument('--book-dir', default=str(ROOT / 'public'))
    ap.add_argument('--audio-dir', default='', help='the files of the release "audiobook"')
    ap.add_argument('--summary', default='', help='Markdown file for the job summary')
    a = ap.parse_args(argv)

    langs = [l for l in re.split(r'[,\s]+', a.langs) if l]
    if not langs or any(l not in LANGS for l in langs):
        sys.exit(f'--langs: el, en or el,en (not {a.langs!r})')
    try:
        ids = {'texts': check_identifier(a.book_id.strip() or BOOK_ID),
               'audio': check_identifier(a.audio_id.strip() or AUDIO_ID)}
    except ValueError as e:
        sys.exit(str(e))
    if ids['texts'] == ids['audio']:
        sys.exit('The book and the audiobook need two different identifiers.')

    rep = Report(a.summary or None)
    try:
        # A dry run also works before the keys exist (it then cannot tell whose an item is).
        sess, access, secret = session(need_keys=a.mode != 'dry-run')
        acc = account(access, secret) if access and secret else None
        if a.mode == 'list':
            do_list(sess, acc, ids, rep)
            return 0
        if a.mode == 'point-old':
            try:
                old_ids = [check_identifier(x) for x in re.split(r'[,\s]+', a.old_ids) if x]
            except ValueError as e:
                sys.exit(str(e))
            if not old_ids:
                sys.exit('point-old: give the older items with --old-ids.')
            return 0 if do_point_old(sess, acc, ids, old_ids, rep) else 1
        words = {l: book_words(l) for l in LANGS}
        book, missing = book_files(a.book_dir, langs)
        audio = audio_files(a.audio_dir, langs)
        if audio and COVER.is_file():
            # The book's cover as the audiobook's picture (archive.org shows
            # __ia_thumb.jpg as an item's image).
            audio['__ia_thumb.jpg'] = COVER
        files = {'texts': book, 'audio': audio}
        rep.line(f'# Internet Archive: {a.mode}, languages {", ".join(langs)}')
        if acc:
            rep.line(f'Account: {acc["screenname"]} ({acc["itemname"]}), {mask_email(acc["email"])}')
        else:
            rep.line('No keys: a dry run without an account (it cannot tell whose an existing item is).')
        if missing:
            rep.line(f'Not in the repository, so not uploaded: {", ".join(missing)}')
        if not files['audio']:
            rep.line('No audiobook files (the release "audiobook" has none for these languages).')
        ok = do_items(sess, acc, ids, files, words, rep, send=a.mode == 'upload')
        return 0 if ok else 1
    finally:
        rep.close()


if __name__ == '__main__':
    sys.exit(main())
