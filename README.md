# Gossip — Solana Intelligence Terminal

![Gossip Signal Board Screenshot](./assets/signal-board.png)

**v1.0.8** · https://gossip-app-rob-fiasco.vercel.app · Android APK available in Releases

Gossip is a mobile-first intelligence terminal for the Solana ecosystem.

Instead of tracking hundreds of accounts across X (Twitter), Discord, and newsletters,
Gossip converts ecosystem signals into a simple daily briefing and deeper narrative analysis.

The app is designed for the Solana Mobile Seeker and uses token-gating
to unlock premium intelligence for Seeker holders.

---

## Demo

Demo video: [ADD DEMO VIDEO LINK]

Live preview: https://gossip-app-rob-fiasco.vercel.app
Android APK: https://github.com/robfiasco/gossip-app/releases

---

## Why Gossip Exists

The Solana ecosystem moves extremely fast.

Important information is scattered across X (Twitter), newsletters,
Discord posts, and research reports. Even experienced users struggle
to keep up with the volume of information.

Gossip aggregates these signals and converts them into structured,
readable intelligence so users can understand what is happening in the
ecosystem quickly.

---

## Features

- **Signal Board** — AI-generated weekly intelligence: market context, what people are talking about, why it matters, signal vs noise, glossary
- **Daily Briefing** — curated story feed from 10 RSS sources
- **Premium Stories** — full narrative analysis with timeline, key quotes, key players, and engagement chart; gated behind Seeker token verification
- **Live Market Ticker** — SOL price (24h/7d), market cap, Fear & Greed Index, BTC dominance, volume
- **FOCUS Mode** — distraction-free reading
- **Onboarding Carousel** — first-launch walkthrough
- **Story Notifications** — twice-daily local notifications at 7:30 AM and 7:30 PM (user's local time)
- **Wallet Connect / Disconnect** — MWA native flow on Android; modal on web

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Custom CSS (globals.css), dark-mode native |
| Native wrapper | Capacitor v8 (Android) |
| Wallet | `@solana-mobile/wallet-adapter-mobile` (MWA), Phantom, Solflare |
| Notifications | `@capacitor/local-notifications` |
| Data cache | Vercel KV (`@vercel/kv`) |
| Deployment | Vercel |

---

## Access Control

Premium intelligence is unlocked by verifying the Solana Seeker Genesis token.

```
SEEKER_GROUP = GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te
```

Verification checks Token-2022 and classic SPL token programs via the Solana RPC. A **Hackathon Judge Bypass** button is visible on the paywall for judges evaluating the app without a Seeker device.

---

## Project Structure

```
app/
  components/       React components
  lib/              Shared utilities (categories, KV, notifications)
  api/              Next.js API routes
  globals.css       All styles
  page.tsx          Main app shell
  error.tsx         Global error boundary

scripts/            Data pipeline scripts (Node/ESM)
data/               JSON fallbacks for API routes (pipeline output)
src/lib/            Shared TypeScript types and data loaders
android/            Capacitor Android project
public/             Static assets (icons, onboarding images)
```

---

## API Routes

| Route | Description | Cache |
|-------|-------------|-------|
| `/api/daily` | All daily data (signal board, briefing, stories, news cards) | Dynamic |
| `/api/market-prices` | Live SOL price, Fear & Greed, BTC.D | In-memory 5 min |
| `/api/market-context` | Cached market context narrative | 1 min revalidate |
| `/api/stories` | Seeker premium stories | 1 min revalidate |
| `/api/terminal` | Terminal/signal board data | 5 min revalidate |
| `/api/verify-seeker` | Token-gate verification endpoint | Dynamic |
| `/api/metrics` | Engagement metrics | 1 min revalidate |

All routes fall back to `data/*.json` if Vercel KV is unavailable.

---

## Data Sources

- **SOL price / 7d**: CoinGecko `/api/v3/coins/solana`
- **Global market**: CoinGecko `/api/v3/global`
- **Fear & Greed**: Alternative.me `/fng/?limit=1`
- **RSS feeds**: The Block, CoinDesk, Decrypt, Cointelegraph, Messari, Blockworks, Galaxy, VanEck, CryptoSlate, AMB Crypto

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_VERSION` | Auto-injected from `package.json` via `next.config.mjs` |
| `NEXT_PUBLIC_APP_URL` | Deployment URL (defaults to `https://gossip-app-rob-fiasco.vercel.app`) |
| `KV_REST_API_URL` | Vercel KV endpoint |
| `KV_REST_API_TOKEN` | Vercel KV auth token |

---

## Development

```bash
npm install
npm run dev        # Next.js dev server → http://localhost:3000
```

---

## Data Pipeline

The daily intelligence pipeline runs server-side and outputs to Vercel KV (with `data/` as local fallback):

```bash
npm run daily:run           # Full pipeline + KV sync
npm run daily:run:fast      # Skip story generation
npm run signal:build        # Rebuild signal board only
npm run briefing:build      # Rebuild daily briefing only
npm run articles:build      # Fetch + cache RSS articles
```

Individual pipeline steps in `scripts/` can be run independently. See `package.json` for all available commands.

---

## Android Build

Requires Android SDK and Gradle.

```bash
# Sync Capacitor config + web assets to Android project
npx cap sync android

# Build debug APK
cd android
./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/gossip-v{version}.apk
```

Install via ADB (USB debugging enabled):

```bash
~/Library/Android/sdk/platform-tools/adb install -r gossip-v1.0.8.apk
```

The Capacitor config (`capacitor.config.ts`) points the WebView at the Vercel production deployment. Any URL change requires a rebuild.

---

## Hackathon Submission

This project was built for the Solana Mobile Hackathon.

It demonstrates how mobile-native applications can deliver
high-signal ecosystem intelligence directly on the Solana Seeker device.

---

## Releases

APK releases are published to [GitHub Releases](https://github.com/robfiasco/gossip-app/releases) with changelogs. The app targets the Solana Seeker device (Android) but installs on any Android phone.
