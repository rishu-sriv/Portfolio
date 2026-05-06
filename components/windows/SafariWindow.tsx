"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ChevronLeft, ChevronRight, X, Lock, Send, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

// ─── Input / Textarea shared styles ───────────────────────────────────────────

function FieldInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[12px] font-semibold tracking-wide uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--accent)" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 text-[14px] rounded-lg outline-none transition-all"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--separator)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = "var(--separator)";
          (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[12px] font-semibold tracking-wide uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--accent)" }}> *</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="w-full px-3 py-2 text-[14px] rounded-lg outline-none resize-none transition-all"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--separator)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-system)",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLTextAreaElement).style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent)";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--separator)";
          (e.currentTarget as HTMLTextAreaElement).style.boxShadow = "none";
        }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SafariWindow() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [state, setState] = useState<FormState>("idle");
  const [spinning, setSpinning] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set = useCallback(
    (field: keyof FormData) => (v: string) =>
      setForm((prev) => ({ ...prev, [field]: v })),
    []
  );

  const handleRefresh = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }, [spinning]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.message) return;

      setState("loading");
      setErrorMsg("");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Something went wrong");
        }

        setState("success");
        setForm({ name: "", email: "", message: "" });
      } catch (err) {
        setState("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [form]
  );

  const handleTryAgain = useCallback(() => {
    setState("idle");
    setErrorMsg("");
  }, []);

  // ─── Tab bar ────────────────────────────────────────────────────────────────

  const TabBar = (
    <div
      className="flex items-center shrink-0"
      style={{
        height: 36,
        background: "var(--titlebar-bg)",
        borderBottom: "1px solid var(--separator)",
        paddingLeft: 12,
        paddingRight: 12,
        gap: 0,
      }}
    >
      {/* Single tab */}
      <div
        className="flex items-center gap-2 px-3 py-1 rounded-t-md text-[12px] shrink-0"
        style={{
          background: "var(--window-bg)",
          border: "1px solid var(--separator)",
          borderBottom: "1px solid var(--window-bg)",
          color: "var(--text-primary)",
          maxWidth: 200,
          height: "100%",
          alignSelf: "flex-end",
          position: "relative",
          bottom: -1,
        }}
      >
        {/* Favicon */}
        <div
          className="shrink-0 flex items-center justify-center rounded-sm"
          style={{ width: 14, height: 14, background: "#0071e3", fontSize: 8, color: "#fff" }}
        >
          ✉
        </div>
        <span className="truncate font-medium">Contact — Portfolio</span>
        {/* Tab close dot */}
        <div
          className="shrink-0 w-3 h-3 rounded-full flex items-center justify-center ml-1 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ background: "var(--separator)" }}
        >
          <X size={7} style={{ color: "var(--text-secondary)" }} />
        </div>
      </div>
    </div>
  );

  // ─── Address / toolbar bar ──────────────────────────────────────────────────

  const ToolBar = (
    <div
      className="flex items-center gap-2 shrink-0 px-3"
      style={{
        height: 44,
        background: "var(--titlebar-bg)",
        borderBottom: "1px solid var(--separator)",
      }}
    >
      {/* Back / Forward */}
      <button
        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
        style={{ color: "var(--text-tertiary)", cursor: "not-allowed" }}
        disabled
        aria-label="Back"
      >
        <ChevronLeft size={18} strokeWidth={2} />
      </button>
      <button
        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
        style={{ color: "var(--text-tertiary)", cursor: "not-allowed" }}
        disabled
        aria-label="Forward"
      >
        <ChevronRight size={18} strokeWidth={2} />
      </button>

      {/* URL bar */}
      <div
        className="flex-1 flex items-center gap-2 px-3 py-1 rounded-lg mx-1"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--separator)",
          height: 28,
        }}
      >
        <Lock size={11} strokeWidth={2} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
        <span
          className="text-[12px] truncate select-all"
          style={{ color: "var(--text-secondary)", flex: 1 }}
        >
          portfolio://contact
        </span>
      </div>

      {/* Refresh */}
      <motion.button
        className="w-7 h-7 rounded-md flex items-center justify-center"
        style={{ color: "var(--text-secondary)" }}
        onClick={handleRefresh}
        whileTap={{ scale: 0.9 }}
        aria-label="Refresh"
      >
        <motion.div
          animate={{ rotate: spinning ? 360 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <RefreshCw size={14} strokeWidth={2} />
        </motion.div>
      </motion.button>
    </div>
  );

  // ─── Success state ──────────────────────────────────────────────────────────

  const SuccessView = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="flex flex-col items-center justify-center gap-5 py-12 px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.1 }}
      >
        <CheckCircle2 size={64} style={{ color: "#22c55e" }} strokeWidth={1.5} />
      </motion.div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Message sent!
        </h3>
        <p className="text-[14px] max-w-xs" style={{ color: "var(--text-secondary)" }}>
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
      </div>
      <motion.button
        onClick={handleTryAgain}
        className="px-6 py-2 rounded-lg text-[13px] font-medium"
        style={{ background: "var(--accent)", color: "#fff" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        Send another message
      </motion.button>
    </motion.div>
  );

  // ─── Contact form ───────────────────────────────────────────────────────────

  const ContactForm = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldInput
        label="Name"
        value={form.name}
        onChange={set("name")}
        placeholder="Jane Smith"
        required
      />
      <FieldInput
        label="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="jane@example.com"
        required
      />
      <FieldTextarea
        label="Message"
        value={form.message}
        onChange={set("message")}
        placeholder="Hi Rishu, I'd love to chat about…"
        required
      />

      {/* Error banner */}
      <AnimatePresence>
        {state === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px]"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
          >
            <AlertCircle size={14} strokeWidth={2} />
            {errorMsg || "Something went wrong. Please try again."}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={state === "loading" || !form.name || !form.email || !form.message}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium transition-opacity"
        style={{
          background: "var(--accent)",
          color: "#fff",
          opacity: !form.name || !form.email || !form.message ? 0.5 : 1,
          cursor: !form.name || !form.email || !form.message ? "not-allowed" : "pointer",
        }}
        whileHover={{ scale: !form.name || !form.email || !form.message ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {state === "loading" ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            >
              <RefreshCw size={14} strokeWidth={2} />
            </motion.div>
            Sending…
          </>
        ) : (
          <>
            <Send size={14} strokeWidth={2} />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );

  // ─── Main content area ──────────────────────────────────────────────────────

  const ContentArea = (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--window-bg)" }}
    >
      <div className="max-w-[560px] mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2
            className="text-[24px] font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Say Hello 👋
          </h2>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            Have a project idea or just want to chat? I&apos;d love to hear from you.
          </p>
        </div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div key="success">{SuccessView}</motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {ContactForm}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--window-bg)" }}>
      {TabBar}
      {ToolBar}
      {ContentArea}
    </div>
  );
}
