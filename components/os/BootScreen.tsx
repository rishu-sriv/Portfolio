"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

function AppleLogo() {
  return (
    <svg width="72" height="88" viewBox="0 0 814 1000" fill="white" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4C46 790.8 0 663.4 0 541.8c0-202.9 132.4-310.3 261.5-310.3 70.2 0 128.5 46.4 173.9 46.4 43.4 0 111.3-49 192.1-49 30.8 0 134.2 2.6 197.5 99.9zm-234.2-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [bootStarted, setBootStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef  = useRef<number>(0);

  // Preload startup chime so it's ready when loading completes.
  useEffect(() => {
    const audio = new Audio("/sounds/macbook-startup-chime-2020.mp3");
    audio.preload = "auto";
    audio.playsInline = true;
    audio.load();
    audioRef.current = audio;

    return () => {
      audioRef.current = null;
    };
  }, []);

  const startExit = useCallback(() => {
    setExiting(true);
    setTimeout(onComplete, 550);
  }, [onComplete]);

  useEffect(() => {
    if (!bootStarted) return;

    const DURATION = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const p = Math.min(100, ((now - startTime) / DURATION) * 100);
      setProgress(p);

      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Bar full — play chime then fade out
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.volume = 1;
          audio.muted = false;

          // 1) Try normal playback first.
          // 2) If browser blocks it, fallback to muted-start then unmute.
          audio.play().catch(() => {
            audio.currentTime = 0;
            audio.muted = true;
            return audio.play().then(() => {
              audio.muted = false;
            });
          }).catch(() => {
            // Still blocked by autoplay policy; continue silently.
          });
        }
        // Give chime time to ring before fading
        setTimeout(startExit, 800);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bootStarted, startExit]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#000000" }}
      animate={exiting ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={exiting ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] } : { duration: 0.01 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
      >
        <AppleLogo />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: "14%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        {!bootStarted ? (
          <button
            type="button"
            aria-label="Start boot sequence"
            onClick={() => setBootStarted(true)}
            className="rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ background: "transparent" }}
          >
            <img
              src="/icons/power-button.jpg"
              alt="Power button"
              width={110}
              height={110}
              draggable={false}
              style={{ userSelect: "none" }}
            />
          </button>
        ) : (
          <div
            style={{
              width: 196,
              height: 4,
              background: "rgba(255,255,255,0.13)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "rgba(255,255,255,0.82)",
                borderRadius: 2,
                transition: "width 40ms linear",
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
