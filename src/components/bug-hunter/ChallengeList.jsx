"use client";

import { useState, useMemo } from "react";
import { Search, CheckCircle2, Circle, Flame, ShieldAlert, Sparkles, Trophy } from "lucide-react";
import { DIFFICULTY_TIERS } from "@/data/bugChallenges";

export default function ChallengeList({
  challenges = [],
  activeChallengeId,
  onSelectChallenge,
  solvedChallenges = {},
}) {
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const solvedCount = Object.keys(solvedChallenges).length;
  const totalCount = challenges.length;
  const progressPercent = Math.round((solvedCount / totalCount) * 100) || 0;

  // Filtered challenges list
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchesDifficulty =
        filterDifficulty === "all" || c.difficulty === filterDifficulty;
      const matchesQuery =
        searchQuery.trim() === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDifficulty && matchesQuery;
    });
  }, [challenges, filterDifficulty, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header & Overall Progress */}
      <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">Challenges</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-white text-slate-700 border border-slate-200 shadow-xs">
              {solvedCount}/{totalCount}
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-600">
            {progressPercent}% Done
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bugs, tags, topics..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-colors"
          />
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            onClick={() => setFilterDifficulty("all")}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 ${
              filterDifficulty === "all"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All ({challenges.length})
          </button>
          <button
            onClick={() => setFilterDifficulty("beginner")}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 ${
              filterDifficulty === "beginner"
                ? "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300"
                : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            🟢 Beginner
          </button>
          <button
            onClick={() => setFilterDifficulty("intermediate")}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 ${
              filterDifficulty === "intermediate"
                ? "bg-amber-100 text-amber-800 font-bold border border-amber-300"
                : "text-slate-600 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            🟡 Intermediate
          </button>
          <button
            onClick={() => setFilterDifficulty("advanced")}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 ${
              filterDifficulty === "advanced"
                ? "bg-rose-100 text-rose-800 font-bold border border-rose-300"
                : "text-slate-600 hover:text-rose-700 hover:bg-rose-50"
            }`}
          >
            🔴 Advanced
          </button>
          <button
            onClick={() => setFilterDifficulty("production")}
            className={`px-2 py-1 rounded-md transition-colors shrink-0 ${
              filterDifficulty === "production"
                ? "bg-red-100 text-red-800 font-bold border border-red-300"
                : "text-slate-600 hover:text-red-700 hover:bg-red-50"
            }`}
          >
            ☠️ Production
          </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No challenges match your filter.
          </div>
        ) : (
          filteredChallenges.map((item) => {
            const isSolved = !!solvedChallenges[item.id];
            const isActive = item.id === activeChallengeId;
            const tier = DIFFICULTY_TIERS[item.difficulty.toUpperCase()] || {};

            return (
              <button
                key={item.id}
                onClick={() => onSelectChallenge(item.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 group ${
                  isActive
                    ? "bg-[var(--primary-light)] border border-[var(--primary)]/30 shadow-xs"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                {/* Solved / Unsolved Icon */}
                <div className="mt-0.5 shrink-0">
                  {isSolved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                  )}
                </div>

                {/* Challenge Title & Badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs font-medium truncate ${
                        isActive ? "text-[var(--primary)] font-bold" : "text-slate-800 group-hover:text-slate-900"
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* XP Tag */}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--secondary-light)] text-[var(--secondary-hover)] font-bold border border-[var(--secondary)]/30 shrink-0">
                      +{item.baseXP} XP
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    {/* Difficulty Badge */}
                    <span className={`px-1.5 py-0.2 rounded border font-medium ${tier.badgeColor}`}>
                      {tier.name}
                    </span>

                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 truncate">{item.category}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
