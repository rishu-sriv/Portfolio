"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Folder,
  Globe,
  Terminal,
  Fingerprint,
  BookOpen,
  LayoutGrid,
  ExternalLink,
  Code,
  X,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useWindowStore } from "@/store/useWindowStore";
import { PROJECTS } from "@/lib/projects";
import type { AppId } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SearchResult {
  type: "app" | "project" | "skill" | "link";
  id: string;
  name: string;
  description?: string;
  Icon: React.ElementType;
  action: () => void;
}

interface ResultCategory {
  label: string;
  items: SearchResult[];
  startIndex: number;
}

// ── Static search data ────────────────────────────────────────────────────────

const SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
  "Tailwind CSS", "Framer Motion", "PostgreSQL", "MongoDB", "Docker",
  "Python", "GraphQL", "Redis", "AWS", "Git",
];

const SOCIAL_LINKS = [
  { name: "GitHub",    url: "https://github.com/rishu-sriv" },
  { name: "LinkedIn",  url: "https://www.linkedin.com/in/sameer-srivastava-01a438371/" },
  { name: "Instagram", url: "https://www.instagram.com/ft.rishu/" },
  { name: "Gmail",     url: "mailto:rishupayne04@gmail.com" },
];

const APP_DEFAULTS: Partial<Record<AppId, { defaultPosition: { x: number; y: number }; defaultSize: { width: number; height: number } }>> = {
  finder:    { defaultPosition: { x: 80,  y: 48  }, defaultSize: { width: 860, height: 540 } },
  terminal:  { defaultPosition: { x: 120, y: 80  }, defaultSize: { width: 720, height: 460 } },
  safari:    { defaultPosition: { x: 100, y: 60  }, defaultSize: { width: 960, height: 600 } },
  about:     { defaultPosition: { x: 160, y: 60  }, defaultSize: { width: 860, height: 580 } },
  guestbook: { defaultPosition: { x: 160, y: 100 }, defaultSize: { width: 680, height: 500 } },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fuzzyMatch(needle: string, haystack: string) {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SpotlightSearch() {
  const { isSpotlightOpen, setSpotlightOpen, setLaunchpadOpen } = useDesktopStore();
  const { openWindow } = useWindowStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus & reset when opened
  useEffect(() => {
    if (isSpotlightOpen) {
      setQuery("");
      setSelectedIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isSpotlightOpen]);

  // Build flat result list
  const buildCategories = useCallback(
    (q: string): ResultCategory[] => {
      const close = () => setSpotlightOpen(false);

      const appItems = [
        { id: "finder",    name: "Finder",    Icon: Folder,      action: () => { openWindow("finder",    APP_DEFAULTS.finder);    close(); } },
        { id: "safari",    name: "Safari",    Icon: Globe,       action: () => { openWindow("safari",    APP_DEFAULTS.safari);    close(); } },
        { id: "terminal",  name: "Terminal",  Icon: Terminal,    action: () => { openWindow("terminal",  APP_DEFAULTS.terminal);  close(); } },
        { id: "about",     name: "About Me",  Icon: Fingerprint, action: () => { openWindow("about",     APP_DEFAULTS.about);     close(); } },
        { id: "guestbook", name: "Guestbook", Icon: BookOpen,    action: () => { openWindow("guestbook", APP_DEFAULTS.guestbook); close(); } },
        { id: "launchpad", name: "Launchpad", Icon: LayoutGrid,  action: () => { close(); setTimeout(() => setLaunchpadOpen(true), 120); } },
      ];

      const apps: SearchResult[] = appItems
        .filter((r) => fuzzyMatch(q, r.name))
        .map((r) => ({ ...r, type: "app" as const }));

      const projects: SearchResult[] = PROJECTS
        .filter((p) => fuzzyMatch(q, p.title) || fuzzyMatch(q, p.description))
        .map((p) => ({
          type: "project" as const,
          id: p.id,
          name: p.title,
          description: p.description,
          Icon: Folder,
          action: () => { openWindow("finder", APP_DEFAULTS.finder); close(); },
        }));

      const skills: SearchResult[] = SKILLS
        .filter((s) => fuzzyMatch(q, s))
        .map((s) => ({
          type: "skill" as const,
          id: `skill-${s}`,
          name: s,
          Icon: Code,
          action: () => { openWindow("about", APP_DEFAULTS.about); close(); },
        }));

      const links: SearchResult[] = SOCIAL_LINKS
        .filter((l) => fuzzyMatch(q, l.name))
        .map((l) => ({
          type: "link" as const,
          id: `link-${l.name}`,
          name: l.name,
          Icon: ExternalLink,
          action: () => { window.open(l.url, "_blank", "noopener,noreferrer"); close(); },
        }));

      const raw = [
        { label: "Applications", items: apps },
        { label: "Projects",     items: projects },
        { label: "Skills",       items: skills },
        { label: "Links",        items: links },
      ].filter((c) => c.items.length > 0);

      // Assign flat start indices
      let offset = 0;
      return raw.map((c) => {
        const cat: ResultCategory = { ...c, startIndex: offset };
        offset += c.items.length;
        return cat;
      });
    },
    [openWindow, setSpotlightOpen, setLaunchpadOpen]
  );

  const categories = buildCategories(query);
  const totalResults = categories.reduce((s, c) => s + c.items.length, 0);

  // Keyboard navigation
  useEffect(() => {
    if (!isSpotlightOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSpotlightOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, totalResults - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        // Find the result at selectedIndex
        let cur = 0;
        for (const cat of categories) {
          for (const item of cat.items) {
            if (cur === selectedIndex) { item.action(); return; }
            cur++;
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSpotlightOpen, categories, selectedIndex, totalResults, setSpotlightOpen]);

  // Reset selection when query changes
  useEffect(() => { setSelectedIndex(0); }, [query]);

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <motion.div
          key="spotlight-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9000] flex items-start justify-center"
          style={{ paddingTop: "16vh", background: "rgba(0,0,0,0.48)" }}
          onClick={() => setSpotlightOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: -12 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{ scale: 0.94,    opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 520, damping: 36 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 640,
              maxHeight: "62vh",
              borderRadius: 18,
              background: "rgba(255,255,255,0.13)",
              backdropFilter: "blur(72px)",
              WebkitBackdropFilter: "blur(72px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 32px 96px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ── Search row ─────────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                gap: 12,
                borderBottom:
                  totalResults > 0
                    ? "0.5px solid rgba(255,255,255,0.14)"
                    : "none",
              }}
            >
              <Search size={22} color="rgba(255,255,255,0.75)" strokeWidth={2} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Spotlight Search"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 21,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.95)",
                  caretColor: "white",
                  letterSpacing: "-0.01em",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    flexShrink: 0,
                  }}
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* ── Results ───────────────────────────────────────────────── */}
            {totalResults > 0 && (
              <div style={{ overflowY: "auto", flex: 1, paddingBottom: 8 }}>
                {categories.map((cat) => (
                  <div key={cat.label}>
                    {/* Category header */}
                    <div
                      style={{
                        padding: "10px 20px 4px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.45)",
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                      }}
                    >
                      {cat.label}
                    </div>

                    {/* Items */}
                    {cat.items.map((item, localIdx) => {
                      const globalIdx = cat.startIndex + localIdx;
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "9px 20px",
                            cursor: "pointer",
                            background: isSelected
                              ? "rgba(255,255,255,0.16)"
                              : "transparent",
                            transition: "background 0.08s ease",
                          }}
                        >
                          {/* Icon */}
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 7,
                              background: isSelected
                                ? "rgba(255,255,255,0.18)"
                                : "rgba(255,255,255,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              color: "rgba(255,255,255,0.85)",
                              transition: "background 0.08s ease",
                            }}
                          >
                            <item.Icon size={15} strokeWidth={1.8} />
                          </div>

                          {/* Text */}
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "rgba(255,255,255,0.95)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.name}
                            </div>
                            {item.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "rgba(255,255,255,0.45)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  marginTop: 1,
                                }}
                              >
                                {item.description}
                              </div>
                            )}
                          </div>

                          {/* Type badge */}
                          <div
                            style={{
                              fontSize: 10,
                              color: "rgba(255,255,255,0.3)",
                              textTransform: "capitalize",
                              flexShrink: 0,
                            }}
                          >
                            {item.type}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* ── Empty hint ─────────────────────────────────────────────── */}
            {totalResults === 0 && (
              <div
                style={{
                  padding: "24px 20px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 14,
                }}
              >
                {query ? `No results for "${query}"` : "Start typing to search…"}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
