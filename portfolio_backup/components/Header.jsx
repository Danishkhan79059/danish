"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  FileText,
  Sparkles,
  Send,
  ChevronDown,
  Disc3,
  Code2,
  Search,
  Bug,
  FileJson,
  KeyRound,
  QrCode,
  Keyboard,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  {
    label: "Challenge ⚡",
    href: "/spinner-game",
    hasDropdown: true,
    dropdownItems: [
      {
        label: "Freelance Services",
        badge: "💼 Hire Me",
        desc: "Websites, eCommerce, SMM panels, Shopify & WooCommerce",
        href: "/freelance",
        icon: Briefcase,
      },
      {
        label: "Debug My Code",
        badge: "🐛 Bug Hunter",
        desc: "Interactive IDE bug fixer with Monaco editor",
        href: "/bug-hunter",
        icon: Bug,
      },
      {
        label: "Coding Challenge",
        badge: "⚡ Quiz",
        desc: "Interactive JavaScript & React test",
        href: "/coding-challenge",
        icon: Code2,
      },
      {
        label: "Spinner Game",
        badge: "🎡 Lucky Draw",
        desc: "Candidate wheel picker with live MongoDB",
        href: "/spinner-game",
        icon: Disc3,
      },
      {
        label: "GitHub Analyzer",
        badge: "🔍 Insights",
        desc: "Tech stack, repos & developer analytics",
        href: "/github-analyzer",
        icon: Search,
      },
      {
        label: "JSON Formatter",
        badge: "🛠️ Dev Tool",
        desc: "Format, validate, beautify & minify JSON",
        href: "/tools/json-formatter",
        icon: FileJson,
      },
      {
        label: "JWT Decoder",
        badge: "🔐 Security",
        desc: "Decode & inspect claims, header & signature",
        href: "/jwt-decoder",
        icon: KeyRound,
      },
      {
        label: "QR Generator",
        badge: "📱 Free Utility",
        desc: "Create custom QR codes for URLs, Wi-Fi & text",
        href: "/qr-generator",
        icon: QrCode,
      },
      {
        label: "Image to PDF",
        badge: "📄 PDF Tool",
        desc: "Convert JPG, PNG & SVG images to PDF",
        href: "/image-to-pdf",
        icon: FileText,
      },
      {
        label: "Typing Test",
        badge: "⚡ Skill Game",
        desc: "Test your WPM, accuracy & typing speed",
        href: "/typing-speed-test",
        icon: Keyboard,
      },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/Contactus" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChallengeHovered, setIsChallengeHovered] = useState(false);
  const [mobileChallengeOpen, setMobileChallengeOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full select-none bg-white">
      {/* Top Developer Status Bar */}
      <div className="hidden lg:block bg-[#0b1021] text-slate-300 text-xs py-2 border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Status & Role */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
              Full-Stack MERN Developer
            </span>

            <span className="text-slate-700">|</span>

            <span className="text-slate-400">3+ Years Experience</span>

            <span className="text-slate-700">|</span>

            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open to Opportunities
            </span>
          </div>

          {/* Right: Quick Socials */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Danishkhan79059"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <span className="text-slate-700">|</span>

            <a
              href="https://www.linkedin.com/in/danishkhan786/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_25px_-5px_rgba(125,42,232,0.08)] border-b border-slate-200/90 py-1 sm:py-1.5"
          : "bg-white border-b border-slate-200/80 py-1.5 sm:py-2"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logoD.png"
              alt="Danish Khan Logo"
              width={300}
              height={120}
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain transition-transform hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                const isDropdownActive = link.dropdownItems.some((item) =>
                  pathname.startsWith(item.href)
                );

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setIsChallengeHovered(true)}
                    onMouseLeave={() => setIsChallengeHovered(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setIsChallengeHovered(!isChallengeHovered)}
                      className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${isDropdownActive || isChallengeHovered
                        ? "text-[var(--primary)] bg-[var(--primary-light)] font-bold shadow-xs"
                        : "text-slate-600 hover:text-[var(--primary)] hover:bg-slate-50"
                        }`}
                      aria-expanded={isChallengeHovered}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isChallengeHovered ? "rotate-180 text-[var(--primary)]" : "text-slate-400"
                          }`}
                      />
                      {isDropdownActive && (
                        <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-canva-gradient rounded-full" />
                      )}
                    </button>

                    {/* Floating Dropdown Menu on Hover */}
                    {isChallengeHovered && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] xl:w-[780px] rounded-3xl border border-slate-200/90 bg-white/98 p-4 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 z-50">
                        <div className="flex items-center justify-between px-2 pb-2.5 mb-2.5 border-b border-slate-100">
                          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                            Interactive Challenges &amp; Developer Tools
                          </span>
                          <span className="text-[10px] font-semibold text-[var(--primary)] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                            {link.dropdownItems.length} Developer Tools &amp; Apps
                          </span>
                        </div>
                        {/* 3-Column Grid: 1st | 2nd | 3rd on top row, 4th | 5th on bottom row */}
                        <div className="grid grid-cols-3 gap-2.5">
                          {link.dropdownItems.map((item) => {
                            const isItemActive = pathname === item.href;
                            const IconComp = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsChallengeHovered(false)}
                                className={`group flex items-start gap-2.5 rounded-2xl p-2.5 border transition-all duration-150 ${isItemActive
                                  ? "border-purple-200 bg-[var(--primary-light)] text-[var(--primary)] shadow-xs"
                                  : "border-slate-100 bg-white hover:border-purple-200 hover:bg-slate-50 hover:text-[var(--primary)]"
                                  }`}
                              >
                                <div
                                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${isItemActive
                                    ? "bg-canva-gradient text-white shadow-xs"
                                    : "bg-purple-50 text-[var(--primary)] group-hover:bg-canva-gradient group-hover:text-white"
                                    }`}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="text-xs font-bold truncate">
                                      {item.label}
                                    </span>
                                  </div>
                                  <span className="inline-block rounded-full bg-purple-100/80 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--primary)] mb-1">
                                    {item.badge}
                                  </span>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                                    {item.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Dedicated Freelance Spotlight Banner */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <Link
                            href="/freelance"
                            onClick={() => setIsChallengeHovered(false)}
                            className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-purple-200/90 bg-gradient-to-r from-purple-50/90 via-cyan-50/50 to-white p-3 hover:border-[var(--primary)] hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canva-gradient text-white shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
                                <Briefcase className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                                    Looking for Freelance Work &amp; Custom Web Apps?
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[9px] font-bold">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Available Now
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  Full-Working Websites • E-Commerce Panels • Social Panels • Shopify &amp; WooCommerce Integrations
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] shrink-0 pl-3">
                              <span>Hire Danish</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? "text-[var(--primary)] bg-[var(--primary-light)] font-bold shadow-xs"
                    : "text-slate-600 hover:text-[var(--primary)] hover:bg-slate-50"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-canva-gradient rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* GitHub Profile Icon */}
            <a
              href="https://github.com/Danishkhan79059"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-slate-50 transition-all"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/danishkhan786/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-slate-50 transition-all"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            {/* Resume Button */}
            <a
              href="/Danish_Khan_Full_Stack_Developer_Resume (1).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Resume</span>
            </a>

            {/* Let's Talk CTA */}
            <Link
              href="/contact"
              className="btn-canva-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let's Talk</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/contact"
              className="btn-canva-primary inline-flex sm:hidden items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold"
            >
              <span>Contact</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[var(--primary)] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-5 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                const isDropdownActive = link.dropdownItems.some((item) =>
                  pathname.startsWith(item.href)
                );

                return (
                  <div key={link.label} className="flex flex-col gap-1 rounded-xl bg-slate-50/80 p-2 border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMobileChallengeOpen(!mobileChallengeOpen)}
                      className="flex items-center justify-between px-2 py-1.5 text-sm font-bold text-slate-800"
                    >
                      <span className="flex items-center gap-2">
                        <span>{link.label}</span>
                        {isDropdownActive && (
                          <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
                        )}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileChallengeOpen ? "rotate-180 text-[var(--primary)]" : ""
                          }`}
                      />
                    </button>

                    {mobileChallengeOpen && (
                      <div className="flex flex-col gap-1 pl-2 pt-1 border-l-2 border-purple-200 ml-2">
                        {link.dropdownItems.map((item) => {
                          const isItemActive = pathname === item.href;
                          const IconComp = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              prefetch={false}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isItemActive
                                ? "bg-white text-[var(--primary)] shadow-xs font-bold"
                                : "text-slate-600 hover:text-[var(--primary)]"
                                }`}
                            >
                              <IconComp className="w-3.5 h-3.5 text-[var(--primary)]" />
                              <span>{item.label}</span>
                              <span className="ml-auto text-[10px] text-purple-600 font-medium">
                                {item.badge}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? "text-[var(--primary)] bg-[var(--primary-light)] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[var(--primary)]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Actions */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>

            <a
              href="/Danish_Khan_Full_Stack_Developer_Resume (1).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Download Resume</span>
            </a>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="btn-canva-primary flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Let's Talk</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}