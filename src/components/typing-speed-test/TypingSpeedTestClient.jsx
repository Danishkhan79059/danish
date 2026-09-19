"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Keyboard,
  Timer,
  Gauge,
  Target,
  RotateCcw,
  Trophy,
  Check,
  X,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronUp,
  Play,
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Volume2,
  VolumeX,
  RefreshCw,
  Globe,
} from "lucide-react";
import { getRandomPassage } from "@/data/typingPassages";
import { fetchDynamicPassage } from "@/lib/typingApiService";

// Durations available
const DURATIONS = [
  { label: "15s", seconds: 15 },
  { label: "30s", seconds: 30 },
  { label: "60s", seconds: 60 },
  { label: "120s", seconds: 120 },
];

// Difficulty levels
const DIFFICULTIES = [
  { id: "easy", label: "Easy", desc: "Simple words & short sentences" },
  { id: "medium", label: "Medium", desc: "Standard text & punctuation" },
  { id: "hard", label: "Hard", desc: "Technical terms, symbols & numbers" },
];

// Categories
const CATEGORIES = [
  { id: "general", label: "General" },
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "programming", label: "Programming" },
  { id: "random", label: "Random" },
];

export default function TypingSpeedTestClient() {
  // Test Configuration
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [selectedCategory, setSelectedCategory] = useState("general");

  // Passage & Typing State
  const [currentPassage, setCurrentPassage] = useState("");
  const [passageSource, setPassageSource] = useState("🌐 Free Live API");
  const [passageAuthor, setPassageAuthor] = useState("");
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);
  const [typedInput, setTypedInput] = useState("");
  const [testState, setTestState] = useState("idle"); // 'idle' | 'running' | 'finished'

  // Timer & Statistics
  const [timeLeft, setTimeLeft] = useState(60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState(false);

  // FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Refs
  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const activeCharRef = useRef(null);

  // Load a new passage from Free API with local fallback
  const loadPassage = useCallback(async (forceOffline = false) => {
    setIsLoadingPassage(true);
    setTypedInput("");
    setTimeLeft(selectedDuration);
    setElapsedSeconds(0);
    setMistakesCount(0);
    setTestState("idle");
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    try {
      if (!forceOffline) {
        const res = await fetchDynamicPassage(selectedCategory, selectedDifficulty);
        setCurrentPassage(res.text);
        setPassageSource(res.source);
        setPassageAuthor(res.author);
      } else {
        const p = getRandomPassage(selectedCategory, selectedDifficulty);
        setCurrentPassage(p.text);
        setPassageSource("📚 Offline Curated");
        setPassageAuthor("");
      }
    } catch {
      const p = getRandomPassage(selectedCategory, selectedDifficulty);
      setCurrentPassage(p.text);
      setPassageSource("📚 Offline Curated");
      setPassageAuthor("");
    } finally {
      setIsLoadingPassage(false);
    }
  }, [selectedCategory, selectedDifficulty, selectedDuration]);

  // Initial load
  useEffect(() => {
    loadPassage();
  }, [loadPassage]);

  // Timer countdown engine
  useEffect(() => {
    if (testState === "running") {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current);
            setTestState("finished");
            return 0;
          }
          return prevTime - 1;
        });

        setElapsedSeconds((prevElapsed) => prevElapsed + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [testState]);

  // Real-time statistics calculations
  const stats = useMemo(() => {
    const totalTyped = typedInput.length;
    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < totalTyped; i++) {
      if (typedInput[i] === currentPassage[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    // Elapsed time in minutes (minimum 1 second to avoid division by zero)
    const effectiveElapsed = Math.max(1, elapsedSeconds);
    const minutes = effectiveElapsed / 60;

    // Standard WPM: (correct characters / 5) / minutes
    const rawWpm = Math.round((correctChars / 5) / minutes);
    const wpm = isNaN(rawWpm) || rawWpm < 0 ? 0 : rawWpm;

    // Accuracy %
    const accuracy =
      totalTyped === 0 ? 100 : Math.max(0, Math.min(100, (correctChars / totalTyped) * 100));

    return {
      wpm,
      accuracy: accuracy.toFixed(1),
      totalTyped,
      correctChars,
      incorrectChars,
      mistakes: mistakesCount,
      timeTaken: selectedDuration - timeLeft,
    };
  }, [typedInput, currentPassage, elapsedSeconds, mistakesCount, selectedDuration, timeLeft]);

  // Play subtle keyboard click sound if enabled
  const playKeySound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Ignore audio policy restriction
    }
  }, [soundEnabled]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    if (testState === "finished") return;

    const value = e.target.value;

    // Do not allow typing beyond the passage
    if (value.length > currentPassage.length) return;

    // Start timer on first keystroke if currently idle
    if (testState === "idle") {
      setTestState("running");
    }

    // Detect if user made a mistake on this keystroke
    const lastIndex = value.length - 1;
    if (lastIndex >= 0 && value.length > typedInput.length) {
      if (value[lastIndex] !== currentPassage[lastIndex]) {
        setMistakesCount((prev) => prev + 1);
      }
      playKeySound();
    }

    setTypedInput(value);

    // Auto-complete if user finished typing the full passage
    if (value.length === currentPassage.length) {
      setTestState("finished");
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Start Test explicitly
  const startTest = () => {
    setTestState("running");
    inputRef.current?.focus();
  };

  // Restart Test
  const restartTest = () => {
    loadPassage();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Keyboard shortcut: Tab to restart
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        restartTest();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loadPassage]);

  // Smoothly scroll text container as typing advances
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const charEl = activeCharRef.current;
      const charTop = charEl.offsetTop;
      const containerScroll = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (charTop - containerScroll > containerHeight - 60) {
        container.scrollTo({ top: charTop - 60, behavior: "smooth" });
      } else if (charTop < containerScroll) {
        container.scrollTo({ top: charTop - 20, behavior: "smooth" });
      }
    }
  }, [typedInput]);

  // Performance message based on results
  const getFeedbackMessage = (wpm) => {
    if (wpm >= 80) return { title: "Outstanding Performance!", desc: "You're typing at professional speed with incredible rhythm." };
    if (wpm >= 60) return { title: "Excellent Typing!", desc: "Well above the global average. Great speed and muscle memory." };
    if (wpm >= 40) return { title: "Great Job!", desc: "Solid typing speed. With consistent practice, you'll reach 60+ WPM easily." };
    if (wpm >= 25) return { title: "Nice Progress!", desc: "Good foundation. Focus on accuracy first and your speed will naturally increase." };
    return { title: "Keep Practicing!", desc: "Regular 5-minute daily sessions will dramatically boost your words per minute." };
  };

  const faqs = [
    {
      q: "What is WPM?",
      a: "WPM stands for Words Per Minute. It is the standardized international metric for measuring typing speed. Under standard typing conventions, one 'word' is calculated as 5 keystrokes (characters including spaces and punctuation).",
    },
    {
      q: "What is a good typing speed?",
      a: "The average typing speed for casual computer users is around 35 to 40 WPM. Professional office workers typically type between 50 to 70 WPM, while software developers, transcriptionists, and competitive typists often reach 80 to 120+ WPM.",
    },
    {
      q: "How is typing accuracy calculated?",
      a: "Accuracy is the percentage of correct characters typed out of total characters entered: (Correct Characters / Total Typed Characters) × 100. High accuracy is essential because correcting mistakes significantly reduces overall typing throughput.",
    },
    {
      q: "Is this typing test free?",
      a: "Yes, 100% free with unlimited tests, no account registration, and no advertisements interrupting your practice.",
    },
    {
      q: "Does the typing test save my data?",
      a: "No. All keystroke timing, accuracy calculations, and speed measurements occur strictly inside your local web browser. Your typing text is never recorded, saved, or uploaded to any external server.",
    },
    {
      q: "Can I use this typing test on mobile?",
      a: "Yes! The test interface is fully responsive. When you tap on the typing area on your phone or tablet, your mobile keyboard will appear automatically.",
    },
    {
      q: "What is the difference between WPM and accuracy?",
      a: "WPM measures how fast you can type words in a 60-second window, while Accuracy measures how error-free your typing is. Speed without accuracy leads to typos and re-work; aiming for 95%+ accuracy while typing is the best practice.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ================= 1. HERO HEADER ================= */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-purple-200/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Skill Tool</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>🔒 100% Local &amp; Private</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            Instant Results
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            Mobile &amp; Desktop
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          Typing Speed Test
        </h1>

        <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
          Test your typing speed, accuracy, and consistency with a free online typing test. Measure real-time WPM, track keystrokes, and elevate your keyboard mastery.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Your typing data stays in your browser and is not uploaded to a server.</strong>
          </span>
        </div>
      </div>

      {/* ================= 2. CONFIGURATION BAR ================= */}
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Duration Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Duration:
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              {DURATIONS.map((dur) => (
                <button
                  key={dur.seconds}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(dur.seconds);
                    setTimeLeft(dur.seconds);
                    setTestState("idle");
                    setTypedInput("");
                    setElapsedSeconds(0);
                    setMistakesCount(0);
                  }}
                  disabled={testState === "running"}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                    selectedDuration === dur.seconds
                      ? "bg-white text-[var(--primary)] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Difficulty:
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => {
                    setSelectedDifficulty(diff.id);
                    setTestState("idle");
                  }}
                  disabled={testState === "running"}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                    selectedDifficulty === diff.id
                      ? "bg-white text-[var(--primary)] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown & Sound Toggle */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setTestState("idle");
                }}
                disabled={testState === "running"}
                className="px-3.5 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer disabled:opacity-50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    Category: {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute typing click sounds" : "Enable typing click sounds"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? "border-purple-200 bg-purple-50 text-[var(--primary)]"
                  : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
              }`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= 3. REAL-TIME STATS HUD ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {/* Timer Card */}
        <div className="col-span-2 sm:col-span-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-md flex items-center justify-between sm:flex-col sm:justify-center text-center">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider sm:mb-1">
            <Timer className="h-4 w-4 text-[var(--primary)]" />
            <span>Time Left</span>
          </div>
          <span
            className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              timeLeft <= 10 && testState === "running"
                ? "text-rose-600 animate-pulse"
                : "text-slate-900"
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        {/* WPM */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>WPM</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] font-mono">
            {stats.wpm}
          </span>
        </div>

        {/* Accuracy */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="h-4 w-4 text-emerald-500" />
            <span>Accuracy</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {stats.accuracy}%
          </span>
        </div>

        {/* Characters (Correct / Incorrect) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Keyboard className="h-4 w-4 text-cyan-500" />
            <span>Characters</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm font-bold font-mono mt-0.5">
            <span className="text-emerald-600" title="Correct characters">
              {stats.correctChars}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-rose-500" title="Incorrect characters">
              {stats.incorrectChars}
            </span>
          </div>
        </div>

        {/* Mistakes */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <span>Mistakes</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
            {stats.mistakes}
          </span>
        </div>
      </div>

      {/* ================= 4. INTERACTIVE TYPING AREA ================= */}
      <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl mb-6 overflow-hidden">
        {/* Dynamic Content Source Indicator & API Refresh Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-700">
              {passageSource}
            </span>
            {passageAuthor && (
              <span className="text-xs text-slate-400 italic truncate max-w-xs">
                — {passageAuthor}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => loadPassage(false)}
            disabled={testState === "running" || isLoadingPassage}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-[var(--primary)] bg-slate-50 hover:bg-purple-50 rounded-xl border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
            title="Fetch a fresh random passage from free public APIs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingPassage ? "animate-spin text-[var(--primary)]" : ""}`} />
            <span>{isLoadingPassage ? "Fetching API..." : "Fetch New API Text"}</span>
          </button>
        </div>

        {/* Hidden Input to capture keystrokes naturally while maintaining accessibility */}
        <textarea
          ref={inputRef}
          value={typedInput}
          onChange={handleInputChange}
          onPaste={(e) => e.preventDefault()}
          disabled={testState === "finished" || isLoadingPassage}
          aria-label="Typing test input area"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="absolute inset-0 opacity-0 cursor-text resize-none w-full h-full z-10"
        />

        {/* Target Text with Character-by-Character Colorization */}
        <div
          ref={textContainerRef}
          onClick={() => inputRef.current?.focus()}
          className="relative max-h-[220px] overflow-y-auto pr-2 text-lg sm:text-xl sm:leading-loose font-mono select-none tracking-wide transition-all"
        >
          {isLoadingPassage ? (
            <div className="py-8 text-center text-sm font-sans text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" />
              <span>Fetching fresh passage from free public API...</span>
            </div>
          ) : (
            currentPassage.split("").map((char, index) => {
            const isTyped = index < typedInput.length;
            const isCurrent = index === typedInput.length;
            const isCorrect = isTyped && typedInput[index] === char;
            const isIncorrect = isTyped && typedInput[index] !== char;

            let charClass = "text-slate-400"; // default untyped

            if (isCorrect) {
              charClass = "text-emerald-600 bg-emerald-50 font-semibold";
            } else if (isIncorrect) {
              charClass = "text-rose-600 bg-rose-100 font-semibold underline decoration-rose-500";
            } else if (isCurrent) {
              charClass = "bg-purple-100 border-b-2 border-[var(--primary)] text-slate-900 font-bold animate-pulse";
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`transition-colors rounded-xs px-[0.5px] ${charClass}`}
              >
                {char}
              </span>
            );
          })
        )}
        </div>

        {/* Watermark / Guidance Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {testState === "idle" && "Click 'Start Test' or simply start typing to begin"}
              {testState === "running" && "Typing in progress... Type as accurately as possible"}
              {testState === "finished" && "Test completed!"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Shortcut:</span>
            <kbd className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
              Tab
            </kbd>
            <span>to restart</span>
          </div>
        </div>
      </div>

      {/* ================= 5. ACTION BUTTONS: START & RESTART ================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {testState === "idle" && (
          <button
            type="button"
            onClick={startTest}
            className="btn-canva-primary flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Start Test</span>
          </button>
        )}

        <button
          type="button"
          onClick={restartTest}
          className="btn-canva-outline flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-xs cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restart Test</span>
        </button>
      </div>

      {/* ================= 6. RESULTS CARD MODAL / PANEL ================= */}
      {testState === "finished" && (
        <div className="mb-16 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-center max-w-2xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-canva-gradient text-white shadow-lg mb-4">
            <Trophy className="h-8 w-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Test Completed
          </span>

          {/* Large Hero WPM */}
          <div className="my-4">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight">
              {stats.wpm}
            </span>
            <span className="text-lg font-bold text-slate-500 ml-2">WPM</span>
          </div>

          {/* Performance Message */}
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {getFeedbackMessage(stats.wpm).title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            {getFeedbackMessage(stats.wpm).desc}
          </p>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Accuracy
              </span>
              <span className="text-base font-extrabold text-emerald-600 font-mono mt-0.5 block">
                {stats.accuracy}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Time Taken
              </span>
              <span className="text-base font-extrabold text-slate-800 font-mono mt-0.5 block">
                {stats.timeTaken}s / {selectedDuration}s
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Characters
              </span>
              <span className="text-base font-extrabold text-slate-800 font-mono mt-0.5 block">
                {stats.totalTyped}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Correct Chars
              </span>
              <span className="text-base font-extrabold text-emerald-600 font-mono mt-0.5 block">
                {stats.correctChars}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Incorrect Chars
              </span>
              <span className="text-base font-extrabold text-rose-600 font-mono mt-0.5 block">
                {stats.incorrectChars}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Mistakes Fixed
              </span>
              <span className="text-base font-extrabold text-amber-600 font-mono mt-0.5 block">
                {stats.mistakes}
              </span>
            </div>
          </div>

          {/* Try Again Button */}
          <button
            type="button"
            onClick={restartTest}
            className="btn-canva-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Practice Again</span>
          </button>
        </div>
      )}

      {/* ================= 7. SEO EDUCATIONAL CONTENT ================= */}
      <div className="border-t border-slate-200 pt-16 mb-16">
        <div className="max-w-4xl mx-auto space-y-12 text-slate-700 leading-relaxed">
          {/* Section: What is a Typing Speed Test? */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              What is a Typing Speed Test?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-3">
              A <strong>Typing Speed Test</strong> evaluates how rapidly and precisely you can enter written language through a physical or digital keyboard. It provides objective metrics—principally <strong>Words Per Minute (WPM)</strong> and <strong>Accuracy Percentage</strong>—to gauge your typing rhythm, muscle memory, and keyboard fluency.
            </p>
            <p className="text-sm sm:text-base text-slate-600">
              Whether you are writing code, drafting emails, conducting customer support, or writing academic essays, higher typing speed directly increases your workplace productivity and reduces cognitive fatigue by eliminating the need to look down at your fingers.
            </p>
          </div>

          {/* Section: How is WPM calculated? */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              How is WPM calculated?
            </h2>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-4">
              <p className="text-sm sm:text-base text-slate-700">
                Because English words vary significantly in length (e.g. comparing &quot;a&quot; with &quot;extraordinary&quot;), standard typing speed metrics normalize words using a universal formula:
              </p>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 font-mono text-sm font-bold text-[var(--primary)] text-center">
                WPM = (Correct Characters ÷ 5) ÷ Elapsed Minutes
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                For example, if you type <strong>300 correct characters</strong> in <strong>60 seconds</strong> (1 minute), your calculated speed is exactly <strong>(300 ÷ 5) ÷ 1 = 60 WPM</strong>. Uncorrected mistakes do not contribute toward your net speed.
              </p>
            </div>
          </div>

          {/* Section: How to improve typing speed? */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              How to improve typing speed?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Practice Regularly</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Short, consistent 5-minute sessions every day develop lasting muscle memory far faster than long, infrequent typing drills.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Focus on Accuracy First</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Speed naturally follows precision. Slow down until you can maintain 95%+ accuracy; backspacing to correct typos destroys typing momentum.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Learn Touch Typing</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Rest your index fingers on the home row keys (F and J), which have small tactile bumps designed to guide your hand positioning without looking.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Keep Proper Posture</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Sit upright with feet flat on the floor, keep your elbows at a 90-degree angle, and avoid resting your wrists heavily on the desk edge while typing.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <Lock className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Does the typing test save my data?
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              No. <strong>Your typing data stays in your browser and is not uploaded to a server.</strong> All keystroke checks, timing calculations, and WPM metrics are calculated entirely client-side using JavaScript.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 8. FAQ ACCORDION ================= */}
      <div className="border-t border-slate-200 pt-16 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Common questions about words per minute, typing benchmarks, and performance testing.
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
