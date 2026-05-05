"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  ExternalLink,
  GitFork as GithubIcon,
  X,
  Globe,
  FolderOpen,
  Layers,
  Server,
  GitMerge,
  Code2,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { PROJECTS, type Project } from "@/lib/projects";
import type { ProjectCategory } from "@/types";

// ─── Sidebar config ───────────────────────────────────────────────────────────

interface SidebarItem {
  label: string;
  category: ProjectCategory | "all";
  Icon: React.ElementType;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "All Projects",  category: "all",         Icon: FolderOpen },
  { label: "Full Stack",    category: "fullstack",    Icon: Layers     },
  { label: "Frontend",      category: "frontend",     Icon: Code2      },
  { label: "Backend",       category: "backend",      Icon: Server     },
  { label: "Open Source",   category: "open-source",  Icon: GitMerge   },
];

// ─── Tech tag colours (maps first matching keyword) ──────────────────────────

const TAG_COLORS: { key: string; bg: string; color: string }[] = [
  { key: "React",      bg: "rgba(97,218,251,0.15)",  color: "#61DAFB" },
  { key: "Next",       bg: "rgba(255,255,255,0.1)",   color: "#aaa"   },
  { key: "TypeScript", bg: "rgba(49,120,198,0.18)",   color: "#3178C6" },
  { key: "Tailwind",   bg: "rgba(56,189,248,0.15)",   color: "#38BDF8" },
  { key: "Node",       bg: "rgba(104,160,99,0.18)",   color: "#68A063" },
  { key: "Postgres",   bg: "rgba(51,103,145,0.18)",   color: "#336791" },
  { key: "Python",     bg: "rgba(255,212,59,0.15)",   color: "#FFD43B" },
  { key: "Docker",     bg: "rgba(36,150,237,0.15)",   color: "#2496ED" },
  { key: "Redis",      bg: "rgba(220,56,45,0.15)",    color: "#DC382D" },
  { key: "Framer",     bg: "rgba(255,92,147,0.15)",   color: "#ff5c93" },
  { key: "Zustand",    bg: "rgba(255,165,0,0.15)",    color: "#ffa500" },
  { key: "Vercel",     bg: "rgba(255,255,255,0.08)",  color: "#ccc"   },
  { key: "Socket",     bg: "rgba(37,99,235,0.15)",    color: "#3b82f6" },
  { key: "Rollup",     bg: "rgba(255,62,0,0.15)",     color: "#ff3e00" },
  { key: "Recharts",   bg: "rgba(136,132,216,0.18)",  color: "#8884d8" },
];

function tagStyle(tag: string) {
  const match = TAG_COLORS.find((t) => tag.toLowerCase().includes(t.key.toLowerCase()));
  return match
    ? { background: match.bg, color: match.color }
    : { background: "rgba(128,128,128,0.12)", color: "var(--text-secondary)" };
}

// ─── Placeholder thumbnail ────────────────────────────────────────────────────

function ProjectThumbnail({ project, dark }: { project: Project; dark: boolean }) {
  const gradient = useMemo(() => {
    const palettes: [string, string][] = [
      ["#667eea", "#764ba2"],
      ["#f093fb", "#f5576c"],
      ["#4facfe", "#00f2fe"],
      ["#43e97b", "#38f9d7"],
      ["#fa709a", "#fee140"],
      ["#a18cd1", "#fbc2eb"],
    ];
    const idx = project.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % palettes.length;
    return palettes[idx];
  }, [project.id]);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }}
    >
      <span
        className="text-[28px] font-bold tracking-tight select-none"
        style={{
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}
      >
        {project.title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

// ─── Project Card (grid) ──────────────────────────────────────────────────────

function ProjectCard({
  project,
  dark,
  onClick,
}: {
  project: Project;
  dark: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
      style={{
        background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="w-full h-[120px] overflow-hidden relative flex-shrink-0">
        <ProjectThumbnail project={project} dark={dark} />

        {/* Hover overlay with action buttons */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center gap-2"
              style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(4px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ActionBtn
                icon={<Globe size={13} />}
                label="Live"
                href={project.liveUrl}
                dark={dark}
              />
              <ActionBtn
                icon={<GithubIcon size={13} />}
                label="GitHub"
                href={project.githubUrl}
                dark={dark}
              />
              <ActionBtn
                icon={<ExternalLink size={13} />}
                label="Details"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                dark={dark}
                accent
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p
          className="text-[12px] font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </p>
        <p
          className="text-[10px] leading-snug line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {project.techStack.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={tagStyle(tag)}
            >
              {tag}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(128,128,128,0.12)", color: "var(--text-tertiary)" }}
            >
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Project Row (list) ───────────────────────────────────────────────────────

function ProjectRow({
  project,
  dark,
  onClick,
}: {
  project: Project;
  dark: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer"
      style={{
        background: hovered
          ? dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
          : "transparent",
        transition: "background 0.12s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Mini thumbnail */}
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
        <ProjectThumbnail project={project} dark={dark} />
      </div>

      {/* Title + desc */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {project.title}
        </p>
        <p className="text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
          {project.description}
        </p>
      </div>

      {/* Tags */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        {project.techStack.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
            style={tagStyle(tag)}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--accent)" }}
          >
            <Globe size={12} />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--text-secondary)" }}
          >
            <GithubIcon size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Small action button used in card hover overlay ──────────────────────────

function ActionBtn({
  icon,
  label,
  href,
  onClick,
  dark,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  dark: boolean;
  accent?: boolean;
}) {
  const style = accent
    ? { background: "var(--accent)", color: "#fff" }
    : { background: "rgba(255,255,255,0.18)", color: "#fff" };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold backdrop-blur-sm"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
        {label}
      </a>
    );
  }
  return (
    <button
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold backdrop-blur-sm"
      style={style}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Project Detail Sheet ─────────────────────────────────────────────────────

function DetailSheet({
  project,
  dark,
  onClose,
}: {
  project: Project;
  dark: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
      className="absolute inset-0 flex flex-col z-20 overflow-hidden"
      style={{
        background: dark ? "rgba(26,26,28,0.98)" : "rgba(252,252,252,0.98)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
      }}
    >
      {/* Sheet header */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <ProjectThumbnail project={project} dark={dark} />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <Globe size={11} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
                color: "var(--text-primary)",
              }}
            >
              <GithubIcon size={11} />
              GitHub
            </a>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
            style={{
              background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
              color: "var(--text-secondary)",
            }}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 selectable">
        {/* Hero banner */}
        <div className="w-full h-36 rounded-xl overflow-hidden flex-shrink-0">
          <ProjectThumbnail project={project} dark={dark} />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            About
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {project.longDescription}
          </p>
        </div>

        {/* Tech stack */}
        <div className="space-y-2">
          <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={tagStyle(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
            style={{
              background: "rgba(0,113,227,0.12)",
              color: "var(--accent)",
            }}
          >
            {project.category === "open-source" ? "Open Source" : project.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  search: string;
  onSearch: (q: string) => void;
  dark: boolean;
}

function Toolbar({
  canGoBack, canGoForward, onBack, onForward,
  view, onViewChange,
  search, onSearch,
  dark,
}: ToolbarProps) {
  const btnBase: React.CSSProperties = {
    borderRadius: 6,
    background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
    color: "var(--text-secondary)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  };

  const activeBtnStyle: React.CSSProperties = {
    ...btnBase,
    background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
      style={{
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
        background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
      }}
    >
      {/* Back / Forward */}
      <div className="flex items-center gap-1">
        <button
          style={canGoBack ? btnBase : { ...btnBase, opacity: 0.35, cursor: "default" }}
          onClick={canGoBack ? onBack : undefined}
          aria-label="Back"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          style={canGoForward ? btnBase : { ...btnBase, opacity: 0.35, cursor: "default" }}
          onClick={canGoForward ? onForward : undefined}
          aria-label="Forward"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 16,
          background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      />

      {/* View toggle */}
      <div className="flex items-center gap-1">
        <button
          style={view === "grid" ? activeBtnStyle : btnBase}
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
        >
          <LayoutGrid size={14} />
        </button>
        <button
          style={view === "list" ? activeBtnStyle : btnBase}
          onClick={() => onViewChange("list")}
          aria-label="List view"
        >
          <List size={14} />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
        style={{
          background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
          minWidth: 0,
          width: 160,
        }}
      >
        <Search size={11} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search projects…"
          className="flex-1 bg-transparent border-none outline-none text-[11px] min-w-0"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-system)",
          }}
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            style={{ color: "var(--text-tertiary)", lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <X size={10} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  activeCategory,
  onChange,
  dark,
}: {
  activeCategory: ProjectCategory | "all";
  onChange: (c: ProjectCategory | "all") => void;
  dark: boolean;
}) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 py-2"
      style={{
        width: 148,
        borderRight: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
        background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
      }}
    >
      <p
        className="text-[9px] font-bold uppercase tracking-widest px-3 pb-1.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        Collections
      </p>

      {SIDEBAR_ITEMS.map(({ label, category, Icon }) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className="flex items-center gap-2 px-3 py-[5px] rounded-lg mx-1.5 text-left transition-colors"
            style={{
              background: active
                ? dark ? "rgba(41,151,255,0.18)" : "rgba(0,113,227,0.1)"
                : "transparent",
              color: active ? "var(--accent)" : "var(--text-secondary)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon size={13} style={{ flexShrink: 0 }} />
            <span className="text-[12px] font-medium truncate">{label}</span>
          </button>
        );
      })}
    </aside>
  );
}

// ─── FinderWindow ─────────────────────────────────────────────────────────────

export default function FinderWindow() {
  const { isDarkMode: dark } = useDesktopStore();

  // Navigation history — behaves like browser back/forward
  const [history, setHistory] = useState<(ProjectCategory | "all")[]>(["all"]);
  const [histIdx, setHistIdx] = useState(0);
  const activeCategory = history[histIdx];

  const goTo = useCallback((cat: ProjectCategory | "all") => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, histIdx + 1);
      if (trimmed[trimmed.length - 1] === cat) return prev; // no-op if same
      return [...trimmed, cat];
    });
    setHistIdx((i) => {
      const trimmedLen = history.slice(0, i + 1).length;
      const isSame = history[i] === cat;
      return isSame ? i : trimmedLen; // move forward only if different
    });
  }, [histIdx, history]);

  const goBack    = useCallback(() => setHistIdx((i) => Math.max(0, i - 1)), []);
  const goForward = useCallback(() => setHistIdx((i) => Math.min(history.length - 1, i + 1)), [history.length]);

  const [view,         setView]         = useState<"grid" | "list">("grid");
  const [search,       setSearch]       = useState("");
  const [activeDetail, setActiveDetail] = useState<Project | null>(null);

  // Filtered projects
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const catMatch = activeCategory === "all" || p.category === activeCategory;
      const searchMatch = !q || p.title.toLowerCase().includes(q) || p.techStack.some((t) => t.toLowerCase().includes(q));
      return catMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-full relative" style={{ background: dark ? "rgba(28,28,30,0.96)" : "rgba(255,255,255,0.96)" }}>
      {/* Toolbar */}
      <Toolbar
        canGoBack={histIdx > 0}
        canGoForward={histIdx < history.length - 1}
        onBack={goBack}
        onForward={goForward}
        view={view}
        onViewChange={setView}
        search={search}
        onSearch={setSearch}
        dark={dark}
      />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 min-h-0">
        <Sidebar activeCategory={activeCategory} onChange={goTo} dark={dark} />

        {/* Main content area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 relative">
          {/* Category heading */}
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[13px] font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {SIDEBAR_ITEMS.find((s) => s.category === activeCategory)?.label ?? "Projects"}
            </h2>
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-40">
              <Search size={28} style={{ color: "var(--text-tertiary)" }} />
              <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                No projects found
              </p>
            </div>
          ) : view === "grid" ? (
            <motion.div
              layout
              className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    dark={dark}
                    onClick={() => setActiveDetail(p)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div layout className="flex flex-col gap-0.5">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <ProjectRow
                    key={p.id}
                    project={p}
                    dark={dark}
                    onClick={() => setActiveDetail(p)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail sheet — slides up from bottom of window */}
      <AnimatePresence>
        {activeDetail && (
          <DetailSheet
            key={activeDetail.id}
            project={activeDetail}
            dark={dark}
            onClose={() => setActiveDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
