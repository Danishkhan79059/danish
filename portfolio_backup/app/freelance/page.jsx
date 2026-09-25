"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ShoppingCart,
  Share2,
  Layers,
  Zap,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  CreditCard,
  Users,
  Smartphone,
  Check,
  Send,
  HelpCircle,
  ChevronDown,
  Code2,
  ExternalLink,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/Icons";

const SERVICES = [
  {
    id: "full-websites",
    icon: Globe,
    title: "Full-Working Websites & Web Apps",
    badge: "Most Requested",
    tagline: "End-to-end, production-ready web solutions tailored to your business needs.",
    description:
      "From modern responsive landing pages to complex full-stack web applications, I build complete, bug-free, and high-performance websites with clean architectures.",
    features: [
      "Full-Stack MERN (MongoDB, Express, React, Node.js) & Next.js 14/15/16",
      "Dynamic Admin Dashboards & Role-Based Access Control (RBAC)",
      "Pixel-perfect responsive design across mobile, tablet, and desktop",
      "High speed optimization (90+ Google PageSpeed score) & SEO ready",
      "Robust REST & GraphQL API backend with secure JWT authentication",
    ],
    deliverables: "Complete Source Code • Live Cloud Deployment • Database Setup • Documentation",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "Custom E-Commerce Panels & Stores",
    badge: "High Conversion",
    tagline: "Tailored online store platforms with powerful admin management.",
    description:
      "Looking for a custom alternative to generic store builders? I create custom eCommerce platforms with complete control over inventory, orders, customer data, and checkout flows.",
    features: [
      "Custom product catalog with variants, sizes, colors & inventory tracking",
      "Smooth shopping cart, guest checkout & saved customer accounts",
      "Integrated payment gateways (Razorpay, Stripe, Cashfree, UPI & PayPal)",
      "Comprehensive Admin Panel: order management, sales analytics & invoices",
      "Coupon code engine, discount rules & automated email notifications",
    ],
    deliverables: "Custom Storefront • Admin Dashboard • Payment Gateway Integration • Invoicing Engine",
  },
  {
    id: "social-panel",
    icon: Share2,
    title: "Social Panels (SMM Panels & Automation)",
    badge: "Automation Specialist",
    tagline: "Automated social media service panels with instant multi-provider API sync.",
    description:
      "High-throughput, automated SMM panels designed for social media service providers and marketing agencies. Handles thousands of orders with automated dispatch.",
    features: [
      "Multi-provider API connection with automatic order placement & status sync",
      "Client balance wallet with automated instant payment gateway deposits",
      "Real-time service sync, custom margin pricing & refill/cancel automation",
      "User & Reseller dashboard with custom API access for sub-clients",
      "Support ticket system, order logs & fraud-protection safeguards",
    ],
    deliverables: "Full SMM Platform • Provider API Integration • Wallet Payment Gateway • Admin Master Portal",
  },
  {
    id: "shopify",
    icon: ShoppingCart,
    title: "Shopify Store & Custom Theme Integration",
    badge: "E-Com Giant",
    tagline: "Custom Liquid coding, theme tweaking, app integrations & store setup.",
    description:
      "Elevate your Shopify store beyond basic templates. I customize Liquid themes, build custom sections, integrate third-party apps, and optimize conversion funnels.",
    features: [
      "Shopify Liquid theme customization & bespoke section building",
      "Shopify App setup, private app development & Storefront API integration",
      "Custom product page layouts, sticky add-to-cart & upselling triggers",
      "Indian & Global payment gateways (Razorpay, PhonePe, Paytm, Stripe)",
      "Store migration, product bulk upload & checkout speed optimization",
    ],
    deliverables: "Configured Shopify Store • Custom Theme Code • App Integrations • Launch Support",
  },
  {
    id: "woocommerce",
    icon: Layers,
    title: "WooCommerce & WordPress Customization",
    badge: "Flexible E-Com",
    tagline: "Bespoke WooCommerce stores, custom plugins & payment configurations.",
    description:
      "Scalable WordPress & WooCommerce solutions built for high reliability. Whether you need a brand-new store or custom plugin modifications, I handle it seamlessly.",
    features: [
      "Custom WooCommerce theme development & child theme modifications",
      "Custom checkout field editors, single-page checkouts & COD verification",
      "Payment gateway integration (Razorpay, Stripe, PayPal, Instamojo, UPI)",
      "Shipping rules, tax calculation & automated PDF invoice generation",
      "Performance caching, database optimization & security hardening",
    ],
    deliverables: "WooCommerce Store • Payment Gateways • Custom Plugins • Performance Optimization",
  },
  {
    id: "api-integration",
    icon: Zap,
    title: "Custom APIs & Payment Gateway Integrations",
    badge: "Backend & Systems",
    tagline: "Seamless third-party connectivity, webhooks & backend automation.",
    description:
      "Need to connect external services to your existing website? I develop secure REST APIs, webhook handlers, and payment integrations that work reliably 24/7.",
    features: [
      "Payment gateway setups (Razorpay, Stripe, PayPal, Cashfree, PayU)",
      "Webhook processing for real-time payment & order confirmation",
      "SMS, WhatsApp (Twilio/Meta API) & Email (SendGrid/Resend) notifications",
      "Third-party CRM, ERP, and shipping provider API synchronization",
      "Data migration, database architecture & legacy code refactoring",
    ],
    deliverables: "Clean API Endpoints • Webhook Handlers • Postman Documentation • Live Testing",
  },
];

const ESTIMATOR_SERVICES = [
  { id: "Full Website / Web App", label: "Full-Working Website", basePrice: "₹12,000 / $150", defaultDays: "7-14 Days" },
  { id: "E-Commerce Panel & Store", label: "Custom E-Commerce Panel", basePrice: "₹18,000 / $220", defaultDays: "10-20 Days" },
  { id: "Social Panel (SMM)", label: "Social / SMM Panel", basePrice: "₹15,000 / $180", defaultDays: "7-15 Days" },
  { id: "Shopify Integration", label: "Shopify Store & Customization", basePrice: "₹10,000 / $125", defaultDays: "5-10 Days" },
  { id: "WooCommerce Integration", label: "WooCommerce / WordPress", basePrice: "₹10,000 / $125", defaultDays: "5-10 Days" },
  { id: "Custom API & Payment Gateway", label: "Custom API / Payment Gateway", basePrice: "₹6,000 / $75", defaultDays: "3-7 Days" },
];

const TIMELINES = [
  { id: "Urgent (1-2 Weeks)", label: "⚡ Fast Track (1-2 Weeks)" },
  { id: "Standard (2-4 Weeks)", label: "📅 Standard (2-4 Weeks)" },
  { id: "Flexible (1+ Month)", label: "🛡️ Flexible / Long-term" },
];

const FAQS = [
  {
    q: "Kya aap complete working project dete ho (frontend + backend + database)?",
    a: "Haan, bilkul! Main complete, fully-functional web application deliver karta hu jisme responsive frontend, robust backend, live database, authentication aur payment gateway sab kuch integrated aur tested hota hai.",
  },
  {
    q: "Shopify aur WooCommerce me aap exactly kya customize karte ho?",
    a: "Shopify me Liquid theme customization, custom apps, custom sections, Indian/International payment gateways, aur checkout speed optimization. WooCommerce me custom theme/plugin development, single-page checkout, Razorpay/UPI/Stripe setup, aur order automation.",
  },
  {
    q: "Social / SMM Panel me kya features milte hain?",
    a: "Complete SMM system jisme multiple provider APIs connect hoti hain, automatic order placement, user wallet deposit (automatic payments ke saath), service catalog sync, reseller API, aur admin master panel shamil hota hai.",
  },
  {
    q: "Payment terms kya rehte hain?",
    a: "Kaam safe milestone basis par hota hai (e.g. initial token advance to start, milestone preview demo dekhne ke baad second part, aur final live deployment / source code handover par balance). Isse dono parties safe rehti hain.",
  },
  {
    q: "Delivery ke baad support ya bug-fixing milti hai?",
    a: "Haan, har project ke sath 30 days ka free post-launch support aur bug-fixing guarantee milti hai. Agar koi bhi issue aata hai toh bina kisi extra charge ke turant fix kiya jata hai.",
  },
  {
    q: "Project start karne ke liye mujhe kya provide karna hoga?",
    a: "Aapke project ki basic requirement ya reference websites, logo/content (agar available ho), aur domain/hosting credentials (agar already purchase kiye hue hain, warna main recommend aur setup kar dunga).",
  },
];

export default function FreelancePage() {
  const [selectedService, setSelectedService] = useState(ESTIMATOR_SERVICES[0].id);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINES[0].id);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Selected service metadata
  const currentServiceMeta =
    ESTIMATOR_SERVICES.find((s) => s.id === selectedService) || ESTIMATOR_SERVICES[0];

  // WhatsApp Message Generator
  const generateWhatsAppMessage = () => {
    let msg = `Hi Danish! I saw your Freelance Services on your portfolio and want to discuss a project:%0A%0A`;
    msg += `• *Service Required:* ${selectedService}%0A`;
    msg += `• *Timeline:* ${selectedTimeline}%0A`;
    if (clientName) msg += `• *My Name:* ${clientName}%0A`;
    if (clientPhone) msg += `• *Contact:* ${clientPhone}%0A`;
    if (projectNotes) msg += `• *Project Details:* ${projectNotes}%0A`;
    msg += `%0APlease let me know your availability and how we can proceed!`;
    return `https://wa.me/917905955584?text=${msg}`;
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("+917905955584");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Top Ambient Glow / Banner */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-purple-50/40 via-white to-white py-16 sm:py-20 lg:py-24">
        {/* Subtle Decorative Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10">
          <div className="absolute -top-12 left-1/4 h-72 w-72 rounded-full bg-[var(--secondary)]/15 blur-3xl" />
          <div className="absolute top-8 right-1/4 h-80 w-80 rounded-full bg-[var(--primary)]/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Live Availability Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-700">
                Available for Freelance &amp; Contract Work
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-[var(--primary)]">
                Fast Turnaround
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight">
              I Build{" "}
              <span className="text-canva-gradient">Full-Working Websites</span>,
              <br className="hidden sm:inline" /> E-Commerce &amp; Custom Panels
            </h1>

            {/* Subheading */}
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Need a full-stack developer who turns ideas into reliable, production-ready code?
              From complete custom web applications and high-throughput SMM social panels to
              Shopify &amp; WooCommerce integrations — I deliver end-to-end, bug-free solutions.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-canva-primary inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg"
              >
                <WhatsAppIcon className="h-5 w-5 fill-current" />
                <span>Discuss on WhatsApp</span>
              </a>

              <a
                href="#estimator"
                className="btn-canva-outline inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold"
              >
                <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                <span>Estimate Project Cost</span>
              </a>

              <a
                href="tel:+917905955584"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
              >
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>+91 7905955584</span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl text-left">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[var(--primary)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">100% Working Code</h2>
                  <p className="text-[11px] text-slate-500">Zero half-done code</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-[var(--secondary-hover)]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">On-Time Delivery</h2>
                  <p className="text-[11px] text-slate-500">Agile milestones</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">30 Days Support</h2>
                  <p className="text-[11px] text-slate-500">Free bug-fix warranty</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[var(--accent)]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">Direct 1-on-1</h2>
                  <p className="text-[11px] text-slate-500">No agency middlemen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
            What I Deliver
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            Specialized Freelance Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            From modern responsive frontends to complex backend automation and store integrations,
            here are the core solutions I engineer for clients worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
              >
                {/* Top Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canva-gradient text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold text-[var(--primary)] bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-[var(--secondary-hover)] mt-1">
                    {service.tagline}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Deliverables & CTA */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Deliverables:
                    </span>
                    <p className="text-[11px] font-medium text-slate-700 mt-0.5">
                      {service.deliverables}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/917905955584?text=Hi%20Danish,%20I'm%20interested%20in%20your%20${encodeURIComponent(
                      service.title
                    )}%20freelance%20service.%20Let's%20discuss!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-canva-gradient hover:text-white hover:border-transparent transition-all shadow-xs"
                  >
                    <span>Inquire About This Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Project Estimator & WhatsApp Inquiry */}
      <section id="estimator" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="relative overflow-hidden rounded-3xl border border-purple-200/90 bg-gradient-to-br from-purple-50/40 via-white to-cyan-50/30 p-6 sm:p-10 lg:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Configuration Form */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-purple-100/70 px-3 py-1 rounded-full">
                  Interactive Estimator
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Plan Your Project &amp; Get an Instant Quote
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">
                  Select your project type and timeline to see estimated cost and turn-around time,
                  then send the scope directly to my WhatsApp with a single click.
                </p>
              </div>

              {/* Step 1: Select Service */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                  1. Select Service Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ESTIMATOR_SERVICES.map((s) => {
                    const isSelected = selectedService === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.id)}
                        className={`text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? "border-[var(--primary)] bg-white shadow-md ring-1 ring-[var(--primary)]"
                            : "border-slate-200 bg-white/70 hover:border-purple-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{s.label}</span>
                          {isSelected && <Check className="h-4 w-4 text-[var(--primary)]" />}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Starts approx: {s.basePrice}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Timeline */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                  2. Select Timeline / Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIMELINES.map((t) => {
                    const isSelected = selectedTimeline === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTimeline(t.id)}
                        className={`text-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Project Requirements / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Describe any specific features, design links or reference websites..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Instant Estimate Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-purple-200 bg-white p-6 sm:p-7 shadow-xl shadow-purple-500/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Estimated Project Summary
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Free Consultation
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-xs text-slate-500">Service:</span>
                      <h4 className="text-sm font-bold text-slate-900">{selectedService}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500">Estimated Timeline:</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          {currentServiceMeta.defaultDays}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500">Starting Estimate:</span>
                        <p className="text-xs font-bold text-[var(--primary)] mt-0.5">
                          {currentServiceMeta.basePrice}
                        </p>
                      </div>
                    </div>

                    <div className="bg-purple-50/70 rounded-xl p-3 border border-purple-100 space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>100% Full Working Source Code Handover</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Free 30-Day Bug Fixing &amp; Deployment</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Direct Communication with Danish Khan</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-canva-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold shadow-md"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-current" />
                    <span>Send Scope to Danish on WhatsApp</span>
                  </a>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Average reply time: under 15 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work: 5-Step Process */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
            Seamless Workflow
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            How Your Project Gets Built
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            A transparent, milestone-driven process with zero surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Discovery & Scope",
              desc: "We discuss your exact requirements, features, reference sites, and target launch date.",
            },
            {
              step: "02",
              title: "Architecture & UI",
              desc: "I design the system architecture, database schema, and responsive UI components.",
            },
            {
              step: "03",
              title: "Live Development",
              desc: "You receive staging demo links so you can test features and give feedback in real time.",
            },
            {
              step: "04",
              title: "Integrations & QA",
              desc: "Payment gateways, APIs, email notifications, and end-to-end bug testing completed.",
            },
            {
              step: "05",
              title: "Launch & Support",
              desc: "Final live deployment, source code transfer, and 30 days of free ongoing warranty.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 hover:border-purple-200 hover:shadow-md transition-all"
            >
              <span className="text-2xl font-black text-[var(--primary)]/30 block mb-2 font-mono">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Freelance FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-slate-900 hover:text-[var(--primary)] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[var(--primary)]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Direct CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1021] via-slate-900 to-[#121829] p-8 sm:p-12 lg:p-14 text-white text-center shadow-2xl border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,42,232,0.3)_0%,rgba(0,196,204,0.15)_40%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md mb-4 border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              Let's Build Something Great
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Ready to Start Your Freelance Project?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Have an existing project that needs finishing, or a new concept from scratch?
              Connect with Danish Khan directly for quick estimation and immediate start.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-canva-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-bold shadow-xl"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+917905955584"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-md"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>Call +91 7905955584</span>
              </a>

              <a
                href="mailto:khandanish30599@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-md"
              >
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>Email Me</span>
              </a>
            </div>

            <p className="mt-6 text-[11px] text-slate-400">
              Direct Contact: Danish Khan • Flat 817, Sector-4, India • Reply guarantee within 15 minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
