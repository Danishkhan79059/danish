"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BorderGlow from "@/components/BorderGlow";
import {
  Sparkles,
  Code2,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  FileText,
  Mail,
  Terminal,
  Briefcase,
  Award,
  ShieldCheck,
  Activity,
  BarChart3,
  Database,
  Server,
  Globe,
  Rocket,
  HeartHandshake,
  TrendingUp,
  UserCheck,
  Timer,
  SlidersHorizontal,
  Compass,
  Laptop,
  Check,
  PhoneCall,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/Icons";

// 5 Core Questions Navigation Map
const QUESTIONS_NAV = [
  { id: "who-is-danish", number: "01", label: "Who is Danish?" },
  { id: "what-he-builds", number: "02", label: "What He Builds" },
  { id: "technologies", number: "03", label: "Tech Stack" },
  { id: "real-world-experience", number: "04", label: "Real Experience" },
  { id: "value-to-company", number: "05", label: "Value to Your Company" },
];

// Tech Stack Matrix Data
const TECH_CATEGORIES = [
  { id: "all", label: "All Technologies" },
  { id: "frontend", label: "Frontend & UI" },
  { id: "backend", label: "Backend & APIs" },
  { id: "database", label: "Databases & Storage" },
  { id: "devops", label: "DevOps & Tools" },
  { id: "creative", label: "UI Design & Media" },
];

const TECH_ITEMS = [
  // Frontend
  { name: "React 19 / React.js", category: "frontend", level: "Expert", desc: "Component architecture, hooks, state patterns & SSR optimization" },
  { name: "Next.js (App Router)", category: "frontend", level: "Advanced", desc: "Server Components, dynamic routing, Turbopack & technical SEO" },
  { name: "JavaScript (ES6+)", category: "frontend", level: "Expert", desc: "Asynchronous patterns, closures, DOM performance & modern syntax" },
  { name: "TypeScript", category: "frontend", level: "Proficient", desc: "Type-safe interfaces, predictable payloads & robust contract types" },
  { name: "TailwindCSS v4", category: "frontend", level: "Expert", desc: "Modern utility styling, CSS design tokens, dark themes & animations" },
  { name: "Material UI (MUI)", category: "frontend", level: "Advanced", desc: "Enterprise design systems, complex data tables & form components" },
  { name: "Framer Motion", category: "frontend", level: "Advanced", desc: "Micro-animations, layout transitions & interactive physics" },
  
  // Backend
  { name: "Node.js", category: "backend", level: "Advanced", desc: "Event-driven runtime, asynchronous streams & high concurrency" },
  { name: "Express.js", category: "backend", level: "Advanced", desc: "Modular REST APIs, middleware pipelines & controller architecture" },
  { name: "RESTful Architecture", category: "backend", level: "Expert", desc: "Idempotent endpoints, HTTP status standards & pagination" },
  { name: "Socket.io (WebSockets)", category: "backend", level: "Proficient", desc: "Real-time bidirectional event streaming & live sync feeds" },
  { name: "JWT & OAuth 2.0", category: "backend", level: "Advanced", desc: "Role-Based Access Control (RBAC), token rotation & session security" },
  { name: "Webhook Listeners", category: "backend", level: "Advanced", desc: "Asynchronous event ingestion from couriers, payment gateways & CRMs" },

  // Databases
  { name: "MongoDB & Mongoose", category: "database", level: "Expert", desc: "Document schemas, complex aggregation pipelines & indexing" },
  { name: "PostgreSQL", category: "database", level: "Advanced", desc: "Relational modeling, multi-table joins & ACID transaction guarantees" },
  { name: "Redis Caching", category: "database", level: "Advanced", desc: "Sub-millisecond in-memory cache, rate limiting & session stores" },
  { name: "Multi-Tenant Isolation", category: "database", level: "Advanced", desc: "Partitioned datasets, tenant identification & zero cross-talk security" },

  // DevOps & Tools
  { name: "Git & GitHub", category: "devops", level: "Expert", desc: "Version control, branching workflows, pull requests & code review" },
  { name: "Postman & API Testing", category: "devops", level: "Advanced", desc: "Automated test suites, environment variables & mock servers" },
  { name: "Docker Basics", category: "devops", level: "Proficient", desc: "Containerized development environments & reproducible builds" },
  { name: "Linux & Shell Scripting", category: "devops", level: "Proficient", desc: "Server management, cron jobs & process monitors" },
  { name: "Vercel & Netlify", category: "devops", level: "Advanced", desc: "Edge functions, continuous integration & instant previews" },

  // Creative
  { name: "Canva Pro", category: "creative", level: "Expert", desc: "UI wireframes, brand kits, pitch decks & marketing visual assets" },
  { name: "DaVinci Resolve", category: "creative", level: "Proficient", desc: "Product walkthrough videos, demo editing & dynamic video cuts" },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCodeTab, setActiveCodeTab] = useState("overview");

  const filteredTech =
    activeTab === "all"
      ? TECH_ITEMS
      : TECH_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="w-full bg-white text-slate-900 overflow-hidden selection:bg-purple-100 selection:text-purple-900">
      {/* =========================================================================
          HERO BANNER & QUESTION JUMP BAR
          ========================================================================= */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(0,196,204,0.12)_0%,rgba(56,120,232,0.08)_45%,rgba(125,42,232,0.1)_75%,transparent_85%)] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-6 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Discover Danish Khan • Full-Stack MERN &amp; SaaS Engineer</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight max-w-4xl"
          >
            Who is <span className="text-canva-gradient">Danish Khan</span>, and What Can He Build for You?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed font-normal"
          >
            A full-stack product engineer with <strong>3+ years of production experience</strong> crafting 
            multi-tenant SaaS architectures, high-throughput logistics aggregators, and real-time data visualization platforms.
          </motion.p>

          {/* Quick Action Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/contact"
              className="btn-canva-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>Let's Discuss Opportunities</span>
            </Link>

            <Link
              href="/projects"
              className="btn-canva-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold"
            >
              <Layers className="w-4 h-4 text-[var(--primary)]" />
              <span>View 7+ Live Platforms</span>
            </Link>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Download Resume</span>
            </a>
          </motion.div>
        </div>

        {/* 5-Question Sticky Navigation Bar */}
        <div className="mt-12 max-w-5xl mx-auto pt-6 border-t border-slate-100">
          <div className="text-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Jump to specific answer
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {QUESTIONS_NAV.map((q) => (
              <a
                key={q.id}
                href={`#${q.id}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-[var(--primary-light)] text-slate-700 hover:text-[var(--primary)] border border-slate-200 hover:border-[var(--primary)] transition-all shadow-xs group"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-500 group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]">
                  {q.number}
                </span>
                <span>{q.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE DEVELOPER TERMINAL / SNAPSHOT
          ========================================================================= */}
      <section className="py-8 bg-slate-50/60 border-b border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            {/* Terminal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 ml-2">
                  danish-khan-developer-snapshot.js
                </span>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center gap-1.5">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "metrics", label: "Production Telemetry" },
                  { id: "philosophy", label: "Core Principles" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCodeTab(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeCodeTab === tab.id
                        ? "bg-[var(--primary)] text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Content */}
            <div className="pt-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-800 overflow-x-auto">
              {activeCodeTab === "overview" && (
                <div className="space-y-1 text-slate-700">
                  <p><span className="text-purple-600 font-bold">const</span> developer = &#123;</p>
                  <p className="pl-4"><span className="text-blue-600 font-medium">name</span>: <span className="text-emerald-700 font-semibold">&quot;Danish Khan&quot;</span>,</p>
                  <p className="pl-4"><span className="text-blue-600 font-medium">title</span>: <span className="text-emerald-700 font-semibold">&quot;Full-Stack MERN Developer &amp; SaaS Product Engineer&quot;</span>,</p>
                  <p className="pl-4"><span className="text-blue-600 font-medium">experience</span>: <span className="text-amber-700 font-semibold">&quot;3+ Years in High-Impact Engineering&quot;</span>,</p>
                  <p className="pl-4"><span className="text-blue-600 font-medium">status</span>: <span className="text-emerald-600 font-semibold">&quot;Ready for Product Leadership / High-Growth Roles&quot;</span>,</p>
                  <p className="pl-4"><span className="text-blue-600 font-medium">primaryFocus</span>: [<span className="text-emerald-700">&quot;Multi-Tenant SaaS&quot;</span>, <span className="text-emerald-700">&quot;Logistics Aggregators&quot;</span>, <span className="text-emerald-700">&quot;Data Viz Dashboards&quot;</span>],</p>
                  <p className="pl-4"><span className="text-blue-600 font-medium">workEthic</span>: <span className="text-purple-700 font-bold">&quot;Zero handoff friction, pixel-perfect UX, scalable backend logic&quot;</span></p>
                  <p>&#125;;</p>
                </div>
              )}

              {activeCodeTab === "metrics" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="text-xs text-slate-500">Live Platforms</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">7+ Deployed</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Production grade</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="text-xs text-slate-500">Dispatch Time</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">45% Faster</div>
                    <div className="text-[11px] text-emerald-600 font-medium">AiShyp rate engine</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="text-xs text-slate-500">Analytics Events</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">500K+ / Day</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Sub-second queries</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="text-xs text-slate-500">Tenant Cross-Talk</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">0% Leakage</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Isolated RBAC schemas</div>
                  </div>
                </div>
              )}

              {activeCodeTab === "philosophy" && (
                <div className="space-y-1.5 text-slate-700">
                  <p className="text-slate-500">// Danish's 3 Non-Negotiable Engineering Rules:</p>
                  <p>1. <strong className="text-slate-900">User experience is not an afterthought:</strong> If an interface feels slow, cluttered, or difficult to use, excellent backend architecture cannot save it.</p>
                  <p>2. <strong className="text-slate-900">Architect for resilience:</strong> Handle network drops, rate limits, schema anomalies, and external third-party outages gracefully.</p>
                  <p>3. <strong className="text-slate-900">Ship code that moves business needles:</strong> Write clean, understandable code that delivers measurable speed and customer retention.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUESTION 1: WHO IS DANISH?
          ========================================================================= */}
      <section id="who-is-danish" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-start max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              Question 01 • Bio &amp; Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Who is <span className="text-canva-gradient">Danish Khan</span>?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              A dedicated software engineer who bridges the gap between complex operational requirements 
              and fluid, high-converting digital products.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Story & Biography (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed font-normal">
              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                Hi! I’m Danish Khan. Over the past 3+ years, I’ve dedicated my career to building 
                resilient web applications and full-scale SaaS platforms that solve real, painful problems 
                for modern businesses.
              </p>

              <p>
                My engineering journey began with an insatiable curiosity about how software powers businesses behind the scenes. 
                Rather than sticking to isolated tutorials or static websites, I threw myself into the deep end of production engineering:
                handling high-throughput <strong>logistics aggregator platforms</strong>, coordinating heterogeneous courier APIs, 
                and crafting <strong>dynamic drag-and-drop data visualization tools</strong> that transform raw CSV and database queries into intuitive executive dashboards.
              </p>

              <p>
                I don’t view myself as just a coder who translates tickets into syntax. I act as an engineering partner: 
                I analyze user flows, challenge assumptions when simpler solutions exist, safeguard database performance with strict indexing, 
                and ensure that the final product feels effortless, snappy, and visually delightful.
              </p>

              {/* Personal Philosophy Card */}
              <div className="mt-6 rounded-2xl bg-canva-gradient-subtle border border-[var(--primary-glow)] p-6 relative overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[var(--primary)]" />
                  <span>The Danish Khan Guarantee</span>
                </div>
                <blockquote className="text-base sm:text-lg font-semibold text-slate-900 italic">
                  &quot;Great engineering isn’t about writing the most complex code. It’s about building reliable, maintainable systems that make complex business workflows feel deceptively simple for users.&quot;
                </blockquote>
              </div>
            </div>

            {/* Profile Snapshot Cards (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[var(--primary)]">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Engineering Domain</div>
                    <div className="text-xs text-slate-500">MERN &amp; SaaS Systems</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specialized in full-stack JavaScript architectures, multi-tenant databases, 
                  server-rendered React frameworks, and resilient REST/WebSocket protocols.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[var(--secondary)] hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-teal-700">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Location &amp; Availability</div>
                    <div className="text-xs text-slate-500">India • Global Remote Friendly</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based in India with proven remote collaboration experience. Comfortable working 
                  across flexible timezones, asynchronous communication, and sprint deadlines.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[var(--accent)]">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Collaboration Mindset</div>
                    <div className="text-xs text-slate-500">Proactive &amp; Low Maintenance</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clear written updates, thorough self-QA before PR submissions, and a relentless 
                  commitment to keeping repositories clean and well-structured.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUESTION 2: WHAT DOES HE BUILD?
          ========================================================================= */}
      <section id="what-he-builds" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--secondary)]" />
              Question 02 • Products &amp; Platforms
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              What Does Danish <span className="text-canva-gradient">Build</span>?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Danish builds production-ready systems that handle high transaction volumes, 
              intricate data calculations, and high-stakes operational workflows.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Pillar 1: Logistics Aggregators */}
            <BorderGlow
              glowColor="185 90 55"
              edgeSensitivity={25}
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              coneSpread={25}
              animated={false}
              colors={["#00c4cc", "#3878e8", "#7d2ae8"]}
              fillOpacity={0.4}
              className="p-1 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="p-7 sm:p-8 flex flex-col justify-between h-full bg-white rounded-[23px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-[var(--secondary)] border border-cyan-200">
                      <Rocket className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                      Flagship Expertise
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Logistics &amp; Multi-Carrier SaaS Aggregators
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Platforms that connect merchants with multiple courier partners simultaneously. 
                    Features live rate engines, automatic Airway Bill (AWB) generation, weight reconciliation, 
                    real-time tracking webhooks, and automated PDF shipping manifests.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">AiShyp</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">SureShip</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">4Murti Surface</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Anteair Freight</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">ShypKart</span>
                </div>
              </div>
            </BorderGlow>

            {/* Pillar 2: Data Visualization Platforms */}
            <BorderGlow
              glowColor="265 80 65"
              edgeSensitivity={25}
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              coneSpread={25}
              animated={false}
              colors={["#00c4cc", "#3878e8", "#7d2ae8"]}
              fillOpacity={0.4}
              className="p-1 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="p-7 sm:p-8 flex flex-col justify-between h-full bg-white rounded-[23px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[var(--primary)] border border-purple-200">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                      No-Code / BI
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Data Visualization &amp; BI Tooling
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Dynamic drag-and-drop analytics engines allowing non-technical users to ingest raw CSV, 
                    Excel sheets, or live database streams, transforming them into interactive line charts, 
                    heatmaps, cohort analysis tables, and automated executive PDF digests.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Vizta Data Tool</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">VizLabs Research</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Aggregation Pipelines</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Sub-second Ingestion</span>
                </div>
              </div>
            </BorderGlow>

            {/* Pillar 3: Multi-Tenant SaaS Architecture */}
            <BorderGlow
              glowColor="215 85 60"
              edgeSensitivity={25}
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              coneSpread={25}
              animated={false}
              colors={["#00c4cc", "#3878e8", "#7d2ae8"]}
              fillOpacity={0.4}
              className="p-1 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="p-7 sm:p-8 flex flex-col justify-between h-full bg-white rounded-[23px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--accent)] border border-blue-200">
                      <Layers className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Enterprise Cloud
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Multi-Tenant Cloud Architectures
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    Scalable SaaS platforms designed for multiple independent organizations with 
                    isolated tenant partitions, custom subdomains, granular Role-Based Access Control (RBAC), 
                    subscription billing cycles, and organization-level audit logs.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Tenant Isolation</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">RBAC Tiering</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Subscription Billing</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Zero Cross-Talk</span>
                </div>
              </div>
            </BorderGlow>

            {/* Pillar 4: High-Throughput APIs & Real-Time Sync */}
            <BorderGlow
              glowColor="265 80 65"
              edgeSensitivity={25}
              backgroundColor="#ffffff"
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              coneSpread={25}
              animated={false}
              colors={["#00c4cc", "#3878e8", "#7d2ae8"]}
              fillOpacity={0.4}
              className="p-1 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="p-7 sm:p-8 flex flex-col justify-between h-full bg-white rounded-[23px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[var(--primary)] border border-purple-200">
                      <Server className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                      High Performance
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    High-Throughput APIs &amp; Live Event Streams
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    High-concurrency backend services utilizing Redis in-memory caching, rate-limited public APIs, 
                    resilient webhook receiver queues, and WebSockets (Socket.io) for live collaborative feeds 
                    and live delivery status monitors.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">RESTful Endpoints</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Redis In-Memory</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Socket.io Streaming</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700">Payment Webhooks</span>
                </div>
              </div>
            </BorderGlow>
          </div>

          {/* Deep Dive Action */}
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="btn-canva-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform"
            >
              <span>Explore All 7 Production Projects in Detail</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUESTION 3: WHAT TECHNOLOGIES DOES HE KNOW?
          ========================================================================= */}
      <section id="technologies" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              Question 03 • Technical Arsenal
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              What Technologies Does <span className="text-canva-gradient">Danish Know</span>?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              An expert in modern full-stack web engineering, from responsive client interfaces 
              to robust database aggregation pipelines and micro-interaction animations.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {TECH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === cat.id
                    ? "bg-canva-gradient text-white shadow-md font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tech Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            <AnimatePresence>
              {filteredTech.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[var(--primary)] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.level === "Expert"
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Link to Full Skills Matrix */}
          <div className="mt-10 text-center">
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline"
            >
              <span>View interactive Skills Matrix with proficiency breakdowns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUESTION 4: WHAT KIND OF REAL-WORLD EXPERIENCE DOES HE HAVE?
          ========================================================================= */}
      <section id="real-world-experience" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--secondary)]" />
              Question 04 • Battle-Tested Track Record
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Real-World <span className="text-canva-gradient">Production Experience</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Not textbook theory or toy apps. Danish has built and deployed systems operating 
              in high-stakes environments where reliability, correctness, and speed matter.
            </p>
          </div>

          {/* 4 Impact Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-14">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs text-center hover:border-[var(--primary)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-canva-gradient">3+</div>
              <div className="mt-2 text-sm font-bold text-slate-900">Years Active Experience</div>
              <div className="mt-0.5 text-xs text-slate-500 font-medium">Production full-stack dev</div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs text-center hover:border-[var(--secondary)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-canva-gradient">7+</div>
              <div className="mt-2 text-sm font-bold text-slate-900">Live Deployed Systems</div>
              <div className="mt-0.5 text-xs text-slate-500 font-medium">SaaS, BI &amp; courier apps</div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs text-center hover:border-blue-400 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-canva-gradient">45%</div>
              <div className="mt-2 text-sm font-bold text-slate-900">Dispatch Time Cut</div>
              <div className="mt-0.5 text-xs text-slate-500 font-medium">Automated rate aggregation</div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs text-center hover:border-[var(--primary)] transition-all">
              <div className="text-3xl sm:text-4xl font-black text-canva-gradient">500K+</div>
              <div className="mt-2 text-sm font-bold text-slate-900">Daily Events Handled</div>
              <div className="mt-0.5 text-xs text-slate-500 font-medium">Sub-second query speeds</div>
            </div>
          </div>

          {/* Real-World Case Studies / Proven Scenarios */}
          <div className="space-y-6">
            {/* Scenario 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-[var(--primary)] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold font-mono text-[var(--primary)] uppercase tracking-wider">
                    Case Study 01 • Multi-Carrier Logistics Synchronization
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    Normalizing Heterogeneous Courier APIs for Instant Merchant Checkout
                  </h3>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  AiShyp &amp; SureShip
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>The Challenge:</strong> Different delivery carriers (express air, ground cargo, local couriers) provide wildly differing API payloads, latency, and error codes. Merchants were wasting hours manually checking each portal to find the cheapest, fastest rate.
                <br />
                <strong>Danish&apos;s Solution:</strong> Architected a centralized rate calculation service in Node.js that fires parallel queries across courier partners, normalizes data payloads, factors in volumetric weight algorithms, and surfaces ranked choices to the merchant in under 400 milliseconds.
              </p>
            </div>

            {/* Scenario 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-[var(--secondary)] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold font-mono text-[var(--secondary)] uppercase tracking-wider">
                    Case Study 02 • High-Volume Data Ingestion &amp; Visualization
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    Building a No-Code Visualization Engine for Gigantic Spreadsheets
                  </h3>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  Vizta &amp; VizLabs
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>The Challenge:</strong> Non-technical business teams struggled to decipher dense CSV/Excel exports with hundreds of thousands of rows, slowing down management decision-making.
                <br />
                <strong>Danish&apos;s Solution:</strong> Built a browser-optimized streaming parser and MongoDB aggregation pipeline capable of ingesting raw datasets, automatically categorizing headers, and generating interactive canvas-rendered charts with drag-and-drop customization in seconds.
              </p>
            </div>

            {/* Scenario 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-blue-400 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold font-mono text-[var(--accent)] uppercase tracking-wider">
                    Case Study 03 • Zero Data-Leakage Multi-Tenancy
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    Isolating Enterprise Datasets in Multi-Tenant Environments
                  </h3>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  SaaS Architecture
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>The Challenge:</strong> When onboarding multiple competing enterprise brands on a single SaaS instance, even the slightest accidental data leakage across organizations is fatal to the business.
                <br />
                <strong>Danish&apos;s Solution:</strong> Implemented middleware-enforced tenant segregation using scoped database queries, cryptographic JWT claims, and strict role-based permission gates (RBAC) ensuring foolproof partition isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUESTION 5: WHAT VALUE CAN HE BRING TO A PRODUCT/COMPANY?
          ========================================================================= */}
      <section id="value-to-company" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              Question 05 • Why Hire Danish
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              What Value Can Danish Bring to <span className="text-canva-gradient">Your Team</span>?
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Hiring Danish is not just adding another developer; it means gaining a self-driven 
              product builder who increases overall engineering velocity and product quality.
            </p>
          </div>

          {/* 6 High-Impact Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Value 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[var(--primary)] mb-5 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Rapid Zero-to-One Velocity</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Full-stack autonomy means features move from whiteboard concept to production deployment 
                without the delays of constant frontend-backend handoff friction.
              </p>
            </div>

            {/* Value 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[var(--secondary)] hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-teal-700 mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Production-First Resilience</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Builds with edge cases, graceful error boundaries, API retries, rate limiting, 
                and database index optimization in mind from day one.
              </p>
            </div>

            {/* Value 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--accent)] mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Business &amp; Product Alignment</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Understands customer acquisition, conversion funnels, and churn reduction. 
                Focuses engineering effort on features that directly move company metrics.
              </p>
            </div>

            {/* Value 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Modern Aesthetic Polish</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                A rare developer who cares deeply about design systems, fluid micro-interactions, 
                clean typography, and responsive perfection on every viewport.
              </p>
            </div>

            {/* Value 5 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mb-5 group-hover:scale-110 transition-transform">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Autonomous Ownership</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Requires minimal hand-holding. Takes vague requirements, proactively researches solutions, 
                clarifies constraints, and executes reliably.
              </p>
            </div>

            {/* Value 6 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 mb-5 group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Modern Tech Agility</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fluent in Next.js 16, React 19, Tailwind v4, Redis caching, and fast to adopt 
                AI integrations or new cloud conventions as your product scales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION SECTION
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,196,204,0.08)_0%,rgba(125,42,232,0.08)_60%,transparent_80%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Ready for the Next Milestone</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Have a High-Impact Role or SaaS Product? <br />
            <span className="text-canva-gradient">Let&apos;s Build Together</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you need an autonomous full-stack product engineer to launch a new SaaS venture, 
            or a reliable senior contributor to scale your existing systems, Danish is ready to deliver.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/contact"
              className="btn-canva-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Danish Directly</span>
            </Link>

            <a
              href="https://wa.me/917905955584?text=Hi%20Danish,%20I%20reviewed%20your%20About%20page%20and%20would%20like%20to%20connect!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href="/projects"
              className="btn-canva-outline inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
            >
              <Layers className="w-4 h-4 text-[var(--primary)]" />
              <span>Explore Projects</span>
            </Link>
          </div>

          {/* Social Links Row */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-slate-500">
            <a
              href="https://github.com/Danishkhan79059"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold hover:text-[var(--primary)] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>

            <span className="text-slate-300">•</span>

            <a
              href="https://www.linkedin.com/in/danishkhan786/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold hover:text-[var(--accent)] transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn Profile</span>
            </a>

            <span className="text-slate-300">•</span>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold hover:text-slate-900 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Resume PDF</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
