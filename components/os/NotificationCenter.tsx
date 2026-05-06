"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Droplets, Pencil, Check } from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import type { WeatherData } from "@/types";

// ─── Weather widget ────────────────────────────────────────────────────────────

function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode, weatherCity, setWeatherCity } = useDesktopStore();

  const fetchWeather = useCallback((city: string) => {
    setLoading(true);
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setWeather(d);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchWeather(weatherCity);
  }, [weatherCity, fetchWeather]);

  const startEdit = () => {
    setCityInput(weatherCity);
    setEditingCity(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const submitCity = () => {
    const trimmed = cityInput.trim();
    if (trimmed && trimmed !== weatherCity) {
      setWeatherCity(trimmed);
    }
    setEditingCity(false);
  };

  const surface = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const border  = isDarkMode ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.08)";

  if (loading) {
    return (
      <div
        className="rounded-2xl p-4 flex items-center justify-center"
        style={{ background: surface, border: `1px solid ${border}`, minHeight: 100 }}
      >
        <div className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Loading weather…
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      {/* City + icon row */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-widest mb-1"
               style={{ color: "var(--text-tertiary)" }}>
            Weather
          </div>
          {editingCity ? (
            <form
              onSubmit={(e) => { e.preventDefault(); submitCity(); }}
              className="flex items-center gap-1"
            >
              <input
                ref={inputRef}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onBlur={submitCity}
                className="text-[14px] font-semibold rounded px-1.5 py-0.5 outline-none w-full"
                style={{
                  background: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--accent)",
                }}
                autoFocus
              />
              <button type="submit" style={{ color: "var(--accent)", flexShrink: 0 }}>
                <Check size={14} strokeWidth={2.5} />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {weather.city}
              </div>
              <button
                onClick={startEdit}
                style={{ color: "var(--text-tertiary)" }}
                title="Change city"
              >
                <Pencil size={11} strokeWidth={2} />
              </button>
            </div>
          )}
          <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            {weather.condition}
          </div>
        </div>
        <div className="text-[40px] leading-none select-none ml-2" aria-hidden>
          {getWeatherEmoji(weather.iconCode)}
        </div>
      </div>

      {/* Temperature */}
      <div className="mt-3 text-[36px] font-thin leading-none tracking-tight"
           style={{ color: "var(--text-primary)" }}>
        {weather.temperature}°<span className="text-[20px]">C</span>
      </div>

      {/* Humidity row */}
      <div className="mt-3 flex items-center gap-1.5 text-[12px]"
           style={{ color: "var(--text-tertiary)" }}>
        <Droplets size={12} strokeWidth={2} />
        <span>{weather.humidity}% humidity</span>
      </div>
    </div>
  );
}

function getWeatherEmoji(iconCode: string): string {
  const map: Record<string, string> = {
    "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
    "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
  };
  return map[iconCode.slice(0, 2)] ?? "🌤️";
}

// ─── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="relative shrink-0 rounded-full transition-colors"
      style={{
        width: 44,
        height: 26,
        background: on ? "var(--accent)" : "rgba(120,120,128,0.36)",
      }}
    >
      <motion.div
        className="absolute top-[3px] rounded-full shadow"
        style={{
          width: 20,
          height: 20,
          background: "#fff",
        }}
        animate={{ left: on ? 21 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ─── NotificationCenter ────────────────────────────────────────────────────────

export default function NotificationCenter() {
  const {
    isNotificationCenterOpen,
    setNotificationCenterOpen,
    isDarkMode,
    toggleDarkMode,
    isSpidermanVisible,
    toggleSpidermanVisible,
  } =
    useDesktopStore();

  // Close on Escape
  useEffect(() => {
    if (!isNotificationCenterOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotificationCenterOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isNotificationCenterOpen, setNotificationCenterOpen]);

  const panelBg = isDarkMode ? "rgba(28,28,30,0.92)" : "rgba(242,242,247,0.92)";
  const text    = isDarkMode ? "#f5f5f7" : "#1d1d1f";

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="nc-backdrop"
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationCenterOpen(false)}
          />

          {/* Panel */}
          <motion.aside
            key="nc-panel"
            className="fixed top-0 right-0 bottom-0 z-40 flex flex-col overflow-hidden"
            style={{
              width: 320,
              background: panelBg,
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderLeft: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              color: text,
              paddingTop: "var(--menubar-height)",
            }}
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[17px] font-semibold" style={{ color: text }}>
                Notification Center
              </h2>
              <button
                onClick={() => setNotificationCenterOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                style={{ background: "rgba(120,120,128,0.2)", color: "var(--text-secondary)" }}
                aria-label="Close"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-4">
              {/* ── Dark / Light Mode ───────────────────────────────────── */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{
                  background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: isDarkMode ? "#2c2c2e" : "#e5e5ea" }}
                  >
                    {isDarkMode
                      ? <Moon size={15} style={{ color: "#c084fc" }} />
                      : <Sun  size={15} style={{ color: "#f59e0b" }} />
                    }
                  </div>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: text }}>
                      {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      Appearance
                    </div>
                  </div>
                </div>
                <Toggle on={isDarkMode} onToggle={toggleDarkMode} />
              </div>

              {/* ── Weather ─────────────────────────────────────────────── */}
              <WeatherWidget />

              {/* ── Spider-Man Toggle ───────────────────────────────────── */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{
                  background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[16px]"
                    style={{ background: isDarkMode ? "#2c2c2e" : "#e5e5ea" }}
                    aria-hidden
                  >
                    🕷️
                  </div>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: text }}>
                      Spider-Man
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      Show / Hide decoration
                    </div>
                  </div>
                </div>
                <Toggle on={isSpidermanVisible} onToggle={toggleSpidermanVisible} />
              </div>

              {/* ── No notifications placeholder ─────────────────────────── */}
              <div className="mt-2">
                <div className="text-[11px] font-semibold uppercase tracking-widest mb-2 px-1"
                     style={{ color: "var(--text-tertiary)" }}>
                  Notifications
                </div>
                <div
                  className="rounded-2xl px-4 py-6 flex flex-col items-center gap-2 text-center"
                  style={{
                    background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <span className="text-[28px]" aria-hidden>🔕</span>
                  <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                    No new notifications
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
