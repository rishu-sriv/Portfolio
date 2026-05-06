"use client";

import { useState } from "react";

const KEYS = [
  ["⌫", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["◎", "0", ".", "="],
];

export default function CalculatorWindow() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const current = Number(display);

  const apply = (a: number, b: number, operator: string) => {
    if (operator === "+") return a + b;
    if (operator === "−") return a - b;
    if (operator === "×") return a * b;
    if (operator === "÷") return b === 0 ? 0 : a / b;
    return b;
  };

  const onKey = (k: string) => {
    if (k >= "0" && k <= "9") {
      if (fresh) {
        setDisplay(k);
        setFresh(false);
      } else {
        setDisplay((d) => (d === "0" ? k : d + k));
      }
      return;
    }

    if (k === ".") {
      setDisplay((d) => (fresh ? "0." : d.includes(".") ? d : d + "."));
      setFresh(false);
      return;
    }

    if (k === "C") {
      setDisplay("0");
      setAcc(null);
      setOp(null);
      setFresh(true);
      return;
    }

    if (k === "⌫") {
      setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
      return;
    }

    if (k === "+/-") {
      setDisplay(String(current * -1));
      return;
    }

    if (k === "%") {
      setDisplay(String(current / 100));
      return;
    }

    if (k === "=") {
      if (acc !== null && op) {
        const out = apply(acc, current, op);
        setDisplay(String(Number(out.toFixed(8))));
        setAcc(null);
        setOp(null);
        setFresh(true);
      }
      return;
    }

    if (["+", "−", "×", "÷"].includes(k)) {
      if (acc === null) {
        setAcc(current);
      } else if (op && !fresh) {
        setAcc(apply(acc, current, op));
      }
      setOp(k);
      setFresh(true);
    }
  };

  return (
    <div
      className="h-full p-3"
      style={{
        background: "#000",
      }}
    >
      <div
        className="w-full rounded-2xl px-3 py-4 mb-3 text-right font-medium"
        style={{
          background: "#000",
          color: "#fff",
          fontSize: "clamp(2.2rem, 4vw, 3.1rem)",
          letterSpacing: "0.02em",
          minHeight: 72,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {display}
      </div>

      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
        }}
      >
        {KEYS.flat().map((k) => (
          <button
            key={k}
            onClick={() => onKey(k)}
            className="h-14 rounded-full text-2xl font-normal transition-transform active:scale-95"
            style={{
              background: ["÷", "×", "−", "+", "="].includes(k)
                ? "#f59e0b"
                : ["⌫", "+/-", "%"].includes(k)
                  ? "#6b6b73"
                  : "#1f2128",
              color: "#f8f9fb",
              border: "none",
              gridColumn: "span 1",
              boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
