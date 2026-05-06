# macOS Portfolio — Sameer Srivastava

An interactive macOS-style portfolio built with Next.js 14, featuring a real desktop environment: draggable windows, a working Dock, Spotlight search, dark mode, a Guestbook, and a Safari-like browser.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand (with `persist`) |
| Database | MongoDB via Mongoose |
| Email | Resend (optional) |
| Music | Spotify Embed |
| Weather | OpenWeatherMap API |
| Deployment | Vercel |

---

## Features

- **Desktop OS shell** — draggable/resizable windows, Dock with magnification, menu bar, Spotlight search
- **Safari window** — server-side proxy strips X-Frame-Options so real websites load inside the iframe
- **Finder** — project showcase with category filtering
- **Terminal** — animated skill proficiency display
- **About Me** — slide-based presentation (Intro, Skills, Experience, Education, Fun Facts)
- **Guestbook** — school autograph book aesthetic; persists to MongoDB with localStorage fallback
- **Spotify** — embedded Spotify playlists, no auth required
- **Weather widget** — live data from OpenWeatherMap, city editable in-app
- **Dark / light mode** — system-aware, persisted across sessions
- **Boot screen** — macOS-style loading animation with startup chime

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/macos-portfolio.git
cd macos-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local` — see the [Environment Variables](#environment-variables) section below.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Optional | MongoDB Atlas connection string. Without it the Guestbook uses localStorage only. |
| `OPENWEATHER_API_KEY` | Recommended | Free-tier key from [openweathermap.org](https://openweathermap.org/api). Without it the weather widget shows a placeholder. |
| `WEATHER_CITY` | Optional | Default city for the weather widget (e.g. `Mumbai`). Users can override it in-app. |
| `RESEND_API_KEY` | Optional | [Resend](https://resend.com) API key for forwarding contact-form submissions to your email. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Full URL of your deployed site — used for Open Graph meta tags. |

### Getting API keys

**MongoDB Atlas (free)**
1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Add a database user and whitelist `0.0.0.0/0` (or Vercel's IPs)
4. Copy the connection string and replace `<password>` with your database user's password

**OpenWeatherMap (free)**
1. Create an account at [openweathermap.org](https://openweathermap.org)
2. Go to API Keys and generate a key
3. The free tier gives 1,000 calls/day — more than enough

**Resend (optional, free)**
1. Create an account at [resend.com](https://resend.com)
2. Verify your sending domain or use the sandbox `onboarding@resend.dev` address
3. Copy your API key

---

## Deployment on Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/macos-portfolio)

### Manual deploy

1. Push your code to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in **Project Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js and runs `npm run build`

> **Region:** `vercel.json` sets the serverless region to `bom1` (Mumbai). Change this in `vercel.json` to whatever is closest to your audience.

---

## Project Structure

```
app/
  api/
    browser/        # Server-side proxy — strips X-Frame-Options for Safari window
    comments/       # Guestbook CRUD (GET, POST, DELETE /:id)
    contact/        # Contact form — saves to DB + optional Resend email
    weather/        # OpenWeatherMap proxy with city override
  page.tsx          # Entry point — boot screen → desktop shell
  layout.tsx        # Root layout, metadata, fonts

components/
  os/               # Desktop shell, Dock, MenuBar, Spotlight, NotificationCenter, Launchpad
  windows/          # App windows (About, Finder, Terminal, Safari, Guestbook, Spotify…)
  mobile/           # Responsive fallback for small screens

store/
  useDesktopStore.ts  # Global UI state (dark mode, wallpaper, open apps, weather city)
  useWindowStore.ts   # Per-window state (position, size, z-index)

models/             # Mongoose schemas (Comment, Contact)
lib/                # mongodb.ts connection helper, projects data
types/              # Shared TypeScript types
```

---

## License

MIT
