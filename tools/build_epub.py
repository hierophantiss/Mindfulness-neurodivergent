#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_epub.py — markdown → EPUB 3, με pandoc.

Χρήση, από τη ρίζα του repo:

    python3 tools/build_epub.py book/workbook_el.md public/workbook_el.epub book/img/00-cover.jpg

Τρία ορίσματα: το markdown, το EPUB που θα γραφτεί, το εξώφυλλο.

Γιατί ξεχωριστό σενάριο από το build_pdf.py: το EPUB είναι ρέον κείμενο. Δεν
έχει σελίδες, οπότε ο Πίνακας Περιεχομένων με αριθμούς δεν έχει νόημα — τον
φτιάχνει ο ίδιος ο αναγνώστης από τις επικεφαλίδες. Και η γραμματοσειρά δεν
ενσωματώνεται: στο EPUB ο αναγνώστης επιλέγει μέγεθος και οικογένεια, και
είναι λάθος να του το στερήσεις. Ό,τι τεκμηριώνεται για τη νευροδιαφορετική
ανάγνωση — διάστιχο, αριστερή στοίχιση, χώρος — μπαίνει με CSS και σέβεται
τις ρυθμίσεις της συσκευής.
"""

import pathlib
import re
import subprocess
import sys
import tempfile

CSS = """
body { line-height: 1.7; text-align: left; margin: 0 1em;
       -webkit-hyphens: none; hyphens: none; }
p { text-align: left; margin: 0 0 1.1em 0; }
h1, h2, h3 { color: #26404f; line-height: 1.3; text-align: left;
             page-break-after: avoid; }
h1 { font-size: 1.6em; margin: 1.4em 0 .6em; }
h2 { font-size: 1.32em; margin: 1.3em 0 .5em; }
h3 { font-size: 1.12em; margin: 1.2em 0 .4em; color: #2e7d80; }
blockquote { margin: 1.3em 0; padding: .8em 1em; border-left: 3px solid #c9a227;
             background: #f7f2e2; font-style: normal; }
blockquote p:last-child { margin-bottom: 0; }
table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: .95em; }
th, td { border: 1px solid #d8c9b4; padding: .45em .6em; text-align: left; }
th { background: #f0e8d2; }
img { max-width: 100%; height: auto; }
figure { margin: 1.4em 0; text-align: center; }
figcaption { font-size: .88em; font-style: italic; color: #5d7480; margin-top: .5em; }
hr { border: 0; border-top: 1px solid #d8c9b4; margin: 2em 0; }
ul, ol { margin: 0 0 1.1em 1.2em; }
li { margin-bottom: .45em; }
code { font-family: monospace; font-size: .92em; }
"""


def build(src, out, cover):
    src, out, cover = map(pathlib.Path, (src, out, cover))
    text = src.read_text(encoding='utf-8')

    # Αν το αρχείο έχει ήδη front matter, το κρατάμε και το ξαναχρησιμοποιούμε.
    fm = re.match(r'^---\n(.*?\n)---\n', text, re.S)
    front = {}
    if fm:
        for line in fm.group(1).split('\n'):
            k, _, v = line.partition(':')
            if _:
                front[k.strip()] = v.strip().strip('"')
        text = text[fm.end():]

    greek = len(re.findall(r'[\u0370-\u03ff]', text[:2000])) > 20
    lang = front.get('lang') or ('el' if greek else 'en')

    # Ο Πίνακας Περιεχομένων με χειροκίνητους αριθμούς σελίδων δεν έχει νόημα
    # σε ρέον κείμενο· ο αναγνώστης έχει τον δικό του.
    head = r'^#{1,2}[ \t]+(Πίνακας Περιεχομένων|Table of Contents)[ \t]*$'
    m = re.search(head, text, re.M)
    if m:
        nxt = re.search(r'^#[ \t]+', text[m.end():], re.M)
        if nxt:
            text = text[:m.start()] + text[m.end() + nxt.start():]
        # ο διαχωριστής --- που έμενε ορφανός πριν τον ΠΠ
        text = re.sub(r'\n---\n+(?=#[ \t])', '\n\n', text, count=1)

    def pick(key, rx):
        if front.get(key):
            return front[key]
        m = re.search(rx, text, re.M)
        return m.group(1).strip() if m else ''

    title = pick('title', r'^#[ \t]+(.+)$')
    subtitle = pick('subtitle', r'^\*\*([^*]+)\*\*$')
    author = pick('author', r'^\*\*([^*]+)\*\*$')
    rights = front.get('rights') or 'CC BY-NC-ND 4.0'

    q = lambda v: v.replace('"', "'")
    meta = (f'---\ntitle: "{q(title)}"\nsubtitle: "{q(subtitle)}"\n'
            f'author: "{q(author)}"\nlang: {lang}\n'
            f'rights: "{q(rights)}"\n'
            f'publisher: "neurodivergent-mindfulness.org"\n---\n\n')

    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        (tmp / 'style.css').write_text(CSS, encoding='utf-8')
        (tmp / 'book.md').write_text(meta + text, encoding='utf-8')
        cmd = ['pandoc', str(tmp / 'book.md'), '-o', str(out),
               '--to=epub3', '--css', str(tmp / 'style.css'),
               '--epub-cover-image', str(cover),
               '--toc', '--toc-depth=2',
               '--split-level=1',
               '--resource-path', f'{src.parent}:{src.parent / "img"}:.']
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode:
            print(r.stderr, file=sys.stderr)
            sys.exit(1)
        if r.stderr.strip():
            print(r.stderr.strip())

    print(f'wrote {out}  ({out.stat().st_size // 1024} KB, lang={lang})')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    build(*sys.argv[1:])
