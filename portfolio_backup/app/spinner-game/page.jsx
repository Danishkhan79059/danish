"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Trophy,
  RotateCw,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Shuffle,
  Users,
  Database,
  ArrowRight,
  CheckCircle2,
  X,
  Flame,
  History,
  Maximize,
  Minimize,
} from "lucide-react";

// Vibrant, harmonious Canva-inspired color palette for wheel segments
const WHEEL_COLORS = [
  "#7d2ae8", // Canva Violet
  "#00c4cc", // Canva Cyan
  "#3878e8", // Canva Royal Blue
  "#10b981", // Emerald Green
  "#f59e0b", // Amber Gold
  "#ec4899", // Vivid Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Sky Blue
  "#f97316", // Bright Orange
  "#14b8a6", // Teal
  "#6366f1", // Indigo
  "#e11d48", // Rose Red
];

// Fallback candidates if DB is newly initialized and empty
const DEFAULT_CANDIDATES = [

];

export default function SpinnerGamePage() {
  // State
  const [candidates, setCandidates] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerHistory, setWinnerHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dbSource, setDbSource] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const [arrowTick, setArrowTick] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Wheel animation state refs
  const gameContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const animationFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastPegIndexRef = useRef(-1);

  // Fullscreen Handlers
  const toggleFullscreen = useCallback(() => {
    const elem = gameContainerRef.current || document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => setIsFullscreen(true));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => setIsFullscreen(false));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    setIsFullscreen(false);
  }, []);

  // Listen for 'F' key to toggle fullscreen, 'Esc' to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      const isInputFocused =
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        Boolean(document.activeElement?.isContentEditable);

      // If user is actively typing inside candidate input field, allow typing 'f' normally!
      if (isInputFocused) {
        if (e.key === "Escape") {
          document.activeElement?.blur();
        }
        return;
      }

      // 'F' or 'f' key triggers Fullscreen
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape") {
        exitFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(active);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [toggleFullscreen, exitFullscreen]);

  // Audio synthesizer using Web Audio API (Zero external MP3 dependencies)
  const playTickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600 + Math.random() * 150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, [soundEnabled]);

  const playFanfareSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
        });
      }
    } catch {
      // Ignore audio failure
    }
  }, [soundEnabled]);

  // Fetch candidates from MongoDB API on mount
  const fetchCandidates = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/candidates");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCandidates(data.data);
        setDbSource(data.source || "mongodb");
      } else {
        // Seed default sample candidates if collection is empty
        setCandidates(
          DEFAULT_CANDIDATES.map((name, i) => ({
            _id: `seed-${i}`,
            name,
            wins: 0,
          }))
        );
        setDbSource(data.source || "mongodb");
      }
    } catch (err) {
      console.error("Failed to load candidates:", err);
      setCandidates(
        DEFAULT_CANDIDATES.map((name, i) => ({
          _id: `seed-${i}`,
          name,
          wins: 0,
        }))
      );
      setDbSource("offline_fallback");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Confetti Particle Engine
  const triggerConfetti = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 140;
    const colors = ["#7d2ae8", "#00c4cc", "#3878e8", "#f59e0b", "#ec4899", "#10b981", "#ffffff"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.5) * 22 - 6,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        gravity: 0.35,
      });
    }

    let frame = 0;
    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      frame++;
      if (aliveCount > 0 && frame < 180) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animateConfetti();
  }, []);

  // Canvas Drawing Routine
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 500;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 28;
    const currentAngle = currentAngleRef.current;

    ctx.clearRect(0, 0, size, size);

    // If no candidates, render a friendly empty placeholder wheel
    if (candidates.length === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#e2e8f0";
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 16px Poppins, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Please add candidates to spin!", centerX, centerY);
      ctx.restore();
      return;
    }

    const numSlices = candidates.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    // Check peg passing sound during spin
    // Top pointer is at -Math.PI / 2 (or 3*Math.PI/2)
    const pointerAngle = (3 * Math.PI) / 2;
    const normalizedRelativeAngle =
      ((pointerAngle - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const currentPegIndex = Math.floor(normalizedRelativeAngle / sliceAngle);

    if (currentPegIndex !== lastPegIndexRef.current && isSpinning) {
      lastPegIndexRef.current = currentPegIndex;
      playTickSound();
      setArrowTick(true);
      setTimeout(() => setArrowTick(false), 50);
    }

    // Outer Drop Shadow Glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(125, 42, 232, 0.08)";
    ctx.fill();
    ctx.restore();

    // Draw Slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = currentAngle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Slice Fill
      ctx.fillStyle = color;
      ctx.fill();

      // Slice Separator Line
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Inner radial subtle gradient highlight for 3D feel
      const sliceMidAngle = startAngle + sliceAngle / 2;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.22)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0.0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Draw Candidate Name Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(sliceMidAngle);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      // Font size responsive to slice count
      let fontSize = 15;
      if (numSlices > 16) fontSize = 11;
      else if (numSlices > 10) fontSize = 13;
      else if (numSlices <= 4) fontSize = 18;

      ctx.font = `bold ${fontSize}px Poppins, -apple-system, sans-serif`;
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncate candidate name if overly long
      let candidateName = candidates[i]?.name || `Candidate ${i + 1}`;
      if (candidateName.length > 16) {
        candidateName = candidateName.slice(0, 14) + "…";
      }

      ctx.fillText(candidateName, radius - 26, 0);
      ctx.restore();
    }

    // Outer Decorative Bezel Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#1e1b4b"; // Dark royal rim
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 7, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f59e0b"; // Gold accent border
    ctx.stroke();

    // Decorative Bezel Pegs (Golden/White Dots around rim)
    for (let i = 0; i < numSlices; i++) {
      const pegAngle = currentAngle + i * sliceAngle;
      const pegX = centerX + Math.cos(pegAngle) * radius;
      const pegY = centerY + Math.sin(pegAngle) * radius;

      ctx.beginPath();
      ctx.arc(pegX, pegY, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#f59e0b";
      ctx.stroke();
    }
    ctx.restore();

    // Center Hub with Gradient & Danish Khan Logo/Icon styling
    ctx.save();
    const hubRadius = 42;
    const hubGradient = ctx.createRadialGradient(
      centerX - 6,
      centerY - 6,
      4,
      centerX,
      centerY,
      hubRadius
    );
    hubGradient.addColorStop(0, "#ffffff");
    hubGradient.addColorStop(0.7, "#f8fafc");
    hubGradient.addColorStop(1, "#e2e8f0");

    ctx.beginPath();
    ctx.arc(centerX, centerY, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = hubGradient;
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#7d2ae8";
    ctx.stroke();

    // Inner Hub Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, hubRadius - 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#7d2ae8";
    ctx.fill();

    // Center Star / Sparkle Icon
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "transparent";
    ctx.fillText("DK", centerX, centerY);
    ctx.restore();
  }, [candidates, isSpinning, playTickSound]);

  // Redraw when candidates or angle changes
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Handle Add Candidate Submit (Only candidate name field as requested)
  const handleAddCandidate = async (e) => {
    e?.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter candidate name");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setCandidates((prev) => [...prev, data.data]);
        setNameInput("");
      } else {
        // Fallback local addition
        const newLocal = {
          _id: `local-${Date.now()}`,
          name: trimmed,
          wins: 0,
        };
        setCandidates((prev) => [...prev, newLocal]);
        setNameInput("");
      }
    } catch (err) {
      console.error("Failed to add candidate:", err);
      // Still add locally so user flow is uninterrupted
      const newLocal = {
        _id: `local-${Date.now()}`,
        name: trimmed,
        wins: 0,
      };
      setCandidates((prev) => [...prev, newLocal]);
      setNameInput("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = async (id, index) => {
    if (isSpinning) return;
    try {
      await fetch(`/api/candidates?id=${id}`, { method: "DELETE" });
      setCandidates((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete candidate:", err);
      setCandidates((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Clear All Candidates
  const handleClearAll = async () => {
    if (isSpinning) return;
    if (!window.confirm("Are you sure you want to clear all candidates?")) return;
    try {
      await fetch("/api/candidates?all=true", { method: "DELETE" });
      setCandidates([]);
    } catch (err) {
      console.error("Clear all failed:", err);
      setCandidates([]);
    }
  };

  // Quick Shuffle
  const handleShuffle = () => {
    if (isSpinning || candidates.length < 2) return;
    setCandidates((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // Load Sample Candidates if empty
  const handleLoadSamples = async () => {
    if (isSpinning) return;
    for (const name of DEFAULT_CANDIDATES) {
      try {
        await fetch("/api/candidates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      } catch (err) {
        console.error("Sample seeding error:", err);
      }
    }
    fetchCandidates();
  };

  // Execute Spin with Exact Pointer Physics
  const handleSpin = () => {
    if (isSpinning || candidates.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    // Pick random target winner index
    const numSlices = candidates.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const winnerIndex = Math.floor(Math.random() * numSlices);
    const chosenWinner = candidates[winnerIndex];

    // Pointer is located at the TOP (270 degrees or -Math.PI / 2 in radians)
    // Angle in standard polar: 3 * Math.PI / 2
    const pointerAngle = (3 * Math.PI) / 2;

    // Center of slice `winnerIndex` is at `winnerIndex * sliceAngle + sliceAngle / 2`
    // We add slight organic random offset inside the winning slice (-35% to +35% of sliceAngle)
    const randomSliceOffset = (Math.random() - 0.5) * (sliceAngle * 0.7);
    const targetSliceAngle = winnerIndex * sliceAngle + sliceAngle / 2 + randomSliceOffset;

    // Number of full 360-degree rotations (6 to 9 full spins for suspense)
    const fullRotations = 7 + Math.floor(Math.random() * 3);
    const totalRotationAngle = fullRotations * 2 * Math.PI;

    // Compute the exact destination angle so pointer lands on chosen slice
    // currentAngle + deltaAngle = pointerAngle - targetSliceAngle (mod 2PI) + totalRotationAngle
    const currentAngle = currentAngleRef.current;
    const normalizedCurrent = currentAngle % (2 * Math.PI);
    let deltaAngle = pointerAngle - targetSliceAngle - normalizedCurrent;
    while (deltaAngle < 0) {
      deltaAngle += 2 * Math.PI;
    }
    const finalAngle = currentAngle + deltaAngle + totalRotationAngle;

    // Animation physics (ease-out cubic / quint curve)
    const startTime = performance.now();
    const spinDuration = 5200; // 5.2 seconds for realistic spin excitement

    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / spinDuration);
      const easedProgress = easeOutQuint(progress);

      currentAngleRef.current = currentAngle + (finalAngle - currentAngle) * easedProgress;
      drawWheel();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        setWinner(chosenWinner);
        setShowWinnerModal(true);
        setWinnerHistory((prev) => [
          {
            ...chosenWinner,
            wonAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          },
          ...prev.slice(0, 9),
        ]);

        triggerConfetti();
        playFanfareSound();

        // Record winner in database asynchronously
        fetch("/api/candidates/winner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: chosenWinner._id, name: chosenWinner.name }),
        }).catch((e) => console.error("Winner record failed:", e));
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Remove winner from wheel (optional feature for lucky draws)
  const handleRemoveWinner = () => {
    if (!winner) return;
    const idx = candidates.findIndex((c) => c._id === winner._id || c.name === winner.name);
    if (idx !== -1) {
      handleDeleteCandidate(winner._id, idx);
    }
    setShowWinnerModal(false);
  };

  return (
    <div
      ref={gameContainerRef}
      className={`relative min-h-screen bg-white select-none py-8 px-4 sm:px-6 lg:px-8 transition-all ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto bg-white p-4 sm:p-8" : ""
        }`}
    >
      {/* Fullscreen Floating Exit Hint */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-full bg-slate-900/90 text-white px-4 py-2 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>FULLSCREEN • Press <b>ESC</b> or <b>F</b> to Exit</span>
          <button
            onClick={exitFullscreen}
            className="ml-1.5 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Exit Fullscreen (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fullscreen Confetti Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      <div className="mx-auto max-w-7xl">
        {/* Top Header & Breadcrumb */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                Interactive Challenge
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <Database className="w-3 h-3 text-emerald-600" />
                MongoDB: {dbSource === "mongodb" ? "Live Connected" : "Active (Ready)"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Candidate <span className="text-canva-gradient">Spinning Wheel</span> Game
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add candidates below, watch them populate the live wheel, and spin to pick the lucky winner with precision arrow targeting!
            </p>
          </div>

          {/* Quick Toolbar: Fullscreen Toggle [F], Sound Toggle, and Coding Challenge Link */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Fullscreen Button [F] / [Esc] */}
            <button
              onClick={toggleFullscreen}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${isFullscreen
                  ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm font-bold"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[var(--primary)]"
                }`}
              title="Press 'F' for Fullscreen, 'Esc' to exit"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-4 h-4 text-[var(--primary)]" />
                  <span>Exit [ESC]</span>
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4 text-slate-600" />
                  <span>Fullscreen [F]</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[var(--primary)] transition-all cursor-pointer"
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[var(--primary)]" />
                  <span>Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Sound OFF</span>
                </>
              )}
            </button>

            <Link
              href="/coding-challenge"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
            >
              <span>Coding Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Main Grid: Left Side Controls & Candidate List | Right Side Wheel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input Form & Candidate Roster (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Candidate Input Card (Only name field as requested) */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Add Candidate</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">Single Field</span>
              </div>

              <form onSubmit={handleAddCandidate} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    id="candidate-name-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Candidate ka naam likhiye..."
                    maxLength={60}
                    disabled={isSpinning}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--primary-glow)] transition-all"
                  />
                  {nameInput && (
                    <button
                      type="button"
                      onClick={() => setNameInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {errorMessage && (
                  <p className="text-xs font-medium text-rose-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  id="submit-candidate-btn"
                  disabled={isSubmitting || !nameInput.trim() || isSpinning}
                  className="btn-canva-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Adding to MongoDB..." : "Submit Candidate"}</span>
                </button>
              </form>
            </div>

            {/* Candidate List & Actions Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--primary)]" />
                  <h3 className="text-base font-bold text-slate-900">
                    Candidates List ({candidates.length})
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleShuffle}
                    disabled={isSpinning || candidates.length < 2}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    title="Shuffle Order"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    onClick={handleClearAll}
                    disabled={isSpinning || candidates.length === 0}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40 cursor-pointer"
                    title="Clear All"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Candidate Chips List */}
              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <RotateCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--primary)]" />
                  Loading candidates from MongoDB...
                </div>
              ) : candidates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-xs text-slate-500 mb-3">
                    Koi candidate nahi hai. Upar candidate ka naam likh kar add karein!
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadSamples}
                    className="btn-canva-outline inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Load Demo Names</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {candidates.map((candidate, idx) => {
                    const color = WHEEL_COLORS[idx % WHEEL_COLORS.length];
                    return (
                      <div
                        key={candidate._id || `${candidate.name}-${idx}`}
                        className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2 hover:bg-slate-100/80 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Color Dot Indicator */}
                          <span
                            className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-bold text-slate-400 shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-slate-800 truncate">
                            {candidate.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {candidate.wins > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                              <Trophy className="w-2.5 h-2.5" />
                              {candidate.wins} {candidate.wins === 1 ? "win" : "wins"}
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteCandidate(candidate._id, idx)}
                            disabled={isSpinning}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Remove candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Requirement Hint */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Minimum 2 candidates needed to spin</span>
                <span className="font-bold text-[var(--primary)]">
                  {candidates.length >= 2 ? "Ready to spin! 🎯" : "Add more"}
                </span>
              </div>
            </div>

            {/* Recent Winners Card */}
            {winnerHistory.length > 0 && (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">Recent Spin Winners</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {winnerHistory.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200"
                    >
                      <Trophy className="w-3 h-3 text-amber-600" />
                      <span>{item.name}</span>
                      <span className="text-[10px] text-amber-500 font-normal">({item.wonAt})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive High-DPI Spinning Wheel (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-radial from-purple-50/50 via-white to-white border border-slate-200/80 shadow-md w-full max-w-[580px]">
              {/* Wheel Container */}
              <div className="relative flex items-center justify-center">
                {/* 🎯 Precision Arrow Pointer at TOP */}
                <div
                  className={`absolute -top-3 z-30 transition-transform duration-75 ${arrowTick ? "-translate-y-1 scale-110" : "translate-y-0"
                    }`}
                  style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
                >
                  <svg
                    width="44"
                    height="54"
                    viewBox="0 0 44 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Outer glow stroke */}
                    <path
                      d="M22 52L6 14C4.5 10 7.5 6 12 6H32C36.5 6 39.5 10 38 14L22 52Z"
                      fill="#ffffff"
                    />
                    {/* Inner arrow triangle pointing down into the wheel */}
                    <path
                      d="M22 48L8 16C7 13.5 9 10.5 12 10.5H32C35 10.5 37 13.5 36 16L22 48Z"
                      fill="url(#arrow-gradient)"
                    />
                    {/* Center decorative jewel */}
                    <circle cx="22" cy="18" r="4.5" fill="#ffffff" />
                    <defs>
                      <linearGradient
                        id="arrow-gradient"
                        x1="8"
                        y1="10"
                        x2="36"
                        y2="48"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#ef4444" />
                        <stop offset="1" stopColor="#b91c1c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Canvas Element */}
                <canvas
                  ref={canvasRef}
                  style={{ width: "420px", height: "420px", maxWidth: "100%", maxHeight: "80vw" }}
                  className="rounded-full shadow-2xl transition-transform"
                />

                {/* Center Spin Button Floating in the middle */}
                <button
                  type="button"
                  id="center-spin-btn"
                  onClick={handleSpin}
                  disabled={isSpinning || candidates.length < 2}
                  className="absolute z-20 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-canva-gradient text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed transition-all cursor-pointer border-4 border-white"
                >
                  {isSpinning ? (
                    <RotateCw className="w-7 h-7 animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                      <span className="font-extrabold text-xs sm:text-sm">SPIN</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Bottom Spin Action Button */}
              <div className="mt-8 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  id="main-spin-btn"
                  onClick={handleSpin}
                  disabled={isSpinning || candidates.length < 2}
                  className="btn-canva-primary flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl px-8 py-3.5 text-base font-extrabold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RotateCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
                  <span>{isSpinning ? "Rolling..." : "SPIN THE WHEEL 🎡"}</span>
                </button>
              </div>

              {/* Helper text */}
              <p className="mt-3 text-xs text-slate-400 text-center">
                Click <b>SPIN</b> or center button • Pointer will stop on the winning candidate!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🎉 WINNER CELEBRATION MODAL */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            {/* Close Button */}
            <button
              onClick={() => setShowWinnerModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy Badge */}
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-[var(--primary)] mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Winning Candidate Picked!
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Congratulations!</h2>

            <div className="my-5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Selected Winner
              </p>
              <h3 className="text-3xl font-black text-canva-gradient break-words">
                {winner.name}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowWinnerModal(false);
                  setTimeout(() => handleSpin(), 300);
                }}
                className="btn-canva-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Spin Again</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveWinner}
                className="btn-canva-outline flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-rose-600 border-rose-200 hover:border-rose-400 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Winner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
