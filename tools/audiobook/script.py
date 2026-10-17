#!/usr/bin/env python3
"""Turn the workbook markdown into a spoken script for the audiobook.

The book is the master: this script never edits it. It reads
book/workbook_<lang>.md and writes a JSON list of audio chapters, each a list
of segments that synth.py speaks:

    {"kind": "heading" | "theory" | "card" | "step", "text": "...",
     "rate": 0.9, "pause_ms": 700}

What changes on the way from page to voice:
- the table of contents, images, rules and "In the app / Rabbit Hole"
  pointers are left out;
- tables become sentences;
- source lines and DOI lists in Chapter 11 become one spoken sentence;
- exercise steps are read a little slower and followed by silence, as in the
  app's read-aloud; the timed exercises get silence for their duration
  (at most 30 seconds, so the listener can pause the player for longer);
- worksheet questions with a blank line get a silence to answer in;
- the 7-day journal, which is a form, becomes a short spoken note.

Usage:
    python3 tools/audiobook/script.py el out/script_el.json [--preview out/preview_el.txt]
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Reading pace, in step with the app (src/hooks/useSpeechReader.ts).
RATE = {'heading': 0.9, 'theory': 0.9, 'card': 0.86, 'step': 0.81}
PAUSE = {'heading': 900, 'theory': 700, 'card': 1400, 'step': 7000}
PAUSE_BEFORE_CHAPTER_END = 1500
MAX_TIMED_PAUSE_S = 30

L = {
    'el': {
        'intro': [
            ('heading', 'Οδηγός Ενσυνειδητότητας για Νευροδιαφορετικούς.'),
            ('theory', 'Workbook Πρακτικής Παρουσίας, βασισμένο στον Τετραπλό Άξονα: Σώμα, Αναπνοή, Προσοχή, Χώρος.'),
            ('theory', 'Γράφει ο Θεόδωρος Μπαϊρακτάρης. Δεύτερη έκδοση, 2026.'),
            ('theory', 'Το ακουστικό βιβλίο διαβάζεται από συνθετική φωνή. Το έργο προσφέρεται δωρεάν, με άδεια Creative Commons: επιτρέπεται η κοινοποίηση με αναφορά στον δημιουργό, όχι η εμπορική χρήση ή η τροποποίηση.'),
        ],
        'toc': 'Πίνακας Περιεχομένων',
        'exercise': re.compile(r'^(Πρακτική Άσκηση|Τέσσερις Ασκήσεις|Πρωτόκολλο|Στάδιο|Αν Έχεις Κολλήσει Τώρα|Η Κάρτα της Τσέπης)'),
        'pointer': re.compile(r'^\*(Στην εφαρμογή|Στην Κουνελότρυπα)'),
        'source': re.compile(r'^\*?Πηγ(ή|ές):\*?'),
        'source_lists': ('Περισσότερες μελέτες', 'Για τα Κεφάλαια', 'Για το Κεφάλαιο'),
        'sources_said': 'Οι πλήρεις πηγές, με τους συνδέσμους τους, βρίσκονται στο βιβλίο και στη σελίδα Μεθοδολογίας της εφαρμογής.',
        'resources': 'Πόροι',
        'resources_said': 'Τους συνδέσμους θα τους βρεις στο βιβλίο.',
        'journal': '7-Ήμερο Ημερολόγιο',
        'journal_said': 'Το ημερολόγιο είναι ένα φύλλο για επτά μέρες: κάθε μέρα σημειώνεις ποιο από τα τέσσερα κέντρα εξάσκησες, σώμα, αναπνοή, προσοχή ή χώρο, και τι παρατήρησες. Θα το βρεις στο βιβλίο και στο Ημερολόγιο της εφαρμογής.',
        'seconds': r'(\d+)(?:\s*[–-]\s*(\d+))?\s*δευτερόλεπτ',
        'minutes': r'(\d+)(?:\s*[–-]\s*(\d+))?\s*λεπτ',
        'breaths': r'(\d+)\s*αναπνο',
        'et_al': 'και συνεργάτες',
        'or': 'ή',
        'to': 'με',
        'died': 'απεβίωσε το',
        'abbr': [('Κεφ.', 'Κεφάλαιο'), ('Στ.', 'Στάδιο'), ('π.χ.', 'για παράδειγμα')],
        'goal': ('Στόχος',),
        'end': 'Τέλος του ακουστικού βιβλίου. Σε ευχαριστώ που άκουσες.',
    },
    'en': {
        'intro': [
            ('heading', 'A Mindfulness Guide for Neurodivergents.'),
            ('theory', 'A workbook of present practice, based on the Fourfold Axis: Body, Breath, Attention, Space.'),
            ('theory', 'Written by Theodoros Bairaktaris. Second edition, 2026.'),
            ('theory', 'This audiobook is read by a synthetic voice. The work is offered free under a Creative Commons licence: you may share it with credit to the author, but not use it commercially or change it.'),
        ],
        'toc': 'Table of Contents',
        'exercise': re.compile(r'^(Practice Exercise|Four Exercises|Protocol|Stage|If You.re Stuck Right Now|The Pocket Card)'),
        'pointer': re.compile(r'^\*(In the app|In the Rabbit Hole)'),
        'source': re.compile(r'^\*?Sources?:\*?'),
        'source_lists': ('Further Studies', 'For Chapters', 'For Chapter'),
        'sources_said': 'The full sources, with their links, are in the book and on the Methodology page of the app.',
        'resources': 'Resources',
        'resources_said': 'You will find the links in the book.',
        'journal': '7-Day Practice Journal',
        'journal_said': 'The journal is a sheet for seven days: each day you note which of the four centres you practised, body, breath, attention or space, and what you noticed. You will find it in the book and in the app\'s Journal.',
        'seconds': r'(\d+)(?:\s*[–-]\s*(\d+))?\s*seconds?',
        'minutes': r'(\d+)(?:\s*[–-]\s*(\d+))?\s*minutes?',
        'breaths': r'(\d+)\s*breaths?',
        'et_al': 'and colleagues',
        'or': 'or',
        'to': 'to',
        'died': 'died',
        'abbr': [('Ch.', 'Chapter'), ('St.', 'Stage'), ('e.g.', 'for example'), ('i.e.', 'that is')],
        'goal': ('Goal', 'Aim'),
        'end': 'This is the end of the audiobook. Thank you for listening.',
    },
}

PICTOGRAPHS = re.compile('[\U0001F000-\U0001FAFF☀-➿️‍]')


def to_speech(raw, lang):
    """Same spirit as toSpeech() in src/lib/chapterReading.ts."""
    s = raw or ''
    s = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', s)
    s = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s)          # links: keep the words
    s = re.sub(r'https?://\S+', '', s)
    s = re.sub(r'\b(?:DOI:\s*)?10\.\d{4,9}/\S+', '', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('**', '').replace('*', '')
    s = PICTOGRAPHS.sub('', s)
    s = re.sub(r'†\s*(\d{4})', L[lang]['died'] + r' \1', s)
    for a, b in L[lang]['abbr']:
        s = re.sub(r'(?<!\w)' + re.escape(a), b, s)
    s = re.sub(r'(\d+)\s*[–-]\s*(\d+)(?=\s*(?:\w+\)|δευτερ|λεπτ|second|minute|ώρ|hour|μέρ|day|εβδομ|week))', r'\1 ' + L[lang]['to'] + r' \2', s)
    s = re.sub(r'[•★†∞☐☀△▽◯]', '', s)
    s = re.sub(r'\(\s*\)', '', s)
    s = re.sub(r'\s*(?:—|–)\s*(?=[A-ZΑ-ΩΆΈΉΊΌΎΏ«"])', '. ', s)
    s = re.sub(r'_{3,}', '', s)
    s = re.sub(r'\s*(?:→|—|–)\s*', ', ', s)
    s = re.sub(r'(\w+)/\w{1,3}(?!\w)', r'\1', s)              # όρθιος/η → όρθιος
    s = re.sub(r'(\w+)/(?=\w)', r'\1 ' + L[lang]['or'] + ' ', s)
    s = re.sub(r'\s*/\s*', ', ', s)
    s = re.sub(r'\b(\d+(?:-\d+)+)\b', lambda m: ', '.join(m.group(1).split('-')), s)
    if lang == 'el':
        s = re.sub(r'\bet al\.?', L[lang]['et_al'], s)
    s = re.sub(r'\s+([,.;:!?·])', r'\1', s)
    s = re.sub(r',\s*,', ',', s)
    s = re.sub(r'([;?!:.])\s*,', r'\1', s)
    s = re.sub(r'\.\s*\.', '.', s)
    s = re.sub(r'^[,\s]+', '', s)
    s = re.sub(r'\s{2,}', ' ', s).strip()
    if s and not re.search(r'[.!?;·:…»"\')]$', s):
        s += '.'
    return s


def timed_pause_ms(text, lang):
    """Silence for a timed exercise such as '(20 seconds)' or '(1–2 minutes)'."""
    m = re.search(r'\(([^)]*)\)', text)
    if not m:
        return None
    inner = m.group(1).replace('*', '')
    for pat, unit in ((L[lang]['seconds'], 1), (L[lang]['minutes'], 60)):
        n = re.search(pat, inner)
        if n:
            hi = int(n.group(2) or n.group(1))
            return max(3, min(hi * unit, MAX_TIMED_PAUSE_S)) * 1000
    n = re.search(L[lang]['breaths'], inner)
    if n:
        return min(int(n.group(1)) * 8, MAX_TIMED_PAUSE_S) * 1000
    return None


def blocks(md):
    """Markdown → list of (type, payload). Lists, quotes and paragraphs are joined over wrapped lines."""
    out, para, quote, item = [], [], [], None
    lines = md.split('\n')

    def flush():
        nonlocal para, quote, item
        if para:
            out.append(('p', ' '.join(para)))
        if quote:
            out.append(('quote', '\n'.join(quote)))
        if item is not None:
            out.append(('li', item))
        para, quote, item = [], [], None

    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s:
            flush()
        elif s.startswith('#'):
            flush()
            level = len(s) - len(s.lstrip('#'))
            out.append(('h', (level, s[level:].strip())))
        elif s.startswith('|'):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-{2,}:?', c) for c in cells):
                    rows.append(cells)
                i += 1
            out.append(('table', rows))
            continue
        elif s == '---' or s.startswith('!['):
            flush()
        elif s.startswith('>'):
            if para or item is not None:
                flush()
            q = s.lstrip('>').strip()
            if re.fullmatch(r'\*\*[^*]+\*\*', q):
                q = q[:-2].rstrip('.:') + '.**'
            quote.append(q)
        elif re.match(r'^(?:[-*]|\d+\.)\s+', s):
            flush()
            item = re.sub(r'^(?:[-*]|\d+\.)\s+', '', s)
        elif item is not None and line.startswith('  '):
            item += ' ' + s
        elif quote:
            quote.append(s)
        else:
            if item is not None:
                flush()
            para.append(s)
        i += 1
    flush()
    return out


def table_sentences(rows):
    if not rows:
        return []
    head, body = rows[0], rows[1:]
    out = []
    for r in body:
        parts = [r[0]]
        for h, c in zip(head[1:], r[1:]):
            parts.append(f'{h}: {c}')
        out.append('. '.join(p.rstrip('.') for p in parts))
    return out


def build(lang):
    cfg = L[lang]
    md = (ROOT / f'book/workbook_{lang}.md').read_text(encoding='utf-8')
    md = re.sub(r'\A---\n.*?\n---\n', '', md, flags=re.S)   # YAML front matter
    chapters = []
    cur = None
    part_heading = None
    h3 = ''
    skipping = False      # inside a section that is not read
    front = True          # title page: only the note before you start is read
    in_sources = False    # inside a source list in Chapter 11
    said_sources = False

    def seg(kind, text, pause=None, rate=None):
        t = to_speech(text, lang)
        if not t or cur is None:
            return
        cur['segments'].append({'kind': kind, 'text': t,
                                'rate': rate or RATE[kind],
                                'pause_ms': PAUSE[kind] if pause is None else pause})

    def new_chapter(title):
        nonlocal cur
        cur = {'title': to_speech(title, lang).rstrip('.'), 'segments': []}
        chapters.append(cur)

    # Opening track: title, author, licence, and the note before you start.
    new_chapter(cfg['intro'][0][1])
    for kind, text in cfg['intro']:
        seg(kind, text)

    for typ, payload in blocks(md):
        if typ == 'h':
            level, title = payload
            plain = re.sub(r'\*', '', title)
            if level == 1:
                h3 = ''
                in_sources = False
                if front and plain != cfg['toc'] and plain.startswith((L['el']['intro'][0][1][:10], L['en']['intro'][0][1][:10])):
                    continue
                front = False
                if plain == cfg['toc']:
                    skipping = True
                    continue
                skipping = False
                if plain.startswith(('Μέρος', 'Part')):
                    part_heading = plain   # spoken at the start of the next chapter
                    continue
                new_chapter(plain)
                seg('heading', plain)
                if plain.startswith(cfg['journal'][:6]):
                    skipping = True
                    seg('theory', cfg['journal_said'])
                continue
            if level == 2:
                if front:
                    continue
                if plain.startswith(('Κεφάλαιο', 'Chapter')):
                    h3 = ''
                    in_sources = False
                    skipping = False
                    new_chapter(plain)
                    if part_heading:
                        seg('heading', part_heading)
                        part_heading = None
                    seg('heading', plain)
                elif not skipping:
                    seg('heading', plain)
                continue
            if level >= 3 and not skipping:
                h3 = plain
                in_sources = False
                if plain.startswith(cfg['resources']):
                    seg('heading', plain)
                    seg('theory', cfg['resources_said'])
                    continue
                if plain.strip() == '∞':
                    continue
                seg('heading', plain)
            continue

        if skipping or cur is None:
            continue
        if front and typ != 'quote':
            continue

        if typ == 'p':
            text = payload
            if cfg['pointer'].match(text) or cfg['source'].match(text):
                continue
            # A source line written straight after its paragraph (no blank line).
            text = re.split(r'\s\*?(?:Πηγ(?:ή|ές)|Sources?):\*?\s', text)[0]
            bold_label = re.match(r'^\*\*([^*]+)\*\*:?\s*$', text)
            if any(text.replace('*', '').startswith(k) for k in cfg['source_lists']):
                in_sources = True
                if not said_sources:
                    seg('theory', cfg['sources_said'])
                    said_sources = True
                continue
            in_sources = False
            if cfg['exercise'].match(h3) or bold_label:
                seg('heading' if bold_label else 'theory', text)
            else:
                seg('theory', text)
        elif typ == 'quote':
            seg('card', payload.replace('\n', ' '))
        elif typ == 'table':
            for sentence in table_sentences(payload):
                seg('theory', sentence)
        elif typ == 'li':
            if in_sources or h3.startswith(cfg['resources']):
                continue
            text = payload
            if '____' in text:
                seg('step', text, pause=8000)          # a worksheet question: time to answer
            elif cfg['exercise'].match(h3) and not text.replace('*', '').startswith(cfg['goal']):
                pause = timed_pause_ms(text, lang)
                seg('step', text, pause=pause)
            else:
                seg('theory', text)

    if chapters:
        chapters[-1]['segments'].append({'kind': 'theory', 'text': cfg['end'], 'rate': RATE['theory'], 'pause_ms': PAUSE_BEFORE_CHAPTER_END})
    # Chapters that ended up empty (none expected) are dropped.
    return [c for c in chapters if c['segments']]


def preview(chapters):
    lines = []
    for n, c in enumerate(chapters, 1):
        lines.append(f'\n=== {n:02d}. {c["title"]} ===')
        for s in c['segments']:
            tag = {'heading': '#', 'theory': ' ', 'card': '▌', 'step': '•'}[s['kind']]
            lines.append(f'{tag} {s["text"]}   [σιωπή {s["pause_ms"] / 1000:g} s]' if s['kind'] == 'step' else f'{tag} {s["text"]}')
    return '\n'.join(lines)


def main():
    lang, out = sys.argv[1], Path(sys.argv[2])
    chapters = build(lang)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(chapters, ensure_ascii=False, indent=1), encoding='utf-8')
    chars = sum(len(s['text']) for c in chapters for s in c['segments'])
    silence = sum(s['pause_ms'] for c in chapters for s in c['segments']) / 1000
    print(f'{lang}: {len(chapters)} chapters, {chars} characters, {silence / 60:.1f} min of silence')
    if '--preview' in sys.argv:
        Path(sys.argv[sys.argv.index('--preview') + 1]).write_text(preview(chapters), encoding='utf-8')


if __name__ == '__main__':
    main()
