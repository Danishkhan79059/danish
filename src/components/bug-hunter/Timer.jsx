"use client";

import { Timer as TimerIcon } from "lucide-react";

export default function Timer({ seconds = 0, isRunning = true }) {
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-xs select-none">
      <TimerIcon className={`w-3.5 h-3.5 ${isRunning ? "text-[var(--primary)] animate-pulse" : "text-slate-400"}`} />
      <span>⏱ {formatTime(seconds)}</span>
    </div>
  );
}
