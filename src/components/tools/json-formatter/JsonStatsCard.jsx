"use client";

import {
  FileCode2,
  HardDrive,
  Box,
  ListTree,
  KeyRound,
  Layers3,
  BarChart3,
} from "lucide-react";

export default function JsonStatsCard({ stats }) {
  if (!stats) return null;

  const items = [
    {
      label: "Objects",
      value: stats.objectCount ?? 0,
      icon: Box,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Arrays",
      value: stats.arrayCount ?? 0,
      icon: ListTree,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Keys",
      value: stats.keyCount ?? 0,
      icon: KeyRound,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Depth",
      value: stats.maxDepth ?? 0,
      icon: Layers3,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Size",
      value: stats.sizeFormatted || "0 B",
      icon: HardDrive,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      label: "Characters",
      value: (stats.characters ?? 0).toLocaleString(),
      icon: FileCode2,
      color: "text-slate-700 bg-slate-100 border-slate-200",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-canva-gradient text-white shadow-xs">
            <BarChart3 className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">JSON Statistics</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Live Client Metrics
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 transition-colors hover:border-purple-200 hover:bg-purple-50/20"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
                  {item.label}
                </span>
                <span className="block text-sm sm:text-base font-bold text-slate-800 font-mono truncate">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
