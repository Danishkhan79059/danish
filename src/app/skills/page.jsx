"use client";

import { useState } from "react";
import Link from "next/link";
import BorderGlow from "@/components/BorderGlow";
import {
  Code2,
  Smartphone,
  Database,
  Palette,
  FileSpreadsheet,
  Layers,
  Sparkles,
  CheckCircle2,
  Video,
  ArrowRight,
  Monitor,
  Server,
  Zap,
  Cpu,
} from "lucide-react";

const SKILL_CATEGORIES = [
  {
    id: "mern-fullstack",
    categoryTitle: "MERN Stack & Web Core",
    icon: Code2,
    badgeText: "Core Engineering",
    description:
      "End-to-end full-stack web architecture leveraging React, Next.js, Node.js, and Express for high-performance, responsive applications.",
    glowColor: "265 80 65", // Canva Purple
    accentBorder: "border-purple-200",
    skills: [
      { name: "React.js", level: "Expert", desc: "Component architecture, hooks, state management & SSR optimization" },
      { name: "Next.js", level: "Advanced", desc: "App Router, Server Components, SEO optimization & Turbopack" },
      { name: "Node.js", level: "Advanced", desc: "Asynchronous runtime, event loop, streaming & microservices" },
      { name: "Express.js", level: "Advanced", desc: "RESTful APIs, routing middleware, authentication & security" },
      { name: "JavaScript (ES6+)", level: "Expert", desc: "Modern syntax, promises, closures, DOM manipulation & async/await" },
      { name: "MERN Full Stack", level: "Expert", desc: "Integrated end-to-end full-stack production deployments" },
    ],
  },
  {
    id: "ui-design-styling",
    categoryTitle: "UI Design & Modern Styling",
    icon: Palette,
    badgeText: "User Interface & Experience",
    description:
      "Crafting stunning, accessible, and responsive user interfaces with utility-first CSS, design systems, and animated component libraries.",
    glowColor: "185 90 55", // Canva Cyan
    accentBorder: "border-cyan-200",
    skills: [
      { name: "TailwindCSS", level: "Expert", desc: "Responsive utility styling, custom themes, dark mode & Tailwind v4" },
      { name: "CSS3 & Modern CSS", level: "Expert", desc: "Flexbox, Grid, keyframe animations, glassmorphism & gradients" },
      { name: "Material UI (MUI)", level: "Advanced", desc: "Component theming, design system consistency & data tables" },
      { name: "React Bits", level: "Advanced", desc: "Interactive UI components, border glows, micro-interactions & animations" },
    ],
  },
  {
    id: "mobile-development",
    categoryTitle: "Mobile App Development",
    icon: Smartphone,
    badgeText: "Cross-Platform Mobile",
    description:
      "Building seamless native mobile experiences for both iOS and Android platforms with shared React codebase.",
    glowColor: "215 85 60", // Canva Royal Blue
    accentBorder: "border-blue-200",
    skills: [
      { name: "React Native", level: "Proficient", desc: "Cross-platform mobile applications for iOS & Android devices" },
      { name: "Mobile UI & Navigation", level: "Proficient", desc: "React Navigation, mobile gesture handling & touch optimization" },
      { name: "Native Device APIs", level: "Proficient", desc: "Camera, async storage, notifications & network connectivity" },
    ],
  },
  {
    id: "databases",
    categoryTitle: "Databases (SQL & NoSQL)",
    icon: Database,
    badgeText: "Data Architecture",
    description:
      "Robust data modeling, high-throughput queries, indexing, and management across both relational (SQL) and document (NoSQL) databases.",
    glowColor: "265 85 60", // Purple
    accentBorder: "border-purple-200",
    skills: [
      { name: "MongoDB (NoSQL)", level: "Expert", desc: "Document schema design, Mongoose ORM, aggregation pipelines & indexing" },
      { name: "PostgreSQL (SQL)", level: "Advanced", desc: "Relational modeling, complex joins, foreign keys & ACID transactions" },
      { name: "SQL & NoSQL Integration", level: "Advanced", desc: "Hybrid database architecture, data migration & query performance tuning" },
    ],
  },
  {
    id: "creative-multimedia",
    categoryTitle: "Graphic Design & Multimedia",
    icon: Video,
    badgeText: "Creative & Visual",
    description:
      "Visual branding, marketing assets, promotional graphics, and video post-production editing for modern digital products.",
    glowColor: "185 85 50", // Cyan
    accentBorder: "border-teal-200",
    skills: [
      { name: "Canva", level: "Expert", desc: "Graphic design, brand kits, marketing creatives, pitch decks & UI mockups" },
      { name: "DaVinci Resolve", level: "Proficient", desc: "Video editing, color grading, audio leveling & promotional cuts" },
      { name: "Visual Storytelling", level: "Advanced", desc: "Engaging product demo presentations & multimedia assets" },
    ],
  },
  {
    id: "mis-analytics",
    categoryTitle: "Business Analytics & MIS Operations",
    icon: FileSpreadsheet,
    badgeText: "Data & Reporting",
    description:
      "Data organization, executive MIS reporting, formula automation, and business intelligence queries using advanced spreadsheet modeling.",
    glowColor: "150 80 45", // Greenish
    accentBorder: "border-emerald-200",
    skills: [
      { name: "Microsoft Excel (Advanced)", level: "Expert", desc: "Nested formulas (XLOOKUP, INDEX/MATCH), pivot tables & data hygiene" },
      { name: "MIS Query & Reporting", level: "Advanced", desc: "Automated MIS dashboards, business performance metrics & summary reports" },
      { name: "Data Cleaning & Structuring", level: "Advanced", desc: "Large dataset sanitization, conditional formatting & error auditing" },
    ],
  },
];

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories =
    selectedCategory === "all"
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c.id === selectedCategory);

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
            <span>Interactive Skills Matrix • React Bits Powered</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Technical Proficiency &amp;{" "}
            <span className="text-canva-gradient">Creative Toolset</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From MERN full-stack systems and cross-platform React Native apps to SQL/NoSQL databases,
            Canva visual design, DaVinci video editing, and Excel MIS analytics.
          </p>

          {/* Quick Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "btn-canva-primary shadow-md"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              All Capabilities (6)
            </button>

            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "btn-canva-primary shadow-md"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {cat.categoryTitle}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SKILLS GRID WITH REACT BITS BORDER GLOW
          ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <BorderGlow
                  key={category.id}
                  edgeSensitivity={25}
                  glowColor={category.glowColor}
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
                  <div className="p-7 sm:p-8 flex flex-col justify-between h-full">
                    {/* Card Top */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canva-gradient text-white shadow-md shadow-purple-500/20">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-0.5 rounded-full">
                              {category.badgeText}
                            </span>
                            <h2 className="text-xl font-black text-slate-900 mt-1">
                              {category.categoryTitle}
                            </h2>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {category.description}
                      </p>

                      {/* Individual Skill Items */}
                      <div className="flex flex-col gap-3">
                        {category.skills.map((skill, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition-all flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" />
                                <span className="text-sm font-bold text-slate-900">
                                  {skill.name}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-2xs">
                                {skill.level}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 pl-6 leading-normal">
                              {skill.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Bottom Meta */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Zap className="w-3.5 h-3.5 text-[var(--secondary)]" />
                        Hover near edges for React Bits glow
                      </span>
                      <span className="font-semibold text-slate-700">
                        {category.skills.length} Tools
                      </span>
                    </div>
                  </div>
                </BorderGlow>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-t border-slate-100">
        <div className="mx-auto max-w-5xl rounded-3xl bg-canva-gradient p-8 sm:p-12 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Engineering &amp; Design</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Looking for someone who bridges code, databases &amp; visual design?
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Let&apos;s build scalable applications with high visual appeal and rock-solid architecture.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200 px-7 py-3.5 rounded-xl text-sm font-black shadow-lg inline-flex items-center gap-2"
          >
            <span>Let&apos;s Connect</span>
            <ArrowRight className="w-4 h-4 text-[var(--primary)]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
