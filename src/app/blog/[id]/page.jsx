"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  CheckCircle2,
  Database,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/blogs/${id}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Blog post not found");
        }

        setBlog(json.data);
      } catch (err) {
        console.error("Failed to load blog:", err);
        setError(err.message || "Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 rounded-lg" />
          <div className="h-12 w-3/4 bg-slate-200 rounded-xl" />
          <div className="h-6 w-60 bg-slate-200 rounded-lg" />
          <div className="h-96 w-full bg-slate-200 rounded-3xl" />
          <div className="space-y-3 pt-6">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-4/6 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#fafbfc] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Blog Post Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          {error || "The requested blog post does not exist or has been removed from the database."}
        </p>
        <Link
          href="/blog"
          className="btn-canva-primary px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Blogs</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="min-h-screen bg-[#fafbfc] text-slate-900 pb-28">
      {/* Top Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-200/35 blur-3xl" />
        <div className="absolute top-96 -right-32 w-96 h-96 rounded-full bg-cyan-200/35 blur-3xl" />
      </div>

      {/* Header Sticky Navigation Bar */}
      <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[var(--primary)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blogs</span>
          </Link>

          {/* Share & Delete Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Article Content Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Breadcrumb / Category Badge */}
        <div className="flex items-center gap-2 text-xs mb-4">
          <Link href="/blog" className="text-slate-500 hover:text-slate-800">
            Blogs
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-[var(--primary)]">
            {blog.subject}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          {blog.title}
        </h1>

        {/* Metadata Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-canva-gradient text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20">
              DK
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {blog.author || "Danish Khan"}
              </div>
              <div className="text-xs text-slate-500">
                Full-Stack MERN Developer & SaaS Engineer
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {blog.readTime || "3 min read"}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Database className="w-3 h-3" />
              PostgreSQL &amp; MinIO
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {blog.image && (
          <div className="relative mt-8 h-72 sm:h-96 md:h-[460px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Highlighted Summary Callout */}
        <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-cyan-50/80 border border-purple-200/80 shadow-xs">
          <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Summary & Core Takeaways</span>
          </div>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
            {blog.summary}
          </p>
        </div>

        {/* Full Article Content */}
        <div className="mt-10 prose prose-slate max-w-none">
          <div className="text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line space-y-6 font-normal">
            {blog.content || blog.summary}
          </div>
        </div>

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>Related Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Card */}
        <div className="mt-14 p-7 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-canva-gradient text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/20 shrink-0">
              DK
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                Written by Danish Khan
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                Full-Stack MERN Developer with 3+ years of experience engineering
                production SaaS products, high-concurrency databases, and modern web architectures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href="https://github.com/Danishkhan79059"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-slate-50 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/danishkhan786/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-[var(--primary)] bg-slate-50 transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <Link
              href="/Contactus"
              className="btn-canva-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore all articles & tech insights</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
