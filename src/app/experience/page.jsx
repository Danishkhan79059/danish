"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BorderGlow from "@/components/BorderGlow";
import {
  Sparkles,
  ArrowDown,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  Database,
  Server,
  Zap,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Rocket,
  Award,
  ExternalLink,
  Mail,
  FileText,
  Copy,
  Check,
  Building2,
  Cpu,
  Laptop,
  ArrowUpRight,
  Plane,
  Truck,
  BarChart3,
  PackageCheck,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/Icons";

// Animated Down Arrow Connector Component representing the sequential vertical flow (↓)
function DownArrowConnector({ label }) {
  return (
    <div className="flex flex-col items-center justify-center my-6 sm:my-10 relative z-10">
      {/* Top glowing stem */}
      <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-[var(--secondary)] via-[var(--accent)] to-[var(--primary)] rounded-full animate-pulse opacity-80" />

      {/* Circle with Down Arrow (↓) */}
      <div className="relative my-2 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white border-2 border-purple-200 shadow-lg shadow-purple-500/15 group hover:scale-110 transition-transform">
        <div className="absolute inset-0 rounded-full bg-canva-gradient opacity-20 animate-ping" />
        <ArrowDown className="w-6 h-6 text-[var(--primary)] stroke-[2.5]" />
      </div>

      {label && (
        <span className="mt-1.5 text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
          {label}
        </span>
      )}

      {/* Bottom glowing stem */}
      <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-[var(--primary)] to-slate-200 rounded-full opacity-80" />
    </div>
  );
}

export default function ExperiencePage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("khandanish30599@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="w-full bg-white text-slate-900 overflow-hidden selection:bg-purple-100 selection:text-purple-900">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,196,204,0.1)_0%,rgba(56,120,232,0.08)_40%,rgba(125,42,232,0.1)_70%,transparent_85%)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* =========================================================================
            TOP NODE: EXPERIENCE HERO BANNER
            ========================================================================= */}
        <section className="text-center flex flex-col items-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Recruiter &amp; Engineering Hiring Portfolio</span>
          </div>

          {/* Main Title Matching Format */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-none uppercase">
            EXPERIENCE
          </h1>

          {/* Subtitle Pills Matching Exact Format */}
          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-canva-gradient">
              3+ Years of Experience
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800">
              Full-Stack MERN Developer
            </div>
            <div className="text-base sm:text-lg font-semibold text-slate-600">
              SaaS Product Engineer
            </div>
          </div>

          {/* Recruiter Fast-Track Executive Card */}
          <div className="mt-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 text-left shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recruiter Fast Track • Available for Full-Time / Contract Roles
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                Notice: Immediate / Flexible
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-[var(--primary)]">3+</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">Years Experience</div>
                <div className="text-[10px] text-slate-500">Production Web</div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-[var(--secondary)]">7+</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">Live Platforms</div>
                <div className="text-[10px] text-slate-500">SaaS &amp; Logistics</div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-blue-600">45%</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">Dispatch Time Saved</div>
                <div className="text-[10px] text-slate-500">Rate Aggregator</div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-purple-600">500K+</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">Daily Events</div>
                <div className="text-[10px] text-slate-500">Sub-second Queries</div>
              </div>
            </div>

            {/* Quick Action Bar for Recruiters */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-canva-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Resume (PDF)</span>
                </a>

                <a
                  href="https://wa.me/917905955584?text=Hi%20Danish,%20I%20am%20a%20recruiter%20and%20would%20like%20to%20discuss%20an%20opportunity!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>khandanish30599@gmail.com</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FLOW STEP 1: WHO IS DANISH?
            ========================================================================= */}
        <DownArrowConnector label="STEP 01" />

        <section id="who-is-danish" className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-[var(--primary)] bg-[var(--primary-light)] px-3 py-1 rounded-full">
                01 • Candidate Overview
              </span>
              <span className="text-xs font-medium text-slate-400">
                Full-Stack Autonomy
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              WHO IS <span className="text-canva-gradient">DANISH</span>?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              <strong>Danish Khan</strong> is a Full-Stack MERN Developer and SaaS Product Engineer 
              based in India with <strong>3+ years of professional engineering experience</strong>. 
              He specializes in bridging the gap between complex backend architectures (databases, APIs, aggregations) 
              and fluid, high-converting modern user interfaces.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                  <Laptop className="w-4 h-4 text-[var(--primary)]" />
                  <span>End-to-End Ownership</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Takes features from whiteboard database schema design all the way to 
                  responsive UI, automated testing, and cloud deployment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-[var(--secondary)]" />
                  <span>Production Mindset</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Defensive coder who anticipates race conditions, rate limiting, network drops, 
                  and database index overhead from day one.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2.5 mb-2 font-bold text-slate-900 text-sm">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Low Maintenance</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Requires minimal oversight. Clarifies ambiguity upfront, gives concise async updates, 
                  and respects sprint deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FLOW STEP 2: WHAT DOES HE BUILD?
            ========================================================================= */}
        <DownArrowConnector label="STEP 02" />

        <section id="what-does-he-build" className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-[var(--secondary)] bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                02 • Engineering Deliverables
              </span>
              <span className="text-xs font-medium text-slate-400">
                Production-Tested Systems
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              WHAT DOES HE <span className="text-canva-gradient">BUILD</span>?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Danish engineers scalable software products that eliminate operational friction 
              and handle real transaction volume:
            </p>

            {/* 4 Systems Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--primary)] hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[var(--primary)]">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Logistics &amp; Courier SaaS</h3>
                    <span className="text-[11px] text-slate-500">AiShyp, SureShip, 4Murti, Anteair</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-carrier rate engines comparing courier APIs in real-time, automated manifest generation, 
                  Airway Bill (AWB) creation, and door-to-door tracking.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                  <span>Impact: 45% faster dispatches</span>
                  <Link href="/projects" className="hover:underline inline-flex items-center gap-1">
                    View project <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Product 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[var(--secondary)] hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-teal-700">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Data Visualization &amp; BI</h3>
                    <span className="text-[11px] text-slate-500">Vizta &amp; VizLabs</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No-code drag-and-drop tool that ingests raw CSV, Excel files, and live database streams 
                  into dynamic interactive charts, cohort tables, and executive digests.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>Impact: Sub-second query ingest</span>
                  <Link href="/projects" className="hover:underline inline-flex items-center gap-1">
                    View project <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Product 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-400 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Multi-Tenant Cloud Platforms</h3>
                    <span className="text-[11px] text-slate-500">Zero Data-Leakage Architectures</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-organization architectures with partitioned database schemas, custom domain routing, 
                  role-based access control (RBAC), and subscription billing tiers.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Security: Strict tenant segregation</span>
                  <Link href="/projects" className="hover:underline inline-flex items-center gap-1">
                    View architecture <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Product 4 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-purple-400 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">High-Throughput APIs &amp; Feeds</h3>
                    <span className="text-[11px] text-slate-500">Redis, WebSockets, Webhooks</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Asynchronous RESTful APIs with Redis in-memory caching layers, Socket.io bidirectional 
                  live updates, payment gateway listeners, and third-party webhooks.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
                  <span>Uptime: 99.9% resilience focus</span>
                  <Link href="/skills" className="hover:underline inline-flex items-center gap-1">
                    View tech stack <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FLOW STEP 3: WHAT TECHNOLOGIES DOES HE KNOW?
            ========================================================================= */}
        <DownArrowConnector label="STEP 03" />

        <section id="technologies" className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                03 • Technical Arsenal
              </span>
              <span className="text-xs font-medium text-slate-400">
                MERN &amp; Cloud Stack
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              WHAT TECHNOLOGIES DOES <span className="text-canva-gradient">HE KNOW</span>?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              A comprehensive checklist formatted for ATS screeners and engineering hiring managers:
            </p>

            <div className="mt-8 space-y-6">
              {/* Category 1: Frontend */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Frontend &amp; UI Engineering
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--primary)] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Primary Domain
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "React 19 / React.js", level: "Expert" },
                    { name: "Next.js (App Router)", level: "Advanced" },
                    { name: "JavaScript (ES6+)", level: "Expert" },
                    { name: "TypeScript", level: "Proficient" },
                    { name: "TailwindCSS v4", level: "Expert" },
                    { name: "Material UI (MUI)", level: "Advanced" },
                    { name: "Framer Motion", level: "Advanced" },
                    { name: "HTML5 & Modern CSS", level: "Expert" },
                  ].map((tech) => (
                    <span
                      key={tech.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      <span>{tech.name}</span>
                      <span className="text-[10px] text-purple-600 font-mono">({tech.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 2: Backend */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-teal-700" />
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Backend &amp; API Architecture
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                    High Concurrency
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Node.js", level: "Advanced" },
                    { name: "Express.js", level: "Advanced" },
                    { name: "RESTful Architecture", level: "Expert" },
                    { name: "Socket.io (WebSockets)", level: "Proficient" },
                    { name: "JWT & OAuth 2.0 (RBAC)", level: "Advanced" },
                    { name: "Webhook Listeners", level: "Advanced" },
                    { name: "API Gateways", level: "Proficient" },
                  ].map((tech) => (
                    <span
                      key={tech.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      <span>{tech.name}</span>
                      <span className="text-[10px] text-teal-600 font-mono">({tech.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 3: Databases & Caching */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Databases &amp; Caching
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Query Optimization
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "MongoDB & Mongoose", level: "Expert" },
                    { name: "Aggregation Pipelines", level: "Expert" },
                    { name: "PostgreSQL (SQL)", level: "Advanced" },
                    { name: "Redis In-Memory Cache", level: "Advanced" },
                    { name: "Multi-Tenant Partitioning", level: "Advanced" },
                    { name: "Database Indexing", level: "Advanced" },
                  ].map((tech) => (
                    <span
                      key={tech.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      <span>{tech.name}</span>
                      <span className="text-[10px] text-blue-600 font-mono">({tech.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 4: DevOps & Creative */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-700" />
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      DevOps, Tooling &amp; Creative
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Tooling
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Git & GitHub Workflow", level: "Expert" },
                    { name: "Docker Basics", level: "Proficient" },
                    { name: "Linux & Shell", level: "Proficient" },
                    { name: "Postman API Testing", level: "Advanced" },
                    { name: "Vercel / Netlify CI/CD", level: "Advanced" },
                    { name: "Canva Pro (UI/Mockups)", level: "Expert" },
                    { name: "DaVinci Resolve (Video Demos)", level: "Proficient" },
                  ].map((tech) => (
                    <span
                      key={tech.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
                    >
                      <span>{tech.name}</span>
                      <span className="text-[10px] text-amber-700 font-mono">({tech.level})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FLOW STEP 4: REAL-WORLD EXPERIENCE (THE HEART OF THE PAGE)
            ========================================================================= */}
        <DownArrowConnector label="STEP 04" />

        <section id="real-world-experience" className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                04 • Production Provenance
              </span>
              <span className="text-xs font-medium text-slate-400">
                Proven Track Record
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              REAL-WORLD <span className="text-canva-gradient">EXPERIENCE</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Chronological production milestones demonstrating real technical responsibility, 
              architectural decisions, and quantifiable business outcomes:
            </p>

            {/* Production Timeline Milestones */}
            <div className="mt-8 space-y-8">
              
              {/* Milestone 1 */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--primary)] space-y-3">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[var(--primary)] border-4 border-white shadow-xs" />
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Lead Full-Stack &amp; SaaS Systems Architect
                    </h3>
                    <div className="text-xs font-semibold text-slate-500">
                      Enterprise Logistics &amp; Rate Aggregation Platforms • 2023 - Present
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-[var(--primary)] font-bold text-xs border border-purple-200">
                    Flagship: AiShyp &amp; SureShip
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 pt-2">
                  <p>
                    <strong>Situation &amp; Task:</strong> Ecommerce sellers were losing hours manually comparing carrier shipping rates across individual courier websites, leading to delivery delays and dispatch errors.
                  </p>
                  <p>
                    <strong>Action:</strong> Designed and deployed a unified rate engine in Next.js and Node.js that fires parallel queries across multiple carrier APIs, normalizes disparate JSON payloads, calculates volumetric weights, and surfaces the best-fit courier in under 400ms.
                  </p>
                  <p>
                    <strong>Measurable Results:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                    <li>Reduced merchant dispatch turnaround time by <strong className="text-slate-900">45%</strong> via automated batch manifest generation.</li>
                    <li>Integrated real-time webhook listeners to broadcast live tracking status updates without client polling.</li>
                    <li>Engineered multi-tenant isolation guaranteeing zero cross-talk between competing merchant stores.</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {["Next.js", "Node.js", "MongoDB", "Express", "TailwindCSS", "Multi-Carrier APIs", "Webhooks"].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--secondary)] space-y-3">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[var(--secondary)] border-4 border-white shadow-xs" />
                
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
                    Flagship: Vizta &amp; VizLabs
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 pt-2">
                  <p>
                    <strong>Situation &amp; Task:</strong> Non-technical business users struggled to extract actionable insights from dense Excel/CSV data exports containing hundreds of thousands of rows.
                  </p>
                  <p>
                    <strong>Action:</strong> Engineered a browser-optimized streaming parser and MongoDB aggregation pipeline capable of ingesting raw spreadsheet datasets and generating interactive, draggable BI widgets, cohort heatmaps, and customizable charts.
                  </p>
                  <p>
                    <strong>Measurable Results:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                    <li>Processed <strong className="text-slate-900">500K+ daily analytics events</strong> with sub-second MongoDB query latencies.</li>
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
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-white shadow-xs" />
                
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
                    Flagship: 4Murti &amp; Anteair
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 pt-2">
                  <p>
                    <strong>Situation &amp; Task:</strong> National freight and express air cargo operations suffered from fragmented regional branch communication and manual airway bill (AWB) paperwork.
                  </p>
                  <p>
                    <strong>Action:</strong> Architected a centralized consignment tracking portal linking PAN India branches, automating AWB number generation, calculating airline volumetric formulas, and tracking vehicle fleet statuses.
                  </p>
                  <p>
                    <strong>Measurable Results:</strong>
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
            FLOW STEP 5: WHAT VALUE CAN HE BRING TO A COMPANY?
            ========================================================================= */}
        <DownArrowConnector label="STEP 05" />

        <section id="what-value-he-brings" className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                05 • Hiring ROI
              </span>
              <span className="text-xs font-medium text-slate-400">
                Why Hire Danish
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              WHAT VALUE CAN HE BRING TO <span className="text-canva-gradient">A COMPANY</span>?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              What engineering leaders and product teams gain on Day 1 by bringing Danish into the organization:
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Value 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[var(--primary)] hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[var(--primary)] mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Zero Handoff Friction</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Full-stack autonomy means features move from whiteboard concept to production deployment 
                  without the overhead of waiting for separate backend and frontend handoffs.
                </p>
              </div>

              {/* Value 2 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[var(--secondary)] hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-teal-700 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Production Reliability</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Writes defensive, battle-tested code with error boundaries, rate limiting, 
                  retry mechanisms, and database index tuning built-in.
                </p>
              </div>

              {/* Value 3 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Business-First Mindset</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Understands customer retention, checkout conversion, and operational bottlenecks. 
                  Focuses engineering effort on what directly impacts revenue.
                </p>
              </div>

              {/* Value 4 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Aesthetic UI Polish</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Bridges engineering with design. Delivers smooth micro-interactions, responsive 
                  layouts, and modern Canva-grade styling that elevates brand credibility.
                </p>
              </div>

              {/* Value 5 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-emerald-400 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-3">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">High Autonomy</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Requires minimal supervision. Capable of taking vague product specifications, 
                  clarifying edge cases, and executing independently.
                </p>
              </div>

              {/* Value 6 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 hover:border-purple-400 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mb-3">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Modern Stack Agility</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Quick to adopt Next.js 16, React 19, Tailwind v4, Redis caching, or AI-assisted 
                  APIs to keep your engineering stack cutting-edge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FLOW STEP 6: LET'S CONNECT (FINAL DESTINATION)
            ========================================================================= */}
        <DownArrowConnector label="STEP 06" />

        <section id="lets-connect" className="w-full">
          <div className="rounded-3xl border border-purple-200 bg-canva-gradient-subtle p-6 sm:p-12 shadow-lg text-center relative overflow-hidden">
            {/* Ambient Background Shimmer */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,196,204,0.1)_0%,rgba(125,42,232,0.1)_50%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
                <span>Next Step for Recruiters &amp; Founders</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                LET&apos;S <span className="text-canva-gradient">CONNECT</span>
              </h2>

              <p className="mt-4 text-base text-slate-700 leading-relaxed font-normal">
                Looking for a full-stack engineer who takes pride in building fast, reliable, 
                and revenue-driving SaaS products? Let’s schedule a technical conversation.
              </p>

              {/* Direct Recruiter Channels */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/contact"
                  className="btn-canva-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  <Mail className="w-4 h-4" />
                  <span>Schedule an Interview</span>
                </Link>

                <a
                  href="https://wa.me/917905955584?text=Hi%20Danish,%20I%20reviewed%20your%20Experience%20page%20and%20would%20like%20to%20connect!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: +91 7905955584</span>
                </a>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-canva-outline inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Download Resume PDF</span>
                </a>
              </div>

              {/* Quick Info & Socials */}
              <div className="mt-10 pt-6 border-t border-purple-200/60 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
                <button
                  onClick={handleCopyEmail}
                  className="hover:text-[var(--primary)] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>khandanish30599@gmail.com</span>
                </button>

                <span>•</span>

                <a
                  href="https://github.com/Danishkhan79059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>

                <span>•</span>

                <a
                  href="https://www.linkedin.com/in/danishkhan786/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>

                <span>•</span>

                <span>India (Open to Worldwide Remote)</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
