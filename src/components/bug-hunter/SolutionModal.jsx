"use client";

import { CheckCircle2, ArrowRight, Sparkles, Copy, Check, X, Code2 } from "lucide-react";
import { useState } from "react";

export default function SolutionModal({
  isOpen,
  onClose,
  challenge,
  earnedXP = 0,
  timeTaken = 0,
  onNextChallenge,
  hasNextChallenge = true,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !challenge) return null;

  const handleCopySolution = () => {
    navigator.clipboard.writeText(challenge.solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-emerald-300 rounded-3xl overflow-hidden shadow-2xl select-none">
        {/* Victory Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-b border-emerald-200 text-center relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            🎉 BUG FIXED!
          </h2>
          <p className="text-xs text-emerald-800 font-semibold">
            Great job! You identified and resolved the issue.
          </p>

          {/* Reward Badges */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
              +{earnedXP} XP Earned
            </div>
            <div className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-mono font-semibold shadow-xs">
              ⏱ Solved in {formatTime(timeTaken)}
            </div>
          </div>
        </div>

        {/* Modal Body: Explanation & Solution Code */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto select-text text-xs">
          {/* What Was Wrong Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              What was wrong?
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed font-sans">
              {challenge.explanation}
            </div>
          </div>

          {/* Correct Solution Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                Correct Solution:
              </h4>

              <button
                onClick={handleCopySolution}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto selection:bg-emerald-500/30">
              <code>{challenge.solution}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Review Code
          </button>

          {hasNextChallenge ? (
            <button
              onClick={onNextChallenge}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/25 transition-all flex items-center gap-2"
            >
              <span>NEXT CHALLENGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
            >
              All Challenges Solved! 👑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
