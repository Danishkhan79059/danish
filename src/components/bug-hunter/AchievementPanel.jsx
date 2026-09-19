"use client";

import { Trophy, CheckCircle2, Lock, X, Sparkles } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/bug-hunter/scoring";

export default function AchievementPanel({
  isOpen,
  onClose,
  unlockedIds = [],
}) {
  if (!isOpen) return null;

  const unlockedSet = new Set(unlockedIds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl select-none">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Developer Achievements
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono font-bold border border-amber-300">
                  {unlockedIds.length}/{ACHIEVEMENTS.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Unlock badges by solving bugs, maintaining streaks &amp; saving production.
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

        {/* Achievements Grid */}
        <div className="p-5 max-h-[65vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((item) => {
            const isUnlocked = unlockedSet.has(item.id);

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? "bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-amber-300 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                    isUnlocked
                      ? "bg-amber-100 border-amber-300 shadow-xs"
                      : "bg-slate-200/60 border-slate-300 grayscale"
                  }`}
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isUnlocked ? "text-amber-900" : "text-slate-500"
                      }`}
                    >
                      {item.title}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
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
