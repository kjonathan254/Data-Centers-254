#!/usr/bin/env python3
"""Procedural ambient bed for the DC254 Kenya infrastructure video (60s).

Layers:
- low drone (A1/E2/A2 sines with slow LFOs) + filtered brown-noise pad
- soft deep thump + faint ping at each beat start (from src/beatmap.json)
- gentle riser into the outro, global fade-out
Output: public/audio/bed.wav (stereo 44.1k)
"""
import json, wave, struct
import numpy as np

SR = 44100
DUR = 60.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(254)

bm = json.load(open("src/beatmap.json"))
offsets = bm["offsets"]  # seconds, final video timeline

# ---------- drone ----------
def sine(f, phase=0.0):
    return np.sin(2 * np.pi * f * t + phase)

drone = 0.55 * sine(55.0) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.05 * t))
drone += 0.38 * sine(82.41, 0.7) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.037 * t + 1.2))
drone += 0.30 * sine(110.0, 1.9) * (0.65 + 0.35 * np.sin(2 * np.pi * 0.023 * t + 2.5))
# slow beat-frequency shimmer
drone += 0.10 * sine(164.8) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.011 * t))

# brown noise pad, heavily lowpassed
noise = rng.normal(0, 1, N)
brown = np.cumsum(noise)
brown -= np.convolve(brown, np.ones(8001) / 8001, mode="same")  # remove DC drift
brown = np.convolve(brown, np.ones(601) / 601, mode="same")     # lowpass
brown /= np.max(np.abs(brown))
pad = 0.16 * brown

# ---------- beat accents ----------
def thump(f0=58.0, f1=40.0, length=0.65):
    n = int(SR * length)
    tt = np.arange(n) / SR
    f = f0 + (f1 - f0) * (tt / length)
    env = np.exp(-tt * 6.5)
    return np.sin(2 * np.pi * f * tt) * env

def ping(f=1318.5, length=0.35):
    n = int(SR * length)
    tt = np.arange(n) / SR
    env = np.exp(-tt * 11)
    return np.sin(2 * np.pi * f * tt) * env * 0.12

accents = np.zeros(N)
for i, off in enumerate(offsets):
    th = thump()
    n = min(len(th), N - int(off * SR))
    if n > 0:
        accents[int(off * SR): int(off * SR) + n] += th[:n] * (0.42 if i < 7 else 0.5)
    pg = ping()
    n2 = min(len(pg), N - int(off * SR))
    if n2 > 0:
        accents[int(off * SR): int(off * SR) + n2] += pg[:n2]

# ---------- riser into outro + fades ----------
riser = np.zeros(N)
outro_start = bm["BEATS"]["outro"]["start"] / bm["FPS"]
r0 = int(outro_start * SR) - int(5.5 * SR)
r1 = int(outro_start * SR)
if r0 > 0:
    seg = r1 - r0
    tt = np.arange(seg) / SR
    sweep = np.sin(2 * np.pi * (80 + 220 * (tt / 5.5) ** 2) * tt)
    swell = (tt / 5.5) ** 2.2
    riser[r0:r1] = sweep * swell * 0.07

bed = drone + pad + accents + riser

# global envelope: 1.2s fade-in, fade out from 58.2s
env = np.ones(N)
fi = int(1.2 * SR)
env[:fi] = np.linspace(0, 1, fi)
fo0 = int(58.2 * SR)
env[fo0:] = np.linspace(1, 0, N - fo0) ** 1.3
bed *= env

# normalize to modest level (bed sits under VO)
bed /= np.max(np.abs(bed))
bed *= 0.32

# gentle stereo widening (Haas-style 8ms on right)
delay = int(0.008 * SR)
right = np.concatenate([np.zeros(delay), bed[:-delay]])
stereo = np.stack([bed, 0.92 * bed + 0.08 * right], axis=1)
stereo = np.clip(stereo, -1, 1)

with wave.open("public/audio/bed.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype(np.int16).tobytes())

print(f"bed.wav written: {DUR}s, accents at {len(offsets)} beat starts")
