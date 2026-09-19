import Link from "next/link";
import { ArrowLeft, Sparkles, Wrench, ShieldCheck } from "lucide-react";

export default async function ToolPlaceholderPage({ params }) {
  const { slug } = await params;

  const toolTitles = {
    "json-validator": "JSON Validator",
    "json-minifier": "JSON Minifier",
    "json-to-csv": "JSON to CSV Converter",
    "json-viewer": "JSON Tree Viewer",
    "jwt-decoder": "JWT Decoder",
    "base64-converter": "Base64 Encoder / Decoder",
  };

  const title = toolTitles[slug] || "Developer Tool";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canva-gradient text-white shadow-lg mb-5">
          <Wrench className="h-7 w-7" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-[var(--primary)] mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Under Active Development</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {title}
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          This client-side utility is currently being engineered and will be launched shortly. In the meantime, try our fully featured Free JSON Formatter &amp; Validator!
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/tools/json-formatter"
            className="btn-canva-primary flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-md"
          >
            <span>Open JSON Formatter &amp; Validator</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--primary)] transition-colors py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
