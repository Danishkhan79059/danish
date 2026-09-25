"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Copy,
  Check,
  Download,
  Upload,
  ClipboardPaste,
  Trash2,
  Sparkles,
  Minimize2,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Keyboard,
  FileJson,
  Maximize2,
  RefreshCw,
  Columns,
  Rows,
} from "lucide-react";

/**
 * Tokenizer & Syntax Highlighter for JSON
 */
export function highlightJsonToHtml(jsonString, isDark = false) {
  if (!jsonString) return "";

  // Escape HTML characters
  const escaped = jsonString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Regex for JSON tokens: strings (with keys distinguished), numbers, booleans, nulls, brackets
  const tokenRegex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],:])/g;

  return escaped.replace(tokenRegex, (match) => {
    // Key in object
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        const keyText = match.slice(0, -1);
        return `<span class="${
          isDark ? "text-purple-400 font-semibold" : "text-[var(--primary)] font-semibold"
        }">${keyText}</span>:`;
      } else {
        // String value
        return `<span class="${
          isDark ? "text-emerald-400" : "text-emerald-600"
        }">${match}</span>`;
      }
    }
    // Boolean
    if (/true|false/.test(match)) {
      return `<span class="${
        isDark ? "text-amber-400 font-bold" : "text-amber-600 font-bold"
      }">${match}</span>`;
    }
    // Null
    if (/null/.test(match)) {
      return `<span class="${
        isDark ? "text-rose-400 italic" : "text-rose-600 italic"
      }">${match}</span>`;
    }
    // Number
    if (/^-?\d/.test(match)) {
      return `<span class="${
        isDark ? "text-cyan-400" : "text-blue-600 font-mono"
      }">${match}</span>`;
    }
    // Brackets & delimiters
    if (/[{}[\]]/.test(match)) {
      return `<span class="${
        isDark ? "text-slate-300 font-bold" : "text-slate-800 font-bold"
      }">${match}</span>`;
    }
    if (/[:,]/.test(match)) {
      return `<span class="${
        isDark ? "text-slate-500" : "text-slate-400"
      }">${match}</span>`;
    }
    return match;
  });
}

export default function JsonEditor({
  input,
  setInput,
  output,
  setOutput,
  onBeautify,
  onMinify,
  onValidate,
  onClear,
  onLoadSample,
  indent,
  setIndent,
  statusMessage,
  errorState,
  onOpenShortcuts,
}) {
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [splitOrientation, setSplitOrientation] = useState("horizontal"); // "horizontal" (side by side) | "vertical" (stacked)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const inputTextareaRef = useRef(null);
  const inputHighlightRef = useRef(null);
  const fileInputRef = useRef(null);
  const editorContainerRef = useRef(null);
  const outputPreRef = useRef(null);

  // Sync scroll between textarea and highlighting layer
  const handleInputScroll = (e) => {
    if (inputHighlightRef.current) {
      inputHighlightRef.current.scrollTop = e.target.scrollTop;
      inputHighlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Cursor position tracking
  const updateCursorPosition = useCallback(() => {
    const el = inputTextareaRef.current;
    if (!el) return;
    const pos = el.selectionStart || 0;
    const textBefore = el.value.substring(0, pos);
    const lines = textBefore.split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  }, []);

  // Handle Tab key inside textarea to insert indentation spaces
  const handleKeyDown = (e) => {
    // Keyboard shortcuts handled at container level or here
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onBeautify();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "m" || e.key === "M")) {
      e.preventDefault();
      onMinify();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      onClear();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const el = inputTextareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const spaceString = indent === "tab" ? "\t" : " ".repeat(Number(indent) || 2);
      const nextVal = input.substring(0, start) + spaceString + input.substring(end);
      setInput(nextVal);

      // Restore cursor position after state update
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + spaceString.length;
        updateCursorPosition();
      }, 0);
    }
  };

  // File Upload Handler (.json & .txt)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setInput(text);
        onBeautify(text);
      }
    };
    reader.readAsText(file);
    // Reset file input value to allow re-uploading the same file if needed
    e.target.value = "";
  };

  // Paste from Clipboard
  const handlePaste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInput(text);
          onBeautify(text);
        }
      } else {
        alert("Clipboard API not supported in this browser. Please use Ctrl+V to paste.");
      }
    } catch (err) {
      console.warn("Clipboard paste access denied:", err);
      alert("Clipboard permission was denied. Please paste directly using Ctrl+V or Cmd+V.");
    }
  };

  // Copy Formatted Output
  const handleCopy = async () => {
    const textToCopy = output || input;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  // Download Output as formatted.json
  const handleDownload = () => {
    const textToSave = output || input;
    if (!textToSave) return;

    try {
      const blob = new Blob([textToSave], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "formatted.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Calculate lines for line number gutters
  const inputLines = useMemo(() => {
    return Math.max(1, (input || "").split("\n").length);
  }, [input]);

  const outputLines = useMemo(() => {
    return Math.max(1, (output || "").split("\n").length);
  }, [output]);

  // Syntax highlighted HTML outputs
  const highlightedInput = useMemo(() => {
    // Only highlight if length is reasonable to maintain 60 FPS
    if (input.length > 300000) return input;
    return highlightJsonToHtml(input, isDark);
  }, [input, isDark]);

  const highlightedOutput = useMemo(() => {
    if (output.length > 300000) return output;
    return highlightJsonToHtml(output, isDark);
  }, [output, isDark]);

  const editorBgClass = isDark
    ? "bg-[#111827] text-slate-100"
    : "bg-white text-slate-800";

  const gutterBgClass = isDark
    ? "bg-[#0b1021] text-slate-500 border-slate-800"
    : "bg-slate-50 text-slate-400 border-slate-200";

  return (
    <div
      ref={editorContainerRef}
      className={`rounded-3xl border transition-all duration-300 shadow-xl ${
        isFullscreen
          ? "fixed inset-2 z-50 flex flex-col bg-white overflow-hidden"
          : "relative border-slate-200/90 bg-white"
      }`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        onChange={handleFileUpload}
        className="hidden"
        id="json-file-upload-input"
      />

      {/* TOP MASTER ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200/80 bg-slate-50/70 rounded-t-3xl backdrop-blur-xs">
        {/* Left: Primary Processing Actions */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Beautify Button */}
          <button
            type="button"
            onClick={() => onBeautify()}
            className="btn-canva-primary flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95"
            title="Format JSON with indentation (Ctrl/Cmd + Enter)"
          >
            <Sparkles className="h-4 w-4" />
            <span>Beautify</span>
          </button>

          {/* Minify Button */}
          <button
            type="button"
            onClick={() => onMinify()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:border-purple-300 hover:text-[var(--primary)] hover:bg-purple-50/30 transition-all cursor-pointer shadow-2xs"
            title="Compress to single-line JSON (Ctrl/Cmd + Shift + M)"
          >
            <Minimize2 className="h-4 w-4 text-purple-600" />
            <span>Minify</span>
          </button>

          {/* Validate Button */}
          <button
            type="button"
            onClick={() => onValidate()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/30 transition-all cursor-pointer shadow-2xs"
            title="Validate JSON syntax"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Validate</span>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={() => onClear()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/30 transition-all cursor-pointer shadow-2xs"
            title="Clear all fields (Ctrl/Cmd + K)"
          >
            <Trash2 className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Right: Settings, View & Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Indentation Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:inline">
              Indent:
            </span>
            <select
              value={indent}
              onChange={(e) => {
                const val = e.target.value;
                setIndent(val);
                if (output || input) {
                  onBeautify(input, val);
                }
              }}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
              aria-label="Select indentation spacing"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--primary)] hover:border-purple-200 transition-colors shadow-2xs cursor-pointer"
            title={isDark ? "Switch editor to light theme" : "Switch editor to dark theme"}
            aria-label="Toggle editor theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Orientation Split Toggle (Desktop) */}
          <button
            type="button"
            onClick={() =>
              setSplitOrientation(splitOrientation === "horizontal" ? "vertical" : "horizontal")
            }
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--primary)] hover:border-purple-200 transition-colors shadow-2xs cursor-pointer"
            title={
              splitOrientation === "horizontal"
                ? "Switch to stacked view"
                : "Switch to side-by-side view"
            }
            aria-label="Toggle panel orientation"
          >
            {splitOrientation === "horizontal" ? (
              <Rows className="h-4 w-4" />
            ) : (
              <Columns className="h-4 w-4" />
            )}
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 hover:text-[var(--primary)] hover:border-purple-200 transition-colors shadow-2xs cursor-pointer"
            title="View keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--primary)] hover:border-purple-200 transition-colors shadow-2xs cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}
            aria-label="Toggle editor fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* STATUS BANNER (If Valid / Invalid / Info) */}
      {statusMessage && (
        <div
          className={`flex items-center justify-between px-4 py-2 text-xs font-semibold border-b transition-colors ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : statusMessage.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === "error" ? (
              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* DUAL-PANEL EDITOR BODY */}
      <div
        className={`grid ${
          splitOrientation === "horizontal"
            ? "grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200"
            : "grid-cols-1 divide-y divide-slate-200"
        } ${isFullscreen ? "flex-1 min-h-0" : ""}`}
      >
        {/* ================= LEFT PANEL: INPUT ================= */}
        <div className="flex flex-col min-w-0 bg-white">
          {/* Left Panel Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                Input JSON
              </h2>
              {input && (
                <span className="text-[11px] font-mono text-slate-500">
                  ({inputLines} lines)
                </span>
              )}
            </div>

            {/* Left Panel Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-colors cursor-pointer shadow-2xs"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="h-3.5 w-3.5 text-slate-500" />
                <span>Paste</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-colors cursor-pointer shadow-2xs"
                title="Upload JSON or TXT file"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Upload</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                disabled={!input}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
                title="Clear input"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Left Editor Canvas Area */}
          <div
            className={`relative flex flex-1 ${
              isFullscreen ? "h-full" : "h-[440px] sm:h-[500px]"
            } overflow-hidden font-mono text-xs sm:text-sm ${editorBgClass}`}
          >
            {/* Line Numbers Gutter */}
            <div
              className={`select-none shrink-0 py-3.5 px-3 text-right font-mono text-xs border-r overflow-hidden ${gutterBgClass}`}
              style={{ minWidth: "3.2rem" }}
              aria-hidden="true"
            >
              {Array.from({ length: inputLines }, (_, i) => {
                const lineNum = i + 1;
                const isErrorLine = errorState?.line === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`leading-6 ${
                      isErrorLine
                        ? "text-rose-500 font-bold bg-rose-100/50 rounded-xs px-1 -mx-1"
                        : ""
                    }`}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Input Overlay & Textarea */}
            <div className="relative flex-1 h-full overflow-hidden">
              {/* Syntax Highlighted Mirror Underneath */}
              <pre
                ref={inputHighlightRef}
                className={`absolute inset-0 p-3.5 m-0 font-mono text-xs sm:text-sm leading-6 overflow-hidden pointer-events-none whitespace-pre-wrap break-words ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
                aria-hidden="true"
                dangerouslySetInnerHTML={{
                  __html: highlightedInput || `<span class="text-slate-400 italic">// Paste or type your JSON here...</span>`,
                }}
              />

              {/* Real Transparent Textarea for User Input */}
              <textarea
                ref={inputTextareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  updateCursorPosition();
                }}
                onScroll={handleInputScroll}
                onKeyDown={handleKeyDown}
                onClick={updateCursorPosition}
                onKeyUp={updateCursorPosition}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Paste or type your raw JSON here..."
                aria-label="Input JSON data"
                className={`absolute inset-0 w-full h-full p-3.5 m-0 font-mono text-xs sm:text-sm leading-6 resize-none bg-transparent outline-hidden overflow-auto whitespace-pre-wrap break-words ${
                  // Make text transparent so the syntax-highlighted pre underneath shines through
                  // Caret remains visible with custom color!
                  highlightedInput ? "text-transparent caret-purple-600" : "text-slate-800 dark:text-slate-200"
                }`}
              />

              {/* Empty State Callout with Example Button */}
              {!input && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                  <div className="pointer-events-auto flex flex-col items-center bg-white/90 dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-xs max-w-xs">
                    <FileJson className="h-10 w-10 text-purple-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Start by pasting raw JSON or loading an example
                    </p>
                    <button
                      type="button"
                      onClick={() => onLoadSample("simple")}
                      className="btn-canva-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Load Example</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Left Footer: Cursor Pos & Info */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 bg-slate-50/80 text-[11px] font-mono text-slate-500">
            <span>
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
            <span>{input ? `${input.length} chars` : "Empty input"}</span>
          </div>
        </div>

        {/* ================= RIGHT PANEL: OUTPUT ================= */}
        <div className="flex flex-col min-w-0 bg-white">
          {/* Right Panel Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                Formatted JSON
              </h2>
              {output && (
                <span className="text-[11px] font-mono text-slate-500">
                  ({outputLines} lines)
                </span>
              )}
            </div>

            {/* Right Panel Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output && !input}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
                title="Copy formatted JSON to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output && !input}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
                title="Download as formatted.json"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Download</span>
              </button>

              {/* Clear Output Button */}
              <button
                type="button"
                onClick={() => setOutput("")}
                disabled={!output}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
                title="Clear output"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Right Editor Canvas (Read-Only) */}
          <div
            className={`relative flex flex-1 ${
              isFullscreen ? "h-full" : "h-[440px] sm:h-[500px]"
            } overflow-hidden font-mono text-xs sm:text-sm ${editorBgClass}`}
          >
            {/* Output Line Numbers Gutter */}
            <div
              className={`select-none shrink-0 py-3.5 px-3 text-right font-mono text-xs border-r overflow-hidden ${gutterBgClass}`}
              style={{ minWidth: "3.2rem" }}
              aria-hidden="true"
            >
              {Array.from({ length: outputLines }, (_, i) => (
                <div key={i + 1} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Read-Only Output Pre */}
            <div className="relative flex-1 h-full overflow-auto">
              <pre
                ref={outputPreRef}
                className={`p-3.5 m-0 font-mono text-xs sm:text-sm leading-6 whitespace-pre-wrap break-words select-text ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
                tabIndex={0}
                aria-label="Formatted JSON output"
                dangerouslySetInnerHTML={{
                  __html:
                    highlightedOutput ||
                    `<span class="text-slate-400 italic">// Click "Beautify" or "Minify" to generate formatted output</span>`,
                }}
              />
            </div>
          </div>

          {/* Right Footer: Status & Size */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200/80 bg-slate-50/80 text-[11px] font-mono text-slate-500">
            <span>Read-Only Output</span>
            <span>{output ? `${output.length} chars` : "Awaiting action"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
