"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Flame,
  Timer,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Code2,
  Volume2,
  VolumeX,
  Share2,
  Check,
  BookOpen,
  Layers,
  Home,
  ChevronRight,
  Terminal,
  Copy,
} from "lucide-react";
import { CODING_QUESTIONS, TOPICS, DIFFICULTY_CONFIG } from "@/data/codingQuestions";

// ==========================================
// Web Audio Synthesizer (Zero External Assets)
// ==========================================
function playSound(type, soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "correct") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === "wrong") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(146.83, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "streak") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.25);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.25);
      });
    } else if (type === "finish") {
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    }
  } catch (err) {
    // AudioContext autoplay rules handled gracefully
  }
}

// ==========================================
// Canvas Confetti Particle Burst
// ==========================================
function fireConfetti(canvas) {
  if (!canvas || typeof window === "undefined") return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ["#00c4cc", "#7d2ae8", "#3878e8", "#10b981", "#f59e0b", "#ec4899", "#60a5fa"];
  const particles = Array.from({ length: 65 }).map(() => ({
    x: width * 0.5 + (Math.random() - 0.5) * 260,
    y: height * 0.45 + (Math.random() - 0.5) * 100,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.8) * 14,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    alpha: 1,
  }));

  let animId;
  const render = () => {
    ctx.clearRect(0, 0, width, height);
    let hasAlive = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotSpeed;
      p.alpha -= 0.016;

      if (p.alpha > 0) {
        hasAlive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (hasAlive) {
      animId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animId);
    }
  };

  render();
}

export default function CodingChallengePage() {
  // Game States: "start" | "playing" | "result"
  const [gameState, setGameState] = useState("start");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Current session questions
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Answering state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Local record / stats
  const [personalBest, setPersonalBest] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isTimerLow, setIsTimerLow] = useState(false);

  // References
  const timerRef = useRef(null);
  const autoNextTimeoutRef = useRef(null);
  const canvasRef = useRef(null);

  // Read personal best safely from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("danish_coding_challenge_pb");
      if (saved) {
        setPersonalBest(parseInt(saved, 10) || 0);
      }
    } catch (e) {
      // Ignore localStorage restrictions
    }
  }, []);

  // Timer low warning triggers
  useEffect(() => {
    setIsTimerLow(timeLeft <= 10 && gameState === "playing");
  }, [timeLeft, gameState]);

  // Game Countdown Timer
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame(score, streak, bestStreak, gameHistory, true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, score, streak, bestStreak, gameHistory]);

  // Finish Game logic
  const finishGame = useCallback(
    (finalScore, currentStreak, highestStreak, history, timedOut = false) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);

      const computedBestStreak = Math.max(highestStreak, currentStreak);
      setGameState("result");
      playSound("finish", soundEnabled);
      fireConfetti(canvasRef.current);

      try {
        const saved = parseInt(localStorage.getItem("danish_coding_challenge_pb") || "0", 10);
        if (finalScore > saved) {
          setIsNewRecord(true);
          setPersonalBest(finalScore);
          localStorage.setItem("danish_coding_challenge_pb", finalScore.toString());
        } else {
          setIsNewRecord(false);
        }
      } catch (e) {
        // Safe fallback
      }
    },
    [soundEnabled]
  );

  // Start new game session
  const startGame = (topic = selectedTopic) => {
    let pool = [];
    if (topic === "all") {
      pool = [...CODING_QUESTIONS];
    } else {
      pool = CODING_QUESTIONS.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
      if (pool.length < 10) {
        const remaining = CODING_QUESTIONS.filter((q) => q.topic.toLowerCase() !== topic.toLowerCase());
        const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
        pool = [...pool, ...shuffledRemaining.slice(0, 10 - pool.length)];
      }
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);

    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(60);
    setGameHistory([]);
    setIsNewRecord(false);
    setGameState("playing");
  };

  const currentQuestion = questions[currentIndex] || null;

  // Handle Answer Selection
  const handleSelectAnswer = (option) => {
    if (isAnswered || !currentQuestion) return;

    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);

    const correct = option === currentQuestion.answer;
    setIsAnswered(true);
    setSelectedAnswer(option);
    setIsCorrect(correct);

    const diff = currentQuestion.difficulty || "medium";
    const baseXP = DIFFICULTY_CONFIG[diff]?.xp || 150;

    let newScore = score;
    let newStreak = streak;
    let newBestStreak = bestStreak;

    if (correct) {
      const streakBonus = streak >= 2 ? (streak >= 4 ? 100 : 50) : 0;
      const earnedXP = baseXP + streakBonus;
      newScore = score + earnedXP;
      newStreak = streak + 1;
      newBestStreak = Math.max(bestStreak, newStreak);

      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(newBestStreak);

      if (newStreak >= 3) {
        playSound("streak", soundEnabled);
      } else {
        playSound("correct", soundEnabled);
      }
      fireConfetti(canvasRef.current);

      const updatedHistory = [
        ...gameHistory,
        {
          question: currentQuestion,
          userAnswer: option,
          isCorrect: true,
          earnedXP,
        },
      ];
      setGameHistory(updatedHistory);

      autoNextTimeoutRef.current = setTimeout(() => {
        advanceQuestion(updatedHistory, newScore, newStreak, newBestStreak);
      }, 1300);
    } else {
      playSound("wrong", soundEnabled);
      newStreak = 0;
      setStreak(0);

      const updatedHistory = [
        ...gameHistory,
        {
          question: currentQuestion,
          userAnswer: option,
          isCorrect: false,
          earnedXP: 0,
        },
      ];
      setGameHistory(updatedHistory);
    }
  };

  // Advance to Next Question
  const advanceQuestion = (
    hist = gameHistory,
    currentScore = score,
    currentStreakVal = streak,
    bestStreakVal = bestStreak
  ) => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      finishGame(currentScore, currentStreakVal, bestStreakVal, hist, false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing" || !currentQuestion) return;

      if (!isAnswered) {
        const key = e.key.toUpperCase();
        if (key === "1" || key === "A") {
          currentQuestion.options[0] && handleSelectAnswer(currentQuestion.options[0]);
        } else if (key === "2" || key === "B") {
          currentQuestion.options[1] && handleSelectAnswer(currentQuestion.options[1]);
        } else if (key === "3" || key === "C") {
          currentQuestion.options[2] && handleSelectAnswer(currentQuestion.options[2]);
        } else if (key === "4" || key === "D") {
          currentQuestion.options[3] && handleSelectAnswer(currentQuestion.options[3]);
        }
      } else {
        if (e.key === "Enter" || e.key === " ") {
          advanceQuestion();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, isAnswered, currentQuestion, advanceQuestion]);

  const handleCopyCode = () => {
    if (!currentQuestion?.code) return;
    navigator.clipboard.writeText(currentQuestion.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareScore = () => {
    const text = `⚡ I scored ${score} XP (${gameHistory.filter((h) => h.isCorrect).length}/10 correct) with a 🔥 ${bestStreak} streak in Danish Khan's Mini Coding Challenge!\nTry it here: ${window.location.origin}/coding-challenge`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const correctCount = gameHistory.filter((h) => h.isCorrect).length;
  const accuracy = gameHistory.length > 0 ? Math.round((correctCount / gameHistory.length) * 100) : 0;

  const getRankVerdict = (finalScore) => {
    if (finalScore >= 2000) return { title: "Elite Tech Lead 🏆", desc: "Legendary architectural precision and speed!" };
    if (finalScore >= 1400) return { title: "Senior Full-Stack Prodigy 🚀", desc: "Deep MERN knowledge & rapid problem-solving!" };
    if (finalScore >= 800) return { title: "Skilled Software Engineer ⚡", desc: "Solid code instincts. Great execution!" };
    return { title: "Aspiring Code Ninja 💪", desc: "Keep practicing and refining your fundamentals!" };
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full bg-white text-slate-900 overflow-hidden font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Confetti Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      {/* Soft Ambient Canva Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[var(--primary)] opacity-10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-[var(--secondary)] opacity-10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[var(--accent)] opacity-10 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00c4cc08_1px,transparent_1px),linear-gradient(to_bottom,#7d2ae808_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* ============================================================== */}
        {/* SCREEN 1: START SCREEN (WHITE THEME) */}
        {/* ============================================================== */}
        {gameState === "start" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-[var(--primary-light)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)] animate-pulse" />
              <span>Interactive Portfolio Mini-Game</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-canva-gradient">
                ⚡ Mini Coding Challenge
              </span>
            </h1>

            <p className="mt-3 text-lg sm:text-2xl font-bold tracking-wide text-slate-800">
              "Think fast. Code smart."
            </p>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Put your real-world developer instincts to the test. 10 rapid-fire questions covering output prediction, React hooks, Next.js architecture, Node.js internals, and CSS mastery!
            </p>

            {/* Personal Best Banner */}
            {personalBest > 0 && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 shadow-xs"
              >
                <Trophy className="h-4 w-4 text-amber-600" />
                <span>Personal Best Record: <strong>{personalBest} XP</strong></span>
              </motion.div>
            )}

            {/* Topic Selector */}
            <div className="mt-8 w-full max-w-3xl">
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Challenge Track:
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {selectedTopic === "all" ? "36 Curated Questions" : `${CODING_QUESTIONS.filter(q => q.topic.toLowerCase() === selectedTopic.toLowerCase()).length} Topic Questions`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`group relative flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all duration-200 border ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-md shadow-purple-500/10 scale-105 font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50/40 hover:text-[var(--primary)] shadow-xs"
                      }`}
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                        {topic.icon}
                      </span>
                      <span className="text-xs font-bold truncate max-w-full">
                        {topic.label}
                      </span>
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondary)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--secondary)]"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Game Overview Cards */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-left">
                <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold">
                  <Code2 className="h-4 w-4 text-[var(--secondary)]" />
                  <span>10 Questions</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Shuffled & non-repeating</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-left">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
                  <Timer className="h-4 w-4 text-amber-500" />
                  <span>60s Sprint</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Speedrun timer challenge</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-left">
                <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-bold">
                  <Zap className="h-4 w-4 text-[var(--primary)]" />
                  <span>XP Scoring</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">+100 to +300 XP by difficulty</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs text-left">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                  <Flame className="h-4 w-4 text-rose-500" />
                  <span>Streak Combos</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Consecutive multiplier bonus</p>
              </div>
            </div>

            {/* Play Button CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startGame(selectedTopic)}
                className="btn-canva-primary group relative inline-flex items-center gap-3 rounded-2xl px-9 py-4 text-base font-extrabold text-white cursor-pointer"
              >
                <span>PLAY NOW</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs"
              >
                <Home className="h-4 w-4 text-slate-500" />
                <span>Back to Portfolio</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* SCREEN 2: GAMEPLAY SCREEN (WHITE THEME) */}
        {/* ============================================================== */}
        {gameState === "playing" && currentQuestion && (
          <div className="mx-auto max-w-4xl">
            {/* Top HUD Status Bar */}
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left: Progress & Badges */}
                <div className="flex items-center gap-2.5">
                  <span className="rounded-xl bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                    Question {currentIndex + 1} / {questions.length}
                  </span>

                  <span className="rounded-xl border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-[var(--primary)]">
                    {currentQuestion.topic}
                  </span>

                  {currentQuestion.difficulty && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold ${
                        DIFFICULTY_CONFIG[currentQuestion.difficulty]?.color || "text-slate-700 border-slate-200 bg-slate-50"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          DIFFICULTY_CONFIG[currentQuestion.difficulty]?.dot || "bg-slate-500"
                        }`}
                      />
                      {DIFFICULTY_CONFIG[currentQuestion.difficulty]?.label}
                    </span>
                  )}
                </div>

                {/* Center: Countdown Timer */}
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-1 text-sm font-mono font-bold transition-all ${
                    isTimerLow
                      ? "border-rose-300 bg-rose-50 text-rose-700 animate-pulse shadow-xs"
                      : timeLeft <= 25
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-cyan-200 bg-cyan-50 text-cyan-800"
                  }`}
                >
                  <Timer className={`h-4 w-4 ${isTimerLow ? "text-rose-600 animate-spin" : ""}`} />
                  <span>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </span>
                </div>

                {/* Right: Score, Streak & Sound Mute */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 px-3 py-1 font-mono text-xs font-bold text-[var(--primary)]">
                    <Zap className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span>{score} XP</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1 font-mono text-xs font-bold text-rose-700">
                    <Flame className={`h-3.5 w-3.5 ${streak > 1 ? "text-rose-600 animate-bounce" : "text-rose-400"}`} />
                    <span>Streak: {streak}</span>
                  </div>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[var(--primary)] hover:border-purple-200 transition-colors cursor-pointer"
                    title={soundEnabled ? "Mute sound" : "Unmute sound"}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full bg-canva-gradient"
                  initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Main Question Card (White Theme) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-[0_4px_25px_-5px_rgba(125,42,232,0.07)]">
              {/* Question Heading */}
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-canva-gradient text-xs font-bold text-white shadow-xs">
                  Q{currentIndex + 1}
                </span>
                <h2 className="text-base sm:text-xl font-bold leading-relaxed text-slate-900">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Developer Code Editor Window (Modern Navy/Terminal Panel inside White Card) */}
              {currentQuestion.code && (
                <div className="my-5 overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1021] shadow-xl">
                  {/* Editor Window Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 bg-[#080d1a] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500 inline-block opacity-85" />
                      <span className="h-3 w-3 rounded-full bg-amber-500 inline-block opacity-85" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block opacity-85" />
                      <span className="ml-2 font-mono text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                        <Terminal className="h-3 w-3 text-cyan-400" />
                        {currentQuestion.topic.toLowerCase().replace(".", "")}.challenge.js
                      </span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Snippet with Line Numbers */}
                  <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                    <pre className="flex">
                      <div className="select-none pr-4 text-right text-slate-500 font-mono">
                        {currentQuestion.code.split("\n").map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      <code className="text-cyan-300 font-medium">
                        {currentQuestion.code}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* 4 Options Grid (White Theme) */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === option;
                  const isAnswerOptionCorrect = option === currentQuestion.answer;

                  let btnStyle = "border-slate-200 bg-white text-slate-800 hover:border-purple-300 hover:bg-purple-50/40 shadow-xs";
                  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-purple-100 group-hover:text-[var(--primary)]";

                  if (isAnswered) {
                    if (isAnswerOptionCorrect) {
                      // Correct option: Crisp Emerald Light Theme
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-md shadow-emerald-500/10";
                      badgeStyle = "bg-emerald-600 text-white border-emerald-600 font-extrabold";
                    } else if (isSelected && !isCorrect) {
                      // Wrong option: Rose Red Light Theme
                      btnStyle = "border-rose-500 bg-rose-50 text-rose-950 font-semibold shadow-md shadow-rose-500/10 animate-shake";
                      badgeStyle = "bg-rose-600 text-white border-rose-600 font-extrabold";
                    } else {
                      // Other options dimmed
                      btnStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!isAnswered ? { scale: 1.012, y: -1 } : {}}
                      whileTap={!isAnswered ? { scale: 0.99 } : {}}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(option)}
                      className={`group relative flex items-center justify-between rounded-2xl border p-4 text-left font-medium transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-colors ${badgeStyle}`}
                        >
                          {letter}
                        </span>
                        <span className="text-sm sm:text-base font-semibold break-words">
                          {option}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isAnswered && (
                          <span className="hidden sm:inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500 font-bold">
                            [{idx + 1}]
                          </span>
                        )}

                        {isAnswered && isAnswerOptionCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 animate-bounce" />
                        )}

                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Answer Feedback Banners (White/Light Theme) */}
              <AnimatePresence>
                {isAnswered && isCorrect && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 sm:p-5 text-emerald-950 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎉</span>
                          <h3 className="text-base sm:text-lg font-extrabold text-emerald-800">
                            CORRECT!
                          </h3>
                          <span className="rounded-full bg-emerald-200/70 px-2.5 py-0.5 font-mono text-xs font-extrabold text-emerald-900 border border-emerald-300">
                            +{DIFFICULTY_CONFIG[currentQuestion.difficulty]?.xp || 150} XP
                          </span>
                          {streak >= 2 && (
                            <span className="rounded-full bg-amber-200 px-2 py-0.5 font-mono text-xs font-bold text-amber-900 border border-amber-300">
                              🔥 Streak {streak} (+{streak >= 4 ? 100 : 50} Bonus)
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-emerald-700 font-medium">
                          Great job! Advancing to next question...
                        </p>
                      </div>

                      <button
                        onClick={() => advanceQuestion()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {isAnswered && !isCorrect && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 rounded-2xl border border-rose-300 bg-rose-50/90 p-4 sm:p-5 text-rose-950 shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">😢</span>
                      <h3 className="text-base sm:text-lg font-extrabold text-rose-800">
                        SO SAD! Not quite...
                      </h3>
                      <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-mono font-bold text-rose-900 border border-rose-300">
                        Streak Reset
                      </span>
                    </div>

                    <div className="mt-3 rounded-xl border border-rose-200 bg-white p-3.5 text-xs sm:text-sm shadow-xs">
                      <div className="font-bold text-emerald-700">
                        ✓ Correct Answer: <span className="text-slate-900 font-semibold">{currentQuestion.answer}</span>
                      </div>
                      {currentQuestion.explanation && (
                        <div className="mt-2 text-slate-700 leading-relaxed border-t border-slate-100 pt-2">
                          <span className="font-bold text-amber-700">💡 Explanation: </span>
                          {currentQuestion.explanation}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => advanceQuestion()}
                        className="btn-canva-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                      >
                        <span>Continue to Next Question</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCREEN 3: RESULT SCREEN (WHITE THEME) */}
        {/* ============================================================== */}
        {gameState === "result" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-3xl"
          >
            {/* Header Hero Card (White Theme with Canva Gradients) */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-white p-6 sm:p-10 text-center shadow-xl">
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-[var(--primary)] opacity-10 blur-3xl" />

              {/* Trophy Crown */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 shadow-md">
                <Trophy className="h-9 w-9" />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {timeLeft === 0 ? "⏱️ TIME'S UP!" : "🎉 CHALLENGE COMPLETE!"}
              </h2>

              {/* Verdict */}
              <div className="mt-2 text-base sm:text-xl font-extrabold text-[var(--primary)]">
                {getRankVerdict(score).title}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 font-medium">
                {getRankVerdict(score).desc}
              </p>

              {/* New High Score Alert */}
              {isNewRecord && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-800 animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>NEW PERSONAL BEST XP RECORD!</span>
                </div>
              )}

              {/* Primary Score Counter */}
              <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/50 p-5 max-w-md mx-auto shadow-xs">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
                  Total Score
                </div>
                <div className="mt-1 text-4xl sm:text-5xl font-extrabold tracking-tight text-canva-gradient">
                  {score} XP
                </div>
                <div className="mt-2 text-xs font-bold text-slate-600">
                  {correctCount} / {questions.length} Correct Answers
                </div>
              </div>

              {/* Stat Breakdown Grid (Light Theme) */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">Correct</div>
                  <div className="mt-1 text-2xl font-extrabold text-emerald-600">{correctCount}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">Wrong</div>
                  <div className="mt-1 text-2xl font-extrabold text-rose-600">
                    {questions.length - correctCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">Accuracy</div>
                  <div className="mt-1 text-2xl font-extrabold text-[var(--secondary)]">{accuracy}%</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">Best Streak</div>
                  <div className="mt-1 text-2xl font-extrabold text-amber-600">
                    {Math.max(bestStreak, streak)} 🔥
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame(selectedTopic)}
                  className="btn-canva-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>PLAY AGAIN</span>
                </motion.button>

                <button
                  onClick={() => setGameState("start")}
                  className="btn-canva-outline inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all cursor-pointer"
                >
                  <Layers className="h-4 w-4" />
                  <span>CHANGE TRACK</span>
                </button>

                <button
                  onClick={handleShareScore}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  {copiedShare ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 text-slate-500" />
                      <span>Share Score</span>
                    </>
                  )}
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  <Home className="h-4 w-4 text-slate-500" />
                  <span>Back to Portfolio</span>
                </Link>
              </div>
            </div>

            {/* Answer History Review Section (White Theme) */}
            {gameHistory.length > 0 && (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <BookOpen className="h-4 w-4 text-[var(--primary)]" />
                    <span>Question Breakdown & Explanations</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    {correctCount}/{gameHistory.length} solved correctly
                  </span>
                </div>

                <div className="space-y-3.5">
                  {gameHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-4 text-xs sm:text-sm ${
                        item.isCorrect
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-rose-200 bg-rose-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          {item.isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                          )}
                          <span>
                            {idx + 1}. {item.question.question}
                          </span>
                        </div>
                        <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-600 font-bold shrink-0">
                          {item.question.topic}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-600">
                          Your Answer:{" "}
                          <span
                            className={
                              item.isCorrect ? "font-bold text-emerald-700" : "font-bold text-rose-700"
                            }
                          >
                            {item.userAnswer}
                          </span>
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-600">
                          Correct Answer:{" "}
                          <span className="font-bold text-emerald-700">
                            {item.question.answer}
                          </span>
                        </div>
                      </div>

                      {item.question.explanation && (
                        <div className="mt-2.5 text-slate-600 border-t border-slate-200/70 pt-2 text-xs leading-relaxed">
                          <span className="text-amber-800 font-bold">Why: </span>
                          {item.question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
