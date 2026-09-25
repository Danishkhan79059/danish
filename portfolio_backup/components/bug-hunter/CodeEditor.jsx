"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, Lightbulb, Code2, Sparkles, Check, Copy } from "lucide-react";

export default function CodeEditor({
  code,
  onChange,
  onRunTests,
  onReset,
  onOpenHint,
  hintsUsedCount = 0,
  maxHints = 2,
  isRunningTests = false,
  language = "javascript",
  fileName = "solution.js",
}) {
  const containerRef = useRef(null);
  const monacoEditorRef = useRef(null);
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const [monacoFailed, setMonacoFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef(null);

  // Sync internal Monaco model with incoming code updates
  useEffect(() => {
    if (monacoEditorRef.current && isMonacoReady) {
      const currentVal = monacoEditorRef.current.getValue();
      if (currentVal !== code) {
        monacoEditorRef.current.setValue(code);
      }
    }
  }, [code, isMonacoReady]);

  // Load Monaco Editor dynamically from official CDN
  useEffect(() => {
    let isMounted = true;

    function initMonaco() {
      if (!window.monaco || !containerRef.current) return;

      try {
        // Define custom light theme matching the portfolio aesthetics
        window.monaco.editor.defineTheme("canva-light", {
          base: "vs",
          inherit: true,
          rules: [
            { token: "comment", foreground: "94a3b8", fontStyle: "italic" },
            { token: "keyword", foreground: "7d2ae8", fontStyle: "bold" }, // Canva Purple
            { token: "string", foreground: "059669" }, // Emerald
            { token: "number", foreground: "2563eb" }, // Blue
            { token: "identifier", foreground: "0f172a" },
            { token: "delimiter", foreground: "475569" },
          ],
          colors: {
            "editor.background": "#ffffff",
            "editor.foreground": "#0f172a",
            "editor.lineHighlightBackground": "#f8fafc",
            "editorLineNumber.foreground": "#94a3b8",
            "editorLineNumber.activeForeground": "#7d2ae8",
            "editorCursor.foreground": "#7d2ae8",
            "editor.selectionBackground": "#7d2ae822",
            "editor.inactiveSelectionBackground": "#7d2ae811",
          },
        });

        if (monacoEditorRef.current) {
          monacoEditorRef.current.dispose();
        }

        const editor = window.monaco.editor.create(containerRef.current, {
          value: code,
          language: language === "javascript" ? "javascript" : language,
          theme: "canva-light",
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineHeight: 22,
          fontFamily: "'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
          fontLigatures: true,
          tabSize: 2,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          padding: { top: 16, bottom: 16 },
        });

        editor.onDidChangeModelContent(() => {
          const val = editor.getValue();
          onChange(val);
        });

        editor.onDidChangeCursorPosition((e) => {
          setCursorPos({ line: e.position.lineNumber, col: e.position.column });
        });

        // Add Ctrl+Enter or Cmd+Enter shortcut to run tests
        editor.addCommand(
          window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter,
          () => {
            onRunTests();
          }
        );

        monacoEditorRef.current = editor;
        if (isMounted) setIsMonacoReady(true);
      } catch (err) {
        console.warn("Monaco init error, using fallback editor:", err);
        if (isMounted) setMonacoFailed(true);
      }
    }

    if (typeof window !== "undefined") {
      if (window.monaco) {
        initMonaco();
      } else {
        const existingScript = document.getElementById("monaco-loader-script");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "monaco-loader-script";
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js";
          script.async = true;
          script.onload = () => {
            if (window.require) {
              window.require.config({
                paths: {
                  vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
                },
              });
              window.require(["vs/editor/editor.main"], () => {
                if (isMounted) initMonaco();
              });
            }
          };
          script.onerror = () => {
            if (isMounted) setMonacoFailed(true);
          };
          document.body.appendChild(script);
        } else if (window.require) {
          window.require(["vs/editor/editor.main"], () => {
            if (isMounted) initMonaco();
          });
        }
      }
    }

    return () => {
      isMounted = false;
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }
    };
  }, []);

  // Keyboard shortcut listener for fallback editor
  const handleFallbackKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRunTests();
    }
    // Handle tab key to insert 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const updated = val.substring(0, start) + "  " + val.substring(end);
      onChange(updated);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs select-none">
        <div className="flex items-center gap-3">
          {/* Mac-style Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block border border-rose-500/40" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-amber-500/40" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block border border-emerald-500/40" />
          </div>

          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white border-t-2 border-[var(--primary)] text-slate-800 rounded-t font-mono shadow-xs">
            <Code2 className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="font-semibold">{fileName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Right Tools: Copy & Run shortcut hint */}
        <div className="flex items-center gap-3 text-slate-500">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            <kbd className="text-slate-800 font-mono font-semibold">Ctrl</kbd> + <kbd className="text-slate-800 font-mono font-semibold">Enter</kbd> to run
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 text-[11px] font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[320px] bg-white">
        {/* Monaco Container */}
        <div
          ref={containerRef}
          className={`w-full h-full ${isMonacoReady && !monacoFailed ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"}`}
        />

        {/* Fallback Editor (Active while Monaco loads or if offline) */}
        {(!isMonacoReady || monacoFailed) && (
          <div className="flex h-full font-mono text-sm bg-white">
            {/* Line Numbers */}
            <div className="w-12 py-4 select-none bg-slate-50 text-slate-400 text-right pr-3 font-mono text-xs border-r border-slate-200">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => {
                onChange(e.target.value);
                const target = e.target;
                const linesUpToCursor = target.value.substring(0, target.selectionStart).split("\n");
                setCursorPos({
                  line: linesUpToCursor.length,
                  col: linesUpToCursor[linesUpToCursor.length - 1].length + 1,
                });
              }}
              onKeyDown={handleFallbackKeyDown}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-slate-800 font-mono text-sm leading-6 resize-none focus:outline-none selection:bg-purple-100"
              placeholder="Edit code here to fix the bug..."
            />
          </div>
        )}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            {isMonacoReady ? "Monaco VS Code" : "IDE Editor"}
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-[var(--primary)] font-bold">JavaScript</span>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all text-xs font-semibold border border-slate-200 shadow-xs"
            title="Reset code back to original broken state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={onOpenHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-xs ${
              hintsUsedCount > 0
                ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
                : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300"
            }`}
            title="Get hints (may incur XP penalty)"
          >
            <Lightbulb className={`w-3.5 h-3.5 ${hintsUsedCount > 0 ? "text-amber-600 fill-amber-500" : "text-amber-500"}`} />
            <span>Hint ({hintsUsedCount}/{maxHints})</span>
          </button>

          {/* Run Tests Button */}
          <button
            onClick={onRunTests}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] hover:opacity-95 active:scale-95 text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 transition-all disabled:opacity-50"
          >
            {isRunningTests ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN TESTS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
