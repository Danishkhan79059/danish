import { getRandomPassage } from "@/data/typingPassages";

// Sanitize text: replace curly quotes, em-dashes, and multiple spaces with standard typing characters
function sanitizeText(rawText) {
  if (!rawText) return "";
  return rawText
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch dynamic typing passage from free public APIs with instant local fallback
 */
export async function fetchDynamicPassage(category = "general", difficulty = "medium") {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast response

  try {
    // API Route 1: DummyJSON Quotes API (Fast, reliable, free, CORS-enabled worldwide)
    if (category === "general" || category === "random" || category === "business") {
      const res = await fetch("https://dummyjson.com/quotes/random", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        clearTimeout(timeoutId);
        if (data.quote && data.quote.length > 20) {
          // If quote is short and difficulty is medium/hard, fetch another to combine into a fuller passage
          let fullText = data.quote;
          if (fullText.length < 80) {
            try {
              const res2 = await fetch("https://dummyjson.com/quotes/random");
              if (res2.ok) {
                const data2 = await res2.json();
                if (data2.quote) fullText += " " + data2.quote;
              }
            } catch {
              // Ignore fallback if second fetch fails
            }
          }

          return {
            text: sanitizeText(fullText),
            author: data.author || "Unknown",
            source: "🌐 Free Live API (DummyJSON)",
            isApi: true,
          };
        }
      }
    }

    // API Route 2: Bacon Ipsum (Ideal for long multi-sentence continuous typing drills)
    if (category === "technology" || category === "random") {
      const sentenceCount = difficulty === "easy" ? 2 : difficulty === "hard" ? 5 : 3;
      const res = await fetch(
        `https://baconipsum.com/api/?type=meat-and-filler&sentences=${sentenceCount}&start-with-lorem=0`,
        { signal: controller.signal }
      );
      if (res.ok) {
        const paragraphs = await res.json();
        clearTimeout(timeoutId);
        if (Array.isArray(paragraphs) && paragraphs.length > 0) {
          return {
            text: sanitizeText(paragraphs.join(" ")),
            author: "Creative Commons Passage",
            source: "🌐 Free Live API (BaconIpsum)",
            isApi: true,
          };
        }
      }
    }

    // API Route 3: DummyJSON Posts API (Gives structured paragraphs on various topics)
    const randomSkip = Math.floor(Math.random() * 50);
    const postRes = await fetch(`https://dummyjson.com/posts?limit=1&skip=${randomSkip}`, {
      signal: controller.signal,
    });
    if (postRes.ok) {
      const postData = await postRes.json();
      clearTimeout(timeoutId);
      if (postData.posts && postData.posts[0] && postData.posts[0].body) {
        return {
          text: sanitizeText(postData.posts[0].body),
          author: postData.posts[0].title || "Article Snippet",
          source: "🌐 Free Live API (DummyJSON Articles)",
          isApi: true,
        };
      }
    }
  } catch (err) {
    console.info("Online API request timed out or unavailable, using curated offline passage:", err.message);
  } finally {
    clearTimeout(timeoutId);
  }

  // Graceful offline fallback from local curated dataset
  const fallback = getRandomPassage(category, difficulty);
  return {
    text: sanitizeText(fallback.text),
    author: "Curated Typing Bank",
    source: "📚 Offline Curated Passage",
    isApi: false,
  };
}
