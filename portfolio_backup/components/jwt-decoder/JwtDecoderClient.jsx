"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Sparkles,
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  FileCode2,
  KeyRound,
  Info,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  FileText,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/**
 * Robust Base64URL decoder that never throws unhandled errors
 */
function safeBase64UrlDecode(input) {
  if (!input || typeof input !== "string") return "";
  try {
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    try {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder("utf-8").decode(bytes);
    } catch {
      return binary;
    }
  } catch {
    // Fallback: try removing any invalid base64 characters
    try {
      const sanitized = input.replace(/[^A-Za-z0-9\-_]/g, "");
      let b64 = sanitized.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return atob(b64);
    } catch {
      return "";
    }
  }
}

/**
 * Format timestamp (seconds) into ISO and local time strings
 */
function formatUnixTimestamp(timestamp) {
  if (typeof timestamp !== "number" || isNaN(timestamp)) return null;
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) return null;

  return {
    raw: timestamp,
    iso: date.toISOString(),
    local: date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }),
    relative: getRelativeTime(date),
  };
}

/**
 * Human readable relative time format
 */
function getRelativeTime(targetDate) {
  const now = new Date();
  const diffSec = Math.round((targetDate.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const absDiff = Math.abs(diffSec);
  if (absDiff < 60) return rtf.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  const diffDays = Math.round(diffHr / 24);
  return rtf.format(diffDays, "day");
}

/**
 * Clean & sanitize token string (strip Bearer prefix, quotes, trailing whitespace)
 */
function sanitizeJwt(raw) {
  if (!raw || typeof raw !== "string") return "";
  let clean = raw.trim();
  // Remove 'Bearer ' or 'bearer ' prefix
  if (clean.toLowerCase().startsWith("bearer ")) {
    clean = clean.slice(7).trim();
  }
  // Strip quotation marks
  clean = clean.replace(/^["']|["']$/g, "").trim();
  // Strip leading/trailing newlines or spaces
  clean = clean.replace(/^\s+|\s+$/g, "");
  return clean;
}

/**
 * Simple JSON Syntax Highlighter
 */
function highlightJson(data) {
  if (!data) return "";
  const jsonString =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);

  const escaped = jsonString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const tokenRegex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],:])/g;

  return escaped.replace(tokenRegex, (match) => {
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        return `<span class="text-[var(--primary)] font-semibold">${match.slice(
          0,
          -1
        )}</span>:`;
      }
      return `<span class="text-emerald-600">${match}</span>`;
    }
    if (/true|false/.test(match)) {
      return `<span class="text-amber-600 font-bold">${match}</span>`;
    }
    if (/null/.test(match)) {
      return `<span class="text-rose-600 italic font-semibold">${match}</span>`;
    }
    if (/^-?\d/.test(match)) {
      return `<span class="text-blue-600 font-mono">${match}</span>`;
    }
    if (/[{}[\]]/.test(match)) {
      return `<span class="text-slate-700 font-bold">${match}</span>`;
    }
    return match;
  });
}

/**
 * Standard RFC 7519 Registered Claims Definitions
 */
const REGISTERED_CLAIMS_MAP = {
  iss: { label: "Issuer", desc: "Principal that issued the JWT" },
  sub: { label: "Subject", desc: "Principal that is the subject of the JWT" },
  aud: { label: "Audience", desc: "Recipients that the JWT is intended for" },
  exp: { label: "Expiration Time", desc: "Time on or after which the JWT must not be accepted" },
  nbf: { label: "Not Before", desc: "Time before which the JWT must not be accepted" },
  iat: { label: "Issued At", desc: "Time at which the JWT was issued" },
  jti: { label: "JWT ID", desc: "Unique identifier for the JWT" },
};

export default function JwtDecoderClient() {
  const [tokenInput, setTokenInput] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  // Safe demo token
  const demoToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRhbmlzaCBLaGFuIiwiZW1haWwiOiJkYW5pc2hAZXhhbXBsZS5jb20iLCJyb2xlIjoiRnVsbC1TdGFjayBFbmdpbmVlciIsImlzcyI6Imh0dHBzOi8vYXV0aC5leGFtcGxlLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tIiwiaWF0IjoxNzEzNTIwMDAwLCJleHAiOjE3NzQ3MDQwMDAsImp0aSI6Imp3dC1kZW1vLXRva2VuLTk4NDIxIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // Initial load
  useEffect(() => {
    setTokenInput(demoToken);
  }, []);

  /**
   * REAL-TIME JWT DECODING (Works exactly like jwt.io)
   * Decodes on every change or button click, never returns blank!
   */
  const decodedResult = useMemo(() => {
    const raw = sanitizeJwt(tokenInput);
    if (!raw) {
      return {
        isEmpty: true,
        header: null,
        payload: null,
        signature: "",
        headerPart: "",
        payloadPart: "",
        signaturePart: "",
        headerSize: 0,
        payloadSize: 0,
        claimsCount: 0,
        expirationStatus: "no_exp",
        error: null,
      };
    }

    const parts = raw.split(".");
    const headerPart = parts[0] || "";
    const payloadPart = parts[1] || "";
    const signaturePart = parts[2] || "";

    let header = null;
    let payload = null;
    let parseError = null;

    // 1. Try decoding header
    try {
      header = jwtDecode(raw, { header: true });
    } catch {
      const decodedStr = safeBase64UrlDecode(headerPart);
      try {
        header = JSON.parse(decodedStr);
      } catch {
        header = decodedStr ? { raw: decodedStr } : { alg: "unknown", typ: "JWT" };
      }
    }

    // 2. Try decoding payload
    try {
      payload = jwtDecode(raw);
    } catch {
      const decodedStr = safeBase64UrlDecode(payloadPart);
      try {
        payload = JSON.parse(decodedStr);
      } catch {
        payload = decodedStr ? { raw: decodedStr } : {};
      }
    }

    // Check validity
    if (parts.length < 2) {
      parseError = "Invalid JWT token: A JWT must contain at least a header and payload separated by dots (header.payload[.signature]).";
    }

    // Expiration status
    let expirationStatus = "no_exp";
    if (payload && typeof payload.exp === "number") {
      const currentEpoch = Math.floor(Date.now() / 1000);
      expirationStatus = payload.exp > currentEpoch ? "valid" : "expired";
    }

    const headerBytes = header ? new TextEncoder().encode(JSON.stringify(header)).length : 0;
    const payloadBytes = payload ? new TextEncoder().encode(JSON.stringify(payload)).length : 0;
    const claimsCount = payload && typeof payload === "object" ? Object.keys(payload).length : 0;

    return {
      isEmpty: false,
      raw,
      headerPart,
      payloadPart,
      signaturePart,
      header: header || {},
      payload: payload || {},
      signature: signaturePart,
      headerSize: headerBytes,
      payloadSize: payloadBytes,
      claimsCount,
      expirationStatus,
      error: parseError,
    };
  }, [tokenInput]);

  // Copy helper with "Copied!" feedback state
  const handleCopy = async (text, key) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  // Clipboard Paste helper
  const handlePaste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          const sanitized = sanitizeJwt(text);
          setTokenInput(sanitized);
        }
      } else {
        alert("Please paste your token directly into the input box using Ctrl+V / Cmd+V.");
      }
    } catch (err) {
      alert("Clipboard permission was denied. Please paste using Ctrl+V or Cmd+V.");
    }
  };

  // Clear helper
  const handleClear = () => {
    setTokenInput("");
  };

  // Load Example helper
  const handleLoadExample = () => {
    setTokenInput(demoToken);
  };

  // Force Decode button trigger (visual feedback + ensures clean state)
  const handleTriggerDecode = () => {
    const clean = sanitizeJwt(tokenInput);
    setTokenInput(clean);
  };

  // Download Decoded JSON helper
  const handleDownloadJson = () => {
    if (!decodedResult || decodedResult.isEmpty) return;
    const downloadPayload = {
      header: decodedResult.header,
      payload: decodedResult.payload,
      signature: decodedResult.signature,
      decodedAt: new Date().toISOString(),
      disclaimer: "Signature verification is not performed. Decoded with jwt.io style client.",
    };

    const blob = new Blob([JSON.stringify(downloadPayload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jwt-decoded.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. HERO SECTION */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-purple-200/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Developer Tool (jwt.io style)</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>🔒 Your JWT stays in your browser</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          JWT Decoder
        </h1>

        <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
          Decode and inspect JWT tokens directly in your browser. Live color-coded segments, instant header &amp; payload inspection, and expiration analysis.
        </p>
      </div>

      {/* ERROR BANNER IF ANY */}
      {decodedResult.error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-900">Invalid JWT token</h3>
              <p className="text-xs text-rose-800 mt-0.5">{decodedResult.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2 & 3. TWO-COLUMN JWT.IO STYLE LAYOUT: ENCODED (LEFT) vs DECODED (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
        {/* ================= LEFT COLUMN: ENCODED TOKEN INPUT ================= */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-slate-50/90 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Encoded (Enter JWT Token)
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                title="Paste token from clipboard"
              >
                <ClipboardPaste className="h-3.5 w-3.5 text-slate-500" />
                <span>Paste</span>
              </button>

              <button
                type="button"
                onClick={handleLoadExample}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                title="Load example token"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                <span>Load Example</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!tokenInput}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
                title="Clear input"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Large Textarea */}
          <div className="p-4">
            <textarea
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              rows={8}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs sm:text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all shadow-inner leading-relaxed resize-y break-all"
            />
          </div>

          {/* Color Coded Live Token Segments (jwt.io style) */}
          {!decodedResult.isEmpty && (
            <div className="px-4 pb-4">
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Color Coded Token Preview:
                </span>
                <div className="font-mono text-xs break-all leading-6">
                  <span className="text-rose-600 font-semibold bg-rose-50 px-1 py-0.5 rounded-xs" title="Header">
                    {decodedResult.headerPart}
                  </span>
                  <span className="text-slate-400 font-bold px-0.5">.</span>
                  <span className="text-[var(--primary)] font-semibold bg-purple-50 px-1 py-0.5 rounded-xs" title="Payload">
                    {decodedResult.payloadPart}
                  </span>
                  {decodedResult.signaturePart && (
                    <>
                      <span className="text-slate-400 font-bold px-0.5">.</span>
                      <span className="text-cyan-600 font-semibold bg-cyan-50 px-1 py-0.5 rounded-xs" title="Signature">
                        {decodedResult.signaturePart}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Left Footer Action Buttons */}
          <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleTriggerDecode}
              className="btn-canva-primary flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <KeyRound className="h-4 w-4" />
              <span>Decode</span>
            </button>

            {!decodedResult.isEmpty && (
              <button
                type="button"
                onClick={() => handleCopy(decodedResult.raw, "token")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
              >
                {copiedKey === "token" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: DECODED (HEADER, PAYLOAD, SIGNATURE) ================= */}
        <div className="flex flex-col gap-4">
          {/* 1. HEADER */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50/90 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Header: Algorithm &amp; Token Type
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopy(JSON.stringify(decodedResult.header, null, 2), "header")
                }
                disabled={decodedResult.isEmpty}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              >
                {copiedKey === "header" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-500" />
                    <span>Copy Header</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-white font-mono text-xs sm:text-sm overflow-auto max-h-48">
              <pre
                className="m-0 leading-6"
                dangerouslySetInnerHTML={{
                  __html: highlightJson(decodedResult.header) || `<span class="text-slate-400 italic">// Awaiting JWT input...</span>`,
                }}
              />
            </div>
          </div>

          {/* 2. PAYLOAD */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50/90 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Payload: Data &amp; Claims
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopy(JSON.stringify(decodedResult.payload, null, 2), "payload")
                }
                disabled={decodedResult.isEmpty}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              >
                {copiedKey === "payload" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-500" />
                    <span>Copy Payload</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-white font-mono text-xs sm:text-sm overflow-auto max-h-80">
              <pre
                className="m-0 leading-6"
                dangerouslySetInnerHTML={{
                  __html: highlightJson(decodedResult.payload) || `<span class="text-slate-400 italic">// Awaiting JWT input...</span>`,
                }}
              />
            </div>
          </div>

          {/* 3. SIGNATURE */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50/90 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Signature
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(decodedResult.signature, "signature")}
                disabled={!decodedResult.signature}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              >
                {copiedKey === "signature" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-500" />
                    <span>Copy Signature</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-white">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 break-all leading-6">
                {decodedResult.signature || (
                  <span className="italic text-slate-400">
                    No signature or unsecured JWT
                  </span>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Signature verification is not performed.</strong> Decoding reads token claims; cryptographic verification requires a shared secret or public key.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TOKEN INFORMATION CARD */}
      {!decodedResult.isEmpty && (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-canva-gradient text-white shadow-xs">
                <Info className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Token Information
              </h3>
            </div>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Algorithm
              </span>
              <span className="block text-sm font-bold text-slate-800 font-mono mt-0.5 truncate">
                {decodedResult.header.alg || "none"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Token Type
              </span>
              <span className="block text-sm font-bold text-slate-800 font-mono mt-0.5 truncate">
                {decodedResult.header.typ || "JWT"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Header Size
              </span>
              <span className="block text-sm font-bold text-slate-800 font-mono mt-0.5">
                {decodedResult.headerSize} B
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Payload Size
              </span>
              <span className="block text-sm font-bold text-slate-800 font-mono mt-0.5">
                {decodedResult.payloadSize} B
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Signature Present
              </span>
              <span className="block text-sm font-bold text-emerald-600 font-mono mt-0.5">
                {decodedResult.signature ? "Yes" : "No"}
              </span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Expiration Status
              </span>
              <span className="mt-0.5 block">
                {decodedResult.expirationStatus === "valid" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                    ✓ Not Expired
                  </span>
                )}
                {decodedResult.expirationStatus === "expired" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                    ⚠ Expired
                  </span>
                )}
                {decodedResult.expirationStatus === "no_exp" && (
                  <span className="text-xs font-medium text-slate-500">
                    No exp claim
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLAIMS SECTION */}
      {!decodedResult.isEmpty && decodedResult.payload && typeof decodedResult.payload === "object" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-canva-gradient text-white shadow-xs">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  JWT Claims Inspection
                </h3>
                <p className="text-xs text-slate-500">
                  Standard RFC 7519 and application-specific claims
                </p>
              </div>
            </div>

            {/* Expiration Status Badge */}
            <div>
              {decodedResult.expirationStatus === "valid" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                  <span>✓ Token not expired</span>
                </span>
              )}
              {decodedResult.expirationStatus === "expired" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>⚠ Token expired</span>
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Claim</th>
                  <th className="py-2.5 px-3">Standard Name</th>
                  <th className="py-2.5 px-3">Raw Value</th>
                  <th className="py-2.5 px-3">Interpreted Meaning / Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(decodedResult.payload).map(([key, value]) => {
                  const standardClaim = REGISTERED_CLAIMS_MAP[key];
                  const isTimestamp =
                    (key === "exp" || key === "iat" || key === "nbf") &&
                    typeof value === "number";
                  const formattedTime = isTimestamp
                    ? formatUnixTimestamp(value)
                    : null;

                  return (
                    <tr key={key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[var(--primary)]">
                        {key}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {standardClaim ? standardClaim.label : "Custom Claim"}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800 break-all max-w-xs">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </td>
                      <td className="py-3 px-3">
                        {formattedTime ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800">
                              {formattedTime.local}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {formattedTime.iso} ({formattedTime.relative})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">
                            {standardClaim ? standardClaim.desc : "Application payload field"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. SECURITY NOTICE */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-7 shadow-xs mb-12">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950">
              Security Notice
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
              Decoding a JWT does not verify its signature. Never share sensitive production tokens with websites you do not trust. Because this tool runs 100% in your browser, your token never leaves your machine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
