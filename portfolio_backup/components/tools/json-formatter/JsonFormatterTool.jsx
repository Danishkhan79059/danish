"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileCode2,
  Lock,
  Layers,
  ArrowRight,
  Keyboard,
  Info,
} from "lucide-react";

import {
  formatJson,
  minifyJson,
  validateJson,
  computeJsonStats,
  SAMPLE_JSONS,
} from "@/lib/json-tools/jsonEngine";

import JsonEditor from "./JsonEditor";
import JsonStatsCard from "./JsonStatsCard";
import ErrorPanel from "./ErrorPanel";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import SeoContentSection from "./SeoContentSection";

export default function JsonFormatterTool() {
  const [input, setInput] = useState(() => JSON.stringify(SAMPLE_JSONS.simple.data, null, 2));
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [stats, setStats] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const [statusMessage, setStatusMessage] = useState({
    type: "info",
    text: "Ready. Paste your JSON or click Beautify to format.",
  });
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Compute initial stats from default sample
  useEffect(() => {
    try {
      const initialParsed = SAMPLE_JSONS.simple.data;
      const initialFormatted = JSON.stringify(initialParsed, null, 2);
      setOutput(initialFormatted);
      setStats(computeJsonStats(initialParsed, initialFormatted));
      setStatusMessage({
        type: "success",
        text: "Sample JSON loaded. Formatted with 2 spaces.",
      });
    } catch {
      // Ignore
    }
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ignore if typing inside standard inputs unless it's the editor
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleBeautify();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        handleMinify();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        handleClear();
        return;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [input, indent]);

  // 1. BEAUTIFY HANDLER
  const handleBeautify = useCallback(
    (customInput, customIndent) => {
      const source = customInput !== undefined ? customInput : input;
      const spacing = customIndent !== undefined ? customIndent : indent;

      if (!source || !source.trim()) {
        setStatusMessage({
          type: "error",
          text: "Input is empty. Please paste or enter JSON to format.",
        });
        setErrorState(null);
        return;
      }

      startTransition(() => {
        const res = formatJson(source, spacing);
        if (res.success) {
          setOutput(res.result);
          setErrorState(null);
          setStatusMessage({
            type: "success",
            text: `✓ Valid JSON! Successfully beautified with ${
              spacing === "tab" ? "tabs" : `${spacing} spaces`
            }.`,
          });
          const calculatedStats = computeJsonStats(res.parsed, res.result);
          setStats(calculatedStats);
        } else {
          setErrorState({
            message: res.error,
            line: res.line,
            col: res.col,
          });
          setStatusMessage({
            type: "error",
            text: `✕ Invalid JSON: ${res.error}`,
          });
        }
      });
    },
    [input, indent]
  );

  // 2. MINIFY HANDLER
  const handleMinify = useCallback(() => {
    if (!input || !input.trim()) {
      setStatusMessage({
        type: "error",
        text: "Input is empty. Please enter JSON to minify.",
      });
      setErrorState(null);
      return;
    }

    startTransition(() => {
      const res = minifyJson(input);
      if (res.success) {
        setOutput(res.result);
        setErrorState(null);
        setStatusMessage({
          type: "success",
          text: "✓ Valid JSON! Successfully minified to compact representation.",
        });
        const calculatedStats = computeJsonStats(res.parsed, res.result);
        setStats(calculatedStats);
      } else {
        setErrorState({
          message: res.error,
          line: res.line,
          col: res.col,
        });
        setStatusMessage({
          type: "error",
          text: `✕ Invalid JSON: ${res.error}`,
        });
      }
    });
  }, [input]);

  // 3. VALIDATE HANDLER
  const handleValidate = useCallback(() => {
    if (!input || !input.trim()) {
      setStatusMessage({
        type: "error",
        text: "Input is empty. Please enter JSON to validate.",
      });
      setErrorState(null);
      return;
    }

    startTransition(() => {
      const res = validateJson(input);
      if (res.isValid) {
        setErrorState(null);
        setStatusMessage({
          type: "success",
          text: "✓ Valid JSON! Your syntax conforms to standard JSON RFC 8259.",
        });
        const calculatedStats = computeJsonStats(res.parsed, input);
        setStats(calculatedStats);
      } else {
        setErrorState({
          message: res.message,
          line: res.line,
          col: res.col,
        });
        setStatusMessage({
          type: "error",
          text: `✕ Invalid JSON: ${res.message}`,
        });
      }
    });
  }, [input]);

  // 4. CLEAR HANDLER
  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setErrorState(null);
    setStats(null);
    setStatusMessage({
      type: "info",
      text: "All inputs, outputs, errors and statistics have been cleared.",
    });
  }, []);

  // 5. LOAD SAMPLE PRESET HANDLER
  const handleLoadSample = useCallback((key) => {
    const sample = SAMPLE_JSONS[key];
    if (!sample) return;

    const jsonString = JSON.stringify(sample.data, null, 2);
    setInput(jsonString);
    setOutput(jsonString);
    setErrorState(null);
    setStatusMessage({
      type: "success",
      text: `Loaded "${sample.title}" example successfully.`,
    });
    setStats(computeJsonStats(sample.data, jsonString));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-[var(--primary)] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/projects" className="hover:text-[var(--primary)] transition-colors">
          Developer Tools
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[var(--primary)]">JSON Formatter</span>
      </nav>

      {/* HERO SECTION */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start mb-3">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-purple-200/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Free • Private • No Upload</span>
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>100% Client-Side Engine</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Free JSON Formatter &amp; Validator
        </h1>

        <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
          Format, validate, beautify and minify JSON directly in your browser. Fast, private and easy to use with live syntax highlighting and structural metrics.
        </p>

        {/* Privacy Notice Banner */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-medium text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>🔒 Your JSON stays in your browser.</strong> Nothing is uploaded to any server.
          </span>
        </div>
      </div>

      {/* SAMPLE PRESETS CHIPS */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-[var(--primary)]" />
          Try an Example:
        </span>
        {Object.entries(SAMPLE_JSONS).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleLoadSample(key)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-purple-300 hover:bg-purple-50/50 hover:text-[var(--primary)] transition-all cursor-pointer shadow-2xs"
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* ERROR PANEL (When Parsing Fails) */}
      {errorState && (
        <div className="mb-5">
          <ErrorPanel
            error={errorState}
            onDismiss={() => setErrorState(null)}
          />
        </div>
      )}

      {/* MAIN TOOL: TWO-PANEL JSON EDITOR */}
      <JsonEditor
        input={input}
        setInput={setInput}
        output={output}
        setOutput={setOutput}
        onBeautify={handleBeautify}
        onMinify={handleMinify}
        onValidate={handleValidate}
        onClear={handleClear}
        onLoadSample={handleLoadSample}
        indent={indent}
        setIndent={setIndent}
        statusMessage={statusMessage}
        errorState={errorState}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* JSON STATISTICS CARD */}
      {stats && (
        <div className="mt-6">
          <JsonStatsCard stats={stats} />
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* COMPREHENSIVE SEO CONTENT & FAQ SECTION */}
      <SeoContentSection />
    </div>
  );
}
