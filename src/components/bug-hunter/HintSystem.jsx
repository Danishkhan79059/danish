"use client";

import { Lightbulb, AlertTriangle, Check, X, ShieldAlert } from "lucide-react";

export default function HintSystem({
  isOpen,
  onClose,
  hints = [],
  revealedCount = 0,
  onUnlockHint,
}) {
  if (!isOpen) return null;

  const nextHintIndex = revealedCount;
  const hasMoreHints = nextHintIndex < hints.length;
  const nextHint = hasMoreHints ? hints[nextHintIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl select-none">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Debugging Clues &amp; Hints
              </h3>
              <p className="text-[11px] text-slate-500">
                Revealed {revealedCount} of {hints.length} hints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5">
          {/* Unlocked Hints */}
          {revealedCount === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
              <p className="font-semibold mb-1">No hints revealed yet for this challenge.</p>
              <p className="text-[11px] text-slate-400">
                Try inspecting the code first to earn maximum XP!
              </p>
            </div>
          ) : (
            hints.slice(0, revealedCount).map((hint, idx) => (
              <div
                key={hint.id || idx}
                className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-sans animate-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between mb-1.5 font-bold text-amber-800 text-[11px]">
                  <span>💡 Hint #{idx + 1}</span>
                  <span className="text-amber-700 font-mono">-{hint.penalty} XP</span>
                </div>
                <p className="text-amber-900 leading-relaxed select-text font-medium">
                  {hint.text}
                </p>
              </div>
            ))
          )}

          {/* Next Hint Unlock Prompt */}
          {hasMoreHints ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px]">
                  <p className="font-bold text-slate-800">
                    Reveal Hint #{nextHintIndex + 1}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Unlocking this hint will deduct{" "}
                    <span className="text-amber-700 font-mono font-bold">
                      {nextHint.penalty} XP
                    </span>{" "}
                    from this challenge reward.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onUnlockHint(nextHintIndex + 1)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Unlock Hint #{nextHintIndex + 1} (-{nextHint.penalty} XP)</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-500 font-medium">
              All hints for this challenge have been revealed.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
