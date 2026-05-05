import type { ProjectCategory } from "@/types";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  thumbnail: string;
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
}

export const PROJECTS: Project[] = [
  {
    id: "macos-portfolio",
    title: "macOS Portfolio",
    description: "A pixel-perfect macOS desktop experience built as a developer portfolio.",
    longDescription:
      "A fully interactive macOS-inspired portfolio that runs in the browser. Features a draggable, resizable window system, a magnifying dock, light/dark mode, animated wallpapers, a Spotlight-style search, and per-app windows — all built without any UI library.",
    techStack: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS", "Zustand"],
    thumbnail: "/projects/macos-portfolio.png",
    screenshots: ["/projects/macos-portfolio.png"],
    liveUrl: "https://rishu.dev",
    githubUrl: "https://github.com/rishu-sriv/macos-portfolio",
    category: "fullstack",
  },
  {
    id: "ai-chat-app",
    title: "AI Chat App",
    description: "Real-time chat with Claude via streaming responses and conversation history.",
    longDescription:
      "A production-grade chat interface powered by the Anthropic API. Supports streaming token-by-token responses, persistent conversation threads stored in PostgreSQL, markdown rendering, code syntax highlighting, and a clean two-panel layout.",
    techStack: ["React", "Node.js", "PostgreSQL", "Anthropic SDK", "Socket.io"],
    thumbnail: "/projects/ai-chat.png",
    screenshots: ["/projects/ai-chat.png"],
    liveUrl: "https://chat.rishu.dev",
    githubUrl: "https://github.com/rishu-sriv/ai-chat",
    category: "fullstack",
  },
  {
    id: "component-library",
    title: "React Component Library",
    description: "An accessible, themeable UI component library published to npm.",
    longDescription:
      "A zero-dependency React component library with 40+ components. Built with full WAI-ARIA accessibility compliance, CSS custom property theming, tree-shakeable ESM output, and comprehensive Storybook documentation. Bundled with Rollup and distributed via npm.",
    techStack: ["React", "TypeScript", "Rollup", "Storybook", "CSS Modules"],
    thumbnail: "/projects/component-lib.png",
    screenshots: ["/projects/component-lib.png"],
    githubUrl: "https://github.com/rishu-sriv/ui-kit",
    category: "frontend",
  },
  {
    id: "rest-api-platform",
    title: "REST API Platform",
    description: "Scalable microservices API with auth, rate limiting, and observability.",
    longDescription:
      "A production-ready REST API platform built with Node.js and Express. Includes JWT + refresh-token auth, per-route rate limiting via Redis, structured logging with Pino, distributed tracing with OpenTelemetry, and a Swagger UI for live documentation.",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "OpenTelemetry"],
    thumbnail: "/projects/rest-api.png",
    screenshots: ["/projects/rest-api.png"],
    githubUrl: "https://github.com/rishu-sriv/api-platform",
    category: "backend",
  },
  {
    id: "open-graph-gen",
    title: "OG Image Generator",
    description: "Serverless open-graph image generation from URL templates.",
    longDescription:
      "An open-source serverless function that generates Open Graph images on-the-fly from HTML templates. Supports custom fonts, dynamic text, gradient backgrounds, and caching via CDN. Used by 200+ developers on GitHub.",
    techStack: ["TypeScript", "Vercel Edge", "Satori", "Tailwind CSS"],
    thumbnail: "/projects/og-gen.png",
    screenshots: ["/projects/og-gen.png"],
    liveUrl: "https://og.rishu.dev",
    githubUrl: "https://github.com/rishu-sriv/og-gen",
    category: "open-source",
  },
  {
    id: "dashboard-analytics",
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with interactive charts and live data.",
    longDescription:
      "A data-intensive analytics dashboard for monitoring key product metrics. Features real-time WebSocket updates, 10+ chart types via Recharts, date-range filtering, CSV export, and a responsive layout. Connected to a TimescaleDB backend for time-series queries.",
    techStack: ["Next.js", "Recharts", "TimescaleDB", "WebSocket", "Tailwind CSS"],
    thumbnail: "/projects/dashboard.png",
    screenshots: ["/projects/dashboard.png"],
    liveUrl: "https://analytics.rishu.dev",
    githubUrl: "https://github.com/rishu-sriv/analytics-dash",
    category: "frontend",
  },
];
