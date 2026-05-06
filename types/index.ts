// ─── OS / Window Types ────────────────────────────────────────────────────────

export type AppId =
  | "finder"
  | "terminal"
  | "safari"
  | "calculator"
  | "about"
  | "guestbook"
  | "launchpad"
  | "spotlight"
  | "spotify";

export interface AppConfig {
  id: AppId;
  name: string;
  icon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
}

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

// ─── Desktop Types ────────────────────────────────────────────────────────────

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

// ─── Project Types ────────────────────────────────────────────────────────────

export type ProjectCategory =
  | "all"
  | "frontend"
  | "backend"
  | "fullstack"
  | "open-source";

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
}

// ─── Guestbook Types ──────────────────────────────────────────────────────────

export interface Comment {
  _id: string;
  name: string;
  message: string;
  avatar: string;
  inkColor?: string | null;
  createdAt: string;
}

// ─── Weather Types ────────────────────────────────────────────────────────────

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  iconCode: string;
}

// ─── Spotlight Types ──────────────────────────────────────────────────────────

export type SpotlightResultType = "app" | "project" | "skill" | "link";

export interface SpotlightResult {
  type: SpotlightResultType;
  name: string;
  description?: string;
  icon?: string;
  action: () => void;
}
