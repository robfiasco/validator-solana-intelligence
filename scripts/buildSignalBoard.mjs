import fs from "node:fs";
import path from "node:path";
import {
  hydrateMemory,
  createRunSet,
  canUseStory,
  buildMemoryEntry,
  writeMemory,
} from "./storyMemory.mjs";

const cwd = process.cwd();
const MARKET_PATH = path.join(cwd, "data", "market_context.json");
const ARTICLES_PATH = path.join(cwd, "data", "articles.json");
const BRIEFING_PATH = path.join(cwd, "data", "briefing.json");
const OUT_ROOT = path.join(cwd, "signal_board.json");
const OUT_DATA = path.join(cwd, "data", "signal_board.json");
const OUT_PUBLIC = path.join(cwd, "public", "signal_board.json");

const SOLANA_TERMS = [
  "solana", "sol", "jupiter", "jup", "raydium", "orca", "meteora", "drift",
  "kamino", "marginfi", "jito", "pyth", "helius", "firedancer", "backpack",
  "seeker", "saga", "pump.fun", "bonk", "wif", "tokenomics", "airdrop", "unlock",
];

const SOLANA_HARD_TERMS = [
  "solana", "jupiter", "raydium", "orca", "meteora", "drift", "kamino", "marginfi",
  "jito", "pyth", "helius", "firedancer", "backpack", "seeker", "saga", "pump.fun",
  "bonk", "wif", "mad lads",
];

const THEME_RULES = [
  { key: "ai agents", test: /(ai|agent|agents|autonomous|openclaw)/i },
  { key: "gaming", test: /(gaming|game|onchain game|esports)/i },
  { key: "yield", test: /(yield|apy|staking|lst|restaking|carry)/i },
  { key: "new products", test: /(launch|released|announced|new app|new wallet|new protocol|seeker)/i },
  { key: "tokenomics", test: /(tokenomics|unlock|airdrop|supply|vesting|burn)/i },
  { key: "liquidity", test: /(dex|perps|volume|liquidity|tvl|flows|open interest)/i },
  { key: "infrastructure", test: /(rpc|firedancer|validator|latency|throughput|infra)/i },
  { key: "payments", test: /(payments|stablecoin|rwa|tokenized|settlement)/i },
];

const loadJson = (filePath, fallback) => {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\w\s.$-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isSolanaArticle = (article) => {
  const text = normalize(`${article?.title || ""} ${article?.summary || ""} ${article?.url || ""}`);
  const hasHard = SOLANA_HARD_TERMS.some((term) => {
    const t = normalize(term);
    if (!t) return false;
    if (t === "sol") return /\bsol\b/.test(text);
    if (t === "jup") return /\bjup\b/.test(text);
    if (t.includes(".") || t.includes("-")) return text.includes(t);
    return new RegExp(`\\b${escapeRegex(t)}\\b`).test(text);
  });
  if (!hasHard) return false;
  return SOLANA_TERMS.some((term) => {
    const t = normalize(term);
    if (!t) return false;
    if (t === "sol") return /\bsol\b/.test(text);
    if (t === "jup") return /\bjup\b/.test(text);
    if (t.includes(".") || t.includes("-")) return text.includes(t);
    return new RegExp(`\\b${escapeRegex(t)}\\b`).test(text);
  });
};

const getRecentArticles = (articles, days) => {
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return (Array.isArray(articles) ? articles : [])
    .map((item) => {
      const publishedAt = item?.published || item?.publishedAt || item?.date || null;
      const ts = Date.parse(String(publishedAt || ""));
      return { ...item, ts: Number.isFinite(ts) ? ts : 0, publishedAt };
    })
    .filter((item) => item.ts >= cutoff && isSolanaArticle(item))
    .sort((a, b) => b.ts - a.ts);
};

const compactTitle = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[:;].*$/, "")
    .trim();

const teaserTitle = (value, max = 82) => {
  const t = compactTitle(value);
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
};

const cleanHeadline = (value, max = 78) =>
  teaserTitle(value, max)
    .replace(/[?!.]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

const headlineForCopy = (value, max = 64) => {
  const text = cleanHeadline(value, 200).replace(/\s*[–-]\s*is this.*$/i, "").trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  const safe = clipped.includes(" ") ? clipped.slice(0, clipped.lastIndexOf(" ")) : clipped;
  return safe.replace(/[^\w)\]]+$/g, "").trim();
};

const formatPct = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
};

const formatB = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return `${n.toFixed(0)}`;
};

const fearLabel = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "mixed sentiment";
  if (n <= 20) return "extreme fear";
  if (n <= 40) return "risk-off";
  if (n <= 60) return "neutral";
  if (n <= 80) return "risk-on";
  return "extreme greed";
};

const themeLabel = (key) => {
  switch (key) {
    case "ai agents":
      return "AI agents";
    case "new products":
      return "new product launches";
    case "tokenomics":
      return "tokenomics and unlocks";
    case "liquidity":
      return "DEX/perps liquidity";
    case "payments":
      return "payments and stablecoins";
    case "infrastructure":
      return "infrastructure and execution";
    default:
      return key;
  }
};

const scoreThemes = (articles) => {
  const scores = new Map();
  for (const article of articles) {
    const weight = 1;
    const text = normalize(`${article?.title || ""} ${article?.summary || ""}`);
    for (const theme of THEME_RULES) {
      if (theme.test.test(text)) {
        scores.set(theme.key, (scores.get(theme.key) || 0) + weight);
      }
    }
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
};

const utcWeekVisibility = () => {
  const now = new Date();
  const utcDay = now.getUTCDay(); // 0=Sun,1=Mon...6=Sat
  return {
    showPastWeek: utcDay >= 0 && utcDay <= 2, // Sun-Tue
    showNextWeek: utcDay >= 3, // Wed-Sat
    generatedDate: now.toISOString().slice(0, 10),
  };
};

const callOpenAI = async (promptItems, timestamp, isRetry = false) => {
  if (!process.env.OPENAI_API_KEY) throw new Error("No OPENAI_API_KEY");

  let systemPrompt = `You are a "Solana Context Editor" writing for busy professionals who do not use X or subscribe to many newsletters.
Your job is to translate today's RSS items into clear context, not advice.

### HARD RULES (must follow)
- Do NOT give instructions or financial advice. Avoid verbs like: buy, sell, stake, farm, rotate, ape, short, long, avoid, exit, enter.
- Do NOT say "no action required" or any equivalent.
- Do NOT invent causes, numbers, or claims not supported by the RSS items.
- Do NOT use generic market filler (e.g. "amid uncertainty", "despite fear sentiment") unless the RSS explicitly supports it.
- Prefer clarity over hype. Sound confident but not promotional.
- If an item is speculative, label it as speculation.

### OUTPUT FORMAT (must match exactly)
Return plain text (no markdown bullets), using this exact structure and section titles:

MARKET CONTEXT (AS OF ${timestamp})
{2–3 sentences max. Only mention price/volume if the RSS clearly ties them to a cause. Otherwise focus on "where attention is going."}

WHAT PEOPLE ARE TALKING ABOUT
• {Theme 1: one line in plain English}
• {Theme 2}
• {Theme 3 (optional)}

WHY IT MATTERS
{2–4 short lines. Explain implications for Solana users/builders/holders without advice.}

WHAT'S SIGNAL VS NOISE
Signal: {1–2 short lines}
Noise: {1 short line}

GLOSSARY (1-LINERS)
{Only include 1–3 terms that appeared in today's items, each with a simple definition. Format: TERM — definition}

### LENGTH LIMITS
- Total output: 120–180 words
- No section may exceed 3 lines
- If you can't support 3 themes from RSS, output 1–2 themes only (don't pad).`;

  if (isRetry) {
    systemPrompt = "Your last answer was too generic. Use only the provided RSS facts, remove filler, and be more specific about named projects/topics mentioned in the RSS.\n\n" + systemPrompt;
  }

  const userPrompt = JSON.stringify(promptItems);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `RSS Items:\n${userPrompt}` }
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${err}`);
  }

  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content || "").trim();
};

const qualityGateFails = (text, articles) => {
  const lower = text.toLowerCase();

  const bannedPhrases = [
    "amid uncertainty",
    "prevailing fear sentiment",
    "market participants",
    "macro headwinds",
  ];
  if (bannedPhrases.some(phrase => lower.includes(phrase))) {
    console.log("Quality Gate Failed: Contains banned filler phrase.");
    return true;
  }

  if (lower.includes("risk-on") || lower.includes("risk-off")) {
    const rssText = JSON.stringify(articles).toLowerCase();
    if (!rssText.includes("risk-on") && !rssText.includes("risk-off")) {
      console.log("Quality Gate Failed: Hallucinated 'risk-on/risk-off'.");
      return true;
    }
  }

  const instructionVerbs = ["buy ", "sell ", "stake ", "avoid ", "short ", "long ", "ape ", "rotate "];
  if (instructionVerbs.some(verb => lower.includes(` ${verb}`))) {
    console.log("Quality Gate Failed: Contains instruction verbs.");
    return true;
  }

  if (lower.includes("no action required")) {
    console.log("Quality Gate Failed: Contains 'no action required'.");
    return true;
  }

  return false;
};

const parseBrief = (text) => {
  const sections = text.split(/\n{2,}/);
  const result = {
    marketContext: "",
    talkingAbout: "",
    whyItMatters: "",
    signalVsNoise: "",
    glossary: ""
  };

  let currentKey = null;
  for (const block of sections) {
    if (block.startsWith("MARKET CONTEXT")) {
      currentKey = "marketContext";
      result[currentKey] = block.split("\n").slice(1).join("\n").trim();
    } else if (block.startsWith("WHAT PEOPLE ARE TALKING ABOUT")) {
      currentKey = "talkingAbout";
      result[currentKey] = block.split("\n").slice(1).join("\n").trim();
    } else if (block.startsWith("WHY IT MATTERS")) {
      currentKey = "whyItMatters";
      result[currentKey] = block.split("\n").slice(1).join("\n").trim();
    } else if (block.startsWith("WHAT'S SIGNAL VS NOISE") || block.startsWith("WHAT’S SIGNAL VS NOISE")) {
      currentKey = "signalVsNoise";
      result[currentKey] = block.split("\n").slice(1).join("\n").trim();
    } else if (block.startsWith("GLOSSARY")) {
      currentKey = "glossary";
      result[currentKey] = block.split("\n").slice(1).join("\n").trim();
    } else if (currentKey) {
      result[currentKey] += "\n\n" + block.trim();
    }
  }

  return result;
};

const buildReadMore = (articles, max = 3) => {
  const used = new Set();
  const links = [];
  for (const article of articles) {
    if (!article?.url || !article?.title) continue;
    const sourceKey = String(article.source || "").toLowerCase();
    if (used.has(sourceKey)) continue;
    used.add(sourceKey);
    links.push({
      title: compactTitle(article.title),
      source: article.source || "Source",
      url: article.url,
    });
    if (links.length >= max) break;
  }
  return links;
};

const main = async () => {
  // Try loading dotenv
  const { createRequire } = await import("module");
  const req = createRequire(import.meta.url);
  try {
    req("dotenv").config({ path: ".env.local" });
    req("dotenv").config();
  } catch (e) { }

  const rawArticles = loadJson(ARTICLES_PATH, { items: [] });
  const articles = Array.isArray(rawArticles?.items)
    ? rawArticles.items
    : Array.isArray(rawArticles)
      ? rawArticles
      : [];

  const weekArticles = getRecentArticles(articles, 7);
  const visibility = utcWeekVisibility();

  const promptItems = weekArticles.slice(0, 8).map(item => ({
    title: item.title,
    source: item.source,
    published: item.publishedAt || item.published || item.date,
    summary: item.summary
  }));

  let aiText = "";
  try {
    console.log("Generating Context Brief using gpt-4.1...");
    aiText = await callOpenAI(promptItems, visibility.generatedDate, false);

    if (qualityGateFails(aiText, promptItems)) {
      console.log("Retrying Generation...");
      aiText = await callOpenAI(promptItems, visibility.generatedDate, true);
    }
  } catch (err) {
    console.error("AI Generation failed:", err);
    aiText = `MARKET CONTEXT (AS OF ${visibility.generatedDate})\nData unavailable.\n\nWHAT PEOPLE ARE TALKING ABOUT\n• Data unavailable.\n\nWHY IT MATTERS\nData unavailable.\n\nWHAT'S SIGNAL VS NOISE\nSignal: Data unavailable.\nNoise: Data unavailable.\n\nGLOSSARY (1-LINERS)\nDATA — unavailable`;
  }

  const parsedSections = parseBrief(aiText);

  const payload = {
    date: visibility.generatedDate,
    generated_at_utc: new Date().toISOString(),

    // New Context Brief Sections mapped directly into JSON root payload
    ctxMarket: parsedSections.marketContext,
    ctxTalking: parsedSections.talkingAbout,
    ctxMatters: parsedSections.whyItMatters,
    ctxSignal: parsedSections.signalVsNoise,
    ctxGlossary: parsedSections.glossary,

    readMore: buildReadMore(weekArticles, 3),
  };

  const memory = hydrateMemory();
  const runSet = createRunSet(memory);
  const summaryCandidate = {
    title: `Signal Board Summary ${payload.date}`,
    source: "signal-board",
    url: "",
    topicTags: ["signal-board"],
    dateBucket: payload.date,
  };
  const verdict = canUseStory(summaryCandidate, memory, runSet);
  if (verdict.allowed) {
    writeMemory(memory, [buildMemoryEntry(summaryCandidate, verdict.fingerprint, "signal")]);
  }

  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_PUBLIC), { recursive: true });
  fs.writeFileSync(OUT_ROOT, JSON.stringify(payload, null, 2), "utf-8");
  fs.writeFileSync(OUT_DATA, JSON.stringify(payload, null, 2), "utf-8");
  fs.writeFileSync(OUT_PUBLIC, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Signal board summary generated (Context Brief). Articles used: ${weekArticles.length}`);
};

main();
