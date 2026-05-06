"use client";

import { useState } from "react";

// ── Curated playlists ─────────────────────────────────────────────────────────
// These are public Spotify playlists — no auth needed, embed plays real audio.

const PLAYLISTS = [
  { id: "37i9dQZF1DXcBWIGoYBM5M", name: "Today's Top Hits",  emoji: "🔥" },
  { id: "37i9dQZF1DX4WYpdgoIcn6", name: "Chill Hits",         emoji: "🌊" },
  { id: "37i9dQZF1DWZeKCadgRdKQ", name: "Deep Focus",         emoji: "🧠" },
  { id: "37i9dQZF1DX0XUsuxWHRQd", name: "RapCaviar",          emoji: "🎤" },
  { id: "37i9dQZF1DWXRqgorJj26U", name: "Rock Classics",      emoji: "🎸" },
  { id: "37i9dQZF1DX2sUQwD7tbmL", name: "Feeling Happy",      emoji: "😊" },
];

export default function SpotifyWindow() {
  const [active, setActive] = useState(PLAYLISTS[0]);

  return (
    <div className="flex h-full select-none" style={{ background: "#000" }}>

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <div
        className="flex flex-col py-4"
        style={{
          width: 190,
          flexShrink: 0,
          background: "#000",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Spotify wordmark */}
        <div className="flex items-center gap-2 px-5 mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1db954" aria-hidden>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>
            Spotify
          </span>
        </div>

        <p
          className="px-5 mb-2 uppercase tracking-widest"
          style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}
        >
          Playlists
        </p>

        <div className="flex flex-col gap-0.5 px-2">
          {PLAYLISTS.map((pl) => {
            const isActive = pl.id === active.id;
            return (
              <button
                key={pl.id}
                onClick={() => setActive(pl)}
                className="flex items-center gap-3 w-full text-left rounded-lg px-3 py-2 transition-colors"
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1db954" : "rgba(255,255,255,0.65)",
                  background: isActive ? "rgba(29,185,84,0.12)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{pl.emoji}</span>
                <span className="truncate">{pl.name}</span>
              </button>
            );
          })}
        </div>

        {/* Open on Spotify link */}
        <a
          href={`https://open.spotify.com/playlist/${active.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mx-2 mt-auto px-3 py-2 rounded-lg transition-colors"
          style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1db954")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.293 7.294-1.414-1.414L17.585 5H13V3h8z" />
          </svg>
          Open in Spotify
        </a>
      </div>

      {/* ── Spotify embed iframe ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <iframe
          key={active.id}
          src={`https://open.spotify.com/embed/playlist/${active.id}?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ border: "none", display: "block" }}
          title={`Spotify — ${active.name}`}
        />
      </div>
    </div>
  );
}
