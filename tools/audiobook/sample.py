#!/usr/bin/env python3
"""A short listening sample of the reader's voice, in a few versions, to choose
how the app's chapters should be spoken before they are all made again.

Reads the JSON written by scripts/export-reading.ts and speaks one page of a
chapter (by default the first theory pages of Chapter 1) in these versions:

    1-tora              as the app speaks it now: each sentence on its own,
                        0.12 s between sentences
    2-pafseis           the same sentences, with pauses that follow the
                        punctuation (full stop, question, colon, ano teleia)
    3-pafseis-kommata   as 2, and every comma is a short pause too
                        (the sentence is spoken in pieces)
    4-ssml              each paragraph spoken in one go, with the pauses given
                        to the voice as SSML <break> (what the app uses for Greek)
    5-foni-<name>       as 2, with another Chirp 3 HD voice

Every file plays at the listener's default speed for the language
(0.9, as the audio is made), so it sounds as it will in the app.

    python3 tools/audiobook/sample.py reading.json out/sample [--lang el] [--chapter 1] \
        [--keys s0-title,s0-p0,...] [--voice2 Achernar] [--cache .tts-cache] [--mock]

Uses the same authentication and cache as synth.py.
"""
import argparse
import json
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import synth  # noqa: E402

DEFAULT_KEYS = 's0-title,s0-p0,s0-p1,s1-title,s1-p0,s3-p0,s3-p1'
LISTENER_RATE = {'el': 0.9, 'en': 0.9}
OLD_GAP_MS = 120
COMMA_MS = synth.COMMA_MS
gap_after = synth.gap_after


def comma_pieces(sentence):
    return [p for p in re.split(r'(?<=,)\s+', sentence) if p.strip()]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('reading')
    ap.add_argument('out')
    ap.add_argument('--lang', default='el')
    ap.add_argument('--chapter', type=int, default=1)
    ap.add_argument('--keys', default=DEFAULT_KEYS)
    ap.add_argument('--voice2', default='Achernar')
    ap.add_argument('--cache', default='.tts-cache')
    ap.add_argument('--mock', action='store_true')
    a = ap.parse_args()

    data = json.loads(Path(a.reading).read_text(encoding='utf-8'))
    base, factor, pause_after = data['baseRate'], data['rateFactor'], data['pauseAfter']
    chapter = next(c for c in data['langs'][a.lang] if c['num'] == a.chapter)
    wanted = [k.strip() for k in a.keys.split(',') if k.strip()]
    segs = [s for s in chapter['segments'] if s['key'] in wanted]
    if not segs:
        sys.exit(f'None of {wanted} in chapter {a.chapter}.')

    locale = synth.LOCALE[a.lang]
    voice = f'{locale}-Chirp3-HD-Sulafat'
    voice2 = f'{locale}-Chirp3-HD-{a.voice2}'
    if not a.mock:
        synth.check_voice(locale, voice)
        names = [v['name'] for v in synth._call('GET', f'/voices?languageCode={locale}').get('voices', [])]
        if voice2 not in names:
            print(f'{voice2} not found; version 5 is skipped.', flush=True)
            voice2 = None

    out, cache = Path(a.out), Path(a.cache)
    work = out / '_work'
    for d in (out, cache, work):
        d.mkdir(parents=True, exist_ok=True)
    sil = lambda ms: synth.silence(ms, cache)  # noqa: E731

    def by_sentence(v, gap):
        pieces = [sil(300)]
        for s in segs:
            rate = round(base * factor[s['kind']], 3)
            for j, sentence in enumerate(s['sentences']):
                pieces.append(synth.speak(sentence, rate, v, locale, cache, a.mock))
                if j < len(s['sentences']) - 1:
                    pieces.append(sil(gap(sentence)))
            pieces.append(sil(pause_after[s['kind']]))
        return pieces

    def by_comma():
        pieces = [sil(300)]
        for s in segs:
            rate = round(base * factor[s['kind']], 3)
            for j, sentence in enumerate(s['sentences']):
                parts = comma_pieces(sentence)
                for k, part in enumerate(parts):
                    pieces.append(synth.speak(part, rate, voice, locale, cache, a.mock))
                    if k < len(parts) - 1:
                        pieces.append(sil(COMMA_MS))
                if j < len(s['sentences']) - 1:
                    pieces.append(sil(gap_after(sentence)))
            pieces.append(sil(pause_after[s['kind']]))
        return pieces

    def by_ssml():
        pieces = [sil(300)]
        for s in segs:
            rate = round(base * factor[s['kind']], 3)
            for ssml in synth.paragraph_ssml(s['sentences']):
                pieces.append(synth.speak_ssml(ssml, rate, voice, locale, cache, a.mock))
            pieces.append(sil(pause_after[s['kind']]))
        return pieces

    versions = [
        ('1-tora', lambda: by_sentence(voice, lambda _s: OLD_GAP_MS)),
        ('2-pafseis', lambda: by_sentence(voice, gap_after)),
        ('3-pafseis-kommata', by_comma),
        ('4-ssml', by_ssml),
    ]
    if voice2:
        versions.append((f'5-foni-{a.voice2.lower()}', lambda: by_sentence(voice2, gap_after)))

    tempo = LISTENER_RATE[a.lang] / base
    for name, build in versions:
        pieces = build()
        if not pieces:
            continue
        wav = work / f'{name}.wav'
        synth.concat_wav(pieces, wav, work)
        mp3 = out / f'{a.lang}-{name}.mp3'
        synth.ffmpeg('-i', str(wav), '-af', f'atempo={tempo:.4f},loudnorm=I=-18:TP=-1.5:LRA=11',
                     '-ar', str(synth.RATE_HZ), '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', str(mp3))
        print(f'  {mp3.name}: {synth.duration_s(mp3):.0f} s', flush=True)

    shutil.rmtree(work)


if __name__ == '__main__':
    main()
