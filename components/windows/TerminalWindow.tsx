"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  KeyboardEvent,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Segment = { text: string; color?: string; bold?: boolean };

interface TerminalLine {
  id: string;
  type: "input" | "output" | "blank" | "banner";
  segments: Segment[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _id = 0;
function uid() {
  return String(++_id);
}

function line(
  text: string,
  color?: string,
  bold?: boolean,
  type: TerminalLine["type"] = "output"
): TerminalLine {
  return { id: uid(), type, segments: [{ text, color, bold }] };
}

function multiSegLine(segments: Segment[]): TerminalLine {
  return { id: uid(), type: "output", segments };
}

function blank(): TerminalLine {
  return { id: uid(), type: "blank", segments: [{ text: "" }] };
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const G = "#4ade80";   // green
const C = "#67e8f9";   // cyan
const Y = "#fbbf24";   // yellow
const P = "#c084fc";   // purple
const W = "#f1f5f9";   // white-ish
const DIM = "#64748b"; // dim

// ─── Skill bar builder ────────────────────────────────────────────────────────

const SKILLS = [
  { name: "React / Next.js", level: 95, label: "Expert" },
  { name: "TypeScript",      level: 92, label: "Expert" },
  { name: "Framer Motion",   level: 88, label: "Expert" },
  { name: "Tailwind CSS",    level: 90, label: "Expert" },
  { name: "Node.js",         level: 85, label: "Advanced" },
  { name: "Python",          level: 78, label: "Advanced" },
  { name: "PostgreSQL",      level: 75, label: "Advanced" },
  { name: "Docker / CI/CD",  level: 70, label: "Proficient" },
  { name: "GraphQL",         level: 68, label: "Proficient" },
  { name: "Redis",           level: 65, label: "Proficient" },
];

function skillLines(): TerminalLine[] {
  const out: TerminalLine[] = [
    line(`┌${"─".repeat(46)}┐`, DIM),
    multiSegLine([
      { text: "│ ", color: DIM },
      { text: "  Skills & Proficiency", color: C, bold: true },
      { text: " ".repeat(24) + "│", color: DIM },
    ]),
    line(`├${"─".repeat(46)}┤`, DIM),
    multiSegLine([
      { text: "│ ", color: DIM },
      { text: "Name                ", color: Y, bold: true },
      { text: "Level       ", color: Y, bold: true },
      { text: "Progress          ", color: Y, bold: true },
      { text: "│", color: DIM },
    ]),
    line(`├${"─".repeat(46)}┤`, DIM),
  ];

  for (const s of SKILLS) {
    const filled = Math.round(s.level / 5);
    const empty = 20 - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);
    const nameCol = s.name.padEnd(20);
    const lvlCol = s.label.padEnd(12);
    out.push(
      multiSegLine([
        { text: "│ ", color: DIM },
        { text: nameCol, color: W },
        { text: lvlCol, color: G },
        { text: bar, color: G },
        { text: " │", color: DIM },
      ])
    );
  }

  out.push(line(`└${"─".repeat(46)}┘`, DIM));
  out.push(blank());
  return out;
}

// ─── Command responses ────────────────────────────────────────────────────────

const AVAILABLE_COMMANDS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "experience",
  "contact",
  "clear",
  "neofetch",
  "sudo",
];

function getResponse(cmd: string): { lines: TerminalLine[]; confetti?: boolean; clear?: boolean } {
  const trimmed = cmd.trim().toLowerCase();

  if (trimmed === "clear") return { lines: [], clear: true };

  if (trimmed === "sudo hire me") {
    return {
      confetti: true,
      lines: [
        blank(),
        line("🎉  sudo: privilege granted — hiring confirmed!", G, true),
        line("    Initiating onboarding sequence…", C),
        line("    Welcome aboard! 🚀", Y),
        blank(),
      ],
    };
  }

  if (trimmed === "help") {
    return {
      lines: [
        blank(),
        line(`┌${"─".repeat(46)}┐`, DIM),
        multiSegLine([
          { text: "│ ", color: DIM },
          { text: "  Available Commands", color: C, bold: true },
          { text: " ".repeat(26) + "│", color: DIM },
        ]),
        line(`├${"─".repeat(46)}┤`, DIM),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  help        ", color: G }, { text: "Show this help menu        ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  whoami      ", color: G }, { text: "About me                   ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  skills      ", color: G }, { text: "Skills & proficiency        ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  projects    ", color: G }, { text: "Browse my projects          ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  experience  ", color: G }, { text: "Work history                ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  contact     ", color: G }, { text: "Get in touch                ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  neofetch    ", color: G }, { text: "System information          ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  clear       ", color: G }, { text: "Clear the terminal          ", color: W }, { text: "│", color: DIM }]),
        multiSegLine([{ text: "│ ", color: DIM }, { text: "  sudo hire me", color: P, bold: true }, { text: "  ✨ Easter egg             ", color: W }, { text: "│", color: DIM }]),
        line(`└${"─".repeat(46)}┘`, DIM),
        blank(),
      ],
    };
  }

  if (trimmed === "whoami") {
    return {
      lines: [
        blank(),
        line("  Sameer Srivastava", C, true),
        line("  Full-Stack Developer  ·  Open Source Enthusiast", W),
        blank(),
        multiSegLine([
          { text: "  Passionate about building delightful web experiences.", color: W },
        ]),
        multiSegLine([
          { text: "  TypeScript ", color: G },
          { text: "evangelist. ", color: W },
          { text: "React ", color: G },
          { text: "craftsman. ", color: W },
          { text: "UI ", color: G },
          { text: "obsessive.", color: W },
        ]),
        blank(),
        multiSegLine([{ text: "  📍 ", color: Y }, { text: "India", color: W }]),
        multiSegLine([{ text: "  🎓 ", color: Y }, { text: "B.Tech Computer Science", color: W }]),
        multiSegLine([{ text: "  💼 ", color: Y }, { text: "3+ years of professional experience", color: W }]),
        multiSegLine([{ text: "  🌐 ", color: Y }, { text: "Building on the web since 2020", color: W }]),
        blank(),
      ],
    };
  }

  if (trimmed === "skills") {
    return { lines: [blank(), ...skillLines()] };
  }

  if (trimmed === "projects") {
    return {
      lines: [
        blank(),
        line("  Projects", C, true),
        line(`  ${"─".repeat(44)}`, DIM),
        multiSegLine([{ text: "  ➜ ", color: G }, { text: "macOS Portfolio     ", color: W, bold: true }, { text: "https://rishu.dev", color: C }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Next.js · TypeScript · Framer Motion", color: DIM }]),
        blank(),
        multiSegLine([{ text: "  ➜ ", color: G }, { text: "AI Chat App         ", color: W, bold: true }, { text: "https://chat.rishu.dev", color: C }]),
        multiSegLine([{ text: "    ", color: W }, { text: "React · Node.js · Anthropic SDK", color: DIM }]),
        blank(),
        multiSegLine([{ text: "  ➜ ", color: G }, { text: "React UI Kit        ", color: W, bold: true }, { text: "github.com/rishu-sriv/ui-kit", color: C }]),
        multiSegLine([{ text: "    ", color: W }, { text: "React · TypeScript · Rollup · npm", color: DIM }]),
        blank(),
        multiSegLine([{ text: "  ➜ ", color: G }, { text: "REST API Platform   ", color: W, bold: true }, { text: "github.com/rishu-sriv/api-platform", color: C }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Node.js · Express · PostgreSQL · Redis", color: DIM }]),
        blank(),
        multiSegLine([{ text: "  ➜ ", color: G }, { text: "OG Image Generator  ", color: W, bold: true }, { text: "https://og.rishu.dev", color: C }]),
        multiSegLine([{ text: "    ", color: W }, { text: "TypeScript · Vercel Edge · Satori", color: DIM }]),
        blank(),
        multiSegLine([{ text: "  ➜ ", color: G }, { text: "Analytics Dashboard ", color: W, bold: true }, { text: "https://analytics.rishu.dev", color: C }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Next.js · Recharts · TimescaleDB", color: DIM }]),
        blank(),
      ],
    };
  }

  if (trimmed === "experience") {
    return {
      lines: [
        blank(),
        line("  Work History", C, true),
        line(`  ${"─".repeat(44)}`, DIM),
        blank(),
        multiSegLine([{ text: "  2023 – Present  ", color: Y, bold: true }, { text: "Senior Frontend Developer", color: W, bold: true }]),
        multiSegLine([{ text: "  ", color: W }, { text: "  Acme Corp  ·  ", color: DIM }, { text: "Full-time", color: G }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Led rebuild of customer dashboard (React, TypeScript).", color: W }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Reduced bundle size by 42% via code-splitting.", color: W }]),
        blank(),
        multiSegLine([{ text: "  2021 – 2023     ", color: Y, bold: true }, { text: "Frontend Developer", color: W, bold: true }]),
        multiSegLine([{ text: "  ", color: W }, { text: "  StartupXYZ  ·  ", color: DIM }, { text: "Full-time", color: G }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Built design system from scratch with 40+ components.", color: W }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Integrated WebSocket real-time features.", color: W }]),
        blank(),
        multiSegLine([{ text: "  2020 – 2021     ", color: Y, bold: true }, { text: "Junior Developer", color: W, bold: true }]),
        multiSegLine([{ text: "  ", color: W }, { text: "  Agency Inc  ·  ", color: DIM }, { text: "Full-time", color: G }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Delivered 15+ client websites.", color: W }]),
        multiSegLine([{ text: "    ", color: W }, { text: "Introduced TypeScript to the frontend stack.", color: W }]),
        blank(),
      ],
    };
  }

  if (trimmed === "contact") {
    return {
      lines: [
        blank(),
        line("  Get in Touch", C, true),
        line(`  ${"─".repeat(44)}`, DIM),
        blank(),
        multiSegLine([{ text: "  📧  ", color: Y }, { text: "rishupayne04@gmail.com", color: C }]),
        multiSegLine([{ text: "  💼  ", color: Y }, { text: "linkedin.com/in/sameer-srivastava-01a438371", color: C }]),
        multiSegLine([{ text: "  🐙  ", color: Y }, { text: "github.com/rishu-sriv", color: C }]),
        multiSegLine([{ text: "  📸  ", color: Y }, { text: "instagram.com/ft.rishu", color: C }]),
        blank(),
        line("  → Open the Safari window to send a message!", G),
        blank(),
      ],
    };
  }

  if (trimmed === "neofetch") {
    return {
      lines: [
        blank(),
        multiSegLine([{ text: "        ████████        ", color: G }, { text: "sameer", color: G, bold: true }, { text: "@", color: W }, { text: "portfolio", color: C, bold: true }]),
        multiSegLine([{ text: "       ██      ██       ", color: G }, { text: "─".repeat(21), color: DIM }]),
        multiSegLine([{ text: "      ██  ████  ██      ", color: G }, { text: "OS:       ", color: G }, { text: "Portfolio v1.0", color: W }]),
        multiSegLine([{ text: "     ██  ██  ██  ██     ", color: G }, { text: "Host:     ", color: G }, { text: "Browser / Next.js 14", color: W }]),
        multiSegLine([{ text: "    ████████████████    ", color: G }, { text: "Shell:    ", color: G }, { text: "zsh 5.9 (TerminalWindow)", color: W }]),
        multiSegLine([{ text: "   ██              ██   ", color: G }, { text: "Uptime:   ", color: G }, { text: "∞ (always available)", color: W }]),
        multiSegLine([{ text: "   ██  ████  ████  ██   ", color: G }, { text: "Packages: ", color: G }, { text: "42 (npm)", color: W }]),
        multiSegLine([{ text: "    ██  ██    ██  ██    ", color: G }, { text: "Skills:   ", color: G }, { text: "10 languages/frameworks", color: W }]),
        multiSegLine([{ text: "     ████      ████     ", color: G }, { text: "Projects: ", color: G }, { text: "6 shipped, many cooking", color: W }]),
        multiSegLine([{ text: "                        ", color: G }, { text: "Theme:    ", color: G }, { text: "macOS Dark [Custom]", color: W }]),
        multiSegLine([
          { text: "                        ", color: G },
          { text: "Colors:   ", color: G },
          { text: "█", color: "#ef4444" },
          { text: "█", color: "#f97316" },
          { text: "█", color: "#eab308" },
          { text: "█", color: "#22c55e" },
          { text: "█", color: "#3b82f6" },
          { text: "█", color: "#8b5cf6" },
          { text: "█", color: "#ec4899" },
          { text: "█", color: "#06b6d4" },
        ]),
        blank(),
      ],
    };
  }

  if (trimmed === "sudo" || trimmed.startsWith("sudo ")) {
    return {
      lines: [
        blank(),
        line(`  sudo: command not found: ${cmd.trim()}`, "#ef4444"),
        line("  Hint: try  sudo hire me  👀", Y),
        blank(),
      ],
    };
  }

  if (trimmed === "") {
    return { lines: [] };
  }

  return {
    lines: [
      blank(),
      line(`  zsh: command not found: ${cmd.trim()}`, "#ef4444"),
      line("  Type  help  to see available commands.", DIM),
      blank(),
    ],
  };
}

// ─── Confetti canvas ──────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rot: number;
  rotV: number;
}

function useConfetti(containerRef: React.RefObject<HTMLDivElement | null>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  const launch = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove old canvas
    if (canvasRef.current) {
      canvasRef.current.remove();
      cancelAnimationFrame(rafRef.current);
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:50;border-radius:inherit;";
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d")!;
    const colors = ["#4ade80","#60a5fa","#f472b6","#facc15","#c084fc","#fb923c","#34d399"];

    const particles: Particle[] = Array.from({ length: 140 }, () => ({
      x: canvas.width * Math.random(),
      y: -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 3,
      vy: 2.5 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2,
    }));

    let frame = 0;
    const TOTAL = 180;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.rot += p.rotV;
        const alpha = Math.max(0, 1 - (frame / TOTAL) * 0.6);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      frame++;
      if (frame < TOTAL) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        canvas.remove();
        canvasRef.current = null;
      }
    }
    rafRef.current = requestAnimationFrame(draw);
  }, [containerRef]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvasRef.current?.remove();
    };
  }, []);

  return launch;
}

// ─── Welcome banner ───────────────────────────────────────────────────────────

function welcomeBanner(): TerminalLine[] {
  return [
    line("  ███████╗ █████╗ ███╗   ███╗███████╗███████╗██████╗ ", G),
    line("  ██╔════╝██╔══██╗████╗ ████║██╔════╝██╔════╝██╔══██╗", G),
    line("  ███████╗███████║██╔████╔██║█████╗  █████╗  ██████╔╝", G),
    line("  ╚════██║██╔══██║██║╚██╔╝██║██╔══╝  ██╔══╝  ██╔══██╗", G),
    line("  ███████║██║  ██║██║ ╚═╝ ██║███████╗███████╗██║  ██║", G),
    line("  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝", G),
    blank(),
    multiSegLine([
      { text: "  Portfolio Terminal  ", color: W, bold: true },
      { text: "v1.0.0  ·  zsh 5.9  ·  macOS 14.0", color: DIM },
    ]),
    line("  Type  help  to see all available commands.", C),
    blank(),
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TerminalWindow() {
  const [lines, setLines] = useState<TerminalLine[]>(() => welcomeBanner());
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const launchConfetti = useConfetti(containerRef);

  // Auto-scroll to bottom when lines change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Focus input on click anywhere in terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const cmd = input;
    const { lines: responseLines, confetti, clear } = getResponse(cmd);

    // Append the typed command line
    const cmdLine: TerminalLine = {
      id: uid(),
      type: "input",
      segments: [
        { text: "sameer", color: G, bold: true },
        { text: "@", color: W },
        { text: "portfolio", color: C, bold: true },
        { text: ":~$ ", color: W },
        { text: cmd },
      ],
    };

    if (clear) {
      setLines([...welcomeBanner()]);
    } else {
      setLines((prev) => [...prev, cmdLine, ...responseLines]);
    }

    if (cmd.trim()) {
      setHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    }
    setHistoryIdx(-1);
    setInput("");

    if (confetti) {
      setTimeout(launchConfetti, 100);
    }
  }, [input, launchConfetti]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIdx = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx] ?? "");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = Math.max(historyIdx - 1, -1);
        setHistoryIdx(nextIdx);
        setInput(nextIdx === -1 ? "" : (history[nextIdx] ?? ""));
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const partial = input.toLowerCase();
        if (!partial) return;
        const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(partial));
        if (match) setInput(match);
        return;
      }

      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        const cmdLine: TerminalLine = {
          id: uid(),
          type: "input",
          segments: [
            { text: "rishu", color: G, bold: true },
            { text: "@", color: W },
            { text: "portfolio", color: C, bold: true },
            { text: ":~$ ", color: W },
            { text: input },
            { text: "^C", color: "#ef4444" },
          ],
        };
        setLines((prev) => [...prev, cmdLine]);
        setInput("");
        setHistoryIdx(-1);
        return;
      }

      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([...welcomeBanner()]);
        return;
      }
    },
    [input, history, historyIdx, handleSubmit]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full overflow-hidden"
      style={{ background: "#1e1e1e", fontFamily: "var(--font-mono)" }}
      onClick={focusInput}
    >
      {/* ── Scrollable output ─────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2 select-text"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
      >
        {lines.map((l) =>
          l.type === "blank" ? (
            <div key={l.id} style={{ height: "0.75em" }} />
          ) : (
            <div
              key={l.id}
              className="text-[13px] leading-[1.65] whitespace-pre-wrap break-words"
            >
              {l.segments.map((seg, i) => (
                <span
                  key={i}
                  style={{
                    color: seg.color ?? "#e2e8f0",
                    fontWeight: seg.bold ? 600 : 400,
                  }}
                >
                  {seg.text}
                </span>
              ))}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input row ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-center px-4 py-[10px] shrink-0"
        style={{
          borderTop: "1px solid #2a2a2a",
          background: "#1a1a1a",
        }}
      >
        {/* Prompt */}
        <span
          className="text-[13px] shrink-0 select-none"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span style={{ color: G, fontWeight: 600 }}>sameer</span>
          <span style={{ color: W }}>@</span>
          <span style={{ color: C, fontWeight: 600 }}>portfolio</span>
          <span style={{ color: W }}>:~$ </span>
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHistoryIdx(-1);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[13px] caret-green-400"
          style={{
            color: "#e2e8f0",
            fontFamily: "var(--font-mono)",
            caretColor: G,
          }}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />

        {/* Blinking cursor indicator (shown when input is empty) */}
        {input.length === 0 && (
          <span
            className="text-[13px] leading-none select-none"
            style={{
              color: G,
              animation: "termCursorBlink 1s step-end infinite",
              fontFamily: "var(--font-mono)",
            }}
          >
            ▋
          </span>
        )}
      </div>

      {/* Cursor blink keyframe (injected once) */}
      <style>{`
        @keyframes termCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
