"use client";

import { useCallback } from "react";
import { useSoundStore } from "@/store/useSoundStore";

export type SoundName = "window-open" | "window-close" | "dock-click" | "notification";

// Shared AudioContext — created lazily on first interaction
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// ── Sound synthesizers ──────────────────────────────────────────────────────

function playSoft(ctx: AudioContext, freq: number, decay: number, volume = 0.15) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + decay);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + decay + 0.01);
}

const SOUNDS: Record<SoundName, (ctx: AudioContext) => void> = {
  // Soft pop — two layered sines, slight pitch drop
  "window-open": (ctx) => {
    playSoft(ctx, 660, 0.14, 0.14);
    playSoft(ctx, 330, 0.14, 0.06);
  },

  // Whoosh — band-passed noise sweep downward
  "window-close": (ctx) => {
    const sampleRate = ctx.sampleRate;
    const bufLen = Math.ceil(sampleRate * 0.18);
    const buf = ctx.createBuffer(1, bufLen, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.18);
    filter.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(ctx.currentTime);
  },

  // Short sharp click
  "dock-click": (ctx) => {
    playSoft(ctx, 900, 0.055, 0.1);
    playSoft(ctx, 1400, 0.03, 0.04);
  },

  // macOS-style ascending two-note chime
  "notification": (ctx) => {
    const playNote = (freq: number, t: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.13, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    };
    playNote(880,  ctx.currentTime,        0.2);
    playNote(1174, ctx.currentTime + 0.13, 0.25);
  },
};

// ── Hook ────────────────────────────────────────────────────────────────────

export function useSound(soundName: SoundName): () => void {
  const { isMuted } = useSoundStore();

  const play = useCallback(() => {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const doPlay = () => SOUNDS[soundName](ctx);

    if (ctx.state === "suspended") {
      ctx.resume().then(doPlay).catch(() => {});
    } else {
      doPlay();
    }
  }, [isMuted, soundName]);

  return play;
}
