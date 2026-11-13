#!/usr/bin/env python3
"""The spoken guidance of the chapter animations.

Reads src/data/narration.json and writes, for each animation and language:

    <out>/anim-<id>-<lang>.mp3    the guidance, spoken by Sulafat, scene after scene
    <out>/anim-<id>-<lang>.json   timing map: where each scene starts and its speech
                                  ends, and where each breath phase starts and how long it lasts

The animation plays the MP3 when the person turns the voice on, and follows the
map: the scene changes when its words are done, and the breath's light moves
with the spoken "in" and "out".

    python3 tools/audiobook/synth_anim.py src/data/narration.json out/anim [--langs el,en] [--cache .tts-cache] [--mock]

Uses the same voice, authentication and cache as synth.py.
"""
import argparse
import json
import shutil
import sys
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import synth  # noqa: E402

# A little slower than the chapters' reader (0.9): this is guidance, with the eyes perhaps closed.
RATE = 0.85
LEAD_IN_MS = 400


def wav_seconds(path):
    with wave.open(str(path), 'rb') as w:
        return w.getnframes() / float(w.getframerate())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('narration')
    ap.add_argument('out')
    ap.add_argument('--langs', default='el,en')
    ap.add_argument('--cache', default='.tts-cache')
    ap.add_argument('--mock', action='store_true')
    a = ap.parse_args()

    data = json.loads(Path(a.narration).read_text(encoding='utf-8'))
    out = Path(a.out)
    cache = Path(a.cache)
    work = out / '_work'
    for d in (out, cache, work):
        d.mkdir(parents=True, exist_ok=True)

    for lang in [x.strip() for x in a.langs.split(',') if x.strip()]:
        locale = synth.LOCALE[lang]
        voice = f'{locale}-Chirp3-HD-Sulafat'
        if not a.mock:
            synth.check_voice(locale, voice)
        for anim_id, langs in data.items():
            if anim_id.startswith('_') or lang not in langs:
                continue
            pieces = [synth.silence(LEAD_IN_MS, cache)]
            t = LEAD_IN_MS / 1000
            scenes, breaths = [], []

            def gap(ms):
                nonlocal t
                if ms > 0:
                    pieces.append(synth.silence(int(ms), cache))
                    t += ms / 1000

            for steps in langs[lang]:
                t0 = t
                end = t
                for st in steps:
                    if 'pause' in st:
                        gap(st['pause'])
                    elif 'rest' in st:
                        end = t
                        gap(st['rest'])
                    elif 'say' in st:
                        start = t
                        wav = synth.speak(st['say'], RATE, voice, locale, cache, a.mock)
                        pieces.append(wav)
                        t += wav_seconds(wav)
                        end = t
                        if 'breath' in st:
                            spoken = t - start
                            if spoken * 1000 > st['ms']:
                                print(f'  ! {anim_id}/{lang}: "{st["say"]}" takes longer than its breath', flush=True)
                            breaths.append({'t': round(start, 3), 'phase': st['breath'], 'len': st['ms'] / 1000})
                            gap(st['ms'] - spoken * 1000)
                scenes.append({'t0': round(t0, 3), 'e': round(end, 3)})

            name = f'anim-{anim_id}-{lang}'
            wav_all = work / f'{name}.wav'
            synth.concat_wav(pieces, wav_all, work)
            synth.ffmpeg('-i', str(wav_all), '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ar', str(synth.RATE_HZ),
                         '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', '-id3v2_version', '3',
                         '-metadata', f'title={anim_id}', '-metadata', f'artist={synth.AUTHOR[lang]}',
                         '-metadata', f'album={synth.TITLE[lang]}', str(out / f'{name}.mp3'))
            (out / f'{name}.json').write_text(json.dumps({
                'v': 1, 'id': anim_id, 'lang': lang, 'rate': RATE,
                'duration': round(t, 3), 'scenes': scenes, 'breaths': breaths,
            }, ensure_ascii=False), encoding='utf-8')
            print(f'  {name}: {t:.1f} s, {len(scenes)} scenes, {len(breaths)} breath phases', flush=True)

    shutil.rmtree(work)


if __name__ == '__main__':
    main()
