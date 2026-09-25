/**
 * CHALLENGE ENGINE ORCHESTRATOR
 * Connects validation, scoring, audio, and state updates.
 */

import { validateChallengeCode } from "./validation";
import { calculateEarnedXP, evaluateAchievements } from "./scoring";

/**
 * Web Audio sound synthesizer for instant audio feedback without external audio files
 */
export function playBugHunterSound(type, soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "success") {
      // Ascending triumphant dual chime (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.25);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.25);
      });
    } else if (type === "failure") {
      // Low buzz indicating failed assertion
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "hint") {
      // Gentle blip for hint reveal
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === "click") {
      // Subtle key click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // Ignore audio context errors if browser blocks autoplay
  }
}

/**
 * Executes tests on the submitted code and computes rewards if passed
 */
export function runChallengeTests({
  challenge,
  userCode,
  timeTaken,
  hintsUsedCount,
  currentState,
  soundEnabled = true,
}) {
  const startTime = performance.now();
  const validation = validateChallengeCode(challenge.id, userCode);
  const executionMs = Math.max(12, Math.round(performance.now() - startTime + Math.random() * 20));

  if (validation.passed) {
    playBugHunterSound("success", soundEnabled);

    const isAlreadySolved = !!currentState.solvedChallenges[challenge.id];
    const earnedXP = isAlreadySolved
      ? 0 // No duplicate XP for re-solving
      : calculateEarnedXP(challenge.baseXP, hintsUsedCount);

    const achievementResults = evaluateAchievements(currentState, {
      challenge,
      timeTaken,
      hintsUsed: hintsUsedCount,
    });

    return {
      passed: true,
      executionMs,
      results: validation.results,
      earnedXP,
      isFirstSolve: !isAlreadySolved,
      newAchievements: achievementResults.newAchievements,
      updatedUnlockedIds: achievementResults.updatedUnlockedIds,
    };
  } else {
    playBugHunterSound("failure", soundEnabled);

    return {
      passed: false,
      executionMs,
      results: validation.results,
      earnedXP: 0,
      isFirstSolve: false,
      newAchievements: [],
      updatedUnlockedIds: currentState.unlockedAchievements,
    };
  }
}
