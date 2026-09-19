"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Copy,
  Check,
  Sparkles,
  Home,
  Building2,
  ExternalLink,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/Icons";

export default function ContactSection() {
  const [copiedField, setCopiedField] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Full-Stack Web App",
    message: "",
  });

  const contactData = {
    phone: "+91 7905955584",
    phoneRaw: "+917905955584",
    whatsapp: "+91 7905955584",
    whatsappLink:
      "https://wa.me/917905955584?text=Hi%20Danish,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect!",
    email: "khandanish30599@gmail.com",
    currentAddress: {
      flat: "Flat 817, Sector-4",
      landmark: "Near Chintpurni Mata Mandir",
      cityState: "India",
    },
    permanentAddress: {
      village: "Khizirpur Alinagar",
      post: "Post - Zamania",
      district: "Dist - Ghazipur",
      state: "Uttar Pradesh, India",
    },
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-white text-slate-900">
      {/* Top Banner / Hero */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-[radial-gradient(ellipse_at_top,rgba(0,196,204,0.09)_0%,rgba(125,42,232,0.07)_50%,transparent_80%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-canva text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span>Get In Touch • Available For Opportunities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Let&apos;s Start a{" "}
            <span className="text-canva-gradient">Conversation</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have a SaaS project in mind, an opportunity to discuss, or just want to connect?
            Reach out directly via phone, WhatsApp, email, or drop a message below.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* =========================================================================
                LEFT COLUMN: DIRECT CONTACT DETAILS & ADDRESSES (5 Cols)
                ========================================================================= */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* WhatsApp Quick Action Card */}
              <div className="relative rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border border-emerald-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                      <WhatsAppIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Instant WhatsApp Chat
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {contactData.whatsapp}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600">
                  Quickest way to reach me for project discussions, inquiries, or casual hello.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={contactData.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 shadow-sm transition-all active:scale-98"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopy(contactData.whatsapp, "whatsapp")}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 transition-colors"
                    title="Copy WhatsApp number"
                  >
                    {copiedField === "whatsapp" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Direct Phone & Email Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {/* Phone Call Card */}
                <div className="rounded-2xl p-5 border border-slate-200 bg-white hover:border-[var(--primary)] hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)] group-hover:scale-105 transition-transform">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Direct Phone
                        </div>
                        <div className="text-base font-extrabold text-slate-900">
                          {contactData.phone}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(contactData.phone, "phone")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--primary)] hover:bg-slate-50 transition-colors"
                      title="Copy phone number"
                    >
                      {copiedField === "phone" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Available Mon-Sat</span>
                    <a
                      href={`tel:${contactData.phoneRaw}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                    >
                      <span>Call Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Email Card */}
                <div className="rounded-2xl p-5 border border-slate-200 bg-white hover:border-[var(--secondary)] hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--secondary-light)] text-[var(--secondary)] group-hover:scale-105 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Email Address
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 break-all">
                          {contactData.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(contactData.email, "email")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--secondary)] hover:bg-slate-50 transition-colors"
                      title="Copy email address"
                    >
                      {copiedField === "email" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Fast Response</span>
                    <a
                      href={`mailto:${contactData.email}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
                    >
                      <span>Send Mail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  ADDRESSES SECTION (Current & Permanent)
                  ========================================================================= */}
              <div className="rounded-2xl p-6 border border-slate-200 bg-slate-50/70 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--primary)]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Location &amp; Addresses
                  </h2>
                </div>

                {/* Current Address */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-md">
                      Current Address
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {contactData.currentAddress.flat}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {contactData.currentAddress.landmark}
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-[var(--secondary)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)] bg-[var(--secondary-light)] px-2 py-0.5 rounded-md">
                      Permanent Address
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Village: {contactData.permanentAddress.village}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {contactData.permanentAddress.post}, {contactData.permanentAddress.district}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    State: {contactData.permanentAddress.state}
                  </div>
                </div>
              </div>

              {/* Response Time & Work Status */}
              <div className="rounded-2xl p-5 border border-slate-200 bg-white flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                  <Clock className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Average Response Time: &lt; 2 Hours
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Timezone: IST (UTC +5:30) • Open for Full-Time &amp; SaaS Contracts
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN: INTERACTIVE CONTACT FORM (7 Cols)
                ========================================================================= */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm relative">
                <div className="mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] badge-canva px-3 py-1 rounded-full">
                    Direct Inquiry Form
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                    Send Me a Message
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Fill out the form below and I will get back to you promptly.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-emerald-200 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Message Sent Successfully!
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 max-w-md">
                      Thank you for reaching out, <strong className="text-slate-900">{formData.name}</strong>.
                      I have received your inquiry regarding{" "}
                      <span className="font-semibold text-slate-900">
                        &quot;{formData.projectType}&quot;
                      </span>{" "}
                      and will reply to <span className="font-semibold text-slate-900">{formData.email}</span> shortly.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            projectType: "Full-Stack Web App",
                            message: "",
                          });
                        }}
                        className="btn-canva-outline px-5 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Send Another Message
                      </button>

                      <a
                        href={contactData.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp Instead</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Your Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone & Project Type Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Subject / Inquiry Type
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        >
                          <option>Full-Stack Web App</option>
                          <option>SaaS Product Development</option>
                          <option>Data Dashboard &amp; Analytics</option>
                          <option>REST API &amp; Backend Engineering</option>
                          <option>Job / Full-Time Opportunity</option>
                          <option>Other Collaboration</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell me about your project, timeline, or requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn-canva-primary mt-2 flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>

                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Your information is kept 100% private and confidential.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
