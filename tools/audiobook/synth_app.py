#!/usr/bin/env python3
"""Chapter audio for the app's reader.

Reads the JSON written by scripts/export-reading.ts (the app's chapters, cut
into segments and sentences exactly as the reader speaks them) and writes, for
each language and chapter:

    <out>/app-<lang>-NN.mp3    the chapter, spoken by Sulafat, with the reader's pauses
    <out>/app-<lang>-NN.json   timing map: where each segment starts and its speech ends

The reader plays the MP3 and uses the map to highlight the segment being read,
turn pages, skip back and forward, and show the silence after an exercise step.
Each map carries the hash of every segment's text, so the app can tell when a
text has changed since the audio was made.

    python3 tools/audiobook/synth_app.py reading.json out/app [--langs el,en] [--cache .tts-cache] [--mock]

For the languages in --ssml (default: el) each paragraph is spoken in one
request, with the pauses after sentences and commas given to the voice as SSML
<break> (Chirp 3 HD has no pause tags for Greek, and sentences spoken one by
one ran into each other). The other languages are spoken sentence by sentence.

Uses the same voice, authentication and cache as synth.py.
"""
import argparse
import json
import shutil
import sys
import wave
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import synth  # noqa: E402

GAP_BETWEEN_SENTENCES_MS = 120
LEAD_IN_MS = 300


def wav_seconds(path):
    with wave.open(str(path), 'rb') as w:
        return w.getnframes() / float(w.getframerate())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('reading')
    ap.add_argument('out')
    ap.add_argument('--langs', default='el,en')
    ap.add_argument('--cache', default='.tts-cache')
    ap.add_argument('--mock', action='store_true')
    ap.add_argument('--workers', type=int, default=4)
    ap.add_argument('--ssml', default='el', help='languages spoken a paragraph at a time with SSML pauses')
    ap.add_argument('--only', default='', help='chapter numbers, e.g. "1-3" (default: all)')
    a = ap.parse_args()

    data = json.loads(Path(a.reading).read_text(encoding='utf-8'))
    base = data['baseRate']
    pause_after = data['pauseAfter']
    before_practice = data['pauseBeforePractice']
    factor = data['rateFactor']
    keep = None
    if a.only.strip():
        keep = set()
        for part in a.only.split(','):
            lo, _, hi = part.strip().partition('-')
            keep.update(range(int(lo), int(hi or lo) + 1))

    out = Path(a.out)
    cache = Path(a.cache)
    work = out / '_work'
    for d in (out, cache, work):
        d.mkdir(parents=True, exist_ok=True)

    ssml_langs = {x.strip() for x in a.ssml.split(',') if x.strip()}
    for lang in [x.strip() for x in a.langs.split(',') if x.strip()]:
        use_ssml = lang in ssml_langs
        locale = synth.LOCALE[lang]
        voice = f'{locale}-Chirp3-HD-Sulafat'
        if not a.mock:
            synth.check_voice(locale, voice)
        chapters = [c for c in data['langs'][lang] if keep is None or c['num'] in keep]

        # 1. Speak every paragraph (SSML) or sentence (cached ones are skipped).
        def requests(s):
            return synth.paragraph_ssml(s['sentences']) if use_ssml else s['sentences']

        def say(text, rate):
            if use_ssml:
                return synth.speak_ssml(text, rate, voice, locale, cache, a.mock)
            return synth.speak(text, rate, voice, locale, cache, a.mock)

        jobs = []
        for c in chapters:
            for s in c['segments']:
                rate = round(base * factor[s['kind']], 3)
                for text in requests(s):
                    jobs.append((text, rate))
        jobs = list(dict.fromkeys(jobs))
        what = 'paragraphs (SSML)' if use_ssml else 'sentences'
        print(f'{lang}: {len(chapters)} chapters, {len(jobs)} {what}, {sum(len(t) for t, _ in jobs)} characters', flush=True)
        with ThreadPoolExecutor(max_workers=a.workers) as pool:
            spoken = dict(zip(jobs, pool.map(lambda j: say(j[0], j[1]), jobs)))

        # 2. One file and one timing map per chapter.
        for c in chapters:
            pieces = [synth.silence(LEAD_IN_MS, cache)]
            t = LEAD_IN_MS / 1000
            timing = []
            segs = c['segments']
            for i, s in enumerate(segs):
                rate = round(base * factor[s['kind']], 3)
                t0 = t
                texts = requests(s)
                for j, text in enumerate(texts):
                    wav = spoken[(text, rate)]
                    pieces.append(wav)
                    t += wav_seconds(wav)
                    if j < len(texts) - 1:
                        # SSML: two pieces of one long paragraph meet at a sentence end.
                        gap = 550 if use_ssml else GAP_BETWEEN_SENTENCES_MS
                        pieces.append(synth.silence(gap, cache))
                        t += gap / 1000
                end_of_speech = t
                nxt = segs[i + 1] if i + 1 < len(segs) else None
                ms = pause_after[s['kind']] + (before_practice if nxt and nxt['kind'] == 'practice' else 0)
                pieces.append(synth.silence(ms, cache))
                t += ms / 1000
                timing.append({'key': s['key'], 'h': s['hash'], 't0': round(t0, 3), 'e': round(end_of_speech, 3)})

            name = f'app-{lang}-{c["num"]:02d}'
            wav_all = work / f'{name}.wav'
            synth.concat_wav(pieces, wav_all, work)
            synth.ffmpeg('-i', str(wav_all), '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ar', str(synth.RATE_HZ),
                         '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', '-id3v2_version', '3',
                         '-metadata', f'title={c["title"]}', '-metadata', f'artist={synth.AUTHOR[lang]}',
                         '-metadata', f'album={synth.TITLE[lang]}', str(out / f'{name}.mp3'))
            (out / f'{name}.json').write_text(json.dumps({
                'v': 1, 'lang': lang, 'num': c['num'], 'rate': base,
                'duration': round(t, 3), 'segments': timing,
            }, ensure_ascii=False), encoding='utf-8')
            print(f'  {name}: {t / 60:.1f} min, {len(timing)} segments', flush=True)

    shutil.rmtree(work)


if __name__ == '__main__':
    main()
