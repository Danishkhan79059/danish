"use client";

import { Zap, Flame, Trophy, Award, Sparkles } from "lucide-react";
import { calculateHunterLevel } from "@/lib/bug-hunter/scoring";

export default function XPDisplay({
  totalXP = 0,
  streak = 0,
  unlockedAchievementsCount = 0,
  totalAchievementsCount = 6,
  onOpenAchievements,
}) {
  const levelInfo = calculateHunterLevel(totalXP);

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none">
      {/* Level & Rank Badge */}
      <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <span className="text-[11px] font-medium text-slate-500">
          Lvl {levelInfo.level}
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-xs font-bold text-slate-800">
          {levelInfo.badge}
        </span>
      </div>

      {/* Streak Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono font-bold text-amber-800 shadow-xs">
        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
        <span>{streak} Streak</span>
      </div>

      {/* Total XP Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--primary-light)] border border-[var(--primary)]/30 rounded-xl text-xs font-mono font-extrabold text-[var(--primary)] shadow-xs">
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>XP: {totalXP}</span>
      </div>

      {/* Achievements Button */}
      <button
        onClick={onOpenAchievements}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs border border-slate-200 shadow-xs transition-all font-semibold"
        title="View Unlocked Achievements"
      >
        <Trophy className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Badges</span>
        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px] font-mono font-bold border border-amber-200">
          {unlockedAchievementsCount}/{totalAchievementsCount}
        </span>
      </button>
    </div>
  );
}
