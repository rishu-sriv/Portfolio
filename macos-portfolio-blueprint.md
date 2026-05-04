# 🍎 macOS-Inspired Portfolio — Claude Code Build Blueprint

> **Goal:** Build a full-stack, macOS-inspired browser portfolio that mimics a real desktop OS.
> Built phase-by-phase using Claude Code. Each phase = a learning block with clear inputs, outputs, and skills gained.

---

## 🗺️ Project Overview

```
Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · MongoDB
Deploy: Vercel + MongoDB Atlas
Theme: macOS Sequoia — frosted glass, blur, dock, menu bar, spotlight
```

---

## 📦 Building Block Map

```
PHASE 1 → Project Foundation
PHASE 2 → macOS Shell (Menu Bar + Desktop + Dock)
PHASE 3 → Window System (drag, resize, minimize, z-index)
PHASE 4 → App Windows (Finder, Terminal, About, Projects)
PHASE 5 → Backend & Database (comments, contact, weather)
PHASE 6 → Spotlight Search + Launchpad
PHASE 7 → Polish (sounds, animations, boot screen, mobile fallback)
PHASE 8 → Deploy
```

---

## ✅ PHASE 1 — Project Foundation

### 🎯 Goal
Set up the repo, tooling, folder structure, and design tokens before writing a single UI component.

### 📋 Claude Code Prompt
```
Create a new Next.js 14 app with TypeScript, Tailwind CSS, and ESLint.
Configure the following:
- App Router (not Pages Router)
- Tailwind with a custom theme that has macOS-style variables: blur, glassmorphism, system fonts (-apple-system)
- Folder structure:
  /app         → Next.js routes
  /components  → UI components
    /os        → OS chrome (dock, menu bar, desktop)
    /windows   → Individual app windows
    /ui        → Reusable primitives (button, icon, etc.)
  /store       → Zustand state
  /lib         → Utilities and API helpers
  /types       → TypeScript interfaces
  /public      → Static assets, wallpapers, icons
- Install: framer-motion, zustand, mongoose, lucide-react
- Set up a global CSS file with macOS-inspired CSS variables:
  --glass-bg, --glass-border, --blur-amount, --dock-height, --menubar-height
```

### 🧠 Learning Block 1
| Concept | What You Learn |
|---|---|
| Next.js App Router | File-based routing, layout.tsx, page.tsx hierarchy |
| TypeScript setup | tsconfig, strict mode, path aliases (`@/components`) |
| Tailwind config | Extending theme, custom CSS variables |
| Folder architecture | Feature-based vs layer-based structure |
| Package management | npm workspaces, devDependencies vs dependencies |

### ✅ Done When
- [ ] `npm run dev` runs without errors
- [ ] Tailwind classes work
- [ ] Folder structure exists as planned
- [ ] TypeScript compiles clean

---

## ✅ PHASE 2 — macOS Shell (Desktop + Menu Bar + Dock)

### 🎯 Goal
Build the static skeleton of the OS — the three layers of macOS: menu bar (top), desktop (middle), dock (bottom).

### 📋 Claude Code Prompt
```
Build the macOS OS shell with three layers:

1. MenuBar (top, fixed, 28px tall)
   - Left: Apple logo icon + app name ("Finder")
   - Center: current time (updates every second using useEffect)
   - Right: icons for wifi, battery (static), volume (static)
   - Frosted glass background: backdrop-filter: blur(20px), semi-transparent white/dark
   - Responds to a global isDarkMode boolean from Zustand store

2. Desktop (middle, fills remaining space)
   - Background wallpaper (use a gradient or image from /public/wallpapers/)
   - Right-click context menu with options: "Change Wallpaper", "About This Mac"
   - Wallpapers should cycle through an array stored in Zustand

3. Dock (bottom, fixed, centered)
   - Horizontal row of app icons (64px each)
   - macOS magnification effect on hover using Framer Motion (icons scale up to 80px, neighbors scale to 72px)
   - Tooltip showing app name above icon on hover
   - Separator line between main apps and trash/special icons
   - Frosted glass pill background

Use Zustand to manage:
  - isDarkMode (boolean)
  - currentWallpaper (string)
  - openApps (array of app IDs)

All components must be in TypeScript with proper interfaces.
```

### 🧠 Learning Block 2
| Concept | What You Learn |
|---|---|
| CSS backdrop-filter | How glassmorphism / frosted glass works |
| Framer Motion basics | `whileHover`, `animate`, `variants`, `motion.div` |
| Zustand store | Creating a store, slices, reading and writing state |
| useEffect + setInterval | Keeping the clock ticking without memory leaks |
| z-index layering | How to stack OS layers correctly (menubar > windows > desktop) |
| CSS custom properties | Using variables for theming dark/light mode |

### ✅ Done When
- [ ] Menu bar shows time, updates every second
- [ ] Desktop renders with wallpaper
- [ ] Right-click context menu appears on desktop
- [ ] Dock renders with icons
- [ ] Dock magnification works on hover
- [ ] Dark mode toggle switches the whole shell

---

## ✅ PHASE 3 — Window System (Core OS Engine)

### 🎯 Goal
Build the draggable, resizable, focusable window system — the heart of the OS. Every app will live inside a Window.

### 📋 Claude Code Prompt
```
Build a reusable <Window> component that mimics macOS windows:

Props interface:
  id: string
  title: string
  icon: string (path to icon)
  defaultPosition: { x: number, y: number }
  defaultSize: { width: number, height: number }
  minSize: { width: number, height: number }
  children: React.ReactNode
  onClose: () => void
  onMinimize: () => void

Features:
1. Traffic light buttons (top-left):
   - Red (close): calls onClose
   - Yellow (minimize): calls onMinimize — window slides to dock with Framer Motion
   - Green (fullscreen): toggles maximized state (fills desktop area)

2. Drag to move:
   - Draggable by the title bar only
   - Use Framer Motion drag with dragConstraints set to the desktop area
   - Position tracked in Zustand windowStore

3. Click to focus:
   - Clicking any window brings it to front (z-index)
   - Active window has a slightly brighter title bar
   - Zustand store tracks focusedWindowId and zIndexMap

4. Title bar:
   - macOS style: blurred, centered title text, icon left of title
   - Double-click to maximize/restore

5. Window body:
   - Scrollable content area
   - Frosted glass or solid background depending on app type

Create a useWindowStore (Zustand) with:
  windows: Record<string, WindowState>
  openWindow(id, config): void
  closeWindow(id): void
  minimizeWindow(id): void
  focusWindow(id): void
  updatePosition(id, pos): void
```

### 🧠 Learning Block 3
| Concept | What You Learn |
|---|---|
| Framer Motion `drag` | Constrained drag, `dragMomentum`, `dragElastic` |
| z-index management | Dynamic z-index with a counter in global state |
| Compound components | Window = TitleBar + TrafficLights + Body as sub-components |
| Zustand with actions | Writing action functions inside a Zustand store |
| React children pattern | Passing arbitrary children into a shell component |
| CSS resize | Native vs custom resize handles |

### ✅ Done When
- [ ] Windows can be dragged anywhere on the desktop
- [ ] Traffic lights work (close, minimize, maximize)
- [ ] Clicking a window focuses it (brings to front)
- [ ] Multiple windows can be open simultaneously
- [ ] Minimized windows animate down to the dock

---

## ✅ PHASE 4 — App Windows (Your Portfolio Content)

### 🎯 Goal
Build the actual apps that live inside your window system. These carry your real portfolio content.

---

### 4A — About Me (Slides App)

#### 📋 Claude Code Prompt
```
Build an AboutWindow component that renders inside the <Window> shell.
It should look like a presentation/slides app with:
- Left sidebar: slide navigator (small thumbnails of each slide)
- Main area: current slide rendered large
- Bottom: prev/next navigation arrows + slide counter
- Keyboard arrow keys also navigate slides

Slides content (hardcode for now):
  1. Intro: Name, title, one-liner, avatar image
  2. Skills: Grid of tech logos with labels (React, TypeScript, Node, etc.)
  3. Experience: Timeline component (vertical line, dots, company + role + dates)
  4. Education: Same timeline style
  5. Fun Facts: 3-4 cards with icons and short text

Use Framer Motion AnimatePresence for slide transitions (slide in from right, out to left).
```

#### 🧠 Learning Block 4A
| Concept | What You Learn |
|---|---|
| AnimatePresence | Exit animations, `mode="wait"` |
| Keyboard events | `useEffect` + `window.addEventListener("keydown")` |
| Compound layout | Sidebar + main panel with CSS Grid |

---

### 4B — Finder (Projects Browser)

#### 📋 Claude Code Prompt
```
Build a FinderWindow component that mimics macOS Finder:

Left sidebar (Collections):
  - "All Projects", "Frontend", "Backend", "Full Stack", "Open Source"
  - Clicking filters the projects shown

Main area (Grid view by default, List view toggle):
  - Project cards: thumbnail image, name, tech tags, brief description
  - Hover: show "Open" and "GitHub" icon buttons
  - Click: opens a project detail sheet (slides up from bottom of window)

Project detail sheet:
  - Full description, tech stack chips, screenshots, links (Live + GitHub)
  - Close button slides it back down

Projects data: hardcode an array of 4-6 projects in /lib/projects.ts with this interface:
  id, title, description, techStack[], thumbnail, liveUrl, githubUrl, category

Toolbar (top of window):
  - Back/Forward navigation buttons
  - View toggle (grid / list)
  - Search input that filters projects by name
```

#### 🧠 Learning Block 4B
| Concept | What You Learn |
|---|---|
| Data filtering in React | useState + .filter() pattern |
| TypeScript interfaces | Defining a Project type and using it everywhere |
| Sheet/drawer UI | Positioning a panel inside a scrollable container |
| Search UX | Debouncing with useEffect or a library |

---

### 4C — Terminal (Interactive Skills App)

#### 📋 Claude Code Prompt
```
Build a TerminalWindow component that looks and feels like macOS Terminal:

Visual:
  - Dark background (#1e1e1e), monospace font (JetBrains Mono or system-mono)
  - Green or white text
  - Shows: username@portfolio:~$ as the prompt
  - Input field at the bottom, output scrolls up

Supported commands (hardcode responses):
  help          → lists all commands
  whoami        → prints a short bio
  skills        → prints a formatted table of your skills and levels
  projects      → prints a list of your projects with links
  experience    → prints work history
  contact       → prints contact info / links
  clear         → clears the terminal
  sudo hire me  → easter egg — launches confetti animation
  neofetch      → prints a fake system info panel (name, OS: Portfolio v1.0, skills count, etc.)

Behavior:
  - Command history: up/down arrow keys cycle through previous commands
  - Tab completion: pressing Tab autocompletes partial command names
  - Auto-scroll to bottom when new output is added
  - Cursor blinks using CSS animation
```

#### 🧠 Learning Block 4C
| Concept | What You Learn |
|---|---|
| Controlled input | Capturing Enter key, clearing input on submit |
| useRef for scroll | `scrollIntoView` pattern for auto-scroll |
| Command pattern | Map of command strings to handler functions |
| CSS animations | Blinking cursor with `@keyframes` |
| Array as history | Stack operations on state arrays |

---

### 4D — Safari (Contact / Browser Window)

#### 📋 Claude Code Prompt
```
Build a SafariWindow component that mimics macOS Safari:

Address bar at top:
  - Shows current "URL" (fake: portfolio://contact)
  - Back/forward/refresh buttons (mostly decorative)
  - Reload spins with Framer Motion on click

Content area:
  - Renders a Contact form with:
      Name (text input)
      Email (email input)
      Message (textarea)
      Send button
  - On submit: POST to /api/contact (Next.js API route, build in Phase 5)
  - Success state: shows a confirmation animation
  - Social links section below the form: GitHub, LinkedIn, Twitter/X icons

The window should feel like a real browser — tab bar at top showing one tab with a favicon.
```

---

## ✅ PHASE 5 — Backend & Database (Full Stack Layer)

### 🎯 Goal
Add real backend features: storing visitor messages, fetching live weather, and an API layer.

### 📋 Claude Code Prompt — MongoDB Setup
```
Set up MongoDB with Mongoose in this Next.js app:
- Create /lib/mongodb.ts — a singleton connection helper that caches the connection in development
- Create /models/Comment.ts — Mongoose schema:
    name: string (required)
    message: string (required)
    avatar: string (auto-generated URL from DiceBear API based on name)
    createdAt: Date (default: now)
- Create /models/Contact.ts — same structure + email field

Create these Next.js API routes:

GET  /api/comments     → fetch all comments, sorted newest first, limit 20
POST /api/comments     → create a new comment, auto-generate avatar URL
POST /api/contact      → save contact message to DB + (optional) send email via Resend API

Use environment variables:
  MONGODB_URI          → MongoDB Atlas connection string
  RESEND_API_KEY       → (optional, for email)
```

### 📋 Claude Code Prompt — Weather Widget
```
Create a weather widget that lives in the macOS Notification Center (right slide-out panel):
- Fetch weather server-side using Next.js Route Handler (GET /api/weather)
- Call OpenWeatherMap API with city name from env: WEATHER_CITY
- Return: temperature, condition, humidity, icon code
- Cache the response for 10 minutes using Next.js fetch cache: { next: { revalidate: 600 } }
- Widget UI: city name, temperature in °C, weather icon, condition text, humidity %
- Notification Center slides in from the right when clicking the clock/date in menu bar
```

### 📋 Claude Code Prompt — Guestbook/Comments Widget
```
Build a GuestbookWindow app that:
- Shows a scrollable list of visitor comments with DiceBear avatars
- Has a form at bottom: name + message, POST to /api/comments on submit
- Optimistic UI: add comment to list immediately before API confirms
- Animate new comments in with Framer Motion (fade + slide from bottom)
- Show "Be the first to leave a message!" if no comments exist
```

### 🧠 Learning Block 5
| Concept | What You Learn |
|---|---|
| Next.js API Routes | Route Handlers in App Router (`route.ts`) |
| MongoDB + Mongoose | Schema, model, connect, CRUD operations |
| Environment variables | `.env.local`, `process.env`, Vercel env config |
| Server-side fetching | Fetch in a Route Handler, caching strategies |
| Optimistic UI | Updating UI before server confirms |
| CORS & API security | Why API routes are safer than client-side fetch for secrets |

### ✅ Done When
- [ ] `POST /api/comments` saves to MongoDB Atlas
- [ ] `GET /api/comments` returns stored comments
- [ ] `GET /api/weather` returns live weather (cached)
- [ ] Contact form submits and saves message
- [ ] Guestbook shows real stored comments

---

## ✅ PHASE 6 — Spotlight Search + Launchpad

### 📋 Claude Code Prompt — Spotlight
```
Build a Spotlight Search overlay triggered by Cmd+Space (or clicking the search icon in dock):

UI:
  - Full screen dark overlay (50% opacity)
  - Centered frosted glass search box (macOS Spotlight style)
  - Search input auto-focused
  - Results appear below as you type (no button needed)

Search index (static data):
  - Apps: { type: "app", name, icon, action: () => openWindow(id) }
  - Projects: { type: "project", name, description, action: () => openFinderAtProject(id) }
  - Skills: { type: "skill", name, action: () => openTerminal("skills") }
  - Links: { type: "link", name, url }

Behavior:
  - Filter results as user types (fuzzy match on name)
  - Arrow keys navigate results, Enter selects
  - Esc closes overlay
  - Show category headers ("Applications", "Projects", "Skills")
  - First result is always highlighted
```

### 📋 Claude Code Prompt — Launchpad
```
Build a Launchpad overlay triggered by a dock icon or F4 key:
- Full screen frosted glass overlay
- Grid of app icons (all available apps)
- Icons wiggle on long press (like real iOS/macOS Launchpad)
- Search bar at top that filters apps
- Clicking an app icon opens that app's window and closes Launchpad
- Animate in: icons scale from 0.5 to 1 with staggered delay (Framer Motion staggerChildren)
- Animate out: reverse stagger
```

### 🧠 Learning Block 6
| Concept | What You Learn |
|---|---|
| Global keyboard shortcuts | `useEffect` + `keydown` with metaKey detection |
| Fuzzy search | Simple includes() vs fuse.js library |
| Staggered animations | Framer Motion `staggerChildren` in `variants` |
| Portal rendering | Rendering overlays outside the DOM tree with `createPortal` |
| Focus management | Auto-focus input, trap focus inside modal |

---

## ✅ PHASE 7 — Polish Layer

### Boot Screen
```
Add a boot/login screen that plays on first load:
- Dark screen with Apple logo (or your logo) that fades in
- Progress bar fills over 2 seconds
- Then animates out revealing the desktop
- Store "hasBooted" in sessionStorage so it only plays once per tab session
```

### Sounds
```
Add optional UI sounds (user can mute via menu bar toggle):
- Window open: soft pop
- Window close: whoosh
- Dock icon click: click sound
- Notification: macOS notification chime

Use the Web Audio API or small .mp3 files in /public/sounds/
Create a useSoundStore (Zustand) with isMuted toggle
Create a useSound(soundName) hook
```

### Mobile Fallback
```
On screens < 768px, do not render the OS shell.
Instead render a clean, minimal mobile portfolio:
- Name, title, one-liner
- Skills section
- Projects grid
- Contact form
Use Next.js useMediaQuery or CSS media queries to switch between OS mode and mobile mode.
```

### 🧠 Learning Block 7
| Concept | What You Learn |
|---|---|
| sessionStorage | Persisting state across page refreshes (not across tabs) |
| Web Audio API | Playing sounds programmatically |
| Responsive design | Mobile-first vs desktop-first strategy |
| Animation sequencing | Chaining animations with Framer Motion `useAnimate` |

---

## ✅ PHASE 8 — Deploy

### 📋 Claude Code Prompt
```
Prepare this Next.js app for production deployment on Vercel:

1. Create a .env.example file listing all required environment variables:
   MONGODB_URI=
   OPENWEATHER_API_KEY=
   WEATHER_CITY=
   RESEND_API_KEY=       (optional)
   NEXT_PUBLIC_SITE_URL=

2. Add a vercel.json if any special config is needed

3. Create a README.md with:
   - Project overview and screenshot
   - Tech stack
   - Local setup instructions
   - Environment variable guide
   - Deployment steps

4. Run next build and fix any TypeScript or ESLint errors that appear.
```

### 🧠 Learning Block 8
| Concept | What You Learn |
|---|---|
| Vercel deployment | Connecting GitHub → Vercel, auto-deploy on push |
| MongoDB Atlas | Creating a free cluster, whitelisting Vercel IPs |
| Environment variables | Local vs production, `NEXT_PUBLIC_` prefix rules |
| Build errors | Reading Next.js build output, fixing type errors |
| Domain setup | Connecting a custom domain on Vercel |

---

## 🗃️ Full Learning Map Summary

| Phase | Core Skills |
|---|---|
| 1 — Foundation | Next.js, TypeScript, Tailwind, project architecture |
| 2 — OS Shell | Framer Motion, Zustand, glassmorphism CSS, dark mode |
| 3 — Window System | Drag & drop, z-index, compound components, state management |
| 4A — About | AnimatePresence, keyboard events, slide UI |
| 4B — Finder | Data filtering, TypeScript types, search UX |
| 4C — Terminal | Controlled input, command pattern, scroll refs, CSS animations |
| 4D — Safari | Forms, API integration, browser-in-browser UI |
| 5 — Backend | Next.js API routes, MongoDB, env vars, caching, optimistic UI |
| 6 — Spotlight/Launchpad | Global shortcuts, fuzzy search, portals, stagger animations |
| 7 — Polish | Boot screen, sounds, mobile fallback, animation sequencing |
| 8 — Deploy | Vercel, MongoDB Atlas, production env, build pipeline |

---

## 🧩 What Exists After You Build This

| Feature | Status |
|---|---|
| macOS Desktop shell | ✅ Built |
| Dock with magnification | ✅ Built |
| Menu bar with clock + dark mode | ✅ Built |
| Draggable/resizable windows | ✅ Built |
| About Me slides | ✅ Built |
| Projects Finder | ✅ Built |
| Interactive Terminal | ✅ Built |
| Contact form (with DB) | ✅ Built |
| Guestbook comments (with DB) | ✅ Built |
| Live weather widget | ✅ Built |
| Spotlight Search | ✅ Built |
| Launchpad grid | ✅ Built |
| Boot screen animation | ✅ Built |
| Mobile fallback | ✅ Built |
| Deployed on Vercel | ✅ Built |

---

## 🚀 What You Should Add Next (Post-Launch)

| Feature | Why It's Worth Adding |
|---|---|
| **Spotlight with real search** (Fuse.js) | True fuzzy matching — impressive UX detail |
| **iMessage-style Chat** (WebSockets) | Shows real-time backend skills (Socket.io) |
| **Blog window** (MDX) | Demonstrates content rendering + SEO |
| **GitHub activity feed** | Live API integration with GitHub's public API |
| **Resume PDF viewer** | Embeds your resume inside a "Preview" app window |
| **Multi-user cursor** (Liveblocks/Partykit) | Multiplayer — visitors see each other's cursors |
| **Spotify Now Playing widget** | OAuth flow, real-time API polling |
| **Storybook component library** | Documents every component (what vovacodes used) |
| **E2E tests** (Playwright) | Tests that window drag, dock, spotlight work |
| **i18n** (next-intl) | Multi-language support — good for international roles |

---

## 💡 Tips for Using This with Claude Code

1. **Do one phase at a time.** Paste each Claude Code prompt separately and review before moving on.
2. **After each phase**, run `npm run build` to catch type errors early.
3. **Commit after each phase.** Use git branches per phase: `git checkout -b phase-2-shell`
4. **For icons**, use the macOS-style icon set from [macOSicons.com](https://macosicons.com) (free) or Lucide React icons as placeholders.
5. **For wallpapers**, use [Dynamic Wallpaper Club](https://dynamicwallpaper.club/) or generate with your own images.
6. **MongoDB Atlas free tier** is more than enough for a portfolio project.

---

*Built with ❤️ using Next.js · TypeScript · Framer Motion · Zustand · MongoDB*
