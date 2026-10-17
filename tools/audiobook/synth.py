#!/usr/bin/env python3
"""Speak the audiobook script and assemble the audio files.

Reads the JSON written by script.py, sends each segment to Google Cloud
Text-to-Speech (Chirp 3 HD, voice Sulafat by default), adds the silences and
builds:

    <out>/<lang>-NN.mp3                        one file per chapter (ID3 tags)
    <out>/mindfulness-guide-<lang>.mp3         the whole book in one file
    <out>/mindfulness-guide-<lang>.m4b         the whole book with chapter marks

Authentication, either:
    GOOGLE_TTS_API_KEY                an API key restricted to the Text-to-Speech API
    GOOGLE_APPLICATION_CREDENTIALS    a service-account JSON file (needs `pip install google-auth requests`)

Every spoken segment is cached in --cache by voice, rate and text, so a second
run only pays for text that changed.

    python3 tools/audiobook/synth.py out/script_el.json el out/el [--cache .tts-cache] [--mock]

--mock replaces the voice with a soft tone of about the same length, to test
the pipeline without a key.
"""
import argparse
import base64
import hashlib
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import time
import urllib.error
import urllib.request
import wave
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

RATE_HZ = 24000
LOCALE = {'el': 'el-GR', 'en': 'en-US'}
TITLE = {'el': 'Οδηγός Ενσυνειδητότητας για Νευροδιαφορετικούς',
         'en': 'A Mindfulness Guide for Neurodivergents'}
AUTHOR = {'el': 'Θεόδωρος Μπαϊρακτάρης', 'en': 'Theodoros Bairaktaris'}
API = 'https://texttospeech.googleapis.com/v1'
MAX_CHARS = 1500          # the API takes 5000 bytes per request; Greek letters are 2 bytes
GAP_BETWEEN_CHUNKS_MS = 250


# ---------------------------------------------------------------- auth & API
_token = {'value': None, 'expires': 0}


def _auth():
    key = os.environ.get('GOOGLE_TTS_API_KEY')
    if key:
        return {'key': key}, {}
    if os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
        if time.time() > _token['expires'] - 60:
            from google.oauth2 import service_account          # noqa: WPS433
            import google.auth.transport.requests as gr        # noqa: WPS433
            creds = service_account.Credentials.from_service_account_file(
                os.environ['GOOGLE_APPLICATION_CREDENTIALS'],
                scopes=['https://www.googleapis.com/auth/cloud-platform'])
            creds.refresh(gr.Request())
            _token['value'] = creds.token
            _token['expires'] = creds.expiry.timestamp() if creds.expiry else time.time() + 3000
        return {}, {'Authorization': f'Bearer {_token["value"]}'}
    sys.exit('Set GOOGLE_TTS_API_KEY or GOOGLE_APPLICATION_CREDENTIALS.')


def _call(method, path, body=None):
    params, headers = _auth()
    url = f'{API}{path}'
    if params:
        url += ('&' if '?' in url else '?') + 'key=' + params['key']
    data = json.dumps(body).encode() if body is not None else None
    headers = {**headers, 'Content-Type': 'application/json; charset=utf-8'}
    for attempt in range(6):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors='replace')
            if e.code in (429, 500, 502, 503, 504) and attempt < 5:
                time.sleep(2 ** attempt)
                continue
            sys.exit(f'Text-to-Speech error {e.code}: {msg[:500]}')
        except urllib.error.URLError:
            if attempt < 5:
                time.sleep(2 ** attempt)
                continue
            raise
    return None


def check_voice(locale, voice):
    res = _call('GET', f'/voices?languageCode={locale}')
    names = [v['name'] for v in res.get('voices', [])]
    if voice not in names:
        chirp = sorted(n for n in names if 'Chirp3-HD' in n)
        sys.exit(f'Voice {voice} not found for {locale}. Chirp 3 HD voices: {", ".join(chirp) or "none"}')


# ---------------------------------------------------------------- audio pieces
def chunks(text):
    """Split a segment at sentence ends so each request stays under the limit."""
    if len(text) <= MAX_CHARS:
        return [text]
    out, cur = [], ''
    for s in re.findall(r'[^.!?;·…]+[.!?;·…]*\s*', text):
        if cur and len(cur) + len(s) > MAX_CHARS:
            out.append(cur.strip())
            cur = ''
        cur += s
    if cur.strip():
        out.append(cur.strip())
    return out


def write_wav(path, frames):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE_HZ)
        w.writeframes(frames)


def silence(ms, cache):
    path = cache / f'silence-{ms}.wav'
    if not path.exists():
        write_wav(path, b'\x00\x00' * int(RATE_HZ * ms / 1000))
    return path


def mock_frames(text, rate):
    """A quiet tone about as long as the text would take to say."""
    seconds = max(0.6, len(text) / 15.0 / rate)
    period = b''.join(struct.pack('<h', int(1200 * math.sin(2 * math.pi * i / 100))) for i in range(100))  # 240 Hz
    return period * int(RATE_HZ * seconds / 100)


def speak(text, rate, voice, locale, cache, mock):
    key = hashlib.sha1(f'{"mock" if mock else voice}|{rate}|{text}'.encode()).hexdigest()
    path = cache / f'{key}.wav'
    if path.exists():
        return path
    if mock:
        write_wav(path, mock_frames(text, rate))
        return path
    res = _call('POST', '/text:synthesize', {
        'input': {'text': text},
        'voice': {'languageCode': locale, 'name': voice},
        'audioConfig': {'audioEncoding': 'LINEAR16', 'sampleRateHertz': RATE_HZ, 'speakingRate': rate},
    })
    tmp = path.with_suffix('.tmp')
    tmp.write_bytes(base64.b64decode(res['audioContent']))
    tmp.rename(path)
    return path


# ---------------------------------------------------------------- assembly
def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def duration_s(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'default=nw=1:nk=1', str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def concat_wav(pieces, out, work):
    lst = work / (out.stem + '.txt')
    lst.write_text(''.join(f"file '{p.resolve()}'\n" for p in pieces), encoding='utf-8')
    ffmpeg('-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(out))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('script')
    ap.add_argument('lang', choices=['el', 'en'])
    ap.add_argument('out')
    ap.add_argument('--voice', default=None, help='default: <locale>-Chirp3-HD-Sulafat')
    ap.add_argument('--cache', default='.tts-cache')
    ap.add_argument('--mock', action='store_true')
    ap.add_argument('--workers', type=int, default=4)
    ap.add_argument('--only', default='', help='audio chapters to build, e.g. "1-3" or "2,5" (default: all)')
    a = ap.parse_args()

    locale = LOCALE[a.lang]
    voice = a.voice or f'{locale}-Chirp3-HD-Sulafat'
    chapters = json.loads(Path(a.script).read_text(encoding='utf-8'))
    total = len(chapters)
    for n, c in enumerate(chapters, 1):
        c['n'] = n   # file names and track numbers keep the book's numbering
    if a.only.strip():
        keep = set()
        for part in a.only.split(','):
            lo, _, hi = part.strip().partition('-')
            keep.update(range(int(lo), int(hi or lo) + 1))
        chapters = [c for n, c in enumerate(chapters, 1) if n in keep]
    out = Path(a.out)
    cache = Path(a.cache)
    work = out / '_work'
    for d in (out, cache, work):
        d.mkdir(parents=True, exist_ok=True)
    if not shutil.which('ffmpeg'):
        sys.exit('ffmpeg is required.')
    if not a.mock:
        check_voice(locale, voice)

    # 1. Speak every chunk (in parallel; cached chunks are skipped).
    jobs = []
    for c in chapters:
        for s in c['segments']:
            for piece in chunks(s['text']):
                jobs.append((piece, s['rate']))
    chars = sum(len(t) for t, _ in jobs)
    print(f'{a.lang}: {len(chapters)} chapters, {len(jobs)} requests, {chars} characters ({voice})', flush=True)
    done = [0]

    def run(job):
        p = speak(job[0], job[1], voice, locale, cache, a.mock)
        done[0] += 1
        if done[0] % 50 == 0:
            print(f'  {done[0]}/{len(jobs)}', flush=True)
        return p

    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        spoken = dict(zip(jobs, pool.map(run, jobs)))

    # 2. One WAV per chapter: speech, gaps between chunks, silence after each segment.
    chapter_wavs = []
    for n, c in enumerate(chapters, 1):
        pieces = [silence(600, cache)]
        for s in c['segments']:
            parts = chunks(s['text'])
            for i, piece in enumerate(parts):
                pieces.append(spoken[(piece, s['rate'])])
                if i < len(parts) - 1:
                    pieces.append(silence(GAP_BETWEEN_CHUNKS_MS, cache))
            pieces.append(silence(s['pause_ms'], cache))
        wav = work / f'{a.lang}-{c["n"]:02d}.wav'
        concat_wav(pieces, wav, work)
        chapter_wavs.append(wav)

    # 3. Loudness for spoken word, then MP3 per chapter with tags.
    album, artist = TITLE[a.lang], AUTHOR[a.lang]
    norm = 'loudnorm=I=-18:TP=-1.5:LRA=11'
    starts, t = [], 0.0
    for n, (c, wav) in enumerate(zip(chapters, chapter_wavs), 1):
        mp3 = out / f'{a.lang}-{c["n"]:02d}.mp3'
        ffmpeg('-i', str(wav), '-af', norm, '-ar', str(RATE_HZ), '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k',
               '-id3v2_version', '3', '-metadata', f'title={c["title"]}', '-metadata', f'artist={artist}',
               '-metadata', f'album={album}', '-metadata', f'track={c["n"]}/{total}',
               '-metadata', 'genre=Audiobook', str(mp3))
        starts.append((t, c['title']))
        t += duration_s(wav)

    # 4. The whole book: one MP3, and an M4B with a chapter mark per chapter.
    whole = work / f'{a.lang}-all.wav'
    concat_wav(chapter_wavs, whole, work)
    full_mp3 = out / f'mindfulness-guide-{a.lang}.mp3'
    ffmpeg('-i', str(whole), '-af', norm, '-ar', str(RATE_HZ), '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k',
           '-id3v2_version', '3', '-metadata', f'title={album}', '-metadata', f'artist={artist}',
           '-metadata', f'album={album}', '-metadata', 'genre=Audiobook', str(full_mp3))
    meta = work / 'chapters.txt'
    lines = [';FFMETADATA1', f'title={album}', f'artist={artist}', f'album={album}', 'genre=Audiobook']
    for i, (start, title) in enumerate(starts):
        end = starts[i + 1][0] if i + 1 < len(starts) else t
        lines += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={int(start * 1000)}', f'END={int(end * 1000)}',
                  'title=' + title.replace('=', '\\=').replace(';', '\\;').replace('#', '\\#')]
    meta.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    m4b = out / f'mindfulness-guide-{a.lang}.m4b'
    ffmpeg('-i', str(whole), '-i', str(meta), '-map_metadata', '1', '-map_chapters', '1', '-map', '0:a',
           '-af', norm, '-ar', str(RATE_HZ), '-ac', '1', '-c:a', 'aac', '-b:a', '64k', '-f', 'mp4', str(m4b))

    shutil.rmtree(work)
    print(f'{a.lang}: {t / 60:.1f} minutes in {len(chapters)} chapters')
    for f in sorted(out.iterdir()):
        print(f'  {f.name}  {f.stat().st_size / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
