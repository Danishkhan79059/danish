/**
 * SCORING & ACHIEVEMENTS ENGINE
 * Manages XP, hint penalties, developer streaks, achievements, and persistence.
 */

export const ACHIEVEMENTS = [
  {
    id: "first-bug",
    title: "First Bug",
    icon: "🐛",
    description: "Solve your first challenge.",
    unlockedAt: null,
  },
  {
    id: "bug-streak",
    title: "Bug Streak",
    icon: "🔥",
    description: "Solve 5 challenges consecutively without resetting.",
    unlockedAt: null,
  },
  {
    id: "speed-debugger",
    title: "Speed Debugger",
    icon: "⚡",
    description: "Solve a challenge under 30 seconds.",
    unlockedAt: null,
  },
  {
    id: "no-hint-needed",
    title: "No Hint Needed",
    icon: "🧠",
    description: "Solve 5 challenges without using any hints.",
    unlockedAt: null,
  },
  {
    id: "production-hero",
    title: "Production Hero",
    icon: "☠️",
    description: "Solve a Sev-1 Production Incident.",
    unlockedAt: null,
  },
  {
    id: "master-debugger",
    title: "Master Debugger",
    icon: "👑",
    description: "Solve all available bug hunting challenges.",
    unlockedAt: null,
  },
];

const STORAGE_KEY = "bug_hunter_user_state_v1";

export const DEFAULT_STATE = {
  totalXP: 0,
  solvedCount: 0,
  currentStreak: 0,
  bestStreak: 0,
  solveTimes: [], // array of seconds
  solvedChallenges: {}, // { [challengeId]: { xpEarned, hintsUsed, timeTaken, solvedAt } }
  unlockedAchievements: [], // array of achievement ids
  hintUsage: {}, // { [challengeId]: number of hints used }
};

/**
 * Calculates XP earned for a challenge taking hint penalties into account
 */
export function calculateEarnedXP(baseXP, hintsRevealedCount = 0) {
  let penalty = 0;
  if (hintsRevealedCount >= 1) penalty += 10;
  if (hintsRevealedCount >= 2) penalty += 25;

  const minXP = Math.floor(baseXP * 0.25);
  return Math.max(minXP, baseXP - penalty);
}

/**
 * Calculates developer level and rank title based on total XP
 */
export function calculateHunterLevel(totalXP = 0) {
  if (totalXP < 300) {
    return {
      level: 1,
      title: "Junior Bug Hunter",
      badge: "🌱 Apprentice",
      nextTierXP: 300,
      progressPercent: Math.min(100, Math.round((totalXP / 300) * 100)),
    };
  }
  if (totalXP < 800) {
    return {
      level: 2,
      title: "Code Investigator",
      badge: "🔍 Detective",
      nextTierXP: 800,
      progressPercent: Math.min(100, Math.round(((totalXP - 300) / 500) * 100)),
    };
  }
  if (totalXP < 1800) {
    return {
      level: 3,
      title: "Senior Debugger",
      badge: "🛡️ Specialist",
      nextTierXP: 1800,
      progressPercent: Math.min(100, Math.round(((totalXP - 800) / 1000) * 100)),
    };
  }
  if (totalXP < 3500) {
    return {
      level: 4,
      title: "Staff SRE & Bug Slayer",
      badge: "⚡ Principal",
      nextTierXP: 3500,
      progressPercent: Math.min(100, Math.round(((totalXP - 1800) / 1700) * 100)),
    };
  }
  return {
    level: 5,
    title: "Legendary Production Savior",
    badge: "👑 Legend",
    nextTierXP: totalXP,
    progressPercent: 100,
  };
}

/**
 * Safely reads state from localStorage
 */
export function loadHunterState() {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch (err) {
    console.error("Failed to load Bug Hunter state:", err);
    return DEFAULT_STATE;
  }
}

/**
 * Safely persists state to localStorage
 */
export function saveHunterState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save Bug Hunter state:", err);
  }
}

/**
 * Evaluates achievements after a challenge is completed.
 * Returns { newAchievements: Array<Achievement>, updatedUnlockedIds: Array<string> }
 */
export function evaluateAchievements(state, newSolve) {
  const { challenge, timeTaken, hintsUsed } = newSolve;
  const currentUnlocked = new Set(state.unlockedAchievements || []);
  const newlyUnlocked = [];

  // 1. First Bug
  if (!currentUnlocked.has("first-bug")) {
    newlyUnlocked.push("first-bug");
    currentUnlocked.add("first-bug");
  }

  // 2. Bug Streak (5 consecutive)
  const newStreak = (state.currentStreak || 0) + 1;
  if (newStreak >= 5 && !currentUnlocked.has("bug-streak")) {
    newlyUnlocked.push("bug-streak");
    currentUnlocked.add("bug-streak");
  }

  // 3. Speed Debugger (< 30 seconds)
  if (timeTaken <= 30 && !currentUnlocked.has("speed-debugger")) {
    newlyUnlocked.push("speed-debugger");
    currentUnlocked.add("speed-debugger");
  }

  // 4. No Hint Needed (5 challenges solved without hints)
  const solvedList = Object.values(state.solvedChallenges || {});
  const zeroHintCount = solvedList.filter((s) => s.hintsUsed === 0).length + (hintsUsed === 0 ? 1 : 0);
  if (zeroHintCount >= 5 && !currentUnlocked.has("no-hint-needed")) {
    newlyUnlocked.push("no-hint-needed");
    currentUnlocked.add("no-hint-needed");
  }

  // 5. Production Hero (Solve any production bug)
  if (challenge.difficulty === "production" && !currentUnlocked.has("production-hero")) {
    newlyUnlocked.push("production-hero");
    currentUnlocked.add("production-hero");
  }

  // 6. Master Debugger (All 14 challenges solved)
  const totalSolved = Object.keys(state.solvedChallenges || {}).length + (state.solvedChallenges[challenge.id] ? 0 : 1);
  if (totalSolved >= 14 && !currentUnlocked.has("master-debugger")) {
    newlyUnlocked.push("master-debugger");
    currentUnlocked.add("master-debugger");
  }

  return {
    newAchievements: ACHIEVEMENTS.filter((a) => newlyUnlocked.includes(a.id)),
    updatedUnlockedIds: Array.from(currentUnlocked),
  };
}
