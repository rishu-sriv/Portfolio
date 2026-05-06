"use client";

import { useState, FormEvent } from "react";
import { PROJECTS } from "@/lib/projects";
import { ExternalLink, Mail, Send, CheckCircle } from "lucide-react";

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SKILLS = [
  "LLMs / RAG", "Python", "FastAPI", "Redis",
  "PostgreSQL", "React", "Next.js", "TypeScript",
  "Qdrant", "LangChain", "Celery", "Docker",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar() {
  return (
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold select-none flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 8px 32px rgba(102,126,234,0.45)",
        color: "#fff",
      }}
    >
      RS
    </div>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Colour header based on category */}
      <div
        className="h-[3px]"
        style={{
          background:
            project.category === "fullstack"
              ? "linear-gradient(90deg, #667eea, #764ba2)"
              : project.category === "frontend"
              ? "linear-gradient(90deg, #43e97b, #38f9d7)"
              : project.category === "backend"
              ? "linear-gradient(90deg, #4facfe, #00f2fe)"
              : "linear-gradient(90deg, #f093fb, #f5576c)",
        }}
      />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            {project.title}
          </h3>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(41,151,255,0.15)",
              color: "#2997ff",
              border: "1px solid rgba(41,151,255,0.25)",
            }}
          >
            {project.category}
          </span>
        </div>

        <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "var(--text-tertiary)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "var(--text-tertiary)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-medium"
              style={{ color: "#2997ff" }}
            >
              <ExternalLink size={12} />
              Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              <GithubIcon size={12} />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "var(--text-primary)",
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
    WebkitTapHighlightColor: "transparent",
  };

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center gap-3 py-10 text-center"
        style={{ color: "var(--text-primary)" }}
      >
        <CheckCircle size={40} style={{ color: "#30d158" }} />
        <p className="text-lg font-semibold">Message sent!</p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 px-5 py-2 rounded-full text-sm font-medium"
          style={{ background: "rgba(41,151,255,0.15)", color: "#2997ff" }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        style={inputStyle}
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
        autoComplete="name"
      />
      <input
        style={inputStyle}
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
        autoComplete="email"
      />
      <textarea
        style={{ ...inputStyle, resize: "none", minHeight: 110 }}
        placeholder="What's on your mind?"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        required
        rows={4}
      />
      {status === "error" && (
        <p className="text-[13px]" style={{ color: "#ff453a" }}>
          {errMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-white transition-opacity"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: status === "loading" ? 0.6 : 1,
          fontSize: 15,
        }}
      >
        <Send size={16} />
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MobilePortfolio() {
  return (
    <div
      className="min-h-screen w-full selectable"
      style={{
        background: "linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 40%, #0d0d1a 100%)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-system)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{
          height: 52,
          background: "rgba(13,13,26,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="font-bold text-[15px]" style={{ color: "#f5f5f7" }}>
          Rishu<span style={{ color: "#667eea" }}>.</span>
        </span>
        <div className="flex gap-5">
          {["Skills", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[13px] font-medium"
              style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center text-center px-6 pt-[96px] pb-16 gap-5"
        style={{ minHeight: "100dvh", justifyContent: "center" }}
      >
        <Avatar />

        <div className="space-y-1">
          <h1
            className="text-[34px] font-bold tracking-tight leading-tight"
            style={{ color: "#f5f5f7" }}
          >
            Rishu Srivastava
          </h1>
          <p className="text-[17px] font-medium" style={{ color: "#667eea" }}>
            Full-Stack Developer &amp; AI Automation Engineer
          </p>
        </div>

        <p
          className="text-[15px] leading-relaxed max-w-[320px]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          I build scalable web and AI-driven products with a focus on performance, accessibility, and practical automation.
        </p>

        {/* Quick tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {["React", "FastAPI", "TypeScript", "AI Automation"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[13px] font-medium"
              style={{
                background: "rgba(102,126,234,0.15)",
                color: "#a78bfa",
                border: "1px solid rgba(102,126,234,0.25)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="mt-2 px-8 py-3 rounded-full font-semibold text-white text-[15px]"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(102,126,234,0.35)",
          }}
        >
          Get in touch
        </a>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────────────── */}
      <section id="skills" className="px-5 pb-16">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2
            className="text-[22px] font-bold mb-5"
            style={{ color: "#f5f5f7" }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────────────────────────── */}
      <section id="projects" className="px-5 pb-16">
        <h2
          className="text-[22px] font-bold mb-5"
          style={{ color: "#f5f5f7" }}
        >
          Projects
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="px-5 pb-20">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2
            className="text-[22px] font-bold mb-1"
            style={{ color: "#f5f5f7" }}
          >
            Contact
          </h2>
          <p className="text-[14px] mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
            Let&apos;s build something together.
          </p>
          <ContactForm />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer
        className="pb-10 flex flex-col items-center gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}
      >
        <div className="flex gap-6">
          <a
            href="https://github.com/rishu-sriv"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <GithubIcon size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/sameer-srivastava-01a438371/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <LinkedinIcon size={20} />
          </a>
          <a
            href="https://www.instagram.com/ft.rishu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <InstagramIcon size={20} />
          </a>
          <a
            href="mailto:rishupayne04@gmail.com"
            aria-label="Email"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <Mail size={20} />
          </a>
        </div>
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          © 2026 Sameer Srivastava
        </p>
      </footer>
    </div>
  );
}
