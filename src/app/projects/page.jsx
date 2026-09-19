"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Truck,
  ShieldCheck,
  Activity,
  BarChart3,
  Database,
  FileSpreadsheet,
  Play,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Plane,
  Layers,
  Zap,
  PackageCheck,
  SlidersHorizontal,
  Table,
  LineChart,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

// Reusable Video Player Mockup Component
function ProjectVideoPlayer({ videoSrc, title, subtitle, duration = "01:45" }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-2.5 shadow-xl shadow-purple-500/5 group">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1.5 rounded-3xl bg-canva-gradient opacity-20 blur-xl group-hover:opacity-35 transition-opacity -z-10" />

      {/* Video Display Container */}
      <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-[#0b1021] to-slate-900 flex flex-col justify-between p-5 border border-slate-800">

        {/* If videoSrc provided, render video element */}
        {videoSrc ? (
          <video
            src={videoSrc}
            controls
            className="absolute inset-0 h-full w-full object-cover"
            poster="/images/video-poster.png"
          />
        ) : (
          <>
            {/* Background Grid & Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,196,204,0.15)_0%,rgba(125,42,232,0.12)_45%,transparent_75%)] pointer-events-none" />

            {/* Decorative Mockup UI elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4/5 h-44 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xs p-4 flex flex-col justify-between opacity-80">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Live Demo Video Stream</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5" />
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5" />
                </div>
              </div>
            </div>

            {/* Video Header Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Product Demo Video
              </span>
              <span className="text-xs font-mono font-medium text-slate-400 bg-black/40 px-2.5 py-1 rounded-md">
                1080p HD • {duration}
              </span>
            </div>

            {/* Center Play Button Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-canva-gradient text-white shadow-2xl shadow-purple-500/50 hover:scale-110 active:scale-95 transition-transform duration-200 group/btn"
                aria-label="Play Project Demo Video"
              >
                <Play className="h-7 w-7 fill-current ml-1 group-hover/btn:scale-105 transition-transform" />
              </button>
              <span className="mt-3 text-xs font-bold text-white tracking-wide drop-shadow-sm">
                Click to Watch Platform Walkthrough
              </span>
            </div>

            {/* Bottom Video Controls Bar */}
            <div className="relative z-10 rounded-xl bg-black/50 backdrop-blur-md p-3 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">
                    {title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {subtitle}
                  </div>
                </div>
              </div>

              {/* Fake Progress Bar */}
              <div className="hidden sm:flex flex-1 items-center gap-2 px-3">
                <span className="text-[10px] font-mono text-slate-400">0:00</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-1/3 bg-canva-gradient rounded-full" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{duration}</span>
              </div>

              <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-wider">
                Ready
              </span>
            </div>
          </>
        )}
      </div>

      {/* Helper note for user */}
      <div className="px-3 pt-2 pb-1 text-center">
        <span className="text-[11px] text-slate-400">
          Tip: Drop your demo video file in <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">/public/videos/</code> to play directly.
        </span>
      </div>
    </div>
  );
}

// 7 Live Deployed Platforms Data
const DEPLOYED_PLATFORMS = [
  {
    name: "AiShyp",
    category: "Courier Aggregator SaaS",
    description:
      "Enterprise logistics aggregator engine where merchants compare courier rates across multiple partners, select best-fit options, and automate end-to-end order dispatches.",
    tags: ["Next.js", "Node.js", "Express", "MongoDB", "Multi-Carrier APIs"],
    icon: Truck,
    highlight: "Real-Time Rate Engine & Multi-Courier Sync",
    badgeColor: "text-[var(--primary)] bg-[var(--primary-light)]",
  },
  {
    name: "SureShip",
    category: "High-Speed Courier Platform",
    description:
      "Rapid delivery network platform providing expedited parcel booking, live dispatch schedules, and automated door-to-door fulfillment for ecommerce brands.",
    tags: ["React", "Node.js", "MongoDB", "TailwindCSS", "Socket.io"],
    icon: Zap,
    highlight: "Express Doorstep Delivery & Automated Routing",
    badgeColor: "text-blue-700 bg-blue-50",
  },
  {
    name: "4Murti",
    category: "Surface Cargo & Transportation",
    description:
      "Supply chain logistics and surface freight transportation platform with PAN India branch connectivity, full-truckload (FTL) management, and live consignment tracking.",
    tags: ["MERN Stack", "PostgreSQL", "TailwindCSS", "REST APIs"],
    icon: Layers,
    highlight: "PAN India Surface Network & Branch Logistics",
    badgeColor: "text-emerald-700 bg-emerald-50",
  },
  {
    name: "Anteair",
    category: "Express Air Cargo Logistics",
    description:
      "Time-critical air freight and express cargo distribution portal with airway bill (AWB) generation, weight volumetric calculation, and flight cargo tracking.",
    tags: ["Next.js", "Node.js", "MongoDB", "Express", "TailwindCSS"],
    icon: Plane,
    highlight: "Time-Sensitive Air Freight & AWB Automation",
    badgeColor: "text-cyan-700 bg-cyan-50",
  },
  {
    name: "ShypKart",
    category: "Ecommerce Shipping Integrator",
    description:
      "All-in-one shipping automation solution for online stores, integrating Shopify, WooCommerce, and custom webhooks for automated order import and shipping label printing.",
    tags: ["React", "Express", "MongoDB", "Webhooks", "TailwindCSS"],
    icon: PackageCheck,
    highlight: "Ecommerce Store Sync & 1-Click Manifest Printing",
    badgeColor: "text-amber-700 bg-amber-50",
  },
  {
    name: "Vizta",
    category: "Drag & Drop Data Visualization SaaS",
    description:
      "No-code data visualization tool turning raw CSV, Excel files, and direct database queries into dynamic interactive charts, data tables, and geographic heatmaps in seconds.",
    tags: ["React", "Node.js", "MongoDB", "Chart.js", "Data Pipelines"],
    icon: BarChart3,
    highlight: "Sub-Second Ingestion & Interactive Charting",
    badgeColor: "text-[var(--primary)] bg-[var(--primary-light)]",
  },
  {
    name: "VizLabs",
    category: "BI & Analytics Research Dashboard",
    description:
      "Advanced business intelligence lab for deep data queries, custom aggregation pipelines, multi-tenant analytics workspaces, and automated executive PDF reports.",
    tags: ["Next.js", "Express", "PostgreSQL", "Redis", "TailwindCSS"],
    icon: LineChart,
    highlight: "Custom Aggregation Pipelines & Executive Dashboards",
    badgeColor: "text-indigo-700 bg-indigo-50",
  },
];

export default function ProjectsPage() {
  return (
    <div className="w-full bg-white text-slate-900">
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100 overflow-hidden">
        {/* Subtle Canva Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-[radial-gradient(ellipse_at_top,rgba(0,196,204,0.1)_0%,rgba(56,120,232,0.06)_40%,rgba(125,42,232,0.08)_70%,transparent_80%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Production Deployments • MERN Full-Stack Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Engineered for Impact:{" "}
            <span className="text-canva-gradient">SaaS &amp; Live Platforms</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Deep-dive into my flagship production systems — from raw dataset drag &amp; drop
            visualization engines to enterprise courier rate aggregator ecosystems deployed across 5+ live platforms.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#vizta-section"
              className="btn-canva-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
            >
              1. Vizta (Data Visualization Tool)
            </a>
            <a
              href="#aishyp-section"
              className="btn-canva-outline px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              2. AiShyp (Courier Aggregator)
            </a>
            <a
              href="#deployed-platforms"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              View All 5+ Live Platforms
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLAGSHIP PROJECT 1: VIZTA (THE DATA VISUALIZATION TOOL)
          ========================================================================= */}
      <section
        id="vizta-section"
        className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-slate-200/80"
      >
        {/* Ambient background glows */}
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-[var(--secondary)]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-6 space-y-6 order-1">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/90 px-3.5 py-1.5 text-xs font-bold text-cyan-800">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--secondary)] text-white">
                  <BarChart3 className="h-2.5 w-2.5" />
                </span>
                Flagship Project 1 • Data Analytics SaaS
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-950 leading-[1.15]">
                Vizta: Turn Raw Datasets into{" "}
                <span className="text-canva-gradient">
                  Instant Visualizations in Seconds.
                </span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Built to solve a major real-world bottleneck. Instead of opening complex
                <span className="font-bold text-slate-900"> Excel spreadsheets</span>,
                manually applying filters, and writing tedious formulas, users simply
                <strong className="text-slate-900"> drag &amp; drop raw CSV or Excel files</strong> or
                connect their database directly. Vizta parses and renders interactive
                charts, clean data tables, and geographic map views within seconds.
              </p>

              {/* 4 FEATURE CARDS (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-[var(--secondary)] hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[var(--secondary)]">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Drag &amp; Drop Ingestion
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Drop raw CSV / XLSX files or direct DB connect without manual prep
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-[var(--primary)] hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[var(--primary)]">
                      <LineChart className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Dynamic Chart Generator
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Bar, Line, Donut, Area, and Map views generated on the fly
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-blue-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        No-Code Visual Filtering
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Eliminate Excel hassle with visual slicers and instant grouping
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-emerald-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Direct DB Sync
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Connect MongoDB &amp; PostgreSQL directly for live data streaming
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TRUST / METRIC INDICATORS */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Sub-second Ingestion
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Interactive Map &amp; Charts
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Zero Excel Complexity
                </span>
              </div>

              {/* ACTION LINKS */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-canva-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore Vizta Platform</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </a>
              </div>
            </div>

            {/* RIGHT VIDEO / VISUAL SECTION */}
            <div className="lg:col-span-6 relative order-2">
              <ProjectVideoPlayer
                title="Vizta Data Visualization Tool"
                subtitle="Drag & Drop CSV/DB Ingestion Walkthrough"
                duration="02:15"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLAGSHIP PROJECT 2: AISHYP (COURIER AGGREGATOR PLATFORM)
          ========================================================================= */}
      <section
        id="aishyp-section"
        className="relative overflow-hidden bg-slate-50/70 py-16 sm:py-24 border-b border-slate-200/80"
      >
        {/* Ambient background glows */}
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-[var(--secondary)]/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-6 space-y-6 order-1">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/90 px-3.5 py-1.5 text-xs font-bold text-purple-800">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <Truck className="h-2.5 w-2.5" />
                </span>
                Flagship Project 2 • Logistics &amp; Shipping SaaS
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-950 leading-[1.15]">
                AiShyp: Smart Multi-Carrier{" "}
                <span className="text-canva-gradient">
                  Courier Aggregator Platform.
                </span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                An intelligent courier aggregator where ecommerce sellers and businesses come to
                <span className="font-bold text-slate-900">
                  {" "}compare live shipping rates across multiple courier partners
                </span>,
                select the most cost-effective provider, and automatically assign and dispatch orders.
                Built with real-time webhooks, automated AWB label generation, and comprehensive tracking.
              </p>

              {/* 4 FEATURE CARDS (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Card 1 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-[var(--primary)] hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[var(--primary)]">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Multi-Courier Rate Engine
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Instantly compare shipping rates across top couriers for best margin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-blue-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Automated Order Assignment
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Automated courier allotment and 1-click AWB shipping label printing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-amber-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        Live Web-Enabled Tracking
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Unified tracking webhook sync for end-to-end shipment visibility
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-emerald-200 hover:shadow-sm transition">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        COD &amp; Reverse Logistics
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Automated remittance tracking, NDR workflows &amp; return pickups
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TRUST INDICATORS */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  PAN India Courier Partners
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Bulk Manifest Generation
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Multi-Tenant Architecture
                </span>
              </div>

              {/* ACTION LINKS */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-canva-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Explore AiShyp Platform</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Architecture</span>
                </a>
              </div>
            </div>

            {/* RIGHT VIDEO / VISUAL SECTION */}
            <div className="lg:col-span-6 relative order-2">
              <ProjectVideoPlayer
                title="AiShyp Courier Aggregator Demo"
                subtitle="Live Courier Rate Selection & Order Assignment"
                duration="03:10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ALL 5+ LIVE DEPLOYED WEBSITES & CLIENT PLATFORMS
          ========================================================================= */}
      <section
        id="deployed-platforms"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] badge-canva px-3 py-1 rounded-full">
              Production Portfolio
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">
              5+ Live Deployed Websites &amp; Platforms
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Complete ecosystem of logistics, surface delivery, air cargo, and data analytics systems deployed in real production environments.
            </p>
          </div>

          {/* Grid of All Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {DEPLOYED_PLATFORMS.map((platform, idx) => {
              const Icon = platform.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--primary)] hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-canva-gradient text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                            {platform.name}
                          </h3>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${platform.badgeColor}`}>
                            {platform.category}
                          </span>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {platform.description}
                    </p>

                    {/* Highlight Box */}
                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[var(--secondary)] shrink-0" />
                      <span className="text-[11px] font-medium text-slate-700">
                        {platform.highlight}
                      </span>
                    </div>

                    {/* Tech Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {platform.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href="https://example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      <span>Visit Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href="https://github.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
        <div className="mx-auto max-w-5xl rounded-3xl bg-canva-gradient p-8 sm:p-12 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Engineering Consultation</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Have a similar SaaS or logistics product in mind?
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Let&apos;s build scalable architectures with rate engines, data visualization, and cloud integrations.
            </p>
          </div>

          <Link
            href="/Contactus"
            className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200 px-7 py-3.5 rounded-xl text-sm font-black shadow-lg inline-flex items-center gap-2"
          >
            <span>Let&apos;s Discuss</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--primary)]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
