#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the workbook PDF from markdown, matching the established design
(cream background, navy/teal/gold, colour-coded axis table) with
generous, pedagogical paragraph spacing for neurodivergent readers.

Second-edition changes:
  * Table of Contents now carries real page numbers (target-counter)
  * List markers rendered inside the flow, so PDF reading order stays intact
  * Ballot boxes / geometric symbols no longer stripped as emoji
  * Copyright reads 2025-2026, second edition
"""
import os
import re, sys, html, base64, pathlib
from fonts_css import font_faces

# ---------- language labels ----------
LABELS = {
    'el': {
        'inchapter': 'Σε αυτό το κεφάλαιο',
        'axis': {'ΣΩΜΑ':'body','ΑΝΑΠΝΟΗ':'breath','ΠΡΟΣΟΧΗ':'attention','ΧΩΡΟΣ':'space'},
        'breath': 'Αναπνοή', 'reflection': 'Αναστοχασμός', 'exercise': 'Άσκηση',
        'day': 'Ημέρα', 'toc': 'Πίνακας Περιεχομένων', 'intro': 'Εισαγωγή',
        'running': 'Οδηγός Ενσυνειδητότητας για Νευροδιαφορετικούς',
        'pocket': 'ΓΕΙΩΣΗ — ΜΑΚΡΙΑ ΕΚΠΝΟΗ — ΤΑΜΠΕΛΑ — ΑΝΟΙΓΜΑ',
        'jprompt': 'Τι παρατήρησα σήμερα:',
        'rights': '© 2025–2026 · CC BY-NC-ND 4.0 · Δεύτερη έκδοση',
        'author_lbl': 'Συγγραφέας', 'year_lbl': 'Έκδοση', 'year_val': 'Δεύτερη έκδοση, 2026',
    },
    'en': {
        'inchapter': 'In this chapter',
        'axis': {'BODY':'body','BREATH':'breath','ATTENTION':'attention','SPACE':'space'},
        'breath': 'Breath', 'reflection': 'Reflection', 'exercise': 'Exercise',
        'day': 'Day', 'toc': 'Table of Contents', 'intro': 'Introduction',
        'running': 'A Mindfulness Guide for Neurodivergent Individuals',
        'pocket': 'GROUND — LONG EXHALE — LABEL — OPEN',
        'jprompt': 'What I noticed today:',
        'rights': '© 2025–2026 · CC BY-NC-ND 4.0 · Second edition',
        'author_lbl': 'Author', 'year_lbl': 'Edition', 'year_val': 'Second edition, 2026',
    },
}
AXIS_COLORS = {  # label-bg, row-bg
    'body':      ('#4e7a46', '#eaf0e4'),
    'breath':    ('#2e7d80', '#e3f0f0'),
    'attention': ('#b0851f', '#f5ecd2'),
    'space':     ('#6b4e9e', '#eee7f5'),
}
# Emoji stripped for print. Ballot boxes (2610-2612), stars (2605-2606) and the
# infinity sign are typographic, not emoji -- they must survive.
KEEP = set('\u2610\u2611\u2612\u2605\u2606\u221e\u2022\u00b7\u2192\u2014\u2013')
EMOJI_RE = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000027BF\U0001F1E6-\U0001F1FF\U00002B00-\U00002BFF\uFE0F\u200d]",
    flags=re.UNICODE)

def strip_emoji(s):
    out = EMOJI_RE.sub(lambda m: m.group(0) if m.group(0) in KEEP else '', s)
    return out.replace('  ', ' ').strip()

# ---------- inline markdown ----------
def slugify(t):
    t = re.sub(r'<[^>]+>', '', t)
    t = re.sub(r'[^\w\s-]', '', t, flags=re.UNICODE).strip().lower()
    return 'sec-' + re.sub(r'[\s]+', '-', t)[:60]

def inline(text):
    had_link_emoji = ('🔗' in text) or ('🎧' in text)
    text = strip_emoji(text)
    text = html.escape(text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<em>\1</em>', text)
    return text.strip(), had_link_emoji

def raw_has(s, *subs):
    return any(x in s for x in subs)

BLOCK_START = re.compile(r'^(#{1,6}\s|-\s|\||\u2610|!\[|-{3,}$)')

def unwrap_lines(lines):
    """Ενώνει τις γραμμές κάθε παραγράφου σε μία.

    Το markdown είναι τυλιγμένο στους 80 χαρακτήρες. Χωρίς αυτό, κάθε γραμμή
    γίνεται ξεχωριστό <p> και κάθε έμφαση που σπάει σε δύο γραμμές τυπώνεται
    με τους αστερίσκους της.
    """
    out, buf, quote = [], [], []

    def flush_plain():
        if buf:
            out.append(' '.join(x.strip() for x in buf))
            buf.clear()

    def flush_quote():
        """Ένα blockquote: οι ομάδες χωρίζονται από κενή γραμμή '>'.
        Η πρώτη γραμμή μένει μόνη της αν είναι ολόκληρη τίτλος σε bold."""
        if not quote:
            return
        groups, cur = [], []
        for raw in quote:
            if raw.strip() == '':
                if cur:
                    groups.append(cur); cur = []
                groups.append([])          # κρατά την κενή γραμμή
            else:
                cur.append(raw.strip())
        if cur:
            groups.append(cur)
        if groups and groups[0] and re.fullmatch(r'\*\*[^*]+\*\*', groups[0][0]):
            head = groups[0][0]
            rest = groups[0][1:]
            groups[0:1] = ([head], rest) if rest else ([head],)
        for g in groups:
            out.append('> ' + ' '.join(g) if g else '>')
        quote.clear()

    for line in lines:
        s = line.strip()
        if s.startswith('>'):
            flush_plain()
            quote.append(re.sub(r'^\s*>\s?', '', line))
            continue
        flush_quote()
        if not s:
            flush_plain(); out.append(''); continue
        if BLOCK_START.match(s):
            flush_plain(); out.append(line); continue
        # συνέχεια στοιχείου λίστας: γραμμή με εσοχή μετά από «- »
        if (line[:1] in ' \t' and out and not buf
                and re.match(r'^-\s', out[-1].strip())):
            out[-1] = out[-1].rstrip() + ' ' + s
            continue
        buf.append(line)
    flush_plain(); flush_quote()
    return out

IMG_BASE = pathlib.Path('.')

# ---------- images ----------
IMG_RE = re.compile(r'^!\[([^\]]*)\]\(([^)]+)\)\s*$')

def _img_uri(path, base):
    p = (base / path) if not os.path.isabs(path) else pathlib.Path(path)
    ext = p.suffix.lower().lstrip('.')
    mime = 'image/png' if ext == 'png' else 'image/jpeg'
    return f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()

def figure_html(items, base):
    """Μία εικόνα, ή δύο δίπλα-δίπλα αν δοθούν δύο διαδοχικές."""
    cls = 'figure pair' if len(items) == 2 else 'figure'
    out = [f'<figure class="{cls}">']
    for cap, path in items:
        out.append('<span class="fig-item">'
                   f'<img src="{_img_uri(path, base)}" alt="{html.escape(cap)}">'
                   + (f'<figcaption>{inline(cap)[0]}</figcaption>' if cap else '')
                   + '</span>')
    out.append('</figure>')
    return ''.join(out)

SRC_DIR = pathlib.Path('.')

# ---------- block parser ----------
def parse_body(lines, L, anchors=None):
    """anchors: optional dict {plain_heading_text: anchor_id} to stamp ids on
    headings so the table of contents can resolve page numbers."""
    out = []
    _used = set()
    i, n = 0, len(lines)
    axis_keys = L['axis']
    def flush_para(buf):
        if buf:
            txt, _ = inline(' '.join(buf))
            if txt:
                out.append(f'<p>{txt}</p>')
            buf.clear()
    while i < n:
        line = lines[i]
        s = line.strip()
        if not s:
            i += 1; continue
        if re.fullmatch(r'-{3,}', s):
            i += 1; continue
        m = re.match(r'^(#{1,3})\s+(.*)$', s)
        if m:
            level = len(m.group(1)); htext = m.group(2).strip()
            htxt, _ = inline(htext)
            plain = re.sub(r'<[^>]+>', '', htxt)
            aid = ''
            if anchors is not None:
                key = anchors_key(plain)
                hit = anchors.get(key)
                if hit is None:
                    for k, v in anchors.items():
                        if v in _used: continue
                        if key.startswith(k) or k.startswith(key):
                            hit = v; break
                if hit is not None and hit not in _used:
                    _used.add(hit)
                    aid = f' id="{hit}"'
            if level == 1:
                out.append(f'<h1{aid}>{htxt}</h1>')
            elif level == 2:
                if re.match(r'^(Chapter|Κεφάλαιο)\b', htext):
                    out.append(f'<h2 class="chapter"{aid}>{htxt}</h2>')
                elif ' / ' in htext:
                    out.append(f'<h2 class="axis-section"{aid}>{htxt}</h2>')
                elif re.search(r'(7-Day Practice Journal|7-Ήμερο Ημερολόγιο)', htext):
                    out.append(f'<h2 class="section2 major"{aid}>{htxt}</h2>')
                else:
                    out.append(f'<h2 class="section2"{aid}>{htxt}</h2>')
            else:
                out.append(f'<h3{aid}>{htxt}</h3>')
            i += 1; continue
        if s.startswith('!['):
            # μαζεύει και τις αμέσως επόμενες εικόνες: δύο μαζί γίνονται ζεύγος
            mi = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', s)
            j = i + 1
            while j < n:
                nxt = lines[j].strip()
                if not nxt:
                    j += 1; continue
                if nxt.startswith('!['):
                    mi += re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', nxt)
                    i = j; j += 1; continue
                break
            figs = []
            for cap, path in mi:
                p = (SRC_DIR / path) if not os.path.isabs(path) else pathlib.Path(path)
                if not p.exists():
                    print(f'  ΛΕΙΠΕΙ εικόνα: {path}')
                    continue
                mime = 'image/png' if p.suffix.lower() == '.png' else 'image/jpeg'
                b64 = base64.b64encode(p.read_bytes()).decode()
                figs.append(f'<figure><img src="data:{mime};base64,{b64}" alt="{html.escape(cap)}">'
                            + (f'<figcaption>{inline(cap)[0]}</figcaption>' if cap else '')
                            + '</figure>')
            if figs:
                cls = 'figpair' if len(figs) > 1 else 'figsingle'
                out.append(f'<div class="{cls}">' + ''.join(figs) + '</div>')
            i += 1; continue
        if s.startswith('>') and re.sub(r'^>\s*', '', s).strip('*').strip() == L['pocket']:
            out.append(f'<div class="pocketcard">{html.escape(L["pocket"])}</div>')
            i += 1; continue
        if s.startswith('>'):
            q = []
            applink = False
            while i < n and lines[i].strip().startswith('>'):
                raw = re.sub(r'^\s*>\s?', '', lines[i])
                if raw_has(raw, '🔗', '🎧'):
                    applink = True
                q.append(raw)
                i += 1
            first = q[0].strip()
            cls = 'quote'
            title_html = None
            body_lines = q
            if first.startswith('★'):
                cls = 'keypoint'
                q[0] = first.lstrip('★ ').strip()
                body_lines = q
            elif applink:
                cls = 'applink'
            elif re.match(r'^\*\*'+re.escape(L['inchapter']), first):
                cls = 'inchapter'
                title_html, _ = inline(first)
                body_lines = q[1:]
            parts = []
            if title_html:
                parts.append(f'<div class="cotitle">{title_html}</div>')
            for bl in body_lines:
                t, _ = inline(bl)
                if t: parts.append(f'<p>{t}</p>')
            out.append(f'<div class="callout {cls}">' + ''.join(parts) + '</div>')
            continue
        if re.match(r'^-\s+', s):
            items = []
            while i < n and re.match(r'^-\s+', lines[i].strip()):
                items.append(re.sub(r'^-\s+', '', lines[i].strip()))
                i += 1
            def axis_of(it):
                mm = re.match(r'^\*\*([^*]+)\*\*\s*[—-]\s*(.*)$', it)
                if mm and mm.group(1).strip() in axis_keys:
                    return axis_keys[mm.group(1).strip()], mm.group(1).strip(), mm.group(2).strip()
                return None
            axinfo = [axis_of(it) for it in items]
            if items and all(axinfo):
                rows = []
                for key, lbl, desc in axinfo:
                    lbg, rbg = AXIS_COLORS[key]
                    dhtml, _ = inline(desc)
                    rows.append(
                        f'<tr><td class="axlabel" style="background:{lbg}">{html.escape(lbl)}</td>'
                        f'<td class="axdesc" style="background:{rbg}">{dhtml}</td></tr>')
                out.append('<table class="axistable">'+''.join(rows)+'</table>')
            else:
                lis = ''.join(f'<li>{inline(it)[0]}</li>' for it in items)
                out.append(f'<ul>{lis}</ul>')
            continue
        if re.match(r'^\d+\.\s+', s):
            items = []
            while i < n and re.match(r'^\d+\.\s+', lines[i].strip()):
                items.append(re.sub(r'^\d+\.\s+', '', lines[i].strip()))
                i += 1
            lis = ''.join(f'<li>{inline(it)[0]}</li>' for it in items)
            out.append(f'<ol>{lis}</ol>')
            continue
        if s.strip('*').strip() == L['pocket']:
            out.append(f'<div class="pocketcard">{html.escape(L["pocket"])}</div>')
            i += 1; continue
        md = re.match(r'^\*\*('+L['day']+r'\s+.*?)\*\*\s*$', s)
        if md:
            title = md.group(1).strip()
            meta = ''
            if i+1 < n and re.match(r'^\*.*\*$', lines[i+1].strip()):
                meta = lines[i+1].strip().strip('*').strip()
                i += 1
            out.append(f'<div class="day"><div class="day-title">{inline(title)[0]}</div>'
                       + (f'<div class="day-meta">{html.escape(meta)}</div>' if meta else '')
                       + '</div>')
            i += 1; continue
        if re.match(r'^\*\*'+L['breath']+r':\*\*', s):
            t, _ = inline(s)
            out.append(f'<div class="breath">{t}</div>')
            i += 1; continue
        if re.match(r'^\*'+L['exercise']+r'\b.*:\*$', s):
            t, _ = inline(s)
            out.append(f'<div class="exercise-title">{t}</div>')
            i += 1; continue
        if re.match(r'^\*'+L['reflection']+r':', s):
            t, _ = inline(s)
            out.append(f'<div class="reflection">{t}</div>')
            i += 1; continue
        if raw_has(s, '🔗', '🎧'):
            t, _ = inline(s)
            out.append(f'<div class="callout applink"><p>{t}</p></div>')
            i += 1; continue
        if s == L['jprompt']:
            out.append(f'<div class="jprompt">{html.escape(s)}</div>'
                       + '<div class="jwrite"></div>'*3)
            i += 1; continue
        # journal checkbox row
        if s.startswith('☐'):
            out.append(f'<div class="jrow">{html.escape(strip_emoji(s))}</div>')
            i += 1; continue
        mi = IMG_RE.match(s)
        if mi:
            items = [(mi.group(1), mi.group(2))]
            i += 1
            while i < n and not lines[i].strip():
                j = i
                while j < n and not lines[j].strip():
                    j += 1
                m2 = IMG_RE.match(lines[j].strip()) if j < n else None
                if m2 and len(items) < 2:
                    items.append((m2.group(1), m2.group(2))); i = j + 1
                else:
                    break
            out.append(figure_html(items, IMG_BASE))
            continue
        buf = [s]
        i += 1
        flush_para(buf)
    return '\n'.join(out)

# ---------- toc anchoring ----------
def anchors_key(t):
    """Normalise a heading / toc entry so the two can be matched."""
    t = html.unescape(re.sub(r'<[^>]+>', '', t))
    t = t.replace('–', '-').replace('—', '-').replace('’', "'")
    t = re.sub(r'^(Ch\.|Chapter|Κεφ\.|Κεφάλαιο)\s*', '', t)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'[^\w\s\'-]', '', t, flags=re.UNICODE)
    return t.strip().lower()

# ---------- front matter ----------
def build_front(meta, L, cover_data_uri):
    title = meta.get('title',''); subtitle = meta.get('subtitle','')
    author = meta.get('author',''); desc = meta.get('description','')
    lang = meta.get('lang','en')
    if lang == 'el':
        lic=('Αυτό το έργο προσφέρεται δωρεάν υπό τους όρους της άδειας Creative Commons '
             'Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0). '
             'Επιτρέπεται η κοινοποίηση με αναφορά στον δημιουργό. Απαγορεύεται η εμπορική χρήση και η τροποποίηση.')
        safety=('<strong>Μια σημείωση πριν ξεκινήσεις.</strong> Οι ασκήσεις που ακολουθούν είναι εργαλεία '
                'αυτορρύθμισης — δεν αντικαθιστούν θεραπεία, διάγνωση ή φαρμακευτική αγωγή. Αν κάποια στιγμή '
                'τα συναισθήματα σε πλημμυρίσουν, ή αν νιώσεις έντονη δυσφορία, σταμάτα την άσκηση, άνοιξε τα '
                'μάτια και νιώσε τα πέλματα στο έδαφος. Η υποστήριξη ενός θεραπευτή μπορεί να αποδειχθεί '
                'πολύτιμη. Η πρακτική της παρουσίας έχει τη συμπόνια στον πυρήνα της.')
    else:
        lic=('This work is offered free of charge under the terms of the Creative Commons '
             'Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0). '
             'Sharing is permitted with attribution to the creator. Commercial use and modification are not permitted.')
        safety=('<strong>A note before you begin.</strong> The exercises that follow are self-regulation tools — '
                'they are not a substitute for therapy, diagnosis, or medication. If at any point your emotions '
                'overwhelm you, or you feel intense discomfort, stop the exercise, open your eyes, and feel the '
                'soles of your feet on the ground. The support of a therapist can prove valuable. The practice '
                'of presence has compassion at its core.')
    return f'''
<section class="coverpage">
  <img class="cover-bleed" src="{cover_data_uri}" alt="cover"/>
  <div class="cover-over">
    <div class="co-title">{html.escape(title)}</div>
    <div class="co-rule"></div>
    <div class="co-sub">{html.escape(subtitle)}</div>
    <div class="co-author">{html.escape(author)}</div>
  </div>
</section>
<section class="cover">
  <h1 class="cover-title">{html.escape(title)}</h1>
  <div class="cover-rule"></div>
  <p class="cover-sub">{html.escape(subtitle)}</p>
  <p class="cover-tag">{html.escape(desc)}</p>
  <p class="cover-author">{html.escape(author)}</p>
  <p class="cover-lic">{html.escape(L['rights'])}</p>
</section>
<section class="copyright">
  <p><strong>{L['author_lbl']}:</strong> {html.escape(author)}<br><strong>{L['year_lbl']}:</strong> {L['year_val']}</p>
  <p>{html.escape(lic)}</p>
  <div class="callout safety"><p>{safety}</p></div>
</section>
'''

def build_toc(toc_lines, L):
    """Each item links to its heading anchor; the page number is filled in by
    WeasyPrint via target-counter, with a dot leader between."""
    parts = [f'<section class="toc"><h1>{html.escape(L["toc"])}</h1>']
    anchors = {}
    idx = 0
    for ln in toc_lines:
        s = ln.strip()
        if not s or re.fullmatch(r'-{3,}', s): continue
        s = re.sub(r'\s+[—-]\s*\d+\s*$', '', s)      # παλιός αριθμός σελίδας
        mb = re.match(r'^\*\*(.+?)\*\*$', s)
        if mb:
            parts.append(f'<div class="toc-group">{html.escape(mb.group(1))}</div>')
        elif s.startswith('- '):
            label = s[2:].strip()
            idx += 1
            aid = f'toc{idx}'
            anchors[anchors_key(label)] = aid
            parts.append(f'<div class="toc-item"><a class="tocl" href="#{aid}">'
                         f'<span class="tt">{html.escape(label)}</span>'
                         f'<span class="leader"></span></a></div>')
    parts.append('</section>')
    return '\n'.join(parts), anchors

# ---------- CSS ----------
def css(L):
    return font_faces() + f'''
@page {{
  size: A4; margin: 2.35cm 2.9cm 1.7cm 2.9cm; background: #FBF6E9;
  @bottom-center {{ content: counter(page); color:#F1EAD3; font-family:"Noto Sans"; font-size:9.5pt; }}
}}
@page :first {{ margin:0; @bottom-center {{ content: ""; }} }}
@page cover {{ margin:0; @bottom-center {{ content: ""; }} }}
* {{ box-sizing: border-box; }}
html {{ font-family:"Noto Sans","Symbols",sans-serif; color:#26404f;
     font-size:12.25pt; font-weight:400; }}
body {{ margin:0; }}
p {{ line-height:1.7; margin:0 0 1.4em 0; text-align:left; }}
strong {{ color:#1f3a4d; font-weight:800; }}
a {{ color:#2e7d80; text-decoration:none; }}
h1 {{ color:#1f3a4d; font-size:21pt; font-weight:800; margin:0 0 .5cm 0;
     padding-bottom:.18cm; border-bottom:2pt solid #c9a227; page-break-before:always; }}
h2.chapter {{ color:#2e7d80; font-size:16.5pt; font-weight:800; margin:.2cm 0 .55cm 0;
     page-break-before:always; }}
h2.axis-section {{ color:#1f3a4d; font-size:19pt; font-weight:800; text-align:center;
     margin:1cm 0 .3cm 0; page-break-before:always; letter-spacing:.5pt; }}
h2.section2 {{ color:#1f3a4d; font-size:15pt; font-weight:800; margin:1.4em 0 .5em 0; }}
h2.section2.major {{ page-break-before:always; font-size:18pt; margin:.2cm 0 .5cm 0; }}
h3 {{ color:#2e7d80; font-size:13pt; font-weight:800; margin:1.5em 0 .6em 0; }}

/* Lists: markers rendered inline so the PDF reading order is not broken.
   (Outside markers were being flushed to the page footer.) */
ul, ol {{ margin:0 0 1.5em 0; padding-left:0; list-style:none; }}
li {{ line-height:1.75; margin:0 0 .55em 0; padding-left:1.15em; text-indent:-1.15em; }}
ul > li::before {{ content:"\\2022\\00a0\\00a0"; color:#2e7d80; font-weight:bold; }}
ol {{ counter-reset:olc; }}
ol > li {{ padding-left:1.5em; text-indent:-1.5em; counter-increment:olc; }}
ol > li::before {{ content:counter(olc) ".\\00a0\\00a0"; color:#2e7d80; font-weight:bold; }}

.callout {{ margin:0 0 1.5em 0; padding:.45cm .55cm; border-radius:7px; break-inside:avoid; }}
.callout p {{ margin:0 0 .5em 0; }}
.callout p:last-child {{ margin-bottom:0; }}
.callout.inchapter {{ background:#e4efef; border-left:3.5pt solid #2e7d80; font-style:italic; }}
.callout.inchapter .cotitle {{ font-style:normal; font-weight:800; color:#1f3a4d; margin-bottom:.3em; }}
.figure {{ margin:6mm 0; text-align:center; break-inside:avoid; }}
.figure img {{ max-width:100%; max-height:105mm; border-radius:2pt; }}
.figure figcaption {{ font-size:9.5pt; font-style:italic; color:#5c7080;
     margin-top:2mm; letter-spacing:0; }}
.figure.pair {{ display:flex; gap:7mm; justify-content:center; align-items:flex-end; }}
.figure.pair .fig-item {{ flex:1 1 0; display:block; }}
.figure.pair img {{ max-height:95mm; }}
figure {{ margin:0; }}
figure img {{ width:100%; height:auto; display:block; border-radius:3pt; }}
figcaption {{ font-size:9.5pt; font-style:italic; color:#5d7480; text-align:center;
  margin-top:2.5mm; line-height:1.45; }}
.figsingle {{ margin:6mm auto 7mm; max-width:66%; break-inside:avoid; }}
.figpair {{ display:flex; gap:7mm; margin:6mm 0 7mm; break-inside:avoid; align-items:flex-end; }}
.figpair figure {{ flex:1 1 0; display:flex; flex-direction:column; justify-content:flex-end; }}
.figpair img {{ height:78mm; width:auto; margin:0 auto; object-fit:contain; }}
.callout.keypoint {{ background:#f6efd6; border-left:3.5pt solid #c9a227; }}
.callout.keypoint p {{ font-weight:700; color:#3a2f10; }}
.callout.keypoint p:first-child::before {{ content:"\\2605  "; color:#c9a227; font-weight:bold; }}
.callout.applink {{ background:#eceff2; border-left:3.5pt solid #1f3a4d; font-size:10.3pt; }}
.callout.quote {{ background:#f4efe0; border-left:3.5pt solid #cbb26a; font-style:italic; }}
.callout.safety {{ background:#f3e9e4; border-left:3.5pt solid #a8624a; margin-top:1.2cm; }}
.callout.safety p {{ text-align:left; }}

table.axistable {{ width:100%; border-collapse:separate; border-spacing:0 5px; margin:0 0 1.5em 0; }}
table.axistable td {{ padding:.32cm .4cm; vertical-align:middle; }}
td.axlabel {{ width:3.2cm; color:#fff; font-weight:800; letter-spacing:.5pt; text-align:center;
     border-radius:6px 0 0 6px; }}
td.axdesc {{ border-radius:0 6px 6px 0; line-height:1.55; }}
.day {{ break-inside:avoid; margin:1.7em 0 .8em 0; padding-top:.35em; border-top:1.5pt solid #e0d3a8; }}
.day-title {{ font-weight:800; color:#1f3a4d; font-size:13pt; }}
.day-meta {{ font-style:italic; color:#2e7d80; font-size:10pt; margin-top:.15em; }}
div.exercise-title {{ font-weight:800; color:#2e7d80; margin:.2em 0 .5em 0; }}
div.breath {{ background:#eef2f2; border-left:3pt solid #2e7d80; padding:.28cm .45cm; border-radius:5px;
     margin:0 0 1em 0; line-height:1.6; }}
div.reflection {{ font-style:italic; color:#5a6b74; margin:0 0 1em 0; }}
div.pocketcard {{ text-align:center; font-weight:800; color:#1f3a4d; font-size:15pt; letter-spacing:1pt;
     background:#f6efd6; border:1.5pt solid #c9a227; border-radius:8px; padding:.5cm; margin:0 0 1.5em 0; }}
div.jprompt {{ color:#5a6b74; font-size:10.5pt; margin:0 0 .3cm 0; }}
div.jwrite {{ border-bottom:1px solid #ddd0aa; height:.72cm; margin:0 0 .1cm 0; }}
div.jrow {{ font-size:13pt; letter-spacing:.6pt; color:#1f3a4d; margin:.15cm 0 .35cm 0; }}

.hband {{ position:fixed; top:-2.35cm; left:-2.9cm; right:-2.9cm; height:1.4cm;
     background:#213a4d; border-bottom:2.5pt solid #c9a227; }}
.hband .rt {{ position:absolute; right:2.9cm; bottom:5pt; color:#eef2f0; font-style:italic; font-size:8.5pt; }}
.fband {{ position:fixed; bottom:-1.7cm; left:-2.9cm; right:-2.9cm; height:1.7cm; background:#213a4d; }}
.fband .fl {{ position:absolute; left:2.9cm; top:50%; transform:translateY(-50%); color:#eef2f0; font-style:italic; font-size:8pt; }}
.fband .fr {{ position:absolute; right:2.9cm; top:50%; transform:translateY(-50%); color:#cfd8dc; font-size:8pt; }}
.coverpage {{ page:cover; height:0; margin:0; padding:0; break-after:page; }}
.cover-bleed {{ position:absolute; top:0; left:0;
  width:21cm; height:29.7cm; object-fit:cover; object-position:center;
  z-index:99; display:block; }}
.cover-over {{ position:absolute; top:0; left:0; width:21cm; height:29.7cm;
  z-index:100; text-align:center; }}
.co-title {{ position:absolute; top:1.35cm; left:1.6cm; right:1.6cm;
  font-size:27pt; font-weight:700; line-height:1.18; color:#f6efd6;
  letter-spacing:0; text-shadow:0 0 12pt rgba(4,20,26,.85); }}
.co-rule {{ position:absolute; top:4.55cm; left:37%; right:37%; height:1.6pt;
  background:#c9a227; }}
.co-sub {{ position:absolute; top:5.0cm; left:2cm; right:2cm;
  font-size:13pt; font-style:italic; color:#e8dcb8;
  text-shadow:0 0 10pt rgba(4,20,26,.85); }}
.co-author {{ position:absolute; bottom:1.35cm; left:2cm; right:2cm;
  font-size:12.5pt; color:#f6efd6; letter-spacing:.8pt; font-weight:700;
  text-shadow:0 0 6pt rgba(4,20,26,1), 0 0 16pt rgba(4,20,26,.95); }}
.cover {{ text-align:center; padding-top:3.2cm; break-after:page; }}
.cover-title {{ border:none; page-break-before:avoid; color:#1f3a4d; font-size:30pt; margin:.1cm 0 .1cm 0; padding:0; text-align:center; }}
.cover-rule {{ width:60%; height:2pt; background:#c9a227; margin:.15cm auto .35cm auto; }}
.cover-sub {{ font-style:italic; color:#2e7d80; font-size:15pt; text-align:center; margin:0 0 .25cm 0; }}
.cover-tag {{ color:#5a6b74; font-size:11pt; text-align:center; margin:0 0 1.1cm 0; }}
.cover-author {{ color:#1f3a4d; font-size:13pt; text-align:center; margin:0 0 .1cm 0; }}
.cover-lic {{ color:#8a7f5e; font-size:10pt; text-align:center; margin:0; }}
.copyright {{ page-break-before:always; padding-top:1cm; }}
.copyright p {{ line-height:1.7; }}

/* Table of contents with dot leaders and real page numbers */
.toc h1 {{ page-break-before:always; }}
.toc-group {{ font-weight:800; color:#1f3a4d; font-size:12.5pt; margin:.8em 0 .3em 0; }}
.toc-item {{ margin:.15em 0 .15em .4cm; line-height:1.7; }}
a.tocl {{ display:flex; align-items:baseline; color:#31505f; text-decoration:none; }}
a.tocl .tt {{ flex:0 1 auto; }}
a.tocl .leader {{ flex:1 1 auto; margin:0 .25em; border-bottom:1px dotted #b9c6ce;
     transform:translateY(-.18em); min-width:1em; }}
a.tocl::after {{ flex:0 0 auto; color:#2e7d80; font-weight:800;
     content: target-counter(attr(href), page); }}
'''

# ---------- main ----------
def main(src, out_pdf, cover_path):
    global SRC_DIR
    SRC_DIR = pathlib.Path(src).resolve().parent
    text = pathlib.Path(src).read_text(encoding='utf-8')
    meta = {}
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if m:
        for ln in m.group(1).splitlines():
            mm = re.match(r'^(\w+):\s*"?(.*?)"?\s*$', ln)
            if mm: meta[mm.group(1)] = mm.group(2)
        text = text[m.end():]
    if not meta:
        # Χωρίς front matter: τα στοιχεία διαβάζονται από την αρχή του αρχείου.
        head = text[:1200]
        greek = len(re.findall(r'[\u0370-\u03ff]', head)) > 20
        meta['lang'] = 'el' if greek else 'en'
        mt = re.search(r'^#\s+(.+)$', head, re.M)
        ms = re.search(r'^##\s+(.+)$', head, re.M)
        md_ = re.search(r'^\*([^*].+?)\*$', head, re.M)
        ma = re.search(r'^\*\*([^*]+)\*\*$', head, re.M)
        if mt: meta['title'] = mt.group(1).strip()
        if ms: meta['subtitle'] = ms.group(1).strip()
        if md_: meta['description'] = md_.group(1).strip()
        if ma: meta['author'] = ma.group(1).strip()
    global IMG_BASE
    IMG_BASE = pathlib.Path(src).resolve().parent
    lang = meta.get('lang','en'); L = LABELS[lang]
    lines = unwrap_lines(text.split('\n'))
    intro_idx = next(i for i,l in enumerate(lines) if re.match(r'^#\s+'+re.escape(L['intro'])+r'\s*$', l.strip()))
    toc_start = next((i for i,l in enumerate(lines) if re.match(r'^#{1,2}\s', l.strip()) and L['toc'] in l), None)
    toc_lines = lines[toc_start+1:intro_idx] if toc_start is not None else []
    body_lines = lines[intro_idx:]
    data = base64.b64encode(pathlib.Path(cover_path).read_bytes()).decode()
    cover_uri = f'data:image/jpeg;base64,{data}'
    front = build_front(meta, L, cover_uri)
    toc_html, anchors = build_toc(toc_lines, L)
    body_html = parse_body(body_lines, L, anchors)

    # report any toc entry that failed to bind to a heading
    bound = set(re.findall(r'id="(toc\d+)"', body_html))
    missing = [k for k,v in anchors.items() if v not in bound]
    if missing:
        print('  unbound toc entries:', len(missing), missing[:6])

    doc = f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8">
<style>{css(L)}</style></head><body>
<div class="hband"><span class="rt">{html.escape(L['running'])}</span></div>
<div class="fband"><span class="fl">{html.escape(meta.get('author',''))}</span><span class="fr">CC BY-NC-ND 4.0</span></div>
{front}
{toc_html}
{body_html}
</body></html>'''
    pathlib.Path(out_pdf.replace('.pdf','_debug.html')).write_text(doc, encoding='utf-8')
    from weasyprint import HTML
    HTML(string=doc, base_url='.').write_pdf(out_pdf)
    print('wrote', out_pdf)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
