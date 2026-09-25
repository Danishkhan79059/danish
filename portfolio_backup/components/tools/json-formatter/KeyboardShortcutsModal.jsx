"use client";

import { Keyboard, X, Sparkles, Command } from "lucide-react";

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const modifierKey = isMac ? "⌘" : "Ctrl";

  const shortcuts = [
    {
      combo: [modifierKey, "Enter"],
      action: "Beautify JSON",
      desc: "Format with selected indentation spacing",
      badge: "Primary Action",
    },
    {
      combo: [modifierKey, "Shift", "M"],
      action: "Minify JSON",
      desc: "Compact JSON into single-line representation",
      badge: "Compress",
    },
    {
      combo: [modifierKey, "K"],
      action: "Clear All",
      desc: "Reset input, output, errors and statistics",
      badge: "Reset",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[var(--primary)]">
              <Keyboard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-500">
                Speed up your JSON formatting workflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {shortcuts.map((s) => (
            <div
              key={s.action}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {s.action}
                  </span>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                    {s.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {s.combo.map((key, i) => (
                  <kbd
                    key={i}
                    className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg border border-slate-300 bg-white px-1.5 font-mono text-xs font-semibold text-slate-700 shadow-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            Works inside or outside the editor
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
