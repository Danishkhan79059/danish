"use client";

import Link from "next/link";
import { Mail, ArrowUpRight, FileText, Sparkles, } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/Icons";

const QUICK_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "Skills", href: "/skills" },
    { label: "Blog", href: "/blog" },
    { label: "GitHub Analyzer", href: "/github-analyzer" },
    { label: "Contact", href: "/contact" },
];

const EXPERTISE = [
    { label: "MERN Stack Development", href: "/skills" },
    { label: "SaaS Product Development", href: "/projects" },
    { label: "Multi-Tenant Architecture", href: "/projects" },
    { label: "Data Visualization & Dashboards", href: "/projects" },
    { label: "High-Performance REST APIs", href: "/skills" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full text-white bg-[#0b1021] relative overflow-hidden border-t border-slate-800">
            {/* Ambient Canva Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--secondary)] opacity-10 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--primary)] opacity-10 blur-[120px] pointer-events-none rounded-full" />

            {/* Main Footer Container */}
            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Column 1: Brand / Summary */}
                    <div className="flex flex-col gap-5">
                        <Link href="/" className="inline-flex items-center gap-3 w-fit group">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-canva-gradient shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform p-[2px]">
                                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b1021]">
                                    <span className="text-base font-black text-canva-gradient">
                                        DK
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="text-base font-extrabold text-white group-hover:text-[var(--secondary)] transition-colors">
                                    Danish Khan
                                </div>
                                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    Full-Stack &amp; SaaS Engineer
                                </div>
                            </div>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-300">
                            Full-Stack MERN Developer with 3+ years of experience engineering{" "}
                            <strong className="text-white font-semibold">
                                SaaS applications, data visualization dashboards,
                            </strong>{" "}
                            and high-reliability multi-tenant platforms.
                        </p>

                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            <span>Available for high-impact roles &amp; projects</span>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-2 pt-1">
                            <a
                                href="https://github.com/Danishkhan79059"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub Profile"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:bg-white/10 transition-all"
                            >
                                <GithubIcon className="w-4 h-4" />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/danishkhan786/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn Profile"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-white/10 transition-all"
                            >
                                <LinkedinIcon className="w-4 h-4" />
                            </a>

                            <a
                                href="https://wa.me/917905955584?text=Hi%20Danish,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20connect!"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp Chat"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400 hover:text-emerald-400 hover:bg-white/10 transition-all"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                            </a>

                            <a
                                href="mailto:khandanish30599@gmail.com"
                                aria-label="Send an Email"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-white/10 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
                            Navigation
                        </h3>

                        <ul className="flex flex-col gap-2.5">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-300 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                                    >
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Expertise */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                            Expertise
                        </h3>

                        <ul className="flex flex-col gap-2.5">
                            {EXPERTISE.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-slate-300 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1"
                                    >
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact & CTA */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            Let's Connect
                        </h3>

                        <p className="text-sm leading-relaxed text-slate-300">
                            Have an idea, project, or full-time opportunity in mind? Let's build
                            something exceptional together.
                        </p>

                        <a
                            href="mailto:khandanish30599@gmail.com"
                            className="text-sm text-slate-300 hover:text-[var(--secondary)] transition-colors inline-flex items-center gap-1.5 font-medium"
                        >
                            <Mail className="w-4 h-4 text-[var(--secondary)]" />
                            <span>khandanish30599@gmail.com</span>
                        </a>

                        <div className="flex flex-col gap-2.5 pt-1">
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-fit items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Resume</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                            </a>

                            <Link
                                href="/contact"
                                className="btn-canva-primary inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Get In Touch</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Legal & Credits */}
            <div className="border-t border-slate-800/80 bg-black/30">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
                    <p className="text-xs text-slate-400 text-center sm:text-left flex items-center gap-1">
                        <span>© {year} Danish Khan. Built with Next.js &amp; Tailwind.</span>
                    </p>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/projects"
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            Projects
                        </Link>
                        <Link
                            href="/experience"
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            Experience
                        </Link>
                        <Link
                            href="/contact"
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}