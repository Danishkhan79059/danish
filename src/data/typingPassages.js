export const TYPING_PASSAGES = [
  // ================= GENERAL =================
  {
    id: "gen-easy-1",
    category: "general",
    difficulty: "easy",
    text: "The sun was shining bright in the clear blue sky. Birds were singing sweet songs in the tall green trees. A warm gentle breeze made the colorful flowers dance in the garden.",
  },
  {
    id: "gen-easy-2",
    category: "general",
    difficulty: "easy",
    text: "Reading books every day helps build a strong mind. You can learn new words and visit distant places without ever leaving your quiet room. Good habits bring happiness.",
  },
  {
    id: "gen-med-1",
    category: "general",
    difficulty: "medium",
    text: "Time is one of our most precious resources. When we learn to manage our daily routines with discipline, we accomplish our goals while still enjoying moments of relaxation with family and friends.",
  },
  {
    id: "gen-med-2",
    category: "general",
    difficulty: "medium",
    text: "Curiosity drives human progress. Throughout history, ordinary people who asked simple questions discovered extraordinary answers that transformed transportation, science, and everyday medicine across the globe.",
  },
  {
    id: "gen-hard-1",
    category: "general",
    difficulty: "hard",
    text: "Linguistic dexterity requires persistent exercise; deliberate practice bridges the precarious chasm between mediocre execution and consummate craftsmanship in both spoken discourse and mechanical composition.",
  },

  // ================= TECHNOLOGY =================
  {
    id: "tech-easy-1",
    category: "technology",
    difficulty: "easy",
    text: "Smart phones and computers help us connect with people around the world. We can send messages, share pictures, and search for information in just a few seconds.",
  },
  {
    id: "tech-easy-2",
    category: "technology",
    difficulty: "easy",
    text: "Learning to use a keyboard properly is a great skill for modern life. It makes school assignments and office tasks faster, easier, and much more enjoyable.",
  },
  {
    id: "tech-med-1",
    category: "technology",
    difficulty: "medium",
    text: "Cloud computing and modern distributed networks allow software applications to scale seamlessly across multiple data centers. High availability ensures users receive low latency and constant uptime globally.",
  },
  {
    id: "tech-med-2",
    category: "technology",
    difficulty: "medium",
    text: "Artificial intelligence and machine learning models are fundamentally revolutionizing how software analyzes unstructured data, from automated language translation to medical imaging diagnostics.",
  },
  {
    id: "tech-hard-1",
    category: "technology",
    difficulty: "hard",
    text: "Zero-trust cybersecurity architectures mandate continuous verification of cryptographic tokens, ephemeral SSH credentials, and strictly segmented subnet configurations across multi-cloud infrastructure.",
  },

  // ================= BUSINESS =================
  {
    id: "biz-easy-1",
    category: "business",
    difficulty: "easy",
    text: "Good customer service is the heart of every successful business. When clients feel heard and respected, they return and share positive reviews with their friends.",
  },
  {
    id: "biz-easy-2",
    category: "business",
    difficulty: "easy",
    text: "Working together as a team produces better results than working alone. Every member brings fresh ideas, unique strengths, and helpful perspectives to solve difficult problems.",
  },
  {
    id: "biz-med-1",
    category: "business",
    difficulty: "medium",
    text: "Strategic resource allocation and quarterly financial forecasting help growing enterprises navigate market volatility while investing prudently in research, talent acquisition, and sustainable innovation.",
  },
  {
    id: "biz-med-2",
    category: "business",
    difficulty: "medium",
    text: "Effective leadership hinges on clear communication, empathetic active listening, and empowering team members with the autonomy needed to execute high-impact initiatives without micromanagement.",
  },
  {
    id: "biz-hard-1",
    category: "business",
    difficulty: "hard",
    text: "Venture capital syndicates scrutinize EBITDA margins, churn coefficients, and net revenue retention rates before deploying Series B funding into early-stage enterprise software-as-a-service providers.",
  },

  // ================= PROGRAMMING =================
  {
    id: "prog-easy-1",
    category: "programming",
    difficulty: "easy",
    text: "JavaScript is a versatile language used to build interactive websites. Functions, loops, and variables form the basic building blocks of every modern web application.",
  },
  {
    id: "prog-easy-2",
    category: "programming",
    difficulty: "easy",
    text: "Clean code is written for humans to read first, and computers to execute second. Writing clear variable names makes debugging much simpler for everyone on the development team.",
  },
  {
    id: "prog-med-1",
    category: "programming",
    difficulty: "medium",
    text: "Asynchronous operations in JavaScript rely on Promises, async await syntax, and the non-blocking event loop. Handling errors gracefully with try catch prevents unhandled rejections in production.",
  },
  {
    id: "prog-med-2",
    category: "programming",
    difficulty: "medium",
    text: "React components re-render when state or props change. Utilizing memoization hooks like useMemo and useCallback avoids expensive calculations and improves browser rendering performance.",
  },
  {
    id: "prog-hard-1",
    category: "programming",
    difficulty: "hard",
    text: "const fetchUser = async (id: string): Promise<UserResponse> => { const res = await fetch(`/api/v1/users/${id}`); if (!res.ok) throw new Error(res.statusText); return res.json(); };",
  },
  {
    id: "prog-hard-2",
    category: "programming",
    difficulty: "hard",
    text: "Redux middleware intercept dispatched actions before reaching reducers, enabling asynchronous side-effect handling, centralized state synchronization, and deterministic action logging.",
  },

  // ================= RANDOM =================
  {
    id: "rnd-easy-1",
    category: "random",
    difficulty: "easy",
    text: "A quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump under the glowing morning light.",
  },
  {
    id: "rnd-med-1",
    category: "random",
    difficulty: "medium",
    text: "Coffee cultures around the world celebrate diverse brewing methods, from rich Italian espresso and finely ground Turkish decoctions to chilled slow-drip cold brews enjoyed during summer afternoons.",
  },
  {
    id: "rnd-med-2",
    category: "random",
    difficulty: "medium",
    text: "Astronomy reminds us of our humble place in the cosmos. Telescopes capturing photons that traveled millions of light years reveal ancient nebulae, spiral galaxies, and mysterious exoplanets.",
  },
  {
    id: "rnd-hard-1",
    category: "random",
    difficulty: "hard",
    text: "Photosynthetic cyanobacteria in ancient oceans generated the Great Oxidation Event approximately 2.4 billion years ago, permanently altering Earth's atmospheric equilibrium and evolutionary trajectory.",
  },
];

export function getRandomPassage(category = "general", difficulty = "medium") {
  let filtered = TYPING_PASSAGES.filter((p) => {
    const catMatch = category === "random" || p.category === category;
    const diffMatch = p.difficulty === difficulty;
    return catMatch && diffMatch;
  });

  // Fallback if specific combo has no matches
  if (filtered.length === 0) {
    filtered = TYPING_PASSAGES.filter((p) => p.difficulty === difficulty);
  }
  if (filtered.length === 0) {
    filtered = TYPING_PASSAGES;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
