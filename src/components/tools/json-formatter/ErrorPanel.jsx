"use client";

import { AlertCircle, ArrowRight, CornerDownRight, X } from "lucide-react";

export default function ErrorPanel({ error, onDismiss, onJumpToLine }) {
  if (!error) return null;

  // Derive helpful debugging tips based on common JSON errors
  const getHelperTip = (msg) => {
    const lower = (msg || "").toLowerCase();
    if (lower.includes("unexpected token }") || lower.includes("unexpected token ]")) {
      return "Check for a trailing comma before this closing bracket/brace. JSON does not allow trailing commas.";
    }
    if (lower.includes("unexpected string") || lower.includes("expected ','")) {
      return "You may be missing a comma between two key-value pairs or array elements.";
    }
    if (lower.includes("unexpected token '") || lower.includes("single quote")) {
      return "JSON requires double quotes (\") for string values and property keys. Single quotes are not valid.";
    }
    if (lower.includes("unexpected token") && lower.includes("in json")) {
      return "Make sure all object keys are wrapped in double quotes (\") and values are valid JSON primitives.";
    }
    return "Ensure syntax follows RFC 8259: double quotes for strings/keys, no trailing commas, standard braces.";
  };

  return (
    <div
      role="alert"
      className="relative rounded-2xl border border-rose-200 bg-rose-50/90 p-4 sm:p-5 shadow-xs backdrop-blur-xs transition-all animate-in fade-in-0 duration-200"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs">
          <AlertCircle className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <span>Invalid JSON</span>
              {(error.line !== null && error.line !== undefined) && (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                  Line {error.line}
                  {error.col && ` : Col ${error.col}`}
                </span>
              )}
            </h3>

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-rose-400 hover:text-rose-700 transition-colors p-1 -mr-1"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="mt-1.5 text-xs sm:text-sm font-mono text-rose-800 break-words bg-rose-100/60 p-2 rounded-lg border border-rose-200/60">
            {error.message || "Parsing error: Invalid JSON syntax."}
          </p>

          {/* Contextual Tip */}
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-rose-700">
            <CornerDownRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-500" />
            <span>
              <strong>Tip:</strong> {getHelperTip(error.message)}
            </span>
          </div>

          {/* Quick jump to line button if callback provided */}
          {error.line && onJumpToLine && (
            <button
              type="button"
              onClick={() => onJumpToLine(error.line, error.col)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <span>Scroll to Line {error.line} in Input</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
