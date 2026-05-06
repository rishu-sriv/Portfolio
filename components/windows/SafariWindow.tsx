"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
  ExternalLink,
} from "lucide-react";

// ─── URL processing ────────────────────────────────────────────────────────────

function processInput(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (!s.includes(" ") && /\.[a-z]{2,}$/i.test(s)) return "https://" + s;
  // DuckDuckGo Lite — real web search, minimal HTML, works in iframe via proxy
  return `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(s)}`;
}

function proxyUrl(url: string) {
  return `/api/browser?url=${encodeURIComponent(url)}`;
}

// Sites whose own JavaScript checks window !== top and refuses to render —
// no proxy trick fixes this. We show a "open in new tab" page instead.
const KNOWN_BLOCKED = ["linkedin.com", "facebook.com", "instagram.com", "twitter.com", "x.com"];

function isKnownBlocked(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return KNOWN_BLOCKED.some((b) => host === b || host.endsWith("." + b));
  } catch {
    return false;
  }
}

function GoogleWordmark() {
  // "Google" in brand colours
  const letters = [
    { ch: "G", color: "#4285F4" },
    { ch: "o", color: "#EA4335" },
    { ch: "o", color: "#FBBC05" },
    { ch: "g", color: "#4285F4" },
    { ch: "l", color: "#34A853" },
    { ch: "e", color: "#EA4335" },
  ];
  return (
    <div style={{ display: "flex", lineHeight: 1 }}>
      {letters.map(({ ch, color }, i) => (
        <span key={i} style={{ fontSize: 52, fontWeight: 400, color, fontFamily: "Arial, sans-serif", letterSpacing: -1 }}>
          {ch}
        </span>
      ))}
    </div>
  );
}

// ─── New-tab / home page ───────────────────────────────────────────────────────

const SHORTCUTS = [
  { label: "Search",      url: "https://lite.duckduckgo.com/lite/", emoji: "🔍" },
  { label: "Wikipedia",   url: "https://en.wikipedia.org",           emoji: "📖" },
  { label: "GitHub",      url: "https://github.com/rishu-sriv",      emoji: "🐙" },
  { label: "Hacker News", url: "https://news.ycombinator.com",       emoji: "🟠" },
  { label: "Reddit",      url: "https://old.reddit.com",             emoji: "🤖" },
  { label: "BBC News",    url: "https://www.bbc.com/news",           emoji: "📰" },
];

function NewTabPage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) onNavigate(processInput(q));
  };

  return (
    <div
      className="flex flex-col items-center h-full select-none"
      style={{ background: "white", paddingTop: "10%" }}
    >
      {/* Google wordmark */}
      <GoogleWordmark />

      {/* Search bar */}
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 560, padding: "28px 20px 0" }}>
        <div
          className="relative flex items-center"
          style={{
            borderRadius: 24,
            border: "1px solid #dfe1e5",
            boxShadow: "0 1px 6px rgba(32,33,36,0.08)",
            background: "white",
            height: 46,
            paddingLeft: 16,
            paddingRight: 12,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 12px rgba(32,33,36,0.18)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 6px rgba(32,33,36,0.08)")}
        >
          <Search size={18} style={{ color: "#9aa0a6", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search or enter website address"
            className="flex-1 outline-none"
            style={{
              border: "none",
              background: "transparent",
              fontSize: 16,
              color: "#202124",
              padding: "0 10px",
            }}
          />
          {q && (
            <button type="button" onClick={() => { setQ(""); inputRef.current?.focus(); }} style={{ color: "#9aa0a6", lineHeight: 0 }}>
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Shortcuts */}
      <div
        className="flex flex-wrap justify-center"
        style={{ marginTop: 36, gap: 12, maxWidth: 560, padding: "0 20px" }}
      >
        {SHORTCUTS.map(({ label, url, emoji }) => (
          <button
            key={url}
            onClick={() => onNavigate(url)}
            className="flex flex-col items-center gap-2 rounded-xl transition-colors"
            style={{ padding: "10px 12px", width: 80 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f1f3f4")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 48, height: 48, background: "#f1f3f4", fontSize: 22 }}
            >
              {emoji}
            </div>
            <span style={{ fontSize: 11, color: "#202124", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Blocked-site page ─────────────────────────────────────────────────────────

function BlockedPage({ url, reason }: { url: string; reason: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4"
      style={{ background: "#f8f9fa" }}
    >
      <div style={{ fontSize: 52 }} aria-hidden>🔒</div>
      <p style={{ fontSize: 17, fontWeight: 600, color: "#202124" }}>
        {reason}
      </p>
      <p style={{ fontSize: 13, color: "#5f6368", maxWidth: 360, textAlign: "center" }}>
        This site doesn&apos;t allow being opened inside another page. Open it directly instead.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 18px", background: "#1a73e8", color: "white",
          borderRadius: 4, fontSize: 14, fontWeight: 500, textDecoration: "none",
          marginTop: 4,
        }}
      >
        <ExternalLink size={14} /> Open in new tab
      </a>
    </div>
  );
}

// ─── SafariWindow ──────────────────────────────────────────────────────────────

export default function SafariWindow() {
  const [navHistory, setNavHistory]   = useState<string[]>([]);
  const [historyIdx, setHistoryIdx]   = useState(-1);
  const [currentUrl, setCurrentUrl]   = useState("");
  const [isHome, setIsHome]           = useState(true);
  const [isLoading, setIsLoading]     = useState(false);
  const [blocked, setBlocked]         = useState(false);
  const [inputVal, setInputVal]       = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for postMessage navigation from inside proxied pages
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "safari-navigate" && typeof e.data.url === "string") {
        navigateTo(e.data.url);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navHistory, historyIdx]);

  const navigateTo = useCallback(
    (raw: string) => {
      const url = processInput(raw);
      if (!url) return;
      const next = [...navHistory.slice(0, historyIdx + 1), url];
      setNavHistory(next);
      setHistoryIdx(next.length - 1);
      setCurrentUrl(url);
      setInputVal(url);
      setIsHome(false);
      setIsLoading(true);
      setBlocked(isKnownBlocked(url));
    },
    [navHistory, historyIdx]
  );

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      const url = navHistory[idx];
      setHistoryIdx(idx);
      setCurrentUrl(url);
      setInputVal(url);
      setIsHome(false);
      setIsLoading(true);
      setBlocked(isKnownBlocked(url));
    } else if (historyIdx === 0) {
      setHistoryIdx(-1);
      setCurrentUrl("");
      setInputVal("");
      setIsHome(true);
      setBlocked(false);
    }
  };

  const goForward = () => {
    if (historyIdx < navHistory.length - 1) {
      const idx = historyIdx + 1;
      const url = navHistory[idx];
      setHistoryIdx(idx);
      setCurrentUrl(url);
      setInputVal(url);
      setIsHome(false);
      setIsLoading(true);
      setBlocked(isKnownBlocked(url));
    }
  };

  const refresh = () => {
    if (!isHome && !blocked && iframeRef.current) {
      setIsLoading(true);
      const src = proxyUrl(currentUrl);
      iframeRef.current.src = "";
      setTimeout(() => { if (iframeRef.current) iframeRef.current.src = src; }, 30);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputVal);
  };

  const canGoBack    = historyIdx > -1;
  const canGoForward = historyIdx < navHistory.length - 1;

  const showIframe = !isHome && !blocked;

  return (
    <div className="h-full w-full flex flex-col" style={{ background: "white" }}>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{
          height: 44,
          background: "white",
          borderBottom: "1px solid #e8eaed",
        }}
      >
        <NavBtn onClick={goBack}    disabled={!canGoBack}    label="Back">    <ChevronLeft  size={20} strokeWidth={2} /></NavBtn>
        <NavBtn onClick={goForward} disabled={!canGoForward} label="Forward"> <ChevronRight size={20} strokeWidth={2} /></NavBtn>
        <NavBtn onClick={refresh}   disabled={isHome || blocked} label="Refresh"><RotateCcw size={15} strokeWidth={2} /></NavBtn>

        {/* Address bar */}
        <form onSubmit={handleAddressSubmit} style={{ flex: 1 }}>
          <div
            className="relative flex items-center"
            style={{
              height: 32,
              borderRadius: 16,
              border: "1px solid #dfe1e5",
              background: "#f1f3f4",
              paddingLeft: 12,
              paddingRight: inputVal ? 32 : 12,
            }}
          >
            <Search size={13} style={{ color: "#5f6368", flexShrink: 0 }} />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onFocus={(e) => e.target.select()}
              placeholder="Search or enter website address"
              className="flex-1 outline-none"
              style={{
                background: "transparent",
                border: "none",
                fontSize: 13,
                color: "#202124",
                padding: "0 8px",
              }}
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal("")}
                className="absolute"
                style={{ right: 10, color: "#5f6368", lineHeight: 0 }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        {/* Open in new tab */}
        {!isHome && currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            style={{ color: "#5f6368", lineHeight: 0, flexShrink: 0 }}
          >
            <ExternalLink size={15} strokeWidth={2} />
          </a>
        )}
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      {isLoading && !blocked && (
        <div style={{ height: 3, background: "transparent", flexShrink: 0, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: "55%",
            background: "linear-gradient(90deg, #4285f4, #34a853, #fbbc05, #ea4335)",
            animation: "safari-progress 1.4s ease-in-out infinite",
          }} />
        </div>
      )}

      {/* ── Page ─────────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {isHome && <NewTabPage onNavigate={navigateTo} />}

        {!isHome && blocked && (
          <BlockedPage
            url={currentUrl}
            reason={
              currentUrl.includes("linkedin.com")
                ? "LinkedIn requires you to sign in"
                : "This site can't be opened here"
            }
          />
        )}

        {/* Keep iframe in DOM but hidden when not needed, so we can re-show it */}
        <iframe
          key={currentUrl}
          ref={iframeRef}
          src={showIframe ? proxyUrl(currentUrl) : undefined}
          className="w-full h-full border-0 bg-white"
          style={{ display: showIframe ? "block" : "none" }}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          title="Safari browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}

// ── Toolbar button ─────────────────────────────────────────────────────────────

function NavBtn({ children, onClick, disabled, label }: {
  children: React.ReactNode; onClick: () => void; disabled: boolean; label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 28, height: 28, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 6, background: "transparent",
        color: disabled ? "#c4c7c9" : "#5f6368",
        cursor: disabled ? "default" : "pointer",
        border: "none",
      }}
    >
      {children}
    </button>
  );
}
