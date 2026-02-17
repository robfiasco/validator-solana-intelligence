import fs from "fs";
import path from "path";

const cwd = process.cwd();
const dataOut = path.join(cwd, "data", "market_context.json");
const rootOut = path.join(cwd, "market_context.json");
const publicOut = path.join(cwd, "public", "market_context.json");

const FALLBACK_CONTEXT = {
  as_of_utc: new Date().toISOString(),
  sol: {
    price: null,
    change_24h: null,
    change_7d: null,
    change_prev_week_utc: null,
  },
  mkt_cap: {
    solana_mkt_cap_usd: null,
    change_24h: null,
  },
  fear_greed: {
    value: null,
    label: "n/a",
  },
  btc_dominance: {
    value: null,
  },
  vol: {
    sol_24h_usd: null,
  },
};

const loadJson = (filePath) => {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
};

const withTimeout = async (url, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
};

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const pickNearestPrice = (prices, targetMs, mode = "after") => {
  if (!Array.isArray(prices) || !prices.length) return null;
  if (mode === "after") {
    const point = prices.find((p) => Number.isFinite(p?.[0]) && p[0] >= targetMs);
    return toNum(point?.[1]);
  }
  for (let i = prices.length - 1; i >= 0; i -= 1) {
    const p = prices[i];
    if (Number.isFinite(p?.[0]) && p[0] <= targetMs) return toNum(p?.[1]);
  }
  return null;
};

const loadPrevious = () =>
  loadJson(dataOut) || loadJson(rootOut) || loadJson(publicOut) || FALLBACK_CONTEXT;

const main = async () => {
  const previous = loadPrevious();
  const next = {
    ...FALLBACK_CONTEXT,
    ...previous,
    as_of_utc: new Date().toISOString(),
  };

  try {
    const solRes = await withTimeout(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana&price_change_percentage=7d"
    );
    if (solRes.ok) {
      const solJson = await solRes.json();
      const sol = Array.isArray(solJson) ? solJson[0] : null;
      next.sol = {
        price: toNum(sol?.current_price) ?? next.sol.price ?? null,
        change_24h: toNum(sol?.price_change_percentage_24h) ?? next.sol.change_24h ?? null,
        change_7d:
          toNum(sol?.price_change_percentage_7d_in_currency) ?? next.sol.change_7d ?? null,
        change_prev_week_utc: next.sol.change_prev_week_utc ?? null,
      };
      next.mkt_cap = {
        solana_mkt_cap_usd: toNum(sol?.market_cap) ?? next.mkt_cap.solana_mkt_cap_usd ?? null,
        change_24h: toNum(sol?.market_cap_change_percentage_24h) ?? next.mkt_cap.change_24h ?? null,
      };
      next.vol = {
        sol_24h_usd: toNum(sol?.total_volume) ?? next.vol.sol_24h_usd ?? null,
      };
    }
  } catch {
    // keep previous values
  }

  // Previous full UTC week (Sun 00:00 -> Sat 23:59:59.999) change
  try {
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0=Sun..6=Sat
    const thisWeekStartMs = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - utcDay,
      0, 0, 0, 0
    );
    const prevWeekStartMs = thisWeekStartMs - 7 * 24 * 60 * 60 * 1000;
    const prevWeekEndMs = thisWeekStartMs - 1;
    // Add a small buffer to improve chance of endpoints in sparse data.
    const fromSec = Math.floor((prevWeekStartMs - 2 * 60 * 60 * 1000) / 1000);
    const toSec = Math.floor((prevWeekEndMs + 2 * 60 * 60 * 1000) / 1000);
    const rangeRes = await withTimeout(
      `https://api.coingecko.com/api/v3/coins/solana/market_chart/range?vs_currency=usd&from=${fromSec}&to=${toSec}`
    );
    if (rangeRes.ok) {
      const rangeJson = await rangeRes.json();
      const prices = Array.isArray(rangeJson?.prices) ? rangeJson.prices : [];
      const startPrice = pickNearestPrice(prices, prevWeekStartMs, "after");
      const endPrice = pickNearestPrice(prices, prevWeekEndMs, "before");
      if (Number.isFinite(startPrice) && startPrice > 0 && Number.isFinite(endPrice)) {
        const pct = ((endPrice - startPrice) / startPrice) * 100;
        next.sol.change_prev_week_utc = Number.isFinite(pct) ? Number(pct.toFixed(2)) : next.sol.change_prev_week_utc ?? null;
      }
    }
  } catch {
    // keep previous values
  }

  // Fallback: derive previous UTC week change from OHLC candles if range data is missing.
  if (!Number.isFinite(next?.sol?.change_prev_week_utc)) {
    try {
      const now = new Date();
      const utcDay = now.getUTCDay();
      const thisWeekStartMs = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - utcDay,
        0, 0, 0, 0
      );
      const prevWeekStartMs = thisWeekStartMs - 7 * 24 * 60 * 60 * 1000;
      const prevWeekEndMs = thisWeekStartMs - 1;
      const ohlcRes = await withTimeout(
        "https://api.coingecko.com/api/v3/coins/solana/ohlc?vs_currency=usd&days=14"
      );
      if (ohlcRes.ok) {
        const ohlc = await ohlcRes.json(); // [ts, open, high, low, close]
        const candles = Array.isArray(ohlc) ? ohlc.filter((c) => Number.isFinite(c?.[0])) : [];
        const startCandle = candles.find((c) => c[0] >= prevWeekStartMs);
        let endCandle = null;
        for (let i = candles.length - 1; i >= 0; i -= 1) {
          const c = candles[i];
          if (c[0] <= prevWeekEndMs) {
            endCandle = c;
            break;
          }
        }
        const startPrice = toNum(startCandle?.[1]); // open
        const endPrice = toNum(endCandle?.[4]); // close
        if (Number.isFinite(startPrice) && startPrice > 0 && Number.isFinite(endPrice)) {
          const pct = ((endPrice - startPrice) / startPrice) * 100;
          next.sol.change_prev_week_utc = Number.isFinite(pct) ? Number(pct.toFixed(2)) : null;
        }
      }
    } catch {
      // keep null fallback
    }
  }

  try {
    const globalRes = await withTimeout("https://api.coingecko.com/api/v3/global");
    if (globalRes.ok) {
      const globalJson = await globalRes.json();
      next.btc_dominance = {
        value:
          toNum(globalJson?.data?.market_cap_percentage?.btc) ??
          next.btc_dominance.value ??
          null,
      };
    }
  } catch {
    // keep previous values
  }

  try {
    const fgRes = await withTimeout("https://api.alternative.me/fng/?limit=1&format=json");
    if (fgRes.ok) {
      const fgJson = await fgRes.json();
      const row = fgJson?.data?.[0];
      const value = toNum(row?.value);
      next.fear_greed = {
        value: value ?? next.fear_greed.value ?? null,
        label: String(row?.value_classification || next.fear_greed.label || "n/a"),
      };
    }
  } catch {
    // keep previous values
  }

  fs.mkdirSync(path.dirname(dataOut), { recursive: true });
  fs.mkdirSync(path.dirname(publicOut), { recursive: true });
  next.sol = {
    price: toNum(next?.sol?.price),
    change_24h: toNum(next?.sol?.change_24h),
    change_7d: toNum(next?.sol?.change_7d),
    change_prev_week_utc: toNum(next?.sol?.change_prev_week_utc),
  };
  fs.writeFileSync(dataOut, JSON.stringify(next, null, 2), "utf-8");
  fs.writeFileSync(rootOut, JSON.stringify(next, null, 2), "utf-8");
  fs.writeFileSync(publicOut, JSON.stringify(next, null, 2), "utf-8");

  console.log(`Saved market context -> ${dataOut}`);
};

main().catch((err) => {
  console.error("market:build failed:", err?.message || err);
  process.exit(1);
});
