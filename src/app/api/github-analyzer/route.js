import { NextResponse } from "next/server";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  Vue: "#41b883",
  Dart: "#00B4AB",
  SCSS: "#c6538c",
  SQL: "#e38c00",
  Solidity: "#aa6746",
  R: "#198CE7",
};

const KNOWN_FRAMEWORKS = [
  { name: "React", keywords: ["react", "reactjs", "react-native", "create-react-app"] },
  { name: "Next.js", keywords: ["nextjs", "next.js", "next"] },
  { name: "Node.js", keywords: ["nodejs", "node.js", "node"] },
  { name: "Express.js", keywords: ["express", "expressjs", "express.js"] },
  { name: "MongoDB", keywords: ["mongodb", "mongoose", "mongo"] },
  { name: "Tailwind CSS", keywords: ["tailwindcss", "tailwind", "tailwind-css"] },
  { name: "TypeScript", keywords: ["typescript", "ts"] },
  { name: "Redux", keywords: ["redux", "redux-toolkit", "rtk"] },
  { name: "PostgreSQL", keywords: ["postgresql", "postgres", "psql"] },
  { name: "MySQL", keywords: ["mysql"] },
  { name: "Docker", keywords: ["docker", "dockerfile", "docker-compose"] },
  { name: "Prisma", keywords: ["prisma", "prisma-orm"] },
  { name: "GraphQL", keywords: ["graphql", "apollo", "apollo-client"] },
  { name: "Firebase", keywords: ["firebase", "firestore"] },
  { name: "Vue.js", keywords: ["vue", "vuejs", "vue3", "nuxt", "nuxtjs"] },
  { name: "Angular", keywords: ["angular", "angularjs"] },
  { name: "Django", keywords: ["django"] },
  { name: "FastAPI", keywords: ["fastapi"] },
  { name: "Flask", keywords: ["flask"] },
  { name: "Spring Boot", keywords: ["spring-boot", "spring"] },
  { name: "AWS", keywords: ["aws", "s3", "lambda", "ec2"] },
  { name: "Git", keywords: ["git", "github-actions", "ci-cd"] },
  { name: "Socket.io", keywords: ["socket.io", "websocket", "sockets"] },
  { name: "JWT", keywords: ["jwt", "authentication", "auth0"] },
];

function sanitizeUsername(input) {
  if (!input) return "";
  let clean = input.trim();
  // Strip protocol and domain
  clean = clean.replace(/^https?:\/\/(www\.)?github\.com\//i, "");
  // Strip leading @
  clean = clean.replace(/^@/, "");
  // Remove trailing slashes and query params
  clean = clean.split("/")[0].split("?")[0].trim();
  return clean;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawInput = searchParams.get("user") || searchParams.get("username") || "";

  const username = sanitizeUsername(rawInput);

  if (!username) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid GitHub username or URL." },
      { status: 400 }
    );
  }

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DanishKhanPortfolio-GitHub-Analyzer",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 300 }, // cache for 5 mins
    });

    if (userRes.status === 404) {
      return NextResponse.json(
        { success: false, error: `GitHub user "${username}" was not found.` },
        { status: 404 }
      );
    }

    if (userRes.status === 403) {
      return NextResponse.json(
        {
          success: false,
          error: "GitHub API rate limit reached for this IP. Please wait a few minutes or try another profile.",
        },
        { status: 403 }
      );
    }

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch user data: ${userRes.statusText}` },
        { status: userRes.status }
      );
    }

    const profile = await userRes.json();

    // 2. Fetch Repositories (up to 100)
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 300 } }
    );

    let rawRepos = [];
    if (reposRes.ok) {
      rawRepos = await reposRes.json();
    }

    // 3. Fetch Public Events (up to 30)
    let rawEvents = [];
    try {
      const eventsRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`,
        { headers, next: { revalidate: 180 } }
      );
      if (eventsRes.ok) {
        rawEvents = await eventsRes.json();
      }
    } catch {
      // Activity fetch non-fatal
      rawEvents = [];
    }

    // --- AGGREGATE STATS ---
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts = {};
    const detectedTechMap = new Map();

    // Scan repos
    const processedRepos = (Array.isArray(rawRepos) ? rawRepos : []).map((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      // Count languages
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }

      // Detect frameworks from name, desc, topics
      const searchTarget = [
        repo.name,
        repo.description || "",
        ...(repo.topics || []),
      ]
        .join(" ")
        .toLowerCase();

      KNOWN_FRAMEWORKS.forEach((fw) => {
        const matches = fw.keywords.some((kw) => {
          const regex = new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i");
          return regex.test(searchTarget);
        });
        if (matches) {
          detectedTechMap.set(fw.name, (detectedTechMap.get(fw.name) || 0) + 1);
        }
      });

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language,
        languageColor: repo.language ? LANGUAGE_COLORS[repo.language] || "#7d2ae8" : null,
        topics: repo.topics || [],
        isFork: repo.fork,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        homepage: repo.homepage,
      };
    });

    // Language Breakdown
    const totalReposWithLang = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalReposWithLang > 0 ? Math.round((count / totalReposWithLang) * 100) : 0,
        color: LANGUAGE_COLORS[name] || "#7d2ae8",
      }))
      .sort((a, b) => b.count - a.count);

    // Detected Tech List
    // Also include top languages if not already in tech
    languages.slice(0, 4).forEach((lang) => {
      if (!detectedTechMap.has(lang.name)) {
        detectedTechMap.set(lang.name, lang.count);
      }
    });

    const technologies = Array.from(detectedTechMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Repo Highlights
    const sortedByStars = [...processedRepos].sort((a, b) => b.stars - a.stars);
    const sortedByForks = [...processedRepos].sort((a, b) => b.forks - a.forks);
    const sortedByPushed = [...processedRepos].sort(
      (a, b) => new Date(b.pushedAt || b.updatedAt) - new Date(a.pushedAt || a.updatedAt)
    );

    const highlights = {
      mostStarred: sortedByStars[0] || null,
      mostForked: sortedByForks[0] || null,
      latestPushed: sortedByPushed[0] || null,
    };

    // Process Activities
    const activities = (Array.isArray(rawEvents) ? rawEvents : [])
      .slice(0, 15)
      .map((ev) => {
        let typeLabel = "Activity";
        let detail = "";

        if (ev.type === "PushEvent") {
          typeLabel = "Pushed Commits";
          const count = ev.payload?.commits?.length || 1;
          const msg = ev.payload?.commits?.[0]?.message || "Updated code";
          detail = `${count} commit${count > 1 ? "s" : ""}: "${msg.slice(0, 70)}${msg.length > 70 ? "..." : ""}"`;
        } else if (ev.type === "CreateEvent") {
          typeLabel = `Created ${ev.payload?.ref_type || "repository"}`;
          detail = ev.payload?.ref ? `Ref: ${ev.payload.ref}` : "New project initialized";
        } else if (ev.type === "WatchEvent") {
          typeLabel = "Starred Repository";
          detail = "Added repo to favorites";
        } else if (ev.type === "ForkEvent") {
          typeLabel = "Forked Repository";
          detail = `Forked to ${ev.payload?.forkee?.full_name || "personal repository"}`;
        } else if (ev.type === "PullRequestEvent") {
          typeLabel = `Pull Request ${ev.payload?.action || "updated"}`;
          detail = ev.payload?.pull_request?.title || "";
        } else if (ev.type === "IssuesEvent") {
          typeLabel = `Issue ${ev.payload?.action || "updated"}`;
          detail = ev.payload?.issue?.title || "";
        } else {
          typeLabel = ev.type.replace("Event", "");
          detail = "Public repository interaction";
        }

        return {
          id: ev.id,
          type: ev.type,
          typeLabel,
          repoName: ev.repo?.name || "Repository",
          repoUrl: `https://github.com/${ev.repo?.name}`,
          createdAt: ev.created_at,
          detail,
        };
      });

    // Calculate account age
    const createdDate = new Date(profile.created_at);
    const now = new Date();
    const ageYears = ((now - createdDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

    return NextResponse.json({
      success: true,
      profile: {
        login: profile.login,
        name: profile.name || profile.login,
        avatarUrl: profile.avatar_url,
        htmlUrl: profile.html_url,
        bio: profile.bio || "No bio provided",
        company: profile.company,
        blog: profile.blog,
        location: profile.location,
        email: profile.email,
        hireable: profile.hireable,
        twitterUsername: profile.twitter_username,
        publicRepos: profile.public_repos,
        publicGists: profile.public_gists,
        followers: profile.followers,
        following: profile.following,
        createdAt: profile.created_at,
        accountAgeYears: ageYears,
      },
      stats: {
        totalRepos: profile.public_repos,
        analyzedRepos: processedRepos.length,
        totalStars,
        totalForks,
        publicGists: profile.public_gists,
      },
      languages,
      technologies,
      highlights,
      repositories: processedRepos,
      activities,
    });
  } catch (err) {
    console.error("GitHub Analyzer API Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to GitHub API. Please check the username or try again later.",
      },
      { status: 500 }
    );
  }
}
