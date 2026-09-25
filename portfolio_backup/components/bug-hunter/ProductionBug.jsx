"use client";

import { AlertTriangle, Flame, Activity, Server, Users, Clock, Terminal } from "lucide-react";

export default function ProductionBug({ challenge }) {
  if (!challenge || challenge.difficulty !== "production" || !challenge.incidentDetails) {
    return null;
  }

  const {
    endpoint,
    errorRate,
    responseTime,
    affectedUsers,
    status,
    logs = [],
    metrics = {},
  } = challenge.incidentDetails;

  return (
    <div className="bg-rose-50/60 border border-rose-200 rounded-2xl overflow-hidden shadow-sm mb-4 animate-in fade-in duration-300">
      {/* Incident Header Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-rose-100/80 border-b border-rose-200 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
          </span>
          <span className="font-mono font-bold tracking-wider text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            {status || "SEV-1 LIVE INCIDENT"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-rose-800 bg-white px-2 py-0.5 rounded-md border border-rose-300 font-bold shadow-xs">
            {endpoint}
          </span>
        </div>
      </div>

      {/* Incident Metrics Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/40 border-b border-rose-200 text-xs">
        {/* Error Rate */}
        <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Error Rate</span>
            <Activity className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-lg font-mono font-extrabold text-rose-600">
            {errorRate}
          </div>
          <div className="text-[10px] text-rose-500 font-medium mt-0.5">Spiking above threshold</div>
        </div>

        {/* Response Time */}
        <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Latency</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg font-mono font-extrabold text-amber-700">
            {responseTime}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Degraded SLA</div>
        </div>

        {/* Affected Users */}
        <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Affected</span>
            <Users className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-lg font-mono font-extrabold text-rose-700">
            {affectedUsers}
          </div>
          <div className="text-[10px] text-rose-500 font-medium mt-0.5">Active user sessions</div>
        </div>

        {/* System Load */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">System Load</span>
            <Server className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xs font-mono font-bold text-slate-800">
            CPU: {metrics.cpuUsage || "92%"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            RAM: {metrics.memoryUsage || "88%"}
          </div>
        </div>
      </div>

      {/* Production Server Logs Terminal */}
      <div className="p-3.5 bg-slate-900">
        <div className="flex items-center justify-between mb-2 text-[11px] text-red-300 font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            STDOUT / STDERR LIVE CRASH LOGS:
          </span>
          <span className="text-[10px] text-slate-400">Live stream</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-red-300 space-y-1 max-h-32 overflow-y-auto select-text">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed hover:bg-slate-900 px-1 rounded transition-colors">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
