"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Bug,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Home,
  Layers,
  Code2,
  FileText,
  Menu,
  X,
  AlertTriangle,
  Zap,
} from "lucide-react";

import { BUG_CHALLENGES, DIFFICULTY_TIERS } from "@/data/bugChallenges";
import {
  loadHunterState,
  saveHunterState,
  calculateEarnedXP,
} from "@/lib/bug-hunter/scoring";
import { runChallengeTests, playBugHunterSound } from "@/lib/bug-hunter/challengeEngine";

import CodeEditor from "./CodeEditor";
import ChallengeList from "./ChallengeList";
import ChallengeDescription from "./ChallengeDescription";
import TestResults from "./TestResults";
import HintSystem from "./HintSystem";
import Timer from "./Timer";
import XPDisplay from "./XPDisplay";
import AchievementPanel from "./AchievementPanel";
import SolutionModal from "./SolutionModal";

export default function BugHunter() {
  // 1. Core State
  const [activeId, setActiveId] = useState(BUG_CHALLENGES[0].id);
  const [userCode, setUserCode] = useState(BUG_CHALLENGES[0].brokenCode);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 2. Storage & User Progress
  const [userState, setUserState] = useState(() => loadHunterState());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [revealedHints, setRevealedHints] = useState(0);

  // 3. Modals & Drawers
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("editor"); // "challenges" | "editor" | "description"

  // 4. Test Run Outcome
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testOutcome, setTestOutcome] = useState({
    hasRun: false,
    passed: false,
    executionMs: 0,
    results: [],
    earnedXP: 0,
    isFirstSolve: false,
  });

  // Current Challenge Object
  const activeChallenge = useMemo(() => {
    return BUG_CHALLENGES.find((c) => c.id === activeId) || BUG_CHALLENGES[0];
  }, [activeId]);

  // Load state from localStorage upon mount
  useEffect(() => {
    const saved = loadHunterState();
    setUserState(saved);
  }, []);

  // Sync state changes to localStorage
  const updateState = useCallback((updater) => {
    setUserState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveHunterState(next);
      return next;
    });
  }, []);

  // Timer Tick Hook
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle Switching Challenges
  const handleSelectChallenge = useCallback(
    (id) => {
      const challenge = BUG_CHALLENGES.find((c) => c.id === id);
      if (!challenge) return;

      setActiveId(id);
      setUserCode(challenge.brokenCode);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setRevealedHints(userState.hintUsage?.[id] || 0);
      setTestOutcome({
        hasRun: false,
        passed: false,
        executionMs: 0,
        results: [],
        earnedXP: 0,
        isFirstSolve: false,
      });
      setMobileTab("editor");
      playBugHunterSound("click", soundEnabled);
    },
    [userState.hintUsage, soundEnabled]
  );

  // Reset current challenge code
  const handleReset = useCallback(() => {
    setUserCode(activeChallenge.brokenCode);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setTestOutcome({
      hasRun: false,
      passed: false,
      executionMs: 0,
      results: [],
      earnedXP: 0,
      isFirstSolve: false,
    });
    playBugHunterSound("click", soundEnabled);
  }, [activeChallenge, soundEnabled]);

  // Run Test Suite
  const handleRunTests = useCallback(() => {
    setIsRunningTests(true);

    setTimeout(() => {
      const outcome = runChallengeTests({
        challenge: activeChallenge,
        userCode,
        timeTaken: timerSeconds,
        hintsUsedCount: revealedHints,
        currentState: userState,
        soundEnabled,
      });

      setTestOutcome({
        hasRun: true,
        passed: outcome.passed,
        executionMs: outcome.executionMs,
        results: outcome.results,
        earnedXP: outcome.earnedXP,
        isFirstSolve: outcome.isFirstSolve,
      });

      setIsRunningTests(false);

      if (outcome.passed) {
        setIsTimerRunning(false);

        // Update user state and streak
        updateState((prev) => {
          const isAlreadySolved = !!prev.solvedChallenges[activeChallenge.id];
          const newSolvedChallenges = {
            ...prev.solvedChallenges,
            [activeChallenge.id]: {
              xpEarned: outcome.earnedXP,
              hintsUsed: revealedHints,
              timeTaken: timerSeconds,
              solvedAt: new Date().toISOString(),
            },
          };

          const newTotalXP = prev.totalXP + outcome.earnedXP;
          const newCurrentStreak = prev.currentStreak + 1;
          const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);
          const newSolvedCount = Object.keys(newSolvedChallenges).length;

          return {
            ...prev,
            totalXP: newTotalXP,
            currentStreak: newCurrentStreak,
            bestStreak: newBestStreak,
            solvedCount: newSolvedCount,
            solveTimes: [...(prev.solveTimes || []), timerSeconds],
            solvedChallenges: newSolvedChallenges,
            unlockedAchievements: outcome.updatedUnlockedIds,
          };
        });

        // Open victory modal
        setIsSolutionModalOpen(true);
      }
    }, 280);
  }, [
    activeChallenge,
    userCode,
    timerSeconds,
    revealedHints,
    userState,
    soundEnabled,
    updateState,
  ]);

  // Unlock progressive hint
  const handleUnlockHint = useCallback(
    (count) => {
      setRevealedHints(count);
      playBugHunterSound("hint", soundEnabled);
      updateState((prev) => ({
        ...prev,
        hintUsage: {
          ...prev.hintUsage,
          [activeChallenge.id]: count,
        },
      }));
    },
    [activeChallenge.id, soundEnabled, updateState]
  );

  // Next Challenge Navigation
  const currentChallengeIndex = BUG_CHALLENGES.findIndex((c) => c.id === activeId);
  const hasNextChallenge = currentChallengeIndex < BUG_CHALLENGES.length - 1;

  const handleNextChallenge = useCallback(() => {
    if (hasNextChallenge) {
      const nextChallenge = BUG_CHALLENGES[currentChallengeIndex + 1];
      setIsSolutionModalOpen(false);
      handleSelectChallenge(nextChallenge.id);
    }
  }, [hasNextChallenge, currentChallengeIndex, handleSelectChallenge]);

  const activeTier =
    DIFFICULTY_TIERS[activeChallenge.difficulty.toUpperCase()] || {};

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Soft Ambient Canva Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[var(--primary)] opacity-5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-[var(--secondary)] opacity-5 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00c4cc06_1px,transparent_1px),linear-gradient(to_bottom,#7d2ae806_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ========================================================================= */}
      {/* 1. IDE TOP DEVELOPER STATUS BAR                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2 max-w-[1700px] mx-auto">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
              title="Return to Portfolio"
            >
              <Home className="w-4 h-4" />
            </Link>

            <span className="text-slate-300">/</span>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-white shadow-md shadow-[var(--primary)]/20">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-wide text-slate-900">
                    BUG HUNTER
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--primary-light)] text-[var(--primary)] font-mono border border-[var(--primary)]/30 font-bold">
                    v2.0
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span>Interactive Code Debugger</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">Live Workspace</span>
                </div>
              </div>
            </div>

            {/* Current Difficulty Tag */}
            <div className="hidden lg:block ml-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${activeTier.badgeColor}`}>
                {activeTier.label}
              </span>
            </div>
          </div>

          {/* Center: Timer & Status */}
          <div className="flex items-center gap-2">
            <Timer seconds={timerSeconds} isRunning={isTimerRunning} />
          </div>

          {/* Right: XP, Streaks, Achievements & Audio */}
          <div className="flex items-center gap-2 sm:gap-3">
            <XPDisplay
              totalXP={userState.totalXP || 0}
              streak={userState.currentStreak || 0}
              unlockedAchievementsCount={userState.unlockedAchievements?.length || 0}
              onOpenAchievements={() => setIsAchievementModalOpen(true)}
            />

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              title={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden mt-2.5 pt-2 border-t border-slate-200 justify-around text-xs">
          <button
            onClick={() => setMobileTab("challenges")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              mobileTab === "challenges"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Challenges ({Object.keys(userState.solvedChallenges || {}).length}/{BUG_CHALLENGES.length})</span>
          </button>

          <button
            onClick={() => setMobileTab("editor")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              mobileTab === "editor"
                ? "bg-[var(--primary)] text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <button
            onClick={() => setMobileTab("description")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              mobileTab === "description"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Briefing</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-COLUMN WORKSPACE                                               */}
      {/* ========================================================================= */}
      <main className="flex-1 p-3 sm:p-4 max-w-[1700px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 overflow-hidden">
        {/* LEFT COLUMN: Challenge Directory (3 cols on desktop) */}
        <aside
          className={`lg:col-span-3 h-[calc(100vh-140px)] min-h-[500px] ${
            mobileTab === "challenges" ? "block" : "hidden lg:block"
          }`}
        >
          <ChallengeList
            challenges={BUG_CHALLENGES}
            activeChallengeId={activeId}
            onSelectChallenge={handleSelectChallenge}
            solvedChallenges={userState.solvedChallenges || {}}
          />
        </aside>

        {/* MIDDLE COLUMN: Code Editor & Test Results (6 cols on desktop) */}
        <section
          className={`lg:col-span-6 flex flex-col h-[calc(100vh-140px)] min-h-[500px] gap-3 ${
            mobileTab === "editor" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Main Monaco / Fallback Code Editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              code={userCode}
              onChange={setUserCode}
              onRunTests={handleRunTests}
              onReset={handleReset}
              onOpenHint={() => setIsHintModalOpen(true)}
              hintsUsedCount={revealedHints}
              maxHints={activeChallenge.hints?.length || 2}
              isRunningTests={isRunningTests}
              fileName={`${activeChallenge.id}.js`}
            />
          </div>

          {/* Test Results Drawer */}
          <div className="shrink-0 rounded-2xl overflow-hidden shadow-sm">
            <TestResults
              hasRun={testOutcome.hasRun}
              passed={testOutcome.passed}
              executionMs={testOutcome.executionMs}
              results={testOutcome.results}
              earnedXP={testOutcome.earnedXP}
              isFirstSolve={testOutcome.isFirstSolve}
              onViewSolution={() => setIsSolutionModalOpen(true)}
            />
          </div>
        </section>

        {/* RIGHT COLUMN: Challenge Briefing / Production Incident (3 cols) */}
        <aside
          className={`lg:col-span-3 h-[calc(100vh-140px)] min-h-[500px] ${
            mobileTab === "description" ? "block" : "hidden lg:block"
          }`}
        >
          <ChallengeDescription
            challenge={activeChallenge}
            isSolved={!!userState.solvedChallenges?.[activeChallenge.id]}
          />
        </aside>
      </main>

      {/* ========================================================================= */}
      {/* 3. MODALS & POPUPS                                                        */}
      {/* ========================================================================= */}
      {/* Progressive Hint Modal */}
      <HintSystem
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hints={activeChallenge.hints || []}
        revealedCount={revealedHints}
        onUnlockHint={handleUnlockHint}
      />

      {/* Achievements Showcase */}
      <AchievementPanel
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        unlockedIds={userState.unlockedAchievements || []}
      />

      {/* Victory / Post-Mortem Solution Modal */}
      <SolutionModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        challenge={activeChallenge}
        earnedXP={testOutcome.earnedXP}
        timeTaken={timerSeconds}
        onNextChallenge={handleNextChallenge}
        hasNextChallenge={hasNextChallenge}
      />
    </div>
  );
}
