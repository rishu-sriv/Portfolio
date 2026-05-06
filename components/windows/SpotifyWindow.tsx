"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Heart,
  Search,
  Home,
  Library,
  Plus,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────────

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  color: string; // album art gradient
}

const TRACKS: Track[] = [
  { id: 1, title: "Blinding Lights",     artist: "The Weeknd",       album: "After Hours",         duration: 200, color: "linear-gradient(135deg,#e60073,#8a0026)" },
  { id: 2, title: "Levitating",          artist: "Dua Lipa",         album: "Future Nostalgia",    duration: 203, color: "linear-gradient(135deg,#7c3aed,#2563eb)" },
  { id: 3, title: "Stay",                artist: "Kid LAROI & Bieber",album: "F*CK LOVE 3",         duration: 141, color: "linear-gradient(135deg,#0891b2,#0e7490)" },
  { id: 4, title: "Good 4 U",            artist: "Olivia Rodrigo",   album: "SOUR",                duration: 178, color: "linear-gradient(135deg,#dc2626,#7c3aed)" },
  { id: 5, title: "Peaches",             artist: "Justin Bieber",    album: "Justice",             duration: 198, color: "linear-gradient(135deg,#d97706,#b45309)" },
  { id: 6, title: "Save Your Tears",     artist: "The Weeknd",       album: "After Hours",         duration: 215, color: "linear-gradient(135deg,#475569,#1e293b)" },
  { id: 7, title: "drivers license",     artist: "Olivia Rodrigo",   album: "SOUR",                duration: 242, color: "linear-gradient(135deg,#6366f1,#4338ca)" },
  { id: 8, title: "Montero (ILYL)",      artist: "Lil Nas X",        album: "MONTERO",             duration: 137, color: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id: 9, title: "Bad Habits",          artist: "Ed Sheeran",       album: "= (Equals)",          duration: 231, color: "linear-gradient(135deg,#0284c7,#0369a1)" },
  { id: 10, title: "Heat Waves",         artist: "Glass Animals",    album: "Dreamland",           duration: 238, color: "linear-gradient(135deg,#059669,#047857)" },
];

const PLAYLISTS = [
  "Liked Songs",
  "Chill Vibes",
  "Workout Mix",
  "Late Night Drive",
  "Focus Flow",
  "Party Hits",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Album Art ─────────────────────────────────────────────────────────────────

function AlbumArt({ track, size = 56 }: { track: Track; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size > 80 ? 12 : 4,
        background: track.color,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        boxShadow: size > 80 ? "0 8px 32px rgba(0,0,0,0.5)" : "none",
      }}
    >
      🎵
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SpotifyWindow() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);       // 0–1
  const [elapsed, setElapsed] = useState(0);          // seconds
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [activePlaylist, setActivePlaylist] = useState("Liked Songs");
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setElapsed((prev) => {
      const next = prev + 1;
      if (next >= currentTrack.duration) {
        // Auto-advance
        setCurrentTrack((t) => {
          const idx = TRACKS.findIndex((x) => x.id === t.id);
          return TRACKS[(idx + 1) % TRACKS.length];
        });
        setElapsed(0);
        setProgress(0);
        return 0;
      }
      setProgress(next / currentTrack.duration);
      return next;
    });
  }, [currentTrack.duration]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, tick]);

  // Reset progress when track changes
  useEffect(() => {
    setElapsed(0);
    setProgress(0);
  }, [currentTrack.id]);

  function pickTrack(t: Track) {
    setCurrentTrack(t);
    setIsPlaying(true);
  }

  function prev() {
    const idx = TRACKS.findIndex((x) => x.id === currentTrack.id);
    setCurrentTrack(TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length]);
  }

  function next() {
    const idx = TRACKS.findIndex((x) => x.id === currentTrack.id);
    setCurrentTrack(TRACKS[(idx + 1) % TRACKS.length]);
  }

  function toggleLike(id: number) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  const spotifyGreen = "#1db954";
  const bg = "#121212";
  const surface = "#181818";
  const surface2 = "#282828";

  return (
    <div
      className="flex h-full select-none"
      style={{ background: bg, color: "#fff", fontFamily: "var(--font-system)" }}
    >
      {/* ── Left sidebar ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-2 py-3 overflow-hidden"
        style={{ width: 220, flexShrink: 0, background: bg, borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Nav */}
        <div className="px-3 flex flex-col gap-1 pb-2">
          {[
            { icon: <Home size={20} />, label: "Home" },
            { icon: <Search size={20} />, label: "Search" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-4 px-3 py-2 rounded-lg text-[14px] font-semibold transition-colors"
              style={{ color: "rgba(255,255,255,0.7)", background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Library */}
        <div
          className="mx-2 rounded-xl flex flex-col flex-1 overflow-hidden"
          style={{ background: surface }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
              <Library size={20} />
              Your Library
            </div>
            <button style={{ color: "rgba(255,255,255,0.7)" }}>
              <Plus size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
            {PLAYLISTS.map((pl) => (
              <button
                key={pl}
                className="w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors"
                style={{
                  color: activePlaylist === pl ? "#fff" : "rgba(255,255,255,0.6)",
                  background: activePlaylist === pl ? "rgba(255,255,255,0.1)" : "transparent",
                  fontWeight: activePlaylist === pl ? 600 : 400,
                }}
                onClick={() => setActivePlaylist(pl)}
              >
                {pl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Track list */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{
            background: `linear-gradient(180deg, ${currentTrack.color.replace("linear-gradient(135deg,","").split(",")[0].trim()} 0%, ${bg} 260px)`,
            scrollbarWidth: "none",
          }}
        >
          <div className="flex items-end gap-5 mb-6 px-2">
            <AlbumArt track={currentTrack} size={120} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Playlist
              </p>
              <h2 className="text-[28px] font-black leading-tight">{activePlaylist}</h2>
              <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                {TRACKS.length} songs
              </p>
            </div>
          </div>

          {/* Column headers */}
          <div
            className="grid gap-3 px-4 pb-2 text-[12px] font-semibold uppercase tracking-wider mb-1"
            style={{ gridTemplateColumns: "24px 1fr 1fr auto auto", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span>#</span><span>Title</span><span>Album</span><span className="w-8 text-center"><Heart size={14} /></span><span className="w-10 text-right">Time</span>
          </div>

          {/* Rows */}
          {TRACKS.map((track, i) => {
            const isActive = track.id === currentTrack.id;
            return (
              <div
                key={track.id}
                className="grid gap-3 px-4 py-2 rounded-lg items-center cursor-pointer transition-colors group"
                style={{
                  gridTemplateColumns: "24px 1fr 1fr auto auto",
                  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  color: isActive ? spotifyGreen : "#fff",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                onDoubleClick={() => pickTrack(track)}
                onClick={() => setCurrentTrack(track)}
              >
                <span className="text-[14px]" style={{ color: isActive ? spotifyGreen : "rgba(255,255,255,0.5)" }}>
                  {isActive && isPlaying ? "▶" : i + 1}
                </span>
                <div className="flex items-center gap-3 overflow-hidden">
                  <AlbumArt track={track} size={38} />
                  <div className="overflow-hidden">
                    <p className="text-[13px] font-semibold truncate" style={{ color: isActive ? spotifyGreen : "#fff" }}>{track.title}</p>
                    <p className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{track.artist}</p>
                  </div>
                </div>
                <span className="text-[13px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{track.album}</span>
                <button
                  className="w-8 flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                >
                  <Heart
                    size={14}
                    fill={liked.has(track.id) ? spotifyGreen : "none"}
                    stroke={liked.has(track.id) ? spotifyGreen : "rgba(255,255,255,0.4)"}
                  />
                </button>
                <span className="w-10 text-right text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>{fmt(track.duration)}</span>
              </div>
            );
          })}
        </div>

        {/* ── Player bar ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center px-4 py-3 gap-4 flex-shrink-0"
          style={{
            background: surface2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            height: 88,
          }}
        >
          {/* Currently playing */}
          <div className="flex items-center gap-3" style={{ width: 200, flexShrink: 0 }}>
            <AlbumArt track={currentTrack} size={46} />
            <div className="overflow-hidden flex-1">
              <p className="text-[13px] font-semibold truncate">{currentTrack.title}</p>
              <p className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{currentTrack.artist}</p>
            </div>
            <button onClick={() => toggleLike(currentTrack.id)}>
              <Heart
                size={16}
                fill={liked.has(currentTrack.id) ? spotifyGreen : "none"}
                stroke={liked.has(currentTrack.id) ? spotifyGreen : "rgba(255,255,255,0.5)"}
              />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setShuffle((s) => !s)}
                style={{ color: shuffle ? spotifyGreen : "rgba(255,255,255,0.6)" }}
              >
                <Shuffle size={16} />
              </button>
              <button onClick={prev} style={{ color: "rgba(255,255,255,0.8)" }}>
                <SkipBack size={20} />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#fff", color: "#000" }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>
              <button onClick={next} style={{ color: "rgba(255,255,255,0.8)" }}>
                <SkipForward size={20} />
              </button>
              <button
                onClick={() => setRepeat((r) => !r)}
                style={{ color: repeat ? spotifyGreen : "rgba(255,255,255,0.6)" }}
              >
                <Repeat size={16} />
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 w-full max-w-sm">
              <span className="text-[11px] w-8 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>
                {fmt(elapsed)}
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden cursor-pointer"
                style={{ height: 4, background: "rgba(255,255,255,0.2)" }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const p = (e.clientX - rect.left) / rect.width;
                  setProgress(p);
                  setElapsed(Math.round(p * currentTrack.duration));
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: "#fff",
                    borderRadius: 2,
                    transition: "width 0.4s linear",
                  }}
                />
              </div>
              <span className="text-[11px] w-8" style={{ color: "rgba(255,255,255,0.4)" }}>
                {fmt(currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2" style={{ width: 140, justifyContent: "flex-end" }}>
            <Volume2 size={16} style={{ color: "rgba(255,255,255,0.6)" }} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24"
              style={{ accentColor: spotifyGreen }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
