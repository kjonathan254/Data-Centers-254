#!/usr/bin/env python3
"""Mix the 8 voiceover segments at their beat offsets with the ambient bed.

Usage: python3 scripts/mix_audio.py
Output: public/audio/mix.wav (master) + public/audio/mix.mp3 (Remotion input)
"""
import json, subprocess, shutil, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

bm = json.load(open("src/beatmap.json"))
offsets_ms = [round(o * 1000) for o in bm["offsets"]]

inputs = []
filters = []
mix_labels = []
for i, ms in enumerate(offsets_ms, start=1):
    inputs += ["-i", f"public/audio/segments/seg{i}.wav"]
    filters.append(
        f"[{i-1}:a]aformat=sample_rates=44100:channel_layouts=stereo,"
        f"adelay={ms}|{ms}[vo{i}]"
    )
    mix_labels.append(f"[vo{i}]")

# bed input (index 8)
inputs += ["-i", "public/audio/bed.wav"]
filters.append("[8:a]aformat=sample_rates=44100:channel_layouts=stereo[bed]")
mix_labels.append("[bed]")

# VO 1.0, bed 0.55 (bed already normalized to 0.32 peak)
weights = "".join(f"{i+1}: " for i in range(8))
filter_complex = (
    ";".join(filters)
    + f";{''.join(mix_labels)}amix=inputs=9:normalize=0:weights="
    + "'1 1 1 1 1 1 1 1 0.55'"
    + ",alimiter=limit=0.92"
    + ",afade=t=out:st=57.8:d=2.2"
    + "[out]"
)

cmd = (
    ["ffmpeg", "-y", *inputs,
     "-filter_complex", filter_complex,
     "-map", "[out]", "-t", "60",
     "public/audio/mix.wav", "-loglevel", "error"]
)
subprocess.run(cmd, check=True)

# mp3 for Remotion
subprocess.run(
    ["ffmpeg", "-y", "-i", "public/audio/mix.wav",
     "-codec:a", "libmp3lame", "-b:a", "192k",
     "public/audio/mix.mp3", "-loglevel", "error"],
    check=True,
)

d = subprocess.check_output(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
     "-of", "csv=p=0", "public/audio/mix.mp3"]
).decode().strip()
print(f"mix.mp3 written: {d}s")
