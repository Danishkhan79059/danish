"use client";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  X,
  Search,
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  Tag,
  RefreshCw,
  AlertCircle,
  Database,
  Feather,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Predefined quick categories
const QUICK_SUBJECTS = [
  "Full-Stack Development",
  "React & Next.js",
  "MongoDB & Database",
  "System Architecture",
  "Backend & Node.js",
  "Cloud & DevOps",
  "AI & Automation",
];

// Helper to compress image on client using HTML5 Canvas to keep Base64 compact (<150KB)
function compressImageFile(file, maxWidth = 1200, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG data URL
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function BlogPage() {
  const fileInputId = useId();
  // State for blogs and status
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbSource, setDbSource] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal and Form States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Modal and Form States
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Full-Stack Development");
  const [customSubject, setCustomSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageInputMode, setImageInputMode] = useState("upload"); // "upload" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch blogs from PostgreSQL API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBlogs(json.data);
        setDbSource(json.source || "postgresql");
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle local image selection and compression
  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    try {
      setErrorMessage("");
      const compressedDataUrl = await compressImageFile(file);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error("Error compressing image:", err);
      setErrorMessage("Failed to process image file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Submit new blog post to MongoDB
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const finalSubject = subject === "Custom" ? customSubject.trim() : subject;
    const finalImage = imageInputMode === "url" ? imageUrl.trim() : imagePreview;

    if (!title.trim()) {
      setErrorMessage("Please enter a blog title.");
      return;
    }
    if (!finalSubject) {
      setErrorMessage("Please select or enter a subject / category.");
      return;
    }
    if (!summary.trim()) {
      setErrorMessage("Please write a summary or description for the blog.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: title.trim(),
        subject: finalSubject,
        summary: summary.trim(),
        content: content.trim() || summary.trim(),
        image: finalImage,
        author: "Danish Khan",
        tags: tagsInput
          ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save blog in database.");
      }

      setSubmitSuccess(true);
      // Prepend the new post directly to feed
      setBlogs((prev) => [json.data, ...prev]);

      // Reset form after short delay
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setSubmitSuccess(false);
        resetForm();
      }, 1200);
    } catch (err) {
      console.error("Error creating blog:", err);
      setErrorMessage(err.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubject("Full-Stack Development");
    setCustomSubject("");
    setSummary("");
    setContent("");
    setImagePreview("");
    setImageUrl("");
    setTagsInput("");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Unique categories from blogs
  const allCategories = [
    "All",
    ...Array.from(new Set(blogs.map((b) => b.subject).filter(Boolean))),
  ];

  // Filtered blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      activeCategory === "All" || blog.subject === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      blog.title.toLowerCase().includes(query) ||
      blog.subject.toLowerCase().includes(query) ||
      blog.summary.toLowerCase().includes(query) ||
      (blog.content && blog.content.toLowerCase().includes(query)) ||
      (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute top-80 -right-40 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Col: Header Text */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-canva-gradient-subtle border border-purple-200 text-xs font-semibold text-purple-800 mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)] animate-pulse" />
                <span>Tech Insights & Architectural Logs</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-mono text-emerald-600 font-medium">
                  {dbSource === "postgresql" ? "PostgreSQL & MinIO Live" : "PostgreSQL Live"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Engineering, Architecture &{" "}
                <span className="text-canva-gradient">Full-Stack Insights</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Detailed breakdowns on building multi-tenant SaaS products,
                high-throughput PostgreSQL architectures, MinIO object storage, React 19 server patterns, and
                scalable cloud systems by Danish Khan.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-canva-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Blog Post</span>
                </button>

                <button
                  type="button"
                  onClick={fetchBlogs}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-medium text-sm text-slate-700 shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh Feed</span>
                </button>
              </div>
            </div>

            {/* Right Col: Stats Card */}
            <div className="lg:w-80 rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl shadow-purple-900/10 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--secondary)]" />
                  PostgreSQL &amp; MinIO
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Prisma ORM
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {blogs.length}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Published Posts
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--secondary)] tracking-tight">
                    {allCategories.length - 1}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Tech Categories
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Author</span>
                <span className="font-semibold text-white">Danish Khan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Filters, Search, and Feed */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, subject, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-purple-100 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* New Post Button (Mobile/Tablet Friendly) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="md:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-canva-primary text-sm font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse flex flex-col gap-4 shadow-xs"
              >
                <div className="h-48 w-full bg-slate-200 rounded-xl" />
                <div className="h-4 w-28 bg-slate-200 rounded-full" />
                <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-16 w-full bg-slate-200 rounded-md" />
                <div className="h-10 w-full bg-slate-200 rounded-xl mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 mt-6 max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[var(--primary)] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No Blog Posts Found
            </h3>
            <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
              {searchQuery || activeCategory !== "All"
                ? "No articles matched your filter or search query. Try clearing filters or create a new blog post."
                : "No blogs have been added yet. Click the button below to publish your first blog post to PostgreSQL database!"}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {(searchQuery || activeCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-canva-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write First Post</span>
              </button>
            </div>
          </div>
        )}

        {/* Blog Cards Grid */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-6">
            {filteredBlogs.map((blog) => {
              const formattedDate = new Date(blog.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );

              return (
                <article
                  key={blog.id || blog._id}
                  className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Cover Image with Link to dedicated page */}
                  <Link
                    href={`/blog/${blog.slug || blog.id || blog._id}`}
                    className="block relative h-52 w-full overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-slate-50 to-cyan-50 text-slate-400 p-6 text-center">
                        <ImageIcon className="w-10 h-10 text-purple-300 mb-2" />
                        <span className="text-xs font-medium text-slate-500">
                          {blog.subject}
                        </span>
                      </div>
                    )}

                    {/* Category Pill Tag Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[var(--primary)] shadow-sm border border-white/40">
                        {blog.subject}
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Meta info: Date & Read Time */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime || "3 min read"}
                      </span>
                    </div>

                    {/* Title linked to page */}
                    <Link href={`/blog/${blog.slug || blog.id || blog._id}`} className="block">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h2>
                    </Link>

                    {/* Summary / Description */}
                    <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer: Author & Read CTA */}
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-canva-gradient text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          DK
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {blog.author || "Danish Khan"}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${blog.slug || blog.id || blog._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] group-hover:translate-x-0.5 transition-transform"
                      >
                        Read Full Article
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          CREATE BLOG POST MODAL
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8 my-8 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-canva-gradient flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Create New Blog Post
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saves directly to your live PostgreSQL database
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error / Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>🎉 Blog post successfully saved to PostgreSQL database!</span>
              </div>
            )}

            {/* Form Scroll Area */}
            <form
              onSubmit={handleCreateBlog}
              className="flex-1 overflow-y-auto pr-1 space-y-5"
            >
              {/* 1. Image Upload / URL Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Blog Cover Image
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageInputMode("upload")}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                        imageInputMode === "upload"
                          ? "bg-purple-100 text-purple-800 font-semibold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      File Upload
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("url")}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                        imageInputMode === "url"
                          ? "bg-purple-100 text-purple-800 font-semibold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageInputMode === "upload" ? (
                  <div>
                    {/* Hidden input */}
                    <input
                      id={fileInputId}
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageFile(e.target.files[0]);
                        }
                      }}
                    />

                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-44 group">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-xs font-semibold text-slate-800 shadow-sm cursor-pointer"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview("");
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                          isDragging
                            ? "border-[var(--primary)] bg-purple-50/50"
                            : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-[var(--primary)] flex items-center justify-center mx-auto mb-2">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          Click to upload or drag & drop cover image
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          PNG, JPG, WebP supported (auto-compressed for database storage)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                    {imageUrl && (
                      <div className="relative mt-2 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <Image
                          src={imageUrl}
                          alt="URL Preview"
                          fill
                          unoptimized
                          className="object-cover"
                          onError={() => setErrorMessage("Could not load image from this URL.")}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Blog Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Blog Title *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {title.length}/200
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={200}
                  required
                  placeholder="e.g. Scaling Node.js Microservices with MongoDB Aggregations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              {/* 3. Subject / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Subject / Category *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {QUICK_SUBJECTS.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        subject === sub
                          ? "bg-[var(--primary)] text-white font-semibold shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSubject("Custom")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                      subject === "Custom"
                        ? "bg-[var(--primary)] text-white font-semibold"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    + Custom
                  </button>
                </div>

                {subject === "Custom" && (
                  <input
                    type="text"
                    placeholder="Enter custom category name..."
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[var(--primary)]"
                  />
                )}
              </div>

              {/* 4. Description / Summary */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Summary / Description * (Shows on Card)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {summary.length}/1000
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={1000}
                  required
                  placeholder="Provide a concise summary highlighting the core takeaways and architectural value of this blog post..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                />
              </div>

              {/* 5. Full Content / Detailed Story (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Article Body (Optional for Deep Reading Modal)
                </label>
                <textarea
                  rows={6}
                  placeholder="Write the detailed article here. You can use separate paragraphs, bullet points, or code snippets..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-purple-100 transition-all resize-none font-mono text-xs leading-relaxed"
                />
              </div>

              {/* 6. Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="#mongodb, #nodejs, #architecture, #nextjs"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--primary)]"
                />
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="btn-canva-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to PostgreSQL database...</span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Feather className="w-3.5 h-3.5" />
                      <span>Publish Blog Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
