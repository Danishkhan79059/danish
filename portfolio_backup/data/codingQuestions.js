// Mini Coding Challenge Questions Dataset
// Topics: JavaScript, React, Next.js, Node.js, CSS, Logic, Web Development
// Difficulties: easy (+100 XP), medium (+200 XP), hard (+300 XP)

export const CODING_QUESTIONS = [
  // ==========================================
  // JAVASCRIPT QUESTIONS
  // ==========================================
  {
    id: 1,
    topic: "JavaScript",
    difficulty: "easy",
    question: "What will be printed to the console?",
    code: `const a = [1, 2, 3];
const b = a;
b.push(4);

console.log(a.length);`,
    options: ["3", "4", "undefined", "TypeError"],
    answer: "4",
    explanation: "Arrays in JavaScript are reference types. 'b' points to the exact same array in memory as 'a'. Modifying 'b' directly mutates 'a'."
  },
  {
    id: 2,
    topic: "JavaScript",
    difficulty: "medium",
    question: "What will this asynchronous code log?",
    code: `console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");`,
    options: [
      "Start -> Timeout -> Promise -> End",
      "Start -> End -> Timeout -> Promise",
      "Start -> End -> Promise -> Timeout",
      "Start -> Promise -> End -> Timeout"
    ],
    answer: "Start -> End -> Promise -> Timeout",
    explanation: "Synchronous code runs first ('Start', 'End'). Microtasks (Promise.then) run immediately after the synchronous execution before Macrotasks (setTimeout)."
  },
  {
    id: 3,
    topic: "JavaScript",
    difficulty: "easy",
    question: "What does this code snippet evaluate to?",
    code: `const res = [1, 2, 3].map(num => num * 2).filter(num => num > 3);
console.log(res);`,
    options: ["[2, 4, 6]", "[4, 6]", "[2, 4]", "[6]"],
    answer: "[4, 6]",
    explanation: "map() doubles each element resulting in [2, 4, 6]. filter() keeps numbers strictly greater than 3, leaving [4, 6]."
  },
  {
    id: 4,
    topic: "JavaScript",
    difficulty: "hard",
    question: "What will this closure and hoisting example output?",
    code: `var count = 10;

function outer() {
  console.log(count);
  var count = 20;
}

outer();`,
    options: ["10", "20", "undefined", "ReferenceError"],
    answer: "undefined",
    explanation: "Inside outer(), 'var count' is hoisted to the top of the function scope and initialized to 'undefined', shadowing the global variable."
  },
  {
    id: 5,
    topic: "JavaScript",
    difficulty: "easy",
    question: "What will be logged by this type coercion expression?",
    code: `console.log(1 + "2" + 3);
console.log(4 - "2");`,
    options: ["6 and 2", "123 and 2", "15 and NaN", "123 and NaN"],
    answer: "123 and 2",
    explanation: "The + operator concatenates when a string is present ('1' + '2' = '12', + 3 = '123'). The - operator converts strings to numbers, giving 4 - 2 = 2."
  },
  {
    id: 6,
    topic: "JavaScript",
    difficulty: "medium",
    question: "What is the return value of this Object.freeze() check?",
    code: `const user = Object.freeze({
  name: "Danish",
  skills: ["React", "Node"]
});

user.skills.push("Next.js");
console.log(user.skills.length);`,
    options: ["2", "3", "TypeError: Cannot add property", "undefined"],
    answer: "3",
    explanation: "Object.freeze() performs a shallow freeze! Nested objects or arrays within the frozen object remain fully mutable unless frozen recursively."
  },
  {
    id: 7,
    topic: "JavaScript",
    difficulty: "medium",
    question: "What is the result of applying reduce to this array?",
    code: `const nums = [10, 20, 30];
const total = nums.reduce((acc, curr) => acc + curr, 5);
console.log(total);`,
    options: ["60", "65", "55", "70"],
    answer: "65",
    explanation: "The second argument (5) is the initial value of accumulator. Total = 5 + 10 + 20 + 30 = 65."
  },

  // ==========================================
  // REACT QUESTIONS
  // ==========================================
  {
    id: 8,
    topic: "React",
    difficulty: "easy",
    question: "Why should you avoid using array index as a 'key' in React lists?",
    code: `{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}`,
    options: [
      "React throws a compile-time syntax error",
      "Reordering or deleting items can cause component state and DOM bugs",
      "Indexes reduce browser memory by 50%",
      "React requires string UUIDs for all keys"
    ],
    answer: "Reordering or deleting items can cause component state and DOM bugs",
    explanation: "When items are filtered, deleted, or reordered, matching keys by index confuses React's reconciliation diffing, causing state corruption in child components."
  },
  {
    id: 9,
    topic: "React",
    difficulty: "medium",
    question: "What will be logged after clicking the button once in React 18+?",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  };

  return <button onClick={handleClick}>Click</button>;
}`,
    options: ["3", "1", "0", "undefined"],
    answer: "0",
    explanation: "State updates are batched and asynchronous. The 'count' variable captured in the current render closure remains 0 until the next re-render."
  },
  {
    id: 10,
    topic: "React",
    difficulty: "medium",
    question: "When does the cleanup function of this useEffect run?",
    code: `useEffect(() => {
  const timer = setInterval(() => tick(), 1000);

  return () => {
    clearInterval(timer);
  };
}, [userId]);`,
    options: [
      "Only when the browser window closes",
      "Before every re-render and before component unmount",
      "Before re-running effect on userId change AND when component unmounts",
      "Immediately after the initial render"
    ],
    answer: "Before re-running effect on userId change AND when component unmounts",
    explanation: "React executes the cleanup callback before applying the new effect if any dependency (userId) changes, and also when the component unmounts."
  },
  {
    id: 11,
    topic: "React",
    difficulty: "hard",
    question: "What is the primary benefit of useCallback in React?",
    code: `const handleSave = useCallback(() => {
  saveData(formData);
}, [formData]);`,
    options: [
      "It memoizes the return value of calculation like useMemo",
      "It preserves function reference across renders to avoid child re-renders",
      "It makes the function run in a Web Worker thread",
      "It automatically catches asynchronous errors"
    ],
    answer: "It preserves function reference across renders to avoid child re-renders",
    explanation: "useCallback caches a function definition between renders so child components wrapped in React.memo don't re-render due to reference changes."
  },
  {
    id: 12,
    topic: "React",
    difficulty: "easy",
    question: "What is the correct way to update nested state in React?",
    code: `const [profile, setProfile] = useState({
  name: "Danish",
  theme: "dark"
});`,
    options: [
      "profile.theme = 'light'; setProfile(profile);",
      "setProfile({ ...profile, theme: 'light' });",
      "setProfile.theme('light');",
      "delete profile.theme; profile.theme = 'light';"
    ],
    answer: "setProfile({ ...profile, theme: 'light' });",
    explanation: "React state must be treated as immutable. You copy existing properties with the spread operator (...) and override the target field."
  },
  {
    id: 13,
    topic: "React",
    difficulty: "medium",
    question: "What does the useRef hook return?",
    code: `const inputRef = useRef(null);`,
    options: [
      "A state setter tuple [current, setCurrent]",
      "A mutable object with a .current property that persists across renders",
      "A promise that resolves when the DOM element is painted",
      "An immutable clone of the DOM element"
    ],
    answer: "A mutable object with a .current property that persists across renders",
    explanation: "useRef returns a plain JavaScript object { current: initialValue }. Mutating .current does NOT trigger a re-render."
  },

  // ==========================================
  // NEXT.JS QUESTIONS
  // ==========================================
  {
    id: 14,
    topic: "Next.js",
    difficulty: "easy",
    question: "In Next.js App Router, what directive makes a component a Client Component?",
    code: `// Top of the file
"use client";

import { useState } from "react";`,
    options: [
      "'client side';",
      "'use client';",
      "export const client = true;",
      "@ClientComponent"
    ],
    answer: "'use client';",
    explanation: "'use client' declares the boundary between Server and Client Module graphs in Next.js App Router, allowing React hooks and browser events."
  },
  {
    id: 15,
    topic: "Next.js",
    difficulty: "medium",
    question: "Which file convention in Next.js App Router handles runtime UI errors for a segment?",
    code: `app/
  dashboard/
    page.js
    _______.js  <-- catches runtime errors`,
    options: ["catch.js", "error.js", "fallback.js", "exception.js"],
    answer: "error.js",
    explanation: "Next.js defines special file conventions: error.js automatically creates a React Error Boundary wrapping the route segment and page."
  },
  {
    id: 16,
    topic: "Next.js",
    difficulty: "medium",
    question: "What is the primary advantage of Next.js Server Components (RSC)?",
    code: `// Server Component by default in App Router
export default async function Page() {
  const data = await db.query();
  return <div>{data.title}</div>;
}`,
    options: [
      "They have access to browser localStorage directly",
      "They can use useState and useEffect without re-rendering",
      "Zero JavaScript bundle impact on the client and direct backend resource access",
      "They automatically convert CSS into WebGL"
    ],
    answer: "Zero JavaScript bundle impact on the client and direct backend resource access",
    explanation: "Server Components render exclusively on the server, sending rendered HTML/RSC payload to the client with zero JS added to the client bundle."
  },
  {
    id: 17,
    topic: "Next.js",
    difficulty: "hard",
    question: "How do you implement parallel routes in Next.js App Router?",
    code: `app/
  dashboard/
    layout.js
    @analytics/
      page.js
    @team/
      page.js`,
    options: [
      "Using the [parallel] folder naming syntax",
      "Using Named Slots defined with the @folder convention",
      "Using dynamic [id] brackets with a colon",
      "Creating an index.parallel.js file"
    ],
    answer: "Using Named Slots defined with the @folder convention",
    explanation: "Slots created with the @folder pattern pass matching components as props to the parent layout.js (e.g. props.analytics, props.team)."
  },
  {
    id: 18,
    topic: "Next.js",
    difficulty: "easy",
    question: "Why should you use next/image instead of standard <img> tags?",
    code: `<Image
  src="/hero.png"
  alt="Portfolio"
  width={800}
  height={600}
  priority
/>`,
    options: [
      "It converts JPEG images into SVG vectors",
      "Automatic resizing, WebP/AVIF format serving, and prevention of Cumulative Layout Shift",
      "It enables canvas drawing inside images",
      "It encrypts images so users cannot inspect them"
    ],
    answer: "Automatic resizing, WebP/AVIF format serving, and prevention of Cumulative Layout Shift",
    explanation: "next/image optimizes images on demand into modern formats, serves device-specific sizes, and reserves layout aspect ratio to avoid layout shift."
  },

  // ==========================================
  // NODE.JS QUESTIONS
  // ==========================================
  {
    id: 19,
    topic: "Node.js",
    difficulty: "medium",
    question: "In the Node.js event loop, which queue executes first?",
    code: `process.nextTick(() => console.log("A"));
setImmediate(() => console.log("B"));
setTimeout(() => console.log("C"), 0);`,
    options: [
      "setImmediate (B)",
      "process.nextTick (A)",
      "setTimeout (C)",
      "They execute simultaneously"
    ],
    answer: "process.nextTick (A)",
    explanation: "process.nextTick() is processed right after the current operation finishes, before the event loop continues to any timers or check phase."
  },
  {
    id: 20,
    topic: "Node.js",
    difficulty: "easy",
    question: "What is the key difference between CommonJS and ES Modules in Node.js?",
    code: `// Syntax A: const fs = require('fs');
// Syntax B: import fs from 'node:fs';`,
    options: [
      "CommonJS runs faster in production than ES Modules",
      "CommonJS loads synchronously at runtime, while ESM is statically analyzed and asynchronous",
      "CommonJS only works on Windows operating systems",
      "ESM does not support asynchronous functions"
    ],
    answer: "CommonJS loads synchronously at runtime, while ESM is statically analyzed and asynchronous",
    explanation: "require() in CommonJS resolves synchronously on demand, while import/export in ESM are resolved before code execution during module graph building."
  },
  {
    id: 21,
    topic: "Node.js",
    difficulty: "medium",
    question: "Why are Node.js Streams preferable over fs.readFile for large files (e.g. 2GB+)?",
    code: `const readableStream = fs.createReadStream("huge_dataset.csv");
readableStream.pipe(res);`,
    options: [
      "Streams compress files by 90% automatically",
      "Streams process data in sequential chunks, preventing memory overflow",
      "Streams bypass Node.js security checks",
      "Streams write directly to disk without CPU usage"
    ],
    answer: "Streams process data in sequential chunks, preventing memory overflow",
    explanation: "fs.readFile loads the whole 2GB file into RAM at once, which will crash Node with an Out-of-Memory error. Streams read in small chunks (buffers)."
  },
  {
    id: 22,
    topic: "Node.js",
    difficulty: "hard",
    question: "What handles CPU-intensive tasks like crypto and zlib in Node.js?",
    code: `const crypto = require("crypto");
crypto.pbkdf2("secret", "salt", 100000, 64, "sha512", (err, key) => {
  console.log("Hashed");
});`,
    options: [
      "Google V8 garbage collector thread",
      "The libuv thread pool (default 4 worker threads)",
      "Node.js cluster manager master process",
      "Web Worker DOM thread"
    ],
    answer: "The libuv thread pool (default 4 worker threads)",
    explanation: "Node.js offloads synchronous/expensive C++ operations (like cryptography, file I/O, and compression) to the libuv thread pool via UV_THREADPOOL_SIZE."
  },

  // ==========================================
  // CSS & WEB DEVELOPMENT QUESTIONS
  // ==========================================
  {
    id: 23,
    topic: "CSS",
    difficulty: "easy",
    question: "Which CSS selector has the HIGHEST specificity score?",
    code: `A: #main-nav
B: div.navbar > ul.menu li.active
C: header .container nav
D: nav[data-role="navigation"]`,
    options: [
      "#main-nav (ID selector)",
      "div.navbar > ul.menu li.active (Classes + elements)",
      "header .container nav",
      "nav[data-role='navigation']"
    ],
    answer: "#main-nav (ID selector)",
    explanation: "Specificity hierarchy: Inline (1,0,0,0) > ID (0,1,0,0) > Class/Attribute/Pseudo-class (0,0,1,0) > Element (0,0,0,1). An ID beats any number of classes!"
  },
  {
    id: 24,
    topic: "CSS",
    difficulty: "easy",
    question: "What does 'box-sizing: border-box' do?",
    code: `.card {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid purple;
}`,
    options: [
      "Total width becomes 244px",
      "Padding and border are included within the specified 200px width",
      "The border becomes 3D styled",
      "It disables CSS margin collapsing"
    ],
    answer: "Padding and border are included within the specified 200px width",
    explanation: "With border-box, the width and height properties include content, padding, and border, keeping sizing predictable without unexpected overflows."
  },
  {
    id: 25,
    topic: "CSS",
    difficulty: "medium",
    question: "What is the flexbox property to center items both vertically and horizontally?",
    code: `.container {
  display: flex;
  /* Missing centering properties */
}`,
    options: [
      "align-items: center; justify-content: center;",
      "align-content: middle; justify-items: middle;",
      "text-align: center; vertical-align: middle;",
      "float: center; margin: auto;"
    ],
    answer: "align-items: center; justify-content: center;",
    explanation: "justify-content: center aligns flex items along the main axis, and align-items: center aligns them along the cross axis."
  },
  {
    id: 26,
    topic: "CSS",
    difficulty: "medium",
    question: "Which CSS trigger causes a browser Reflow (Layout) rather than just a Repaint?",
    code: `/* Changing which property causes a full layout recalculation? */`,
    options: [
      "opacity",
      "color",
      "width",
      "background-color"
    ],
    answer: "width",
    explanation: "Changing geometric properties like width, height, or margin forces the browser to recalculate element geometry for all siblings (Reflow/Layout)."
  },

  // ==========================================
  // LOGIC & ALGORITHMS QUESTIONS
  // ==========================================
  {
    id: 27,
    topic: "Logic",
    difficulty: "easy",
    question: "What will this logic expression evaluate to in JavaScript?",
    code: `const val = null ?? "default";
const check = "" || "fallback";

console.log(val, check);`,
    options: [
      "'default' and ''",
      "'default' and 'fallback'",
      "'null' and 'fallback'",
      "undefined and 'fallback'"
    ],
    answer: "'default' and ''",
    explanation: "?? (nullish coalescing) only falls back if value is null or undefined. || (logical OR) falls back on any falsy value, including an empty string ('')."
  },
  {
    id: 28,
    topic: "Logic",
    difficulty: "medium",
    question: "What is the average time complexity of searching a key in a JavaScript Map or Set?",
    code: `const set = new Set([1, 2, 3, 4, 5]);
console.log(set.has(3));`,
    options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
    answer: "O(1)",
    explanation: "JavaScript Set and Map are implemented using hash tables internally, giving average constant time O(1) complexity for lookups, insertions, and deletions."
  },
  {
    id: 29,
    topic: "Logic",
    difficulty: "hard",
    question: "What will this recursive countdown function log?",
    code: `function countdown(n) {
  if (n <= 0) return;
  countdown(n - 1);
  console.log(n);
}

countdown(3);`,
    options: ["3, 2, 1", "1, 2, 3", "0, 1, 2, 3", "3, 2, 1, 0"],
    answer: "1, 2, 3",
    explanation: "Because console.log(n) comes AFTER the recursive call countdown(n - 1), the execution stack unwinds in reverse (LIFO), logging 1, 2, 3."
  },
  {
    id: 30,
    topic: "Logic",
    difficulty: "medium",
    question: "What will this Set and spread operator snippet output?",
    code: `const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];
console.log(unique.length);`,
    options: ["6", "4", "3", "TypeError"],
    answer: "4",
    explanation: "Set eliminates all duplicate values, leaving only {1, 2, 3, 4}. Spreading into an array produces an array with length 4."
  },
  {
    id: 31,
    topic: "JavaScript",
    difficulty: "medium",
    question: "What is the output of checking typeof for these values?",
    code: `console.log(typeof null);
console.log(typeof NaN);`,
    options: [
      "'null' and 'NaN'",
      "'object' and 'number'",
      "'undefined' and 'number'",
      "'object' and 'NaN'"
    ],
    answer: "'object' and 'number'",
    explanation: "'typeof null' is a historic JavaScript bug that returns 'object'. 'NaN' stands for 'Not-a-Number' but its JavaScript data type is 'number'."
  },
  {
    id: 32,
    topic: "React",
    difficulty: "hard",
    question: "What happens when you pass a new object literal directly as a prop inside JSX?",
    code: `<DashboardConfig config={{ theme: "dark", autoSync: true }} />`,
    options: [
      "React reuses the previous object from cache",
      "A new object reference is created on every render, potentially breaking child memoization",
      "React converts it to a immutable frozen proxy",
      "The component throws a compile error in production"
    ],
    answer: "A new object reference is created on every render, potentially breaking child memoization",
    explanation: "Creating objects or inline functions inside JSX creates new memory references every render. If the child is wrapped in React.memo, it will fail memo checks."
  },
  {
    id: 33,
    topic: "Node.js",
    difficulty: "easy",
    question: "Which environment variable is standard for switching Node.js into optimized production mode?",
    code: `if (process.env.NODE_ENV === "production") {
  enableProductionOptimizations();
}`,
    options: ["ENVIRONMENT=prod", "NODE_ENV=production", "MODE=release", "APP_ENV=live"],
    answer: "NODE_ENV=production",
    explanation: "NODE_ENV=production is the industry standard convention recognized by Node.js, Express, React, and Next.js to enable caching and disable verbose debug code."
  },
  {
    id: 34,
    topic: "Next.js",
    difficulty: "hard",
    question: "How do you generate static HTML routes for dynamic segments at build time in Next.js App Router?",
    code: `// app/blog/[slug]/page.js
export async function ___________________() {
  return [{ slug: 'post-1' }, { slug: 'post-2' }];
}`,
    options: [
      "getStaticPaths",
      "generateStaticParams",
      "getServerSidePaths",
      "exportPathMap"
    ],
    answer: "generateStaticParams",
    explanation: "generateStaticParams replaces the Pages router's getStaticPaths. It works alongside dynamic route segments to generate static HTML at build time."
  },
  {
    id: 35,
    topic: "CSS",
    difficulty: "hard",
    question: "Which of these CSS properties creates a new Stacking Context?",
    code: `.element {
  /* Which property triggers a new stacking context? */
}`,
    options: [
      "position: static",
      "color: transparent",
      "opacity: 0.95",
      "margin: 0 auto"
    ],
    answer: "opacity: 0.95",
    explanation: "Elements with opacity less than 1, transform not 'none', filter, or will-change create a new stacking context, determining z-index layer isolation."
  },
  {
    id: 36,
    topic: "Logic",
    difficulty: "easy",
    question: "What is the result of this ternary operator evaluation?",
    code: `const isSenior = true;
const hasExperience = false;

const title = isSenior ? (hasExperience ? "Lead" : "Specialist") : "Junior";
console.log(title);`,
    options: ["Lead", "Specialist", "Junior", "undefined"],
    answer: "Specialist",
    explanation: "isSenior is true, so the outer ternary evaluates the first expression: (hasExperience ? 'Lead' : 'Specialist'). hasExperience is false, yielding 'Specialist'."
  }
];

export const TOPICS = [
  { id: "all", label: "Random Mix", icon: "🎲", count: 36 },
  { id: "JavaScript", label: "JavaScript", icon: "⚡", count: 8 },
  { id: "React", label: "React", icon: "⚛️", count: 7 },
  { id: "Next.js", label: "Next.js", icon: "▲", count: 5 },
  { id: "Node.js", label: "Node.js", icon: "🟢", count: 5 },
  { id: "CSS", label: "CSS & Web", icon: "🎨", count: 5 },
  { id: "Logic", label: "Logic", icon: "🧠", count: 6 },
];

export const DIFFICULTY_CONFIG = {
  easy: {
    label: "EASY",
    xp: 100,
    color: "text-emerald-700 border-emerald-200 bg-emerald-50",
    dot: "bg-emerald-500"
  },
  medium: {
    label: "MEDIUM",
    xp: 200,
    color: "text-amber-700 border-amber-200 bg-amber-50",
    dot: "bg-amber-500"
  },
  hard: {
    label: "HARD",
    xp: 300,
    color: "text-rose-700 border-rose-200 bg-rose-50",
    dot: "bg-rose-500"
  }
};
