"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  FileCode2,
  Lock,
  Zap,
  Minimize2,
  Download,
  Copy,
  Upload,
  Binary,
  KeyRound,
  FileSpreadsheet,
  Eye,
} from "lucide-react";

export default function SeoContentSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is JSON?",
      a: "JSON (JavaScript Object Notation) is a lightweight, human-readable data interchange format widely used in web development, REST APIs, and configuration files. It is language-independent and uses standard conventions familiar to programmers of the C-family of languages.",
    },
    {
      q: "What does a JSON formatter do?",
      a: "A JSON formatter takes raw, unformatted, or minified JSON text and reorganizes it with proper line breaks and indentation (usually 2 spaces, 4 spaces, or tabs). This turns dense, hard-to-read data structures into clear, hierarchical, readable trees.",
    },
    {
      q: "How do I validate JSON?",
      a: "Simply paste your JSON string into the input editor and click 'Validate'. If your syntax conforms to RFC 8259, you will receive a confirmation message. If invalid, the tool pinpoints the exact line number, column, and descriptive error message to help you fix syntax problems instantly.",
    },
    {
      q: "Can I minify JSON?",
      a: "Yes! Click the 'Minify' button to strip out all unnecessary whitespace, indentations, and newlines. Minified JSON significantly reduces payload size, which is ideal for production network transfers and storage.",
    },
    {
      q: "Is my JSON uploaded to any server?",
      a: "No. Absolutely nothing is sent across the internet. All parsing, validation, formatting, and file exports are executed locally inside your web browser using client-side JavaScript and standard Web APIs.",
    },
    {
      q: "Can I download formatted JSON?",
      a: "Yes. Click the 'Download' button in the output panel to save your formatted or minified JSON directly as a 'formatted.json' file using browser Blob URLs.",
    },
    {
      q: "Can I format large JSON files?",
      a: "Yes, our client-side engine efficiently processes multi-megabyte JSON payloads directly in browser memory without server timeouts or payload limits.",
    },
  ];

  const relatedTools = [
    {
      title: "JSON Validator",
      desc: "Instant RFC-compliant syntax checking with line-level error highlights.",
      href: "/tools/json-validator",
      badge: "Syntax Check",
      icon: CheckCircle,
      isAvailable: false,
    },
    {
      title: "JSON Minifier",
      desc: "Compress JSON files to the smallest footprint for high-throughput APIs.",
      href: "/tools/json-minifier",
      badge: "Compression",
      icon: Minimize2,
      isAvailable: false,
    },
    {
      title: "JSON to CSV",
      desc: "Convert hierarchical JSON collections into flat tabular spreadsheet formats.",
      href: "/tools/json-to-csv",
      badge: "Converter",
      icon: FileSpreadsheet,
      isAvailable: false,
    },
    {
      title: "JSON Viewer",
      desc: "Explore JSON objects with collapsible tree nodes, search, and type badges.",
      href: "/tools/json-viewer",
      badge: "Tree View",
      icon: Eye,
      isAvailable: false,
    },
    {
      title: "JWT Decoder",
      desc: "Inspect JSON Web Tokens header, payload claims, and expiration client-side.",
      href: "/tools/jwt-decoder",
      badge: "Security",
      icon: KeyRound,
      isAvailable: false,
    },
    {
      title: "Base64 Encoder/Decoder",
      desc: "Encode and decode strings, images, and binary objects securely in browser.",
      href: "/tools/base64-converter",
      badge: "Encoding",
      icon: Binary,
      isAvailable: false,
    },
  ];

  return (
    <div className="mt-16 space-y-16 border-t border-slate-200/80 pt-16">
      {/* 1. WHAT IS A JSON FORMATTER? */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/80 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          <FileCode2 className="h-3.5 w-3.5" />
          <span>Developer Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          What is a JSON Formatter?
        </h2>
        <p className="text-base leading-relaxed text-slate-600">
          A <strong>JSON Formatter</strong> (often referred to as a JSON Beautifier) is an essential developer tool designed to convert compressed, unformatted, or minified JSON strings into clean, well-structured, human-readable data structures. Modern web applications and microservices communicate predominantly through JSON APIs, but raw payloads are frequently compacted to save network bandwidth, making manual debugging, auditing, and reviewing exceptionally difficult.
        </p>
        <p className="text-base leading-relaxed text-slate-600">
          By parsing the input tree and applying consistent indentation, color-coded syntax highlights, and line breaks, a JSON formatter transforms dense strings into an intelligible format where keys, values, arrays, and nested objects are clearly distinguished.
        </p>
      </section>

      {/* 2. HOW TO FORMAT JSON */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          How to Format JSON
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Provide Your JSON",
              desc: "Paste your raw JSON into the input editor, or use the 'Upload' button to load a .json or .txt file directly from your computer.",
            },
            {
              step: "02",
              title: "Select Spacing",
              desc: "Choose your preferred indentation level: 2 spaces (standard), 4 spaces (expanded), or tab characters.",
            },
            {
              step: "03",
              title: "Click Beautify",
              desc: "Press 'Beautify' (or use keyboard shortcut Ctrl+Enter) to instantly parse and generate formatted output.",
            },
            {
              step: "04",
              title: "Copy or Download",
              desc: "Click 'Copy' to store the clean output to your clipboard, or click 'Download' to save as 'formatted.json'.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-purple-200 transition-colors"
            >
              <span className="inline-block text-xs font-mono font-bold text-[var(--primary)] bg-purple-50 px-2 py-0.5 rounded-md mb-2">
                Step {s.step}
              </span>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. JSON FORMATTER FEATURES */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          JSON Formatter Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Beautify & Indent",
              desc: "Format JSON with configurable 2 spaces, 4 spaces, or tab indentation for perfect readability.",
              icon: Sparkles,
              color: "text-purple-600 bg-purple-50",
            },
            {
              title: "Minify & Compress",
              desc: "Remove all extra whitespace and newlines to compress your payload for production APIs.",
              icon: Minimize2,
              color: "text-blue-600 bg-blue-50",
            },
            {
              title: "RFC 8259 Validation",
              desc: "Real-time syntax validation with detailed line and column error indicators.",
              icon: CheckCircle,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              title: "Local File Upload",
              desc: "Load .json and .txt files locally in the browser with no size upload bottlenecks.",
              icon: Upload,
              color: "text-indigo-600 bg-indigo-50",
            },
            {
              title: "Instant Download",
              desc: "Export formatted JSON as a clean file directly using browser Blob APIs without server calls.",
              icon: Download,
              color: "text-teal-600 bg-teal-50",
            },
            {
              title: "One-Click Copy",
              desc: "Quickly transfer formatted data to your system clipboard with visual feedback.",
              icon: Copy,
              color: "text-amber-600 bg-amber-50",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. IS THIS FREE? & IS DATA UPLOADED? */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-purple-50/40 via-white to-white p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 text-purple-700 font-bold mb-3">
            <Zap className="h-5 w-5" />
            <h2 className="text-xl font-bold text-slate-900">
              Is this JSON Formatter Free?
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Yes, this JSON Formatter and Validator is <strong>100% free to use</strong> for developers, students, and businesses. There are no paywalls, no daily usage limits, no account registrations required, and no hidden features. You can format, validate, and minify as many JSON files as you need, whenever you need.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/40 via-white to-white p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold mb-3">
            <Lock className="h-5 w-5" />
            <h2 className="text-xl font-bold text-slate-900">
              Is my JSON data uploaded?
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>No. Your privacy is 100% protected.</strong> All JSON operations—formatting, minifying, parsing, and file saving—occur strictly inside your own browser window using native client-side JavaScript. Your data is never sent to our servers, never logged, and never shared with third parties.
          </p>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          Everything you need to know about formatting, validating, and managing JSON.
        </p>

        <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.q} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-800 hover:text-[var(--primary)] transition-colors focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[var(--primary)]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in-0 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. RELATED TOOLS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Related Developer Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore more client-side developer utilities designed for productivity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {relatedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-purple-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[var(--primary)] group-hover:bg-canva-gradient group-hover:text-white transition-all shadow-2xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                  <span>Open Tool</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
