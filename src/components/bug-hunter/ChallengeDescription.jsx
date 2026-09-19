"use client";

import { AlertCircle, CheckCircle, Tag, Sparkles, BookOpen, Layers } from "lucide-react";
import { DIFFICULTY_TIERS } from "@/data/bugChallenges";
import ProductionBug from "./ProductionBug";

export default function ChallengeDescription({ challenge, isSolved = false }) {
  if (!challenge) return null;

  const tier = DIFFICULTY_TIERS[challenge.difficulty.toUpperCase()] || {};

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-bold text-slate-800">Challenge Briefing</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty Badge */}
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${tier.badgeColor}`}>
            {tier.label}
          </span>

          {/* Solved Status */}
          {isSolved && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Solved
            </span>
          )}
        </div>
      </div>

      {/* Description Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs select-text">
        {/* Production Bug Incident Header (If Sev-1) */}
        {challenge.difficulty === "production" && (
          <ProductionBug challenge={challenge} />
        )}

        {/* Title & Category */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">
            {challenge.title}
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed">
            {challenge.summary}
          </p>
        </div>

        {/* Detailed Description */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed whitespace-pre-line font-sans">
          {challenge.description}
        </div>

        {/* Expected Behavior Box */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Expected Behavior</span>
          </div>
          <p className="text-emerald-900 leading-relaxed font-mono text-[11px]">
            {challenge.expectedBehavior}
          </p>
        </div>

        {/* Tests / Assertions preview */}
        {challenge.tests && challenge.tests.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Validation Tests
            </span>
            <div className="space-y-1.5">
              {challenge.tests.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                >
                  <span className="text-slate-800 truncate mr-2">🧪 {t.name}</span>
                  <span className="text-[10px] text-slate-500 font-sans font-medium shrink-0">Pass test</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
          <Tag className="w-3 h-3 text-slate-400" />
          {challenge.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono border border-slate-200 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
