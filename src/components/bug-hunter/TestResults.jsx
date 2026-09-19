"use client";

import { CheckCircle2, XCircle, Clock, Zap, Terminal, Sparkles, AlertCircle } from "lucide-react";

export default function TestResults({
  results = [],
  passed = false,
  hasRun = false,
  executionMs = 0,
  earnedXP = 0,
  isFirstSolve = false,
  onViewSolution,
}) {
  if (!hasRun) {
    return (
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-mono flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span>Click &quot;▶ RUN TESTS&quot; or press Ctrl+Enter to validate your solution.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all shadow-sm ${
        passed
          ? "bg-emerald-50/80 border-emerald-300"
          : "bg-rose-50/80 border-rose-300"
      }`}
    >
      {/* Test Suite Summary Banner */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-inherit select-none bg-white/60 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          {passed ? (
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>✅ ALL TESTS PASSED! Bug Fixed!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>❌ TEST FAILED</span>
            </div>
          )}

          {passed && earnedXP > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-bounce">
              +{earnedXP} XP
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{executionMs}ms</span>
          </div>

          {passed && (
            <button
              onClick={onViewSolution}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/25 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Post-Mortem</span>
            </button>
          )}
        </div>
      </div>

      {/* Individual Test Assertions */}
      <div className="p-3 space-y-2.5 max-h-48 overflow-y-auto">
        {results.map((test, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border font-mono text-xs shadow-xs ${
              test.passed
                ? "bg-white border-emerald-200 text-emerald-900"
                : "bg-white border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 font-bold">
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{test.name}</span>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                  test.passed
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                {test.passed ? "PASSED" : "FAILED"}
              </span>
            </div>

            {/* Test Diff Details */}
            {!test.passed && (
              <div className="mt-2 space-y-1.5 bg-rose-50/60 p-2.5 rounded-lg border border-rose-200 text-[11px]">
                <div>
                  <span className="text-slate-600 font-bold block mb-0.5">
                    Expected:
                  </span>
                  <div className="text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-mono whitespace-pre-wrap">
                    {test.expected}
                  </div>
                </div>

                <div>
                  <span className="text-slate-600 font-bold block mb-0.5">
                    Received:
                  </span>
                  <div className="text-rose-800 bg-rose-100/80 px-2 py-1 rounded border border-rose-300 font-mono whitespace-pre-wrap">
                    {test.received}
                  </div>
                </div>

                {test.message && (
                  <div className="text-amber-800 pt-1 flex items-start gap-1.5 font-sans">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{test.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
