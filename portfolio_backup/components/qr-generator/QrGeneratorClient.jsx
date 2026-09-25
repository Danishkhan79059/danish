"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import QRCode from "qrcode";
import {
  Globe,
  FileText,
  UserCheck,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Lock,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Sliders,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  QrCode as QrIcon,
  Info,
  Layers,
  Palette,
  CheckCircle2,
  Navigation,
} from "lucide-react";

// Predefined Quick Colors
const COLOR_PRESETS = [
  { name: "Classic Black", fg: "#000000", bg: "#ffffff" },
  { name: "Canva Purple", fg: "#7d2ae8", bg: "#ffffff" },
  { name: "Ocean Cyan", fg: "#00838f", bg: "#ffffff" },
  { name: "Royal Blue", fg: "#1e40af", bg: "#ffffff" },
  { name: "Emerald", fg: "#065f46", bg: "#ffffff" },
  { name: "Dark Theme", fg: "#ffffff", bg: "#0f172a" },
];

// QR Types Definition
const QR_TYPES = [
  { id: "url", label: "Website / URL", icon: Globe, desc: "Open websites and web links" },
  { id: "text", label: "Plain Text", icon: FileText, desc: "Display messages and notes" },
  { id: "vcard", label: "Contact / vCard", icon: UserCheck, desc: "Save contacts to phone" },
  { id: "wifi", label: "Wi-Fi Network", icon: Wifi, desc: "Connect without typing password" },
  { id: "email", label: "Email", icon: Mail, desc: "Compose pre-filled email" },
  { id: "phone", label: "Phone", icon: Phone, desc: "Dial a phone number" },
  { id: "sms", label: "SMS", icon: MessageSquare, desc: "Send pre-filled text message" },
  { id: "location", label: "Location", icon: MapPin, desc: "Google Maps coordinates" },
];

// Helper to escape special characters for Wi-Fi QR
function escapeWifi(str) {
  if (!str) return "";
  return str.replace(/([\\;:,"])/g, "\\$1");
}

// Calculate color luminance for contrast check
function getLuminance(hex) {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const [rl, gl, bl] = [r, g, b].map((val) =>
    val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function getContrastRatio(hex1, hex2) {
  try {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 21;
  }
}

export default function QrGeneratorClient() {
  const [activeType, setActiveType] = useState("url");

  // Form states
  const [urlForm, setUrlForm] = useState({ url: "https://example.com" });
  const [textForm, setTextForm] = useState({ text: "Welcome to my website!" });
  const [vcardForm, setVcardForm] = useState({
    fullName: "Danish Khan",
    phone: "+91 9876543210",
    email: "hello@example.com",
    company: "Example Company",
    jobTitle: "Full-Stack Developer",
    website: "https://example.com",
    address: "New Delhi, India",
  });
  const [wifiForm, setWifiForm] = useState({
    ssid: "Office-Guest-5G",
    password: "SecurePassword123!",
    security: "WPA",
    hidden: false,
  });
  const [emailForm, setEmailForm] = useState({
    email: "hello@example.com",
    subject: "Inquiry about your services",
    body: "Hi Danish,\n\nI would love to discuss a project with you.",
  });
  const [phoneForm, setPhoneForm] = useState({ phone: "+91 9876543210" });
  const [smsForm, setSmsForm] = useState({
    phone: "+91 9876543210",
    message: "Hi Danish, I scanned your QR code!",
  });
  const [locationForm, setLocationForm] = useState({
    latitude: "28.6139",
    longitude: "77.2090",
  });

  // Show Wi-Fi password toggle
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  // Appearance states
  const [qrSize, setQrSize] = useState(512);
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Output QR state
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvgString, setQrSvgString] = useState("");
  const [validationError, setValidationError] = useState("");
  const [copyStatus, setCopyStatus] = useState(null); // 'copied' | 'error' | null
  const [copyFeedbackText, setCopyFeedbackText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // FAQ Accordion open state
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Canvas ref for clipboard copy
  const canvasRef = useRef(null);

  // Compute Raw QR String according to RFC/Standard formats
  const encodedPayload = useMemo(() => {
    let result = "";
    let error = "";

    switch (activeType) {
      case "url": {
        const rawUrl = urlForm.url.trim();
        if (!rawUrl) {
          error = "Please enter a valid website URL.";
          break;
        }
        let fullUrl = rawUrl;
        if (!/^https?:\/\//i.test(fullUrl)) {
          fullUrl = "https://" + fullUrl;
        }
        try {
          const parsed = new URL(fullUrl);
          if (!parsed.hostname || !parsed.hostname.includes(".")) {
            error = "Please enter a valid domain name (e.g. example.com).";
          } else {
            result = fullUrl;
          }
        } catch {
          error = "Invalid URL format. Example: https://example.com";
        }
        break;
      }

      case "text": {
        const txt = textForm.text;
        if (!txt || !txt.trim()) {
          error = "Please enter text to generate a QR code.";
        } else {
          result = txt;
        }
        break;
      }

      case "vcard": {
        if (!vcardForm.fullName.trim()) {
          error = "Full Name is required for contact card.";
          break;
        }
        const nameParts = vcardForm.fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const lines = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${vcardForm.fullName.trim()}`,
          `N:${lastName};${firstName};;;`,
        ];
        if (vcardForm.company.trim()) lines.push(`ORG:${vcardForm.company.trim()}`);
        if (vcardForm.jobTitle.trim()) lines.push(`TITLE:${vcardForm.jobTitle.trim()}`);
        if (vcardForm.phone.trim()) lines.push(`TEL;TYPE=CELL:${vcardForm.phone.trim()}`);
        if (vcardForm.email.trim()) lines.push(`EMAIL:${vcardForm.email.trim()}`);
        if (vcardForm.website.trim()) lines.push(`URL:${vcardForm.website.trim()}`);
        if (vcardForm.address.trim()) lines.push(`ADR:;;${vcardForm.address.trim()};;;;`);
        lines.push("END:VCARD");

        result = lines.join("\n");
        break;
      }

      case "wifi": {
        if (!wifiForm.ssid.trim()) {
          error = "Network Name (SSID) is required.";
          break;
        }
        const authType = wifiForm.security === "None" ? "nopass" : wifiForm.security;
        const passPart =
          wifiForm.security !== "None" && wifiForm.password
            ? `P:${escapeWifi(wifiForm.password)};`
            : "";
        const hiddenPart = `H:${wifiForm.hidden ? "true" : "false"};`;

        result = `WIFI:T:${authType};S:${escapeWifi(wifiForm.ssid.trim())};${passPart}${hiddenPart};`;
        break;
      }

      case "email": {
        const email = emailForm.email.trim();
        if (!email) {
          error = "Recipient Email Address is required.";
          break;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          error = "Please enter a valid email address (e.g. hello@example.com).";
          break;
        }

        const params = [];
        if (emailForm.subject.trim()) {
          params.push(`subject=${encodeURIComponent(emailForm.subject.trim())}`);
        }
        if (emailForm.body.trim()) {
          params.push(`body=${encodeURIComponent(emailForm.body.trim())}`);
        }

        result = `mailto:${email}${params.length ? "?" + params.join("&") : ""}`;
        break;
      }

      case "phone": {
        const ph = phoneForm.phone.trim();
        if (!ph) {
          error = "Phone number is required.";
          break;
        }
        const cleanPh = ph.replace(/[\s-]/g, "");
        if (!/^\+?[0-9]{5,18}$/.test(cleanPh)) {
          error = "Please enter a valid phone number with digits and optional country code (+).";
          break;
        }
        result = `tel:${cleanPh}`;
        break;
      }

      case "sms": {
        const ph = smsForm.phone.trim();
        if (!ph) {
          error = "Phone number is required for SMS.";
          break;
        }
        const cleanPh = ph.replace(/[\s-]/g, "");
        if (!/^\+?[0-9]{5,18}$/.test(cleanPh)) {
          error = "Please enter a valid phone number with digits and optional country code (+).";
          break;
        }
        const msgParam = smsForm.message.trim()
          ? `?body=${encodeURIComponent(smsForm.message.trim())}`
          : "";
        result = `sms:${cleanPh}${msgParam}`;
        break;
      }

      case "location": {
        const lat = parseFloat(locationForm.latitude);
        const lng = parseFloat(locationForm.longitude);
        if (
          isNaN(lat) ||
          lat < -90 ||
          lat > 90 ||
          isNaN(lng) ||
          lng < -180 ||
          lng > 180
        ) {
          error = "Please enter valid Latitude (-90 to 90) and Longitude (-180 to 180).";
          break;
        }
        result = `https://www.google.com/maps?q=${lat},${lng}`;
        break;
      }

      default:
        break;
    }

    return { result, error };
  }, [
    activeType,
    urlForm,
    textForm,
    vcardForm,
    wifiForm,
    emailForm,
    phoneForm,
    smsForm,
    locationForm,
  ]);

  // Generate QR code client-side whenever encoded payload or appearance changes
  const generateQRCode = useCallback(async () => {
    setValidationError(encodedPayload.error);
    if (!encodedPayload.result || encodedPayload.error) {
      setQrDataUrl("");
      setQrSvgString("");
      return;
    }

    setIsGenerating(true);
    try {
      const options = {
        width: qrSize,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      };

      // 1. Generate PNG Data URL
      const dataUrl = await QRCode.toDataURL(encodedPayload.result, options);
      setQrDataUrl(dataUrl);

      // 2. Generate SVG String
      const svg = await QRCode.toString(encodedPayload.result, {
        ...options,
        type: "svg",
      });
      setQrSvgString(svg);

      // 3. Render directly onto hidden canvas for crisp clipboard copy
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, encodedPayload.result, {
          ...options,
          width: 512,
        });
      }
    } catch (err) {
      console.error("QR Generation Error:", err);
      setValidationError("Failed to generate QR Code. Data may be too long for this error correction level.");
    } finally {
      setIsGenerating(false);
    }
  }, [encodedPayload, qrSize, errorCorrection, fgColor, bgColor]);

  // Trigger live generation
  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Contrast check
  const contrastRatio = useMemo(() => {
    return getContrastRatio(fgColor, bgColor);
  }, [fgColor, bgColor]);

  const isLowContrast = contrastRatio < 3.0;

  // Handle Download PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Download SVG
  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Copy QR Image to Clipboard
  const handleCopyQr = async () => {
    if (!canvasRef.current || !qrDataUrl) return;

    try {
      if (typeof window !== "undefined" && window.ClipboardItem && navigator.clipboard?.write) {
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) {
            fallbackTextCopy();
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);
            setCopyStatus("copied");
            setCopyFeedbackText("QR Image Copied to Clipboard!");
            setTimeout(() => setCopyStatus(null), 3000);
          } catch (clipErr) {
            console.warn("ClipboardItem write failed, trying text fallback", clipErr);
            fallbackTextCopy();
          }
        }, "image/png");
      } else {
        fallbackTextCopy();
      }
    } catch (err) {
      console.warn("Clipboard access error:", err);
      fallbackTextCopy();
    }
  };

  const fallbackTextCopy = () => {
    if (encodedPayload.result && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(encodedPayload.result);
      setCopyStatus("copied");
      setCopyFeedbackText("QR Payload text copied to clipboard!");
      setTimeout(() => setCopyStatus(null), 3500);
    } else {
      setCopyStatus("error");
      setCopyFeedbackText("Clipboard not supported. Please right-click or long-press the QR to copy.");
      setTimeout(() => setCopyStatus(null), 4000);
    }
  };

  // Handle Reset
  const handleReset = () => {
    switch (activeType) {
      case "url":
        setUrlForm({ url: "" });
        break;
      case "text":
        setTextForm({ text: "" });
        break;
      case "vcard":
        setVcardForm({
          fullName: "",
          phone: "",
          email: "",
          company: "",
          jobTitle: "",
          website: "",
          address: "",
        });
        break;
      case "wifi":
        setWifiForm({ ssid: "", password: "", security: "WPA", hidden: false });
        break;
      case "email":
        setEmailForm({ email: "", subject: "", body: "" });
        break;
      case "phone":
        setPhoneForm({ phone: "" });
        break;
      case "sms":
        setSmsForm({ phone: "", message: "" });
        break;
      case "location":
        setLocationForm({ latitude: "", longitude: "" });
        break;
      default:
        break;
    }
    setValidationError("");
  };

  // Human-readable summary of payload for preview footer
  const contentPreview = useMemo(() => {
    switch (activeType) {
      case "url":
        return { type: "Website URL", val: urlForm.url || "Awaiting URL input..." };
      case "text":
        return { type: "Plain Text", val: textForm.text || "Awaiting text message..." };
      case "vcard":
        return {
          type: "vCard Contact",
          val: vcardForm.fullName ? `${vcardForm.fullName} (${vcardForm.phone || vcardForm.email || "Contact"})` : "Awaiting contact info...",
        };
      case "wifi":
        return {
          type: "Wi-Fi Access",
          val: wifiForm.ssid ? `SSID: ${wifiForm.ssid} (${wifiForm.security})` : "Awaiting network name...",
        };
      case "email":
        return {
          type: "Email Link",
          val: emailForm.email ? `To: ${emailForm.email}` : "Awaiting email address...",
        };
      case "phone":
        return {
          type: "Phone Dialer",
          val: phoneForm.phone || "Awaiting phone number...",
        };
      case "sms":
        return {
          type: "SMS Message",
          val: smsForm.phone ? `To: ${smsForm.phone}` : "Awaiting mobile number...",
        };
      case "location":
        return {
          type: "Google Maps",
          val: locationForm.latitude && locationForm.longitude ? `${locationForm.latitude}, ${locationForm.longitude}` : "Awaiting coordinates...",
        };
      default:
        return { type: "Data", val: "" };
    }
  }, [
    activeType,
    urlForm,
    textForm,
    vcardForm,
    wifiForm,
    emailForm,
    phoneForm,
    smsForm,
    locationForm,
  ]);

  const faqs = [
    {
      q: "1. How do I create a QR code?",
      a: "Simply choose your desired QR code type (such as URL, Wi-Fi, Text, or vCard), enter your information into the fields, customize colors or size if desired, and your QR code will be generated instantly in real-time. You can then download it as a PNG or SVG.",
    },
    {
      q: "2. Can I create a QR code for a website?",
      a: "Yes! Choose the 'Website / URL' tab, enter your link (e.g. https://example.com or your portfolio link), and a QR code will be created. When scanned by any smartphone camera, it immediately opens the website.",
    },
    {
      q: "3. Can I create a QR code for Wi-Fi?",
      a: "Yes! Select the 'Wi-Fi' tab and enter your Network Name (SSID), Password, and Security Type (WPA, WEP, or None). When scanned by iOS or Android devices, a prompt will appear allowing users to join the Wi-Fi network with a single tap.",
    },
    {
      q: "4. Can I create a contact QR code (vCard)?",
      a: "Yes! Select 'Contact / vCard' and fill in your name, phone number, email, company, and job title. When scanned, modern smartphones recognize the vCard standard and offer to save the contact directly into the phone's address book.",
    },
    {
      q: "5. Can I download my QR code?",
      a: "Yes, you can download your QR code as high-resolution PNG (up to 1024px) for digital use or as vector SVG for lossless printing on business cards, flyers, posters, and merchandise.",
    },
    {
      q: "6. Are QR codes generated locally?",
      a: "Absolutely 100% locally! All encoding and image generation occurs directly in your browser using JavaScript and HTML5 canvas. No credentials, Wi-Fi passwords, contact cards, or URLs ever leave your machine.",
    },
    {
      q: "7. Can I create a QR code for text?",
      a: "Yes! Select the 'Plain Text' tab and type or paste your message, instructions, notes, or promo codes. Scanning will display the exact text on the user's screen.",
    },
    {
      q: "8. Can I create a QR code for email?",
      a: "Yes! Select the 'Email' tab and input recipient email, subject line, and pre-written message. When scanned, it automatically launches the scanner's email app (such as Gmail, Apple Mail, or Outlook) with all fields pre-filled.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hidden canvas for off-screen high-res rendering and clipboard image blob creation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ================= 1. HERO SECTION ================= */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-purple-200/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Universal QR Utility</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>🔒 Private &amp; Local</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Free QR Code Generator
        </h1>

        <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
          Create QR codes for URLs, text, contacts, Wi-Fi, email and more. Fast, completely free, and processed 100% locally in your browser.
        </p>

        {/* Security / Privacy Guarantee Banner */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Your information is processed in your browser and is never uploaded.</strong> No data is sent to external APIs or databases.
          </span>
        </div>
      </div>

      {/* ================= 2. MAIN GENERATOR INTERFACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* ================= LEFT COLUMN: TYPE SELECTOR & FORMS (7 Cols) ================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* QR TYPE SELECTOR (Segmented Grid) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select QR Code Type
              </span>
              <span className="text-xs font-semibold text-[var(--primary)]">
                {QR_TYPES.find((t) => t.id === activeType)?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QR_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = activeType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setActiveType(type.id);
                      setValidationError("");
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer text-center group ${
                      isActive
                        ? "border-[var(--primary)] bg-purple-50/80 text-[var(--primary)] shadow-xs font-bold ring-1 ring-purple-400/30"
                        : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${
                        isActive
                          ? "bg-canva-gradient text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 group-hover:text-[var(--primary)] group-hover:bg-purple-100/70"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold truncate w-full">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC FORM CONTAINER */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-canva-gradient" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {QR_TYPES.find((t) => t.id === activeType)?.label} Details
                </h2>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-rose-50"
                title="Reset current form"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Form</span>
              </button>
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Input Error: </span>
                  {validationError}
                </div>
              </div>
            )}

            {/* 1. WEBSITE / URL FORM */}
            {activeType === "url" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="url-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Website URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <input
                      id="url-input"
                      type="url"
                      value={urlForm.url}
                      onChange={(e) => setUrlForm({ url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Supports <code>https://google.com</code>, <code>https://example.com/product?id=123</code>, or landing pages.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PLAIN TEXT FORM */}
            {activeType === "text" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="text-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Enter Plain Text <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {textForm.text.length} characters
                    </span>
                  </div>
                  <textarea
                    id="text-input"
                    rows={5}
                    value={textForm.text}
                    onChange={(e) => setTextForm({ text: e.target.value })}
                    placeholder="Enter your message, notes, instructions or promotional text here..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all leading-relaxed"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Example: Welcome to my website! The exact text will be displayed when scanned.
                  </p>
                </div>
              </div>
            )}

            {/* 3. CONTACT / vCARD FORM */}
            {activeType === "vcard" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vcard-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="vcard-name"
                      type="text"
                      value={vcardForm.fullName}
                      onChange={(e) => setVcardForm({ ...vcardForm, fullName: e.target.value })}
                      placeholder="Danish Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="vcard-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="vcard-phone"
                      type="tel"
                      value={vcardForm.phone}
                      onChange={(e) => setVcardForm({ ...vcardForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vcard-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="vcard-email"
                      type="email"
                      value={vcardForm.email}
                      onChange={(e) => setVcardForm({ ...vcardForm, email: e.target.value })}
                      placeholder="hello@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="vcard-company" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Company
                    </label>
                    <input
                      id="vcard-company"
                      type="text"
                      value={vcardForm.company}
                      onChange={(e) => setVcardForm({ ...vcardForm, company: e.target.value })}
                      placeholder="Example Company"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vcard-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Job Title
                    </label>
                    <input
                      id="vcard-title"
                      type="text"
                      value={vcardForm.jobTitle}
                      onChange={(e) => setVcardForm({ ...vcardForm, jobTitle: e.target.value })}
                      placeholder="Full-Stack Engineer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="vcard-website" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Website URL
                    </label>
                    <input
                      id="vcard-website"
                      type="url"
                      value={vcardForm.website}
                      onChange={(e) => setVcardForm({ ...vcardForm, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vcard-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Physical Address
                  </label>
                  <input
                    id="vcard-address"
                    type="text"
                    value={vcardForm.address}
                    onChange={(e) => setVcardForm({ ...vcardForm, address: e.target.value })}
                    placeholder="New Delhi, India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Generates a standard vCard 3.0 QR code. Scanned phones can immediately tap &quot;Save Contact&quot;.
                  </p>
                </div>
              </div>
            )}

            {/* 4. WI-FI FORM */}
            {activeType === "wifi" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="wifi-ssid" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Network Name / SSID <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Wifi className="h-4 w-4" />
                    </div>
                    <input
                      id="wifi-ssid"
                      type="text"
                      value={wifiForm.ssid}
                      onChange={(e) => setWifiForm({ ...wifiForm, ssid: e.target.value })}
                      placeholder="MyHomeWifi-5G"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="wifi-security" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Security Type
                    </label>
                    <select
                      id="wifi-security"
                      value={wifiForm.security}
                      onChange={(e) => setWifiForm({ ...wifiForm, security: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                      <option value="WEP">WEP</option>
                      <option value="None">None (Open Network)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wifi-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Wi-Fi Password {wifiForm.security !== "None" && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        id="wifi-password"
                        type={showWifiPassword ? "text" : "password"}
                        disabled={wifiForm.security === "None"}
                        value={wifiForm.password}
                        onChange={(e) => setWifiForm({ ...wifiForm, password: e.target.value })}
                        placeholder={wifiForm.security === "None" ? "No password required" : "Enter network password"}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all disabled:opacity-50"
                      />
                      {wifiForm.security !== "None" && (
                        <button
                          type="button"
                          onClick={() => setShowWifiPassword(!showWifiPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title={showWifiPassword ? "Hide password" : "Show password"}
                        >
                          {showWifiPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    id="wifi-hidden"
                    type="checkbox"
                    checked={wifiForm.hidden}
                    onChange={(e) => setWifiForm({ ...wifiForm, hidden: e.target.checked })}
                    className="h-4 w-4 rounded-md border-slate-300 text-[var(--primary)] focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="wifi-hidden" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Hidden Network (SSID is not broadcasted)
                  </label>
                </div>
              </div>
            )}

            {/* 5. EMAIL FORM */}
            {activeType === "email" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email-address"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      placeholder="hello@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email-subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject Line
                  </label>
                  <input
                    id="email-subject"
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    placeholder="Project Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email-body" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pre-filled Message Body
                  </label>
                  <textarea
                    id="email-body"
                    rows={4}
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    placeholder="Hello Danish, I would like to discuss..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            {/* 6. PHONE FORM */}
            {activeType === "phone" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone-number" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="phone-number"
                      type="tel"
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Include country code (e.g. +91) so any international phone dialer can call immediately.
                  </p>
                </div>
              </div>
            )}

            {/* 7. SMS FORM */}
            {activeType === "sms" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="sms-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recipient Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <input
                      id="sms-phone"
                      type="tel"
                      value={smsForm.phone}
                      onChange={(e) => setSmsForm({ ...smsForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sms-msg" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pre-filled SMS Message
                  </label>
                  <textarea
                    id="sms-msg"
                    rows={4}
                    value={smsForm.message}
                    onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                    placeholder="Hi Danish, I scanned your QR code!"
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            )}

            {/* 8. LOCATION FORM */}
            {activeType === "location" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location-lat" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Latitude (-90 to 90) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="location-lat"
                      type="text"
                      value={locationForm.latitude}
                      onChange={(e) => setLocationForm({ ...locationForm, latitude: e.target.value })}
                      placeholder="28.6139"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="location-lng" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Longitude (-180 to 180) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="location-lng"
                      type="text"
                      value={locationForm.longitude}
                      onChange={(e) => setLocationForm({ ...locationForm, longitude: e.target.value })}
                      placeholder="77.2090"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-slate-500">
                    Generates Google Maps link: <code>https://www.google.com/maps?q={locationForm.latitude || 0},{locationForm.longitude || 0}</code>
                  </p>

                  {locationForm.latitude && locationForm.longitude && !isNaN(parseFloat(locationForm.latitude)) && (
                    <a
                      href={`https://www.google.com/maps?q=${locationForm.latitude},${locationForm.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Manual Explicit Generation Trigger */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Live preview updates automatically as you type.
              </span>

              <button
                type="button"
                onClick={generateQRCode}
                className="btn-canva-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-transform active:scale-95 ml-auto"
              >
                <QrIcon className="h-4 w-4" />
                <span>Generate QR Code</span>
              </button>
            </div>
          </div>

          {/* ================= APPEARANCE & CUSTOMIZATION ================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
              <div className="h-7 w-7 rounded-lg bg-canva-gradient flex items-center justify-center text-white shadow-xs">
                <Sliders className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Appearance &amp; Settings
              </h3>
            </div>

            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Color Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = fgColor === preset.fg && bgColor === preset.bg;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setFgColor(preset.fg);
                          setBgColor(preset.bg);
                        }}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "border-[var(--primary)] bg-purple-50 text-[var(--primary)] ring-1 ring-purple-400"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: preset.fg }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Foreground Color */}
                <div>
                  <label htmlFor="fg-color" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    QR Foreground Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-800"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label htmlFor="bg-color" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    QR Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Contrast Warning if colors are hard to read */}
              {isLowContrast && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Low contrast warning:</strong> The foreground and background colors are very close. Phones may struggle to scan this QR code.
                  </span>
                </div>
              )}

              {/* Size and Error Correction Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Size Selector */}
                <div>
                  <label htmlFor="qr-size" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Export Resolution / Size
                  </label>
                  <select
                    id="qr-size"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    <option value={256}>256 × 256 px (Standard / Web)</option>
                    <option value={512}>512 × 512 px (High-Res / Recommended)</option>
                    <option value={1024}>1024 × 1024 px (Ultra HD / Print)</option>
                  </select>
                </div>

                {/* Error Correction Selector */}
                <div>
                  <label htmlFor="qr-ec" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Error Correction Level
                  </label>
                  <select
                    id="qr-ec"
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    <option value="L">Low (7% recovery)</option>
                    <option value="M">Medium (15% recovery - Default)</option>
                    <option value="Q">Quartile (25% recovery)</option>
                    <option value="H">High (30% recovery - Max durability)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: QR PREVIEW & DOWNLOADS (5 Cols) ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl flex flex-col items-center text-center">
            {/* Header Badge */}
            <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live QR Code Preview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine
              </span>
            </div>

            {/* QR Code Display Canvas / Image Area */}
            <div
              className="p-6 rounded-3xl border border-slate-200/90 shadow-inner flex items-center justify-center min-h-[300px] w-full max-w-[320px] transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              {qrDataUrl && !validationError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-full h-auto object-contain rounded-lg transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                  <QrIcon className="h-16 w-16 stroke-1 mb-2 opacity-50" />
                  <span className="text-xs font-semibold">
                    {validationError ? "Fix errors to preview" : "Enter details to generate QR"}
                  </span>
                </div>
              )}
            </div>

            {/* Guidance Text Below QR */}
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Navigation className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>Scan this QR code with your phone camera</span>
            </div>

            {/* Small Content Summary Snippet */}
            <div className="mt-3 w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {contentPreview.type}
                </span>
                <span className="text-[10px] font-semibold text-[var(--primary)]">
                  {errorCorrection} Level • {qrSize}px
                </span>
              </div>
              <p className="text-xs font-mono text-slate-700 truncate">
                {contentPreview.val}
              </p>
            </div>

            {/* Action Buttons: Copy, PNG, SVG */}
            <div className="mt-6 w-full flex flex-col gap-2.5">
              {/* Copy QR Button */}
              <button
                type="button"
                onClick={handleCopyQr}
                disabled={!qrDataUrl || !!validationError}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-300 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
              >
                {copyStatus === "copied" ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{copyFeedbackText}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-500" />
                    <span>Copy QR to Clipboard</span>
                  </>
                )}
              </button>

              {/* Download Buttons: PNG & SVG */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={!qrDataUrl || !!validationError}
                  className="btn-canva-primary flex items-center justify-center gap-2 rounded-2xl py-3 px-3 text-xs sm:text-sm font-bold shadow-md disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  disabled={!qrSvgString || !!validationError}
                  className="btn-canva-outline flex items-center justify-center gap-2 rounded-2xl py-3 px-3 text-xs sm:text-sm font-bold disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SVG</span>
                </button>
              </div>

              {copyStatus === "error" && (
                <p className="text-[11px] text-amber-700 mt-1">{copyFeedbackText}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. SEO EDUCATIONAL CONTENT ================= */}
      <div className="border-t border-slate-200 pt-16 mb-16">
        <div className="max-w-4xl mx-auto space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1: What is a QR Code */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              What is a QR Code?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-3">
              A <strong>QR Code (Quick Response Code)</strong> is a two-dimensional barcode capable of storing rich digital information. Originally designed in 1994 for industrial automotive tracking, QR codes are now universally recognized by modern iPhone (iOS) and Android camera applications without requiring any special app.
            </p>
            <p className="text-sm sm:text-base text-slate-600">
              Unlike traditional linear barcodes that only encode numbers horizontally, QR codes encode data both vertically and horizontally in a grid of black and white squares. Built-in Reed-Solomon error correction allows QR codes to remain readable even if up to 30% of the symbol is smudged, torn, or partially obscured.
            </p>
          </div>

          {/* Section 2: What can you create a QR code for? */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              What can you create a QR code for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Globe className="h-4 w-4 text-[var(--primary)]" />
                  <span>Websites &amp; Landing Pages</span>
                </div>
                <p className="text-xs text-slate-600">
                  Open portfolios, e-commerce stores, social media profiles, and marketing campaigns with a single scan.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <FileText className="h-4 w-4 text-[var(--primary)]" />
                  <span>Plain Text &amp; Notes</span>
                </div>
                <p className="text-xs text-slate-600">
                  Share instructions, serial numbers, discount coupon codes, or offline text notes instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <UserCheck className="h-4 w-4 text-[var(--primary)]" />
                  <span>Contact Information (vCard)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Allows prospective clients or recruiters to save your phone, email, and company straight to their phonebook.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Wifi className="h-4 w-4 text-[var(--primary)]" />
                  <span>Wi-Fi Network Access</span>
                </div>
                <p className="text-xs text-slate-600">
                  Guests join your home or office wireless network instantly without typing long, complex passwords.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Mail className="h-4 w-4 text-[var(--primary)]" />
                  <span>Email Messages</span>
                </div>
                <p className="text-xs text-slate-600">
                  Pre-fill recipient email addresses, subjects, and inquiry messages ready to be dispatched with one tap.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Phone className="h-4 w-4 text-[var(--primary)]" />
                  <span>Phone Numbers</span>
                </div>
                <p className="text-xs text-slate-600">
                  Directly triggers the smartphone dialer, perfect for hotlines, customer service, or restaurant reservations.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <MessageSquare className="h-4 w-4 text-[var(--primary)]" />
                  <span>SMS Messages</span>
                </div>
                <p className="text-xs text-slate-600">
                  Opens SMS messaging app with pre-filled support or opt-in messages to streamline customer communication.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <MapPin className="h-4 w-4 text-[var(--primary)]" />
                  <span>Map Locations</span>
                </div>
                <p className="text-xs text-slate-600">
                  Direct navigation coordinates for event venues, retail stores, office locations, and real estate.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: How to create a QR code */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              How to create a QR code
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-lg mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Select Your Type
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose what your QR code should do: open a website URL, share Wi-Fi credentials, provide contact info, or launch an email.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-lg mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Enter Info &amp; Style
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fill in your details. Adjust colors, resolution size (up to 1024px), and error correction level with real-time preview.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-lg mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Download or Copy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download your high-resolution PNG image or scalable SVG vector graphic, or copy the QR code directly to your clipboard.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Are these QR codes free? */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              Are these QR codes free?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yes, 100% free with no limits, no expiration dates, and no subscriptions. These are <strong>static QR codes</strong> that directly encode your information into the matrix pattern itself. Because they do not rely on an external redirect service or database, your QR codes will continue to work indefinitely for as long as your website, email, or credentials remain active.
            </p>
          </div>

          {/* Section 5: Is my information uploaded? */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <Lock className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Is my information uploaded?
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              No. <strong>Your data is never uploaded to any server or external API.</strong> All encoding and rendering happens entirely client-side in your web browser using HTML5 Canvas and JavaScript. Whether you are generating Wi-Fi passwords, personal contact numbers, or internal URLs, your data stays strictly on your local device.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. INTERACTIVE FAQ ACCORDION ================= */}
      <div className="border-t border-slate-200 pt-16 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything you need to know about generating and using QR codes.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 hover:text-[var(--primary)] transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                    <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
