"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import type { Comment } from "@/types";

// ─── Constants ─────────────────────────────────────────────────────────────────

const LS_KEY = "sameer-autograph-book";

const PEN_COLORS = [
  { label: "Blue",   ink: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  { label: "Purple", ink: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  { label: "Pink",   ink: "#db2777", bg: "#fdf2f8", border: "#fbcfe8" },
  { label: "Green",  ink: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { label: "Red",    ink: "#dc2626", bg: "#fff1f2", border: "#fecdd3" },
  { label: "Teal",   ink: "#0891b2", bg: "#f0f9ff", border: "#bae6fd" },
  { label: "Orange", ink: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
];

const DOODLES = ["✦", "♡", "★", "✿", "❋", "☆", "◈", "✸", "❀", "✾"];
const STICKERS = ["🌟", "💫", "🎈", "🌈", "🦋", "🌸", "🎉", "💝", "🌻", "🎀"];

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getPenColor(idx: number) {
  return PEN_COLORS[idx % PEN_COLORS.length];
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadLocal(): Comment[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(comments: Comment[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(comments));
  } catch {}
}

// ─── Entry card ────────────────────────────────────────────────────────────────

function EntryCard({ comment, idx, onDelete }: { comment: Comment; idx: number; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const pen   = comment.inkColor
    ? (PEN_COLORS.find((p) => p.ink === comment.inkColor) ?? getPenColor(idx))
    : getPenColor(idx);
  const rot   = (seededRandom(idx) * 4 - 2).toFixed(2); // ±2°
  const doodle = DOODLES[idx % DOODLES.length];
  const sticker = STICKERS[idx % STICKERS.length];
  const isLocal = comment._id.startsWith("local-") || comment._id.startsWith("optimistic-");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, rotate: Number(rot) }}
      animate={{ opacity: 1, y: 0, rotate: Number(rot) }}
      exit={{ opacity: 0, scale: 0.85 }}
      whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: pen.bg,
        border: `1.5px solid ${pen.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        position: "relative",
        boxShadow: "2px 3px 12px rgba(0,0,0,0.08)",
        cursor: "default",
      }}
    >
      {/* Top tape strip */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 48,
          height: 20,
          background: "rgba(255,215,0,0.55)",
          borderRadius: 3,
          backdropFilter: "blur(2px)",
          border: "1px solid rgba(200,170,0,0.3)",
        }}
      />

      {/* Delete button — visible on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => onDelete(comment._id)}
            title="Delete entry"
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(220,38,38,0.85)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              color: "#fff",
            }}
          >
            <X size={11} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticker top-right */}
      <span
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          fontSize: 18,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {sticker}
      </span>

      {/* Name row */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <span style={{ fontSize: 20, color: pen.ink, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "cursive" }}>
          {comment.name}
        </span>
        <span style={{ fontSize: 14, color: pen.ink, opacity: 0.6 }}>{doodle}</span>
      </div>

      {/* Ruled lines behind message */}
      <div
        style={{
          position: "relative",
          minHeight: 52,
          backgroundImage: `repeating-linear-gradient(transparent, transparent 23px, ${pen.border} 23px, ${pen.border} 24px)`,
          backgroundSize: "100% 24px",
          paddingTop: 2,
        }}
      >
        <p
          style={{
            fontSize: 15,
            lineHeight: "24px",
            color: pen.ink,
            fontFamily: "cursive",
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {comment.message}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span style={{ fontSize: 11, color: pen.ink, opacity: 0.5, fontFamily: "cursive" }}>
          ~ {timeAgo(comment.createdAt)}
        </span>
        {isLocal && (
          <span
            style={{
              fontSize: 9,
              color: pen.ink,
              opacity: 0.45,
              background: pen.border,
              borderRadius: 4,
              padding: "1px 5px",
            }}
          >
            saved locally
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyPage() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4"
      style={{ fontFamily: "cursive" }}
    >
      <div style={{ fontSize: 56 }}>📖</div>
      <p style={{ fontSize: 22, color: "#7c6f5e", fontWeight: 700 }}>
        No entries yet!
      </p>
      <p style={{ fontSize: 15, color: "#a89880" }}>
        Be the first to sign Sameer&apos;s book ✦
      </p>
      <div style={{ fontSize: 28, letterSpacing: 8, color: "#c4b59a" }}>
        ✦ ♡ ★ ✿
      </div>
    </div>
  );
}

// ─── GuestbookWindow ──────────────────────────────────────────────────────────

export default function GuestbookWindow() {
  const [comments, setComments]   = useState<Comment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [name, setName]           = useState("");
  const [message, setMessage]     = useState("");
  const [selectedInk, setSelectedInk] = useState(PEN_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Load: try API first, merge with localStorage
  useEffect(() => {
    const local = loadLocal();
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data: Comment[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge: server comments + local-only entries not yet on server
          const serverIds = new Set(data.map((c) => c._id));
          const localOnly = local.filter((c) => !serverIds.has(c._id));
          setComments([...localOnly, ...data]);
        } else {
          setComments(local);
        }
      })
      .catch(() => setComments(local))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    // Remove optimistically
    setComments((prev) => prev.filter((c) => c._id !== id));

    // If local-only entry, just remove from localStorage
    if (id.startsWith("local-") || id.startsWith("optimistic-")) {
      const updated = loadLocal().filter((c) => c._id !== id);
      saveLocal(updated);
      return;
    }

    // Otherwise call the API
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" });
    } catch {
      // Silently ignore — UI already updated
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !message.trim() || submitting) return;
      setError("");

      const optimisticId = `optimistic-${Date.now()}`;
      const optimistic: Comment = {
        _id: optimisticId,
        name: name.trim(),
        message: message.trim(),
        avatar: "",
        inkColor: selectedInk.ink,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [optimistic, ...prev]);
      const savedName    = name.trim();
      const savedMessage = message.trim();
      const savedInk     = selectedInk.ink;
      setName("");
      setMessage("");
      setSubmitting(true);
      setSubmitted(false);

      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: savedName, message: savedMessage, inkColor: savedInk }),
        });
        const data = await res.json();

        if (res.status === 503 || data.error === "db_unavailable") {
          // DB not configured — persist locally
          const localEntry: Comment = {
            ...optimistic,
            _id: `local-${Date.now()}`,
          };
          setComments((prev) =>
            prev.map((c) => (c._id === optimisticId ? localEntry : c))
          );
          const updated = [localEntry, ...loadLocal()];
          saveLocal(updated);
          setSubmitted(true);
          return;
        }

        if (!res.ok) throw new Error(data.error ?? "Failed to post");

        setComments((prev) =>
          prev.map((c) => (c._id === optimisticId ? data : c))
        );
        setSubmitted(true);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch {
        setError("Couldn't send — check your connection.");
        setComments((prev) => prev.filter((c) => c._id !== optimisticId));
      } finally {
        setSubmitting(false);
      }
    },
    [name, message, submitting, selectedInk]
  );

  // ── Paper background style ─────────────────────────────────────────────────
  const paperBg = {
    background: "#fef9f0",
    backgroundImage: `
      repeating-linear-gradient(
        transparent, transparent 27px,
        #d4e4f7 27px, #d4e4f7 28px
      )`,
    backgroundSize: "100% 28px",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#fef9f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Indie+Flower&display=swap');
        .handwrite { font-family: 'Caveat', cursive; }
        .indie     { font-family: 'Indie Flower', cursive; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes wiggle {
          0%,100% { transform: rotate(-2deg); }
          50%      { transform: rotate(2deg); }
        }
      `}</style>

      {/* ── Book cover / header ───────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          padding: "14px 20px 12px",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative dots */}
        {["10%","30%","50%","70%","90%"].map((l, i) => (
          <div key={i} style={{
            position: "absolute", top: 6, left: l,
            width: 6, height: 6, borderRadius: "50%",
            background: "rgba(255,255,255,0.4)",
          }} />
        ))}

        <div className="flex items-center gap-3">
          <span style={{ fontSize: 32 }}>📖</span>
          <div>
            <h1 className="handwrite" style={{ fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.1, textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
              Sameer&apos;s Autograph Book
            </h1>
            <p className="indie" style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 1 }}>
              {loading ? "Loading entries…" : comments.length === 0
                ? "No one has signed yet — be first! ✦"
                : `${comments.length} friend${comments.length > 1 ? "s have" : " has"} signed ♡`}
            </p>
          </div>
        </div>

        {/* Decorative doodles */}
        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 22, opacity: 0.35, letterSpacing: 6, color: "#fff" }}>
          ✦ ♡ ★
        </div>
      </div>

      {/* ── Spiral binding strip ──────────────────────────────────────── */}
      <div style={{ height: 10, background: "#d97706", flexShrink: 0, display: "flex", alignItems: "center", paddingLeft: 12, gap: 14, overflow: "hidden" }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{ width: 14, height: 8, borderRadius: "50%", background: "rgba(0,0,0,0.25)", flexShrink: 0 }} />
        ))}
      </div>

      {/* ── Entries ───────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-5 py-6"
        style={{ ...paperBg, scrollbarWidth: "thin" }}
        ref={topRef}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={26} style={{ color: "#d97706", animation: "spin 1s linear infinite" }} />
          </div>
        ) : comments.length === 0 ? (
          <EmptyPage />
        ) : (
          <AnimatePresence initial={false}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, paddingTop: 10 }}>
              {comments.map((c, i) => (
                <EntryCard key={c._id} comment={c} idx={i} onDelete={handleDelete} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Sign the book form ────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        style={{
          flexShrink: 0,
          background: "#fff8e8",
          borderTop: "2px dashed #f59e0b",
          padding: "14px 18px 16px",
        }}
      >
        {/* Section label */}
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 18 }}>✍️</span>
          <span className="handwrite" style={{ fontSize: 18, fontWeight: 700, color: "#92400e" }}>
            Sign my book!
          </span>
          {submitted && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 13, color: "#16a34a", fontFamily: "cursive", marginLeft: 6 }}
            >
              ✓ Signed! Thanks ♡
            </motion.span>
          )}
        </div>

        {/* Pen colour picker */}
        <div className="flex items-center gap-2 mb-3">
          <span className="indie" style={{ fontSize: 13, color: "#92400e" }}>Pick your pen:</span>
          <div className="flex gap-2">
            {PEN_COLORS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setSelectedInk(p)}
                title={p.label}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: p.ink,
                  border: selectedInk.ink === p.ink ? `3px solid #92400e` : "2px solid transparent",
                  outline: selectedInk.ink === p.ink ? `2px solid ${p.ink}` : "none",
                  outlineOffset: 2,
                  transition: "transform 0.15s",
                  transform: selectedInk.ink === p.ink ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="flex gap-3 mb-2">
          <div className="flex items-center gap-1 flex-1" style={{ borderBottom: `2px solid ${selectedInk.ink}` }}>
            <span className="indie" style={{ fontSize: 13, color: "#92400e", whiteSpace: "nowrap" }}>My name is:</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              placeholder="your name…"
              className="handwrite flex-1 outline-none"
              style={{
                background: "transparent",
                border: "none",
                fontSize: 16,
                color: selectedInk.ink,
                padding: "2px 4px",
                caretColor: selectedInk.ink,
              }}
            />
          </div>
        </div>

        <div className="mb-3" style={{ borderLeft: `3px solid ${selectedInk.ink}`, paddingLeft: 10 }}>
          <span className="indie" style={{ fontSize: 13, color: "#92400e", display: "block", marginBottom: 4 }}>
            I want to say:
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="write your message here…"
            maxLength={500}
            required
            rows={2}
            className="handwrite w-full outline-none resize-none"
            style={{
              background: "transparent",
              border: "none",
              fontSize: 16,
              lineHeight: "26px",
              backgroundImage: `repeating-linear-gradient(transparent, transparent 25px, ${selectedInk.border ?? "#e5e7eb"} 25px, ${selectedInk.border ?? "#e5e7eb"} 26px)`,
              backgroundSize: "100% 26px",
              color: selectedInk.ink,
              caretColor: selectedInk.ink,
              fontFamily: "Caveat, cursive",
            }}
          />
          <div style={{ fontSize: 10, color: "#a16207", textAlign: "right", fontFamily: "cursive" }}>
            {message.length}/500
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: 12, color: "#dc2626", fontFamily: "cursive", marginBottom: 6 }}>
            ✗ {error}
          </p>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!name.trim() || !message.trim() || submitting}
          whileTap={{ scale: 0.94 }}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 10,
            background: !name.trim() || !message.trim() || submitting
              ? "#e5d4b0"
              : `linear-gradient(135deg, ${selectedInk.ink}, ${selectedInk.ink}cc)`,
            color: !name.trim() || !message.trim() || submitting ? "#a16207" : "#fff",
            fontFamily: "Caveat, cursive",
            fontSize: 18,
            fontWeight: 700,
            border: "none",
            cursor: !name.trim() || !message.trim() || submitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: "0.02em",
            boxShadow: !name.trim() || !message.trim() || submitting ? "none" : "0 3px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s",
          }}
        >
          {submitting
            ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Signing…</>
            : <>Sign the book! ✦</>
          }
        </motion.button>
      </form>
    </div>
  );
}
