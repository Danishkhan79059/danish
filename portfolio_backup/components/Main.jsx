"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers,
  BarChart3,
  Server,
  ExternalLink,
  CheckCircle2,
  Zap,
  Mail,
  FileText,
  Boxes,
  Truck,
  Plane,
  PackageCheck,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  HeartHandshake,
  Compass,
  Laptop,
  Award,
  Copy,
  Check,
  Palette,
  Video,
  Search,
  MessageSquare,
  Rocket,
  LineChart,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/Icons";

// Animated Down Arrow Connector Component (↓)
function DownArrowConnector({ label, sublabel }) {
  return (
    <div className="flex flex-col items-center justify-center my-8 sm:my-14 relative z-10 select-none">
      {/* Top glowing stem */}
      <div className="w-1 h-10 sm:h-14 bg-gradient-to-b from-[var(--secondary)] via-[var(--accent)] to-[var(--primary)] rounded-full animate-pulse opacity-80" />

      {/* Circle with Down Arrow (↓) */}
      <div className="relative my-2.5 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white border-2 border-purple-200 shadow-lg shadow-purple-500/15 group hover:scale-110 transition-transform">
        <div className="absolute inset-0 rounded-full bg-canva-gradient opacity-20 animate-ping" />
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)] stroke-[2.5]" />
      </div>

      {label && (
        <span className="mt-1 text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-3.5 py-0.5 rounded-full border border-slate-200">
          {label} {sublabel && <span className="text-slate-400 font-normal">• {sublabel}</span>}
        </span>
      )}

      {/* Bottom glowing stem */}
      <div className="w-1 h-10 sm:h-14 bg-gradient-to-b from-[var(--primary)] to-slate-200 rounded-full opacity-80" />
    </div>
  );
}

// Tech Stack Matrix Data
const TECH_CATEGORIES = [
  { id: "all", label: "All Technologies" },
  { id: "frontend", label: "Frontend & UI" },
  { id: "backend", label: "Backend & APIs" },
  { id: "database", label: "Databases & Storage" },
  { id: "devops", label: "DevOps & Tools" },
];

const TECH_ITEMS = [
  // Frontend
  { name: "React 19 / React.js", category: "frontend", level: "Expert", desc: "Component architecture, modern hooks, server components & render optimization" },
  { name: "Next.js (App Router)", category: "frontend", level: "Advanced", desc: "SSR, dynamic routing, Turbopack, metadata SEO & edge functions" },
  { name: "JavaScript (ES6+)", category: "frontend", level: "Expert", desc: "Async/await, event loop, closures, modern ES syntax & clean code" },
  { name: "TypeScript", category: "frontend", level: "Proficient", desc: "Type-safe interfaces, predictable payloads & robust contract types" },
  { name: "TailwindCSS v4", category: "frontend", level: "Expert", desc: "Design tokens, utility architectures, dark/light themes & fluid animations" },
  { name: "Material UI (MUI)", category: "frontend", level: "Advanced", desc: "Enterprise design systems, complex data tables & form components" },
  { name: "Framer Motion", category: "frontend", level: "Advanced", desc: "Micro-interactions, layout transitions, spring physics & scroll animations" },

  // Backend
  { name: "Node.js", category: "backend", level: "Advanced", desc: "Event-driven runtime, high concurrency, streams & worker threads" },
  { name: "Express.js", category: "backend", level: "Advanced", desc: "Modular REST APIs, middleware pipelines & controller architecture" },
  { name: "RESTful Architecture", category: "backend", level: "Expert", desc: "Idempotent endpoints, HTTP status standards, rate limiting & pagination" },
  { name: "Socket.io (WebSockets)", category: "backend", level: "Proficient", desc: "Real-time bidirectional event streaming & live sync feeds" },
  { name: "JWT & OAuth 2.0 (RBAC)", category: "backend", level: "Advanced", desc: "Role-Based Access Control, token rotation & session security" },
  { name: "Webhook Listeners", category: "backend", level: "Advanced", desc: "Asynchronous event ingestion from couriers, payment gateways & CRMs" },

  // Databases
  { name: "MongoDB & Mongoose", category: "database", level: "Expert", desc: "Document schemas, complex aggregation pipelines & compound indexing" },
  { name: "PostgreSQL", category: "database", level: "Advanced", desc: "Relational modeling, multi-table joins & ACID transaction guarantees" },
  { name: "Redis Caching", category: "database", level: "Advanced", desc: "Sub-millisecond in-memory cache, rate limiting & session stores" },
  { name: "Multi-Tenant Partitioning", category: "database", level: "Advanced", desc: "Partitioned datasets, tenant identification & zero cross-talk security" },

  // DevOps & Tools
  { name: "Git & GitHub", category: "devops", level: "Expert", desc: "Branching workflows, pull requests, semantic commits & code reviews" },
  { name: "Postman & API Testing", category: "devops", level: "Advanced", desc: "Automated test suites, environment variables & mock endpoints" },
  { name: "Docker Basics", category: "devops", level: "Proficient", desc: "Containerized development environments & reproducible builds" },
  { name: "Linux & Shell Scripting", category: "devops", level: "Proficient", desc: "Server management, cron jobs & process monitoring" },
  { name: "Vercel & Netlify CI/CD", category: "devops", level: "Advanced", desc: "Edge deployments, continuous integration & preview pipelines" },
];

// Featured Projects Data
const FEATURED_PROJECTS = [
  {
    title: "Vizta",
    subtitle: "Drag & Drop Data Visualization & BI SaaS Tool",
    description:
      "A no-code data visualization tool that turns raw CSV, Excel files, and direct database queries into interactive dynamic charts, KPI widgets, and automated executive digests with sub-second query latency.",
    tags: ["React", "Node.js", "MongoDB Aggregations", "Redis", "Chart.js", "TailwindCSS"],
    metrics: "Processed 500K+ daily analytics events with sub-second queries",
    demoLink: "https://example.com",
    githubLink: "https://github.com/Danishkhan79059",
    category: "Data Viz / BI SaaS",
    accentColor: "from-purple-600 to-indigo-600",
  },
  {
    title: "AiShyp",
    subtitle: "Enterprise Logistics & Multi-Carrier Rate Aggregator",
    description:
      "A high-throughput logistics aggregation platform connecting merchants with multiple courier partners simultaneously. Features live rate comparison engines, automated Airway Bill (AWB) generation, and real-time tracking webhooks.",
    tags: ["Next.js", "Node.js", "Express", "MongoDB", "Multi-Carrier APIs", "Webhooks"],
    metrics: "Reduced merchant dispatch time by 45% with automated manifests",
    demoLink: "https://example.com",
    githubLink: "https://github.com/Danishkhan79059",
    category: "Logistics SaaS",
    accentColor: "from-cyan-600 to-blue-600",
  },
  {
    title: "SureShip",
    subtitle: "High-Speed Parcel Booking & Automated Courier Fulfillment",
    description:
      "Rapid delivery network platform providing expedited parcel booking, live dispatch schedules, door-to-door fulfillment automation, and live status streaming for high-volume ecommerce brands.",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "TailwindCSS", "REST APIs"],
    metrics: "Automated 100% door-to-door delivery routing with live status sync",
    demoLink: "https://example.com",
    githubLink: "https://github.com/Danishkhan79059",
    category: "Express Delivery SaaS",
    accentColor: "from-blue-600 to-purple-600",
  },
];

export default function Main() {
  const [activeTechTab, setActiveTechTab] = useState("all");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("khandanish30599@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const filteredTech =
    activeTechTab === "all"
      ? TECH_ITEMS
      : TECH_ITEMS.filter((item) => item.category === activeTechTab);

  return (
    <div className="w-full bg-white text-slate-900 overflow-hidden selection:bg-purple-100 selection:text-purple-900">

      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(0,196,204,0.12)_0%,rgba(56,120,232,0.08)_40%,rgba(125,42,232,0.1)_70%,transparent_85%)] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold tracking-wide uppercase shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Full-Stack MERN Developer &amp; SaaS Product Engineer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.12] max-w-4xl tracking-tight">
            Building{" "}
            <span className="text-canva-gradient">Scalable SaaS Products</span>{" "}
            &amp; High-Impact Web Applications
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal">
            Hi, I&apos;m <strong className="font-bold text-slate-900">Danish Khan</strong>.
            With <strong>3+ years of production experience</strong>, I architect resilient SaaS platforms,
            data visualization dashboards, and scalable multi-tenant systems using the MERN stack.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="#featured-projects"
              className="btn-canva-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg"
            >
              <span>Explore Featured Projects</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/contact"
              className="btn-canva-outline inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
            >
              <Mail className="w-4 h-4 text-[var(--primary)]" />
              <span>Get In Touch</span>
            </Link>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Resume PDF</span>
            </a>
          </div>

          {/* Recruiter Fast-Track Telemetry Banner */}
          <div className="mt-12 w-full max-w-4xl rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 text-left shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Production Telemetry • Available for Full-Time &amp; SaaS Roles
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                Notice: Immediate / Flexible
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-canva-gradient">3+</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Years Experience</div>
                <div className="text-[10px] text-slate-500 font-medium">Production MERN Stack</div>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-canva-gradient">7+</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Live Platforms</div>
                <div className="text-[10px] text-slate-500 font-medium">SaaS &amp; Logistics</div>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-blue-600">45%</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Dispatch Time Saved</div>
                <div className="text-[10px] text-slate-500 font-medium">Rate Engine Aggregator</div>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-purple-600">500+</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Daily Events</div>
                <div className="text-[10px] text-slate-500 font-medium">Sub-second Queries</div>
              </div>
            </div>
          </div>

          {/* Core Tech Stack Strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 w-full flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3.5">
              Core Tech Stack &amp; Tools
            </span>
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl">
              {[
                "React 19",
                "Next.js (App Router)",
                "Node.js",
                "Express.js",
                "MongoDB",
                "TailwindCSS v4",
                "PostgreSQL",
                "Redis Caching",
                "RESTful APIs",
                "WebSockets",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 1
          ========================================================================= */}
      <DownArrowConnector label="STEP 01" sublabel="About Candidate" />

      {/* =========================================================================
          2. WHO IS DANISH?
          ========================================================================= */}
      <section id="who-is-danish" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Top Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              01 • Profile &amp; Bio
            </span>
            <span className="text-xs font-mono text-slate-400">
              Full-Stack Autonomy
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Who is <span className="text-canva-gradient">Danish Khan</span>?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            <strong>Danish Khan</strong> is a dedicated Full-Stack MERN Developer and SaaS Product Engineer
            with <strong>3+ years of production experience</strong> based in India. He bridges the gap
            between complex backend architectures (high-throughput databases, carrier APIs, aggregation pipelines)
            and fluid, pixel-perfect, high-converting digital interfaces.
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Rather than building toy apps or following basic tutorials, Danish has spent his career in
            the trenches of production web applications: building heterogeneous courier rate engines,
            coordinating logistics webhooks, and engineering drag-and-drop analytics dashboards that
            empower non-technical teams to make data-driven decisions.
          </p>

          {/* 3 Pillars Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[var(--primary)] hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm sm:text-base">
                <Laptop className="w-5 h-5 text-[var(--primary)]" />
                <span>End-to-End Ownership</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Takes features from whiteboard database schemas and API designs all the way to
                responsive client interfaces, automated tests, and edge deployments.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[var(--secondary)] hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm sm:text-base">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <span>Production Mindset</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A defensive engineer who accounts for race conditions, rate limits, schema anomalies,
                and network drops with resilient retry mechanisms from day one.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm sm:text-base">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>Autonomous &amp; Low Oversight</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Requires minimal hand-holding. Clarifies constraints upfront, provides clear asynchronous
                progress updates, and performs thorough self-QA before submitting PRs.
              </p>
            </div>
          </div>

          {/* Guarantee / Philosophy Card */}
          <div className="mt-6 rounded-2xl bg-canva-gradient-subtle border border-[var(--primary-glow)] p-5 sm:p-6 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--primary)]" />
              <span>The Danish Khan Guarantee</span>
            </div>
            <blockquote className="text-sm sm:text-base font-semibold text-slate-900 italic">
              &quot;Great engineering isn’t about writing the most complex code. It’s about building reliable, maintainable systems that make complex business workflows feel deceptively simple for users.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 2
          ========================================================================= */}
      <DownArrowConnector label="STEP 02" sublabel="Engineering Deliverables" />

      {/* =========================================================================
          3. WHAT DOES HE BUILD?
          ========================================================================= */}
      <section id="what-does-he-build" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-[var(--secondary)]" />
              02 • Core Systems
            </span>
            <span className="text-xs font-mono text-slate-400">
              Battle-Tested Products
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            What Does Danish <span className="text-canva-gradient">Build</span>?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Danish engineers production-ready software systems that eliminate operational friction,
            automate manual paperwork, and handle high transaction volumes:
          </p>

          {/* 4 Core Pillars */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* System 1: Logistics & Aggregators */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[var(--primary)] border border-purple-200 group-hover:scale-105 transition-transform">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-[var(--primary)] border border-purple-200">
                    Flagship Domain
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Logistics &amp; Courier SaaS Aggregators
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Platforms connecting merchants with heterogeneous courier APIs in real-time.
                  Includes parallel rate comparison engines, automated Airway Bill (AWB) generation,
                  volumetric weight calculations, and live delivery status webhooks.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">AiShyp</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">SureShip</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">4Murti</span>
                </div>
                <span className="text-xs font-bold text-[var(--primary)]">45% Faster Dispatches</span>
              </div>
            </div>

            {/* System 2: Data Visualization & BI */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--secondary)] hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-teal-700 border border-cyan-200 group-hover:scale-105 transition-transform">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 text-teal-800 border border-cyan-200">
                    No-Code / BI
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Data Visualization &amp; BI Tooling
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No-code drag-and-drop analytics engines that ingest raw CSV, Excel spreadsheets,
                  and live MongoDB streams into interactive canvas-rendered charts, cohort tables,
                  and 1-click executive PDF digests.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">Vizta</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">VizLabs</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">Aggregation Pipelines</span>
                </div>
                <span className="text-xs font-bold text-teal-700">500K+ Events Handled</span>
              </div>
            </div>

            {/* System 3: Multi-Tenant Architecture */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-105 transition-transform">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Enterprise Security
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Multi-Tenant Cloud Architectures
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Multi-organization SaaS architectures featuring partitioned database schemas,
                  custom domain routing, strict Role-Based Access Control (RBAC), subscription billing,
                  and zero data-leakage guarantees.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">Tenant Isolation</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">RBAC Tiering</span>
                </div>
                <span className="text-xs font-bold text-blue-700">0% Data Cross-Talk</span>
              </div>
            </div>

            {/* System 4: APIs & Event Streams */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200 group-hover:scale-105 transition-transform">
                    <Server className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    High Concurrency
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  High-Throughput APIs &amp; Event Streams
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Resilient RESTful APIs backed by Redis in-memory caching, rate limiting,
                  payment gateway webhook receivers, and Socket.io WebSockets for live collaborative feeds
                  and automated manifest distribution.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">Redis Cache</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">Socket.io</span>
                </div>
                <span className="text-xs font-bold text-purple-700">99.9% Uptime Focus</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 3
          ========================================================================= */}
      <DownArrowConnector label="STEP 03" sublabel="Technical Arsenal" />

      {/* =========================================================================
          4. WHAT TECHNOLOGIES DOES HE KNOW?
          ========================================================================= */}
      <section id="technologies" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              03 • Skills &amp; Stack
            </span>
            <span className="text-xs font-mono text-slate-400">
              Modern JavaScript Ecosystem
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            What Technologies Does <span className="text-canva-gradient">Danish Know</span>?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            A comprehensive checklist formatted for ATS screeners and engineering leaders.
            Click categories to filter his proficiencies:
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 mb-8">
            {TECH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTechTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTechTab === cat.id
                    ? "bg-canva-gradient text-white shadow-md font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Animated Tech Cards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredTech.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-[var(--primary)] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.level === "Expert"
                            ? "bg-purple-50 text-[var(--primary)] border-purple-200"
                            : item.level === "Advanced"
                              ? "bg-cyan-50 text-teal-700 border-cyan-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                      >
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Quick Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing {filteredTech.length} of {TECH_ITEMS.length} indexed proficiencies
            </span>
            <Link
              href="/skills"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline"
            >
              <span>Explore full Skills Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 4
          ========================================================================= */}
      <DownArrowConnector label="STEP 04" sublabel="Battle-Tested Provenance" />

      {/* =========================================================================
          5. WHAT REAL-WORLD EXPERIENCE DOES HE HAVE?
          ========================================================================= */}
      <section id="real-world-experience" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              04 • Proven Track Record
            </span>
            <span className="text-xs font-mono text-slate-400">
              Quantifiable Impact
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Real-World <span className="text-canva-gradient">Production Experience</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Not textbook theory or toy apps. Danish has built and deployed systems operating
            in high-stakes environments where uptime, data correctness, and latency directly impact revenue:
          </p>

          {/* 3 Chronological Milestones / Case Studies */}
          <div className="mt-10 space-y-8">

            {/* Milestone 1 */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--primary)] space-y-3">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-[var(--primary)] border-4 border-white shadow-xs" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Lead Full-Stack &amp; SaaS Systems Architect
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    Enterprise Logistics &amp; Rate Aggregator Platforms • 2023 - Present
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[var(--primary)] font-bold text-xs border border-purple-200">
                  AiShyp &amp; SureShip
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 pt-1">
                <p>
                  <strong>Challenge:</strong> Ecommerce merchants were wasting hours manually comparing shipping rates across individual courier portals, resulting in delayed fulfillments and dispatch errors.
                </p>
                <p>
                  <strong>Engineering Solution:</strong> Designed a unified rate engine in Next.js and Node.js that runs parallel asynchronous queries across multiple carrier APIs, normalizes JSON payloads, factors in volumetric formulas, and surfaces ranked choices in under 400ms.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                  <li>Reduced merchant dispatch turnaround time by <strong className="text-slate-900">45%</strong> via automated batch manifest generation.</li>
                  <li>Integrated webhook event listeners to broadcast real-time delivery tracking without client polling.</li>
                  <li>Engineered multi-tenant isolation guaranteeing zero cross-talk between competing merchants.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {["Next.js", "Node.js", "MongoDB", "Express", "TailwindCSS", "Carrier APIs", "Webhooks"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--secondary)] space-y-3">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-[var(--secondary)] border-4 border-white shadow-xs" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Product Engineer &amp; BI Dashboard Architect
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    Dynamic Data Visualization &amp; Analytics • 2022 - 2023
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-50 text-teal-800 font-bold text-xs border border-cyan-200">
                  Vizta &amp; VizLabs
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 pt-1">
                <p>
                  <strong>Challenge:</strong> Non-technical business users struggled to decipher dense CSV/Excel exports with hundreds of thousands of rows, leading to delayed decision-making.
                </p>
                <p>
                  <strong>Engineering Solution:</strong> Built a browser-optimized streaming parser and MongoDB aggregation pipeline capable of ingesting raw spreadsheet datasets and generating interactive, draggable BI widgets, cohort heatmaps, and customizable charts.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                  <li>Processed <strong className="text-slate-900">500K+ daily analytics events</strong> with sub-second aggregation query latencies.</li>
                  <li>Built 1-click executive PDF report generation directly in the browser with zero server CPU bottleneck.</li>
                  <li>Enabled instant column filtering, multi-field aggregations, and visual chart exports.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {["React", "Node.js", "Express", "MongoDB Aggregations", "Redis", "Chart.js", "TailwindCSS"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-500 space-y-3">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-blue-500 border-4 border-white shadow-xs" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Freight Logistics Systems Developer
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    Surface &amp; Air Freight Transportation Platforms • 2021 - 2022
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200">
                  4Murti &amp; Anteair
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 pt-1">
                <p>
                  <strong>Challenge:</strong> National freight and express cargo operations suffered from fragmented regional branch communication and manual airway bill (AWB) paperwork.
                </p>
                <p>
                  <strong>Engineering Solution:</strong> Architected a centralized consignment tracking portal linking PAN India branches, automating AWB number generation, calculating airline volumetric formulas, and tracking vehicle fleet statuses.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                  <li>Achieved real-time synchronization across multi-state hub terminals with zero consignment misplacements.</li>
                  <li>Automated 100% of air freight manifest documents, speeding up tarmac handovers.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {["MERN Stack", "PostgreSQL", "REST APIs", "TailwindCSS", "AWB Engines"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 5
          ========================================================================= */}
      <DownArrowConnector label="STEP 05" sublabel="Production Deployments" />

      {/* =========================================================================
          6. FEATURED PROJECTS
          ========================================================================= */}
      <section id="featured-projects" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-2">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                05 • Flagship Apps
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Featured <span className="text-canva-gradient">Projects</span>
              </h2>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline self-start sm:self-auto"
            >
              <span>View All 7+ Live Platforms</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-normal mb-8">
            Detailed breakdown of production SaaS platforms Danish has architected and deployed,
            combining high throughput, resilient APIs, and intuitive visual interfaces:
          </p>

          {/* 3 Featured Projects Cards */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {FEATURED_PROJECTS.map((proj, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col lg:flex-row group"
              >
                {/* Visual Banner */}
                <div className="lg:w-1/3 min-h-[200px] lg:min-h-auto bg-gradient-to-br from-slate-950 via-[#0b1021] to-slate-900 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-canva-gradient opacity-20 rounded-full blur-2xl group-hover:opacity-35 transition-opacity" />

                  <div className="flex items-center justify-between z-10">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/10 text-white backdrop-blur-xs border border-white/15">
                      {proj.category}
                    </span>
                    <Boxes className="w-4 h-4 text-[var(--secondary)]" />
                  </div>

                  <div className="z-10 mt-6 lg:mt-0">
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {proj.title}
                    </div>
                    <div className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {proj.subtitle}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 lg:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {proj.description}
                    </p>

                    {/* Metric Callout */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800">
                        {proj.metrics}
                      </span>
                    </div>

                    {/* Tech Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={proj.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      <span>Live Platform</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Repository</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 6
          ========================================================================= */}
      <DownArrowConnector label="STEP 06" sublabel="Hiring ROI" />

      {/* =========================================================================
          7. WHAT VALUE CAN HE BRING?
          ========================================================================= */}
      <section id="what-value-he-brings" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-purple-600" />
              06 • Why Hire Danish
            </span>
            <span className="text-xs font-mono text-slate-400">
              Immediate Velocity
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            What Value Can He Bring to <span className="text-canva-gradient">Your Team</span>?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Hiring Danish is not just adding another developer to the roster; it means bringing in a
            high-velocity, low-maintenance builder who increases overall engineering output:
          </p>

          {/* 6 Value Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Value 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[var(--primary)] hover:bg-white hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[var(--primary)] mb-3 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Handoff Friction</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Full-stack autonomy means features move from whiteboard concept to production deployment
                without the overhead and delays of separate frontend-backend handoffs.
              </p>
            </div>

            {/* Value 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[var(--secondary)] hover:bg-white hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-teal-700 mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Production Reliability</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Writes defensive, battle-tested code with error boundaries, rate limiting,
                retry mechanisms, and database index tuning built-in from Day 1.
              </p>
            </div>

            {/* Value 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Business-First Mindset</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Understands customer retention, checkout conversion, and operational bottlenecks.
                Focuses engineering effort on what directly moves company metrics.
              </p>
            </div>

            {/* Value 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Aesthetic UI Polish</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Bridges engineering with design. Delivers smooth micro-interactions, responsive
                layouts, and Canva-grade visual polish that elevates brand credibility.
              </p>
            </div>

            {/* Value 5 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-emerald-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-3 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">High Autonomy</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Requires minimal supervision. Capable of taking vague product specifications,
                clarifying edge cases, and executing independently without getting blocked.
              </p>
            </div>

            {/* Value 6 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-purple-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-3 group-hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Modern Stack Agility</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Quick to adopt Next.js 16, React 19, Tailwind v4, Redis caching, or AI-assisted
                APIs to keep your engineering stack modern and competitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 7
          ========================================================================= */}
      <DownArrowConnector label="STEP 07" sublabel="The Whole Package" />

      {/* =========================================================================
          8. MORE THAN CODING
          ========================================================================= */}
      <section id="more-than-coding" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              07 • Beyond The Terminal
            </span>
            <span className="text-xs font-mono text-slate-400">
              Creative &amp; Strategic Value
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            More Than <span className="text-canva-gradient">Coding</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Outstanding digital products aren&apos;t created by code alone. Danish brings a rare mix
            of design aesthetics, video storytelling, product strategy, and clear communication:
          </p>

          {/* 5 Beyond-Coding Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* 1. UI/UX & Visual Design */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--primary)] hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[var(--primary)] mb-4 group-hover:scale-105 transition-transform">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  UI/UX &amp; Canva Pro Design
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Skilled with Canva Pro and modern design tokens. Understands visual hierarchy,
                  harmonious color palettes, typography balance, and frictionless user flows.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[var(--primary)]">
                Design System • Pixel Perfection
              </div>
            </div>

            {/* 2. Video Production */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--secondary)] hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-teal-700 mb-4 group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Video Demos &amp; DaVinci Resolve
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Edits product feature walkthroughs, animated feature demos, and customer onboarding
                  videos using DaVinci Resolve to help products sell themselves clearly.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-teal-700">
                1080p Walkthroughs • Product Storytelling
              </div>
            </div>

            {/* 3. Product Strategy & User Psychology */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Product Strategy &amp; Growth
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Doesn&apos;t write code in a silo. Studies customer drop-off points, optimizes checkout
                  funnels, and suggests simpler user experiences that save development time.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
                Conversion Optimization • User Journeys
              </div>
            </div>

            {/* 4. Technical SEO & Web Performance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-4 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Technical SEO &amp; Fast Web Vitals
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Experienced with semantic HTML5, OpenGraph metadata, schema tags, Google Ads
                  conversion setup, and achieving green Core Web Vitals scores.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                Lighthouse 95+ • Search Visibility
              </div>
            </div>

            {/* 5. Clear Async Communication */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between group lg:col-span-2">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 mb-4 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Crisp Asynchronous Communication &amp; Documentation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Writes self-explanatory pull request descriptions, comprehensive README files,
                  and clear API contracts in Postman. Ensures project handoffs and team collaboration
                  remain smooth, predictable, and stress-free.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-purple-700">
                Clean Git Diffs • Thorough Self-QA • Low Overhead
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CONNECTOR (↓) TO STEP 8
          ========================================================================= */}
      <DownArrowConnector label="STEP 08" sublabel="Action & Collaboration" />

      {/* =========================================================================
          9. LET'S BUILD SOMETHING USEFUL
          ========================================================================= */}
      <section id="lets-build-something-useful" className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-canva-gradient p-8 sm:p-14 text-white shadow-2xl shadow-purple-500/25 relative overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-black/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white mb-5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for High-Impact Opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Let&apos;s Build Something <br className="hidden sm:inline" />
              Useful &amp; Scalable Together
            </h2>

            <p className="mt-5 text-white/90 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Whether you need an autonomous full-stack product engineer for a zero-to-one SaaS launch,
              a high-converting data analytics dashboard, or a reliable contributor for your engineering team,
              Danish is ready to deliver.
            </p>

            {/* Direct Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact"
                className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200 px-7 py-3.5 rounded-xl text-sm font-black shadow-lg"
              >
                Let&apos;s Work Together
              </Link>

              <a
                href="https://wa.me/917905955584?text=Hi%20Danish,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500/30 hover:bg-emerald-500/40 text-white border border-emerald-300/40 px-6 py-3.5 rounded-xl text-sm font-bold backdrop-blur-sm transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp (+91 7905955584)</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3.5 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span className="font-bold text-emerald-200">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white/70" />
                    <span>khandanish30599@gmail.com</span>
                  </>
                )}
              </button>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm px-4 py-3.5 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Resume PDF</span>
              </a>
            </div>

            {/* Quick Location & Availability Footnote */}
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-6 text-xs text-white/80 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Immediate / Flexible Notice
              </span>
              <span>•</span>
              <span>Open to Full-Time Roles &amp; High-Impact Contracts</span>
              <span>•</span>
              <span>India (Open to Worldwide Remote)</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CONNECTOR (↓) LEADING SEAMLESSLY INTO FOOTER
          ========================================================================= */}
      <DownArrowConnector label="FOOTER" sublabel="Connect & Socials" />

    </div>
  );
}