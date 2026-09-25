"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  GitFork,
  Star,
  BookOpen,
  Users,
  UserCheck,
  Calendar,
  MapPin,
  Building,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Code2,
  Activity,
  Layers,
  ArrowRight,
  AlertCircle,
  Clock,
  Flame,
  CheckCircle2,
  X,
  Compass,
} from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/Icons";

const QUICK_PROFILES = [
  { label: "Danish Khan", username: "Danishkhan79059", role: "Portfolio Creator" },
  { label: "shadcn", username: "shadcn", role: "UI Creator" },
  { label: "Linus Torvalds", username: "torvalds", role: "Linux & Git" },
  { label: "Dan Abramov", username: "gaearon", role: "React Core" },
];

export default function GitHubAnalyzerPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview | repositories | activity
  const [copied, setCopied] = useState(false);

  // Repositories filtering & sorting state
  const [repoSearch, setRepoSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [sortBy, setSortBy] = useState("stars"); // stars | forks | updated | name

  // Step indicator simulation while loading
  const loadingSteps = [
    "Connecting to GitHub API...",
    "Scanning public repositories & metadata...",
    "Analyzing tech stack & language metrics...",
    "Building developer profile report...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Clean URL / Handle
  const extractUsername = (val) => {
    if (!val) return "";
    let clean = val.trim();
    clean = clean.replace(/^https?:\/\/(www\.)?github\.com\//i, "");
    clean = clean.replace(/^@/, "");
    clean = clean.split("/")[0].split("?")[0].trim();
    return clean;
  };

  const handleAnalyze = async (overrideUsername) => {
    const target = overrideUsername || inputUrl;
    const cleanUser = extractUsername(target);

    if (!cleanUser) {
      setError("Please paste a valid GitHub profile URL or username (e.g., https://github.com/danishkhan or danishkhan).");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setActiveTab("overview");

    try {
      // 1. Try server API route
      const res = await fetch(`/api/github-analyzer?user=${encodeURIComponent(cleanUser)}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setData(result);
      } else {
        // Fallback: If server route has rate limit or error, attempt direct client fetch to GitHub API
        try {
          const clientRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`);
          if (clientRes.ok) {
            const profile = await clientRes.json();
            const repoRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?per_page=100&sort=pushed`);
            const repos = repoRes.ok ? await repoRes.json() : [];

            // Quick client aggregation
            let totalStars = 0;
            let totalForks = 0;
            const langCounts = {};

            const processedRepos = (Array.isArray(repos) ? repos : []).map((r) => {
              totalStars += r.stargazers_count || 0;
              totalForks += r.forks_count || 0;
              if (r.language) {
                langCounts[r.language] = (langCounts[r.language] || 0) + 1;
              }
              return {
                id: r.id,
                name: r.name,
                fullName: r.full_name,
                description: r.description,
                htmlUrl: r.html_url,
                stars: r.stargazers_count || 0,
                forks: r.forks_count || 0,
                language: r.language,
                languageColor: "#7d2ae8",
                topics: r.topics || [],
                updatedAt: r.updated_at,
                pushedAt: r.pushed_at,
              };
            });

            const totalWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0);
            const languages = Object.entries(langCounts)
              .map(([name, count]) => ({
                name,
                count,
                percentage: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
                color: "#7d2ae8",
              }))
              .sort((a, b) => b.count - a.count);

            const sortedByStars = [...processedRepos].sort((a, b) => b.stars - a.stars);
            const sortedByForks = [...processedRepos].sort((a, b) => b.forks - a.forks);
            const sortedByPushed = [...processedRepos].sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

            setData({
              profile: {
                login: profile.login,
                name: profile.name || profile.login,
                avatarUrl: profile.avatar_url,
                htmlUrl: profile.html_url,
                bio: profile.bio || "No bio provided",
                company: profile.company,
                blog: profile.blog,
                location: profile.location,
                email: profile.email,
                hireable: profile.hireable,
                twitterUsername: profile.twitter_username,
                publicRepos: profile.public_repos,
                publicGists: profile.public_gists,
                followers: profile.followers,
                following: profile.following,
                createdAt: profile.created_at,
                accountAgeYears: ((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1),
              },
              stats: {
                totalRepos: profile.public_repos,
                analyzedRepos: processedRepos.length,
                totalStars,
                totalForks,
                publicGists: profile.public_gists,
              },
              languages,
              technologies: languages.map((l) => ({ name: l.name, count: l.count })),
              highlights: {
                mostStarred: sortedByStars[0] || null,
                mostForked: sortedByForks[0] || null,
                latestPushed: sortedByPushed[0] || null,
              },
              repositories: processedRepos,
              activities: [],
            });
          } else {
            setError(result.error || `Could not find GitHub user "${cleanUser}".`);
          }
        } catch {
          setError(result.error || `Could not fetch GitHub user "${cleanUser}".`);
        }
      }
    } catch {
      setError("An unexpected network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyProfile = () => {
    if (!data?.profile?.htmlUrl) return;
    navigator.clipboard.writeText(data.profile.htmlUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        handleAnalyze(text);
      }
    } catch {
      // Clipboard permission denied or unavailable
    }
  };

  // Filter and sort repos
  const filteredRepos = (data?.repositories || [])
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(repoSearch.toLowerCase())) ||
        (repo.topics && repo.topics.some((t) => t.toLowerCase().includes(repoSearch.toLowerCase())));

      const matchesLang =
        selectedLanguage === "ALL" ||
        (repo.language && repo.language.toLowerCase() === selectedLanguage.toLowerCase());

      return matchesSearch && matchesLang;
    })
    .sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "forks") return b.forks - a.forks;
      if (sortBy === "updated") return new Date(b.pushedAt || b.updatedAt) - new Date(a.pushedAt || a.updatedAt);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Relative time helper
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffMin > 0) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 selection:bg-purple-100 selection:text-purple-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-white pt-10 pb-12 border-b border-slate-100">
        {/* Subtle Background Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-200/40 via-purple-200/40 to-blue-200/40 blur-3xl rounded-full opacity-60" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[var(--primary)] shadow-xs backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)] animate-pulse" />
            <span>Real-Time Developer Analytics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            🔍 GitHub <span className="text-canva-gradient">Profile Analyzer</span>
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-normal">
            Paste any GitHub profile URL or username to inspect real-time tech stacks, repository metrics, language breakdowns, and public developer activity.
          </p>

          {/* Quick Profile Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Try Demo:
            </span>
            {QUICK_PROFILES.map((qp) => (
              <button
                key={qp.username}
                type="button"
                onClick={() => {
                  setInputUrl(qp.username);
                  handleAnalyze(qp.username);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-purple-50/50 shadow-2xs transition-all cursor-pointer"
              >
                <GithubIcon className="w-3 h-3 text-slate-500" />
                <span>{qp.label}</span>
                <span className="text-[10px] text-slate-400">({qp.username})</span>
              </button>
            ))}
          </div>

          {/* Input Box Card */}
          <div className="mt-7 mx-auto max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze();
              }}
              className="relative flex flex-col sm:flex-row items-stretch gap-2.5 rounded-2xl border-2 border-purple-200/90 bg-white p-2.5 shadow-xl shadow-purple-500/5 hover:border-purple-300 transition-all"
            >
              <div className="relative flex-1 flex items-center">
                <div className="absolute left-3.5 text-slate-400">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://github.com/username or @username"
                  className="w-full rounded-xl bg-slate-50/70 py-3.5 pl-11 pr-20 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />

                {/* Paste & Clear action inside input */}
                <div className="absolute right-2.5 flex items-center gap-1">
                  {inputUrl ? (
                    <button
                      type="button"
                      onClick={() => setInputUrl("")}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
                      title="Clear"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      title="Paste from clipboard"
                    >
                      <span>Paste</span>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-canva-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Profile</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-2 text-xs text-slate-400">
              💡 Supports full links like <code className="text-purple-600">https://github.com/Danishkhan79059</code> or direct username.
            </p>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-800 shadow-xs flex items-start gap-3.5 animate-in fade-in-50">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold">Profile Analysis Notice</h3>
              <p className="mt-1 text-xs text-rose-700 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Scanner Animation */}
        {loading && (
          <div className="my-12 rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/40 to-white p-8 sm:p-12 text-center shadow-lg animate-in fade-in-50">
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-30" />
              <div className="absolute inset-0 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin" />
              <GithubIcon className="w-8 h-8 text-[var(--primary)]" />
            </div>

            <h3 className="mt-6 text-lg font-bold text-slate-900">
              Scanning GitHub Profile
            </h3>

            {/* Dynamic Step Display */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 border border-purple-100 text-xs font-semibold text-[var(--primary)] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span>{loadingSteps[loadingStep]}</span>
            </div>

            {/* Skeleton Preview Bars */}
            <div className="mt-8 max-w-md mx-auto space-y-3">
              <div className="h-4 bg-slate-200/70 rounded-full animate-pulse w-3/4 mx-auto" />
              <div className="h-3 bg-slate-100 rounded-full animate-pulse w-1/2 mx-auto" />
              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Loaded Data Profile Content */}
        {!loading && data && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Profile Overview Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-canva-gradient" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Left: Avatar & Identity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative">
                    <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border-2 border-purple-300 shadow-md">
                      <img
                        src={data.profile.avatarUrl}
                        alt={data.profile.name}
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                    </div>
                    {data.profile.hireable && (
                      <span
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white"
                        title="Open to Opportunities"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {data.profile.name}
                      </h2>
                      {data.profile.hireable && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Hireable
                        </span>
                      )}
                    </div>

                    <a
                      href={data.profile.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      <span>@{data.profile.login}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <p className="mt-2 text-sm text-slate-600 max-w-xl line-clamp-3 leading-relaxed">
                      {data.profile.bio}
                    </p>

                    {/* Metadata Badges */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
                      {data.profile.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {data.profile.location}
                        </span>
                      )}
                      {data.profile.company && (
                        <span className="inline-flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {data.profile.company}
                        </span>
                      )}
                      {data.profile.blog && (
                        <a
                          href={data.profile.blog.startsWith("http") ? data.profile.blog : `https://${data.profile.blog}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-purple-600 hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5 text-purple-400" />
                          {data.profile.blog.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {data.profile.twitterUsername && (
                        <a
                          href={`https://twitter.com/${data.profile.twitterUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sky-600 hover:underline"
                        >
                          <TwitterIcon className="w-3.5 h-3.5 text-sky-400" />
                          @{data.profile.twitterUsername}
                        </a>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Joined {new Date(data.profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-row lg:flex-col items-center gap-2.5 w-full lg:w-auto shrink-0">
                  <a
                    href={data.profile.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-canva-primary flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View on GitHub</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyProfile}
                    className="btn-canva-outline flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Share Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Numerical Stats Strip */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 border-t border-slate-100 pt-6">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                    <span>Repositories</span>
                  </div>
                  <div className="mt-1.5 text-2xl font-black text-slate-900">
                    {data.profile.publicRepos}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Followers</span>
                  </div>
                  <div className="mt-1.5 text-2xl font-black text-slate-900">
                    {data.profile.followers}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Following</span>
                  </div>
                  <div className="mt-1.5 text-2xl font-black text-slate-900">
                    {data.profile.following}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Stars Earned</span>
                  </div>
                  <div className="mt-1.5 text-2xl font-black text-slate-900">
                    {data.stats.totalStars}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <GitFork className="w-4 h-4 text-indigo-500" />
                    <span>Total Forks</span>
                  </div>
                  <div className="mt-1.5 text-2xl font-black text-slate-900">
                    {data.stats.totalForks}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
                  activeTab === "overview"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("repositories")}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
                  activeTab === "repositories"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Repositories ({data.repositories.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("activity")}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
                  activeTab === "activity"
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Recent Activity</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in-50">
                {/* Most Used Technologies & Languages Section */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-[var(--primary)]">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          💻 Most Used Technologies & Languages
                        </h3>
                        <p className="text-xs text-slate-500">
                          Calculated across all public repositories and commit activity
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Languages Visual Distribution Bar */}
                  {data.languages.length > 0 && (
                    <div className="mt-6">
                      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                        {data.languages.slice(0, 7).map((lang) => (
                          <div
                            key={lang.name}
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color,
                            }}
                            className="h-full transition-all duration-500 hover:opacity-85"
                            title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
                          />
                        ))}
                      </div>

                      {/* Language Legend Chips */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {data.languages.slice(0, 8).map((lang) => (
                          <div
                            key={lang.name}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                          >
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span>{lang.name}</span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {lang.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detected Frameworks & Tools Grid */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Detected Frameworks & Libraries
                    </h4>
                    {data.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {data.technologies.map((tech) => (
                          <div
                            key={tech.name}
                            className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50/50 px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-purple-100/60 hover:border-purple-200 transition-colors"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                            <span>{tech.name}</span>
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-purple-600 border border-purple-100">
                              {tech.count} {tech.count === 1 ? "repo" : "repos"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No specific framework tags identified in repository descriptions.
                      </p>
                    )}
                  </div>
                </div>

                {/* Highlights Grid (Most Starred, Most Forked, Latest Updated) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Most Starred */}
                  {data.highlights.mostStarred && (
                    <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/40 via-white to-white p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 mb-3">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Most Starred Project</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 truncate">
                          {data.highlights.mostStarred.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {data.highlights.mostStarred.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-700 flex items-center gap-1">
                          ⭐ {data.highlights.mostStarred.stars} stars
                        </span>
                        <a
                          href={data.highlights.mostStarred.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Most Forked */}
                  {data.highlights.mostForked && (
                    <div className="rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/40 via-white to-white p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-bold text-indigo-800 mb-3">
                          <GitFork className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Most Forked Project</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 truncate">
                          {data.highlights.mostForked.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {data.highlights.mostForked.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-700 flex items-center gap-1">
                          🍴 {data.highlights.mostForked.forks} forks
                        </span>
                        <a
                          href={data.highlights.mostForked.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Latest Activity / Pushed */}
                  {data.highlights.latestPushed && (
                    <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/40 via-white to-white p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 mb-3">
                          <Flame className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Latest Pushed Repo</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 truncate">
                          {data.highlights.latestPushed.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {data.highlights.latestPushed.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-medium">
                          {formatTimeAgo(data.highlights.latestPushed.pushedAt)}
                        </span>
                        <a
                          href={data.highlights.latestPushed.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Facts Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-7">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                    Developer Facts & Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 font-semibold block mb-1">Account Experience</span>
                      <span className="text-sm font-bold text-slate-900">
                        {data.profile.accountAgeYears} Years Active
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 font-semibold block mb-1">Public Gists</span>
                      <span className="text-sm font-bold text-slate-900">
                        {data.profile.publicGists} Gists
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 font-semibold block mb-1">Primary Language</span>
                      <span className="text-sm font-bold text-purple-700">
                        {data.languages[0]?.name || "None"}
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 font-semibold block mb-1">Avg Stars / Repo</span>
                      <span className="text-sm font-bold text-slate-900">
                        {data.profile.publicRepos > 0
                          ? (data.stats.totalStars / data.profile.publicRepos).toFixed(1)
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REPOSITORIES */}
            {activeTab === "repositories" && (
              <div className="space-y-6 animate-in fade-in-50">
                {/* Search & Filters Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Search repository by name or topic..."
                      className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  {/* Language Filter */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    >
                      <option value="ALL">All Languages</option>
                      {data.languages.map((l) => (
                        <option key={l.name} value={l.name}>
                          {l.name} ({l.count})
                        </option>
                      ))}
                    </select>

                    {/* Sort Selector */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    >
                      <option value="stars">Sort by Stars</option>
                      <option value="forks">Sort by Forks</option>
                      <option value="updated">Recently Updated</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Repository Cards Grid */}
                {filteredRepos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-[var(--primary)] hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-bold text-slate-900 hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1.5 truncate group-hover:underline"
                            >
                              <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="truncate">{repo.name}</span>
                            </a>
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-[var(--primary)] transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {repo.description || "No description provided."}
                          </p>

                          {/* Topics */}
                          {repo.topics && repo.topics.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {repo.topics.slice(0, 4).map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)] border border-purple-100"
                                >
                                  #{topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-3">
                            {repo.language && (
                              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: repo.languageColor || "#7d2ae8" }}
                                />
                                {repo.language}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 hover:text-amber-600 font-medium">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              {repo.stars}
                            </span>
                            <span className="inline-flex items-center gap-1 hover:text-indigo-600 font-medium">
                              <GitFork className="w-3.5 h-3.5 text-indigo-500" />
                              {repo.forks}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400">
                            {formatTimeAgo(repo.pushedAt || repo.updatedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-700">No repositories found</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      No repositories match your current filter or search criteria.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACTIVITY */}
            {activeTab === "activity" && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-[var(--primary)]" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Public GitHub Activity
                  </h3>
                </div>

                {data.activities && data.activities.length > 0 ? (
                  <div className="relative pl-6 border-l-2 border-purple-200 space-y-6">
                    {data.activities.map((act) => (
                      <div key={act.id} className="relative group">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-[var(--primary)] group-hover:scale-125 transition-transform" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
                              {act.typeLabel}
                            </span>
                            <a
                              href={act.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-slate-900 hover:text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                            >
                              <span>{act.repoName}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          </div>

                          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(act.createdAt)}
                          </span>
                        </div>

                        {act.detail && (
                          <p className="mt-1.5 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 font-mono">
                            {act.detail}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No public events recently</p>
                    <p className="text-xs text-slate-400 mt-1">
                      GitHub only returns public activity for the last 90 days.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Initial Empty State / Instructions */}
        {!loading && !data && !error && (
          <div className="mt-6 rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/50 to-white p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-[var(--primary)] mb-4">
              <GithubIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Ready to Analyze</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Paste any public GitHub profile link or click one of the quick profiles above to inspect real-time developer statistics, tech stack, and repositories.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setInputUrl("Danishkhan79059");
                  handleAnalyze("Danishkhan79059");
                }}
                className="btn-canva-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
              >
                <span>Analyze Danish Khan's Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
