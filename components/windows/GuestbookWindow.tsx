"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import type { Comment } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avatarUrl(name: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)  return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Comment card ──────────────────────────────────────────────────────────────

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="flex gap-3 p-4 rounded-xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--separator)",
      }}
    >
      {/* Avatar */}
      <div
        className="shrink-0 rounded-full overflow-hidden"
        style={{ width: 40, height: 40, background: "var(--separator)" }}
      >
        <img
          src={comment.avatar}
          alt={comment.name}
          width={40}
          height={40}
          style={{ width: "100%", height: "100%", display: "block" }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {comment.name}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-[1.55] break-words" style={{ color: "var(--text-secondary)" }}>
          {comment.message}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-[48px]" aria-hidden>✍️</span>
      <p className="text-[14px] font-medium" style={{ color: "var(--text-secondary)" }}>
        Be the first to leave a message!
      </p>
      <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
        Sign the guestbook below ↓
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuestbookWindow() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);

  // Fetch comments on mount
  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !message.trim() || submitting) return;
      setError("");

      // Optimistic update
      const optimistic: Comment = {
        _id: `optimistic-${Date.now()}`,
        name: name.trim(),
        message: message.trim(),
        avatar: avatarUrl(name.trim()),
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [optimistic, ...prev]);
      const savedName    = name.trim();
      const savedMessage = message.trim();
      setName("");
      setMessage("");
      setSubmitting(true);

      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: savedName, message: savedMessage }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? "Failed to post");

        // Replace optimistic entry with real one from server
        setComments((prev) =>
          prev.map((c) => (c._id === optimistic._id ? data : c))
        );
        // Scroll list to top to show new comment
        listEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        // Roll back optimistic entry
        setComments((prev) => prev.filter((c) => c._id !== optimistic._id));
      } finally {
        setSubmitting(false);
      }
    },
    [name, message, submitting]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--window-bg)" }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 px-5 py-4"
        style={{ borderBottom: "1px solid var(--separator)" }}
      >
        <h2 className="text-[17px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Guestbook
        </h2>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          {comments.length > 0
            ? `${comments.length} message${comments.length > 1 ? "s" : ""}`
            : "No messages yet"}
        </p>
      </div>

      {/* ── Comment list ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: "thin" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={22}
              strokeWidth={1.8}
              style={{ color: "var(--text-tertiary)", animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : comments.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence initial={false}>
            <div className="flex flex-col gap-2">
              {comments.map((c) => (
                <CommentCard key={c._id} comment={c} />
              ))}
            </div>
          </AnimatePresence>
        )}
        <div ref={listEndRef} />
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 px-4 py-3 flex flex-col gap-2"
        style={{ borderTop: "1px solid var(--separator)", background: "var(--surface)" }}
      >
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[12px] px-2"
              style={{ color: "#ef4444" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          {/* Name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={80}
            required
            className="flex-1 min-w-0 px-3 py-2 text-[13px] rounded-lg outline-none"
            style={{
              background: "var(--window-bg)",
              border: "1px solid var(--separator)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = "var(--separator)"; }}
          />
        </div>

        <div className="flex gap-2 items-end">
          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message…"
            maxLength={500}
            required
            rows={2}
            className="flex-1 min-w-0 px-3 py-2 text-[13px] rounded-lg outline-none resize-none"
            style={{
              background: "var(--window-bg)",
              border: "1px solid var(--separator)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-system)",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--accent)"; }}
            onBlur={(e)  => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--separator)"; }}
          />

          {/* Send button */}
          <motion.button
            type="submit"
            disabled={!name.trim() || !message.trim() || submitting}
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: !name.trim() || !message.trim() || submitting
                ? "var(--separator)"
                : "var(--accent)",
              color: "#fff",
              cursor: !name.trim() || !message.trim() || submitting ? "not-allowed" : "pointer",
            }}
            whileTap={{ scale: 0.93 }}
            aria-label="Send"
          >
            {submitting
              ? <Loader2 size={15} strokeWidth={2} style={{ animation: "spin 0.8s linear infinite" }} />
              : <Send size={14} strokeWidth={2} />
            }
          </motion.button>
        </div>

        <div className="text-right text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          {message.length}/500
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
