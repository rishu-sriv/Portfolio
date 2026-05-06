"use client";

import { ExternalLink } from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────

export default function SafariWindow() {
  return (
    <div
      className="h-full w-full flex items-center justify-center p-6"
      style={{ background: "#efefef" }}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl px-8 py-10"
        style={{
          background: "rgba(255,255,255,0.25)",
          border: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          className="text-[42px] font-extrabold leading-none text-center"
          style={{ color: "#0a4f90" }}
        >
          Get in Touch
        </h2>
        <p
          className="text-center mt-4 text-[20px]"
          style={{ color: "#5c5c5c" }}
        >
          Feel free to reach out to me below.
        </p>

        <div className="mt-9 flex flex-col gap-4">
          <a
            href="https://github.com/rishu-sriv"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg h-[56px] flex items-center justify-center gap-3 text-[30px] font-bold transition-opacity"
            style={{ background: "#1f2634", color: "#ffffff", textDecoration: "none" }}
          >
            <ExternalLink size={28} />
            GitHub Profile
          </a>

          <a
            href="https://www.linkedin.com/in/sameer-srivastava-01a438371/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg h-[56px] flex items-center justify-center gap-3 text-[30px] font-bold transition-opacity"
            style={{ background: "#137cb0", color: "#ffffff", textDecoration: "none" }}
          >
            <ExternalLink size={28} />
            LinkedIn Profile
          </a>
        </div>
      </div>
    </div>
  );
}
