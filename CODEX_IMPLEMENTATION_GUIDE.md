# 🚀 CODEX IMPLEMENTATION GUIDE
## Saturday Changes: Story Generation + Magazine Premium UI

---

## 📋 IMPLEMENTATION PHASES

**Phase 1:** Backend Story Selection (30 min)  
**Phase 2:** Backend Story Generation (30 min)  
**Phase 3:** Frontend Magazine UI (45 min)  
**Phase 4:** Testing (15 min)

**Total time:** ~2 hours

---

## 📁 STEP 0: Files to Download from Your Repo

Before starting, download these files and have them ready:

```
/scripts/selectStoryClusters.mjs          (your current version)
/scripts/generateCtStories.mjs            (your current version)
/public/data/signals_raw.json             (your current tweet data)
/src/components/SeekerStory.jsx           (or whatever you call it)
package.json                               (to check dependencies)
```

**Upload these to Codex when prompted.**

---

# PHASE 1: BACKEND - STORY SELECTION

## 📝 CODEX PROMPT 1: Update Story Selection Script

**COPY THIS TO CODEX:**

```
I need to upgrade my story selection script to detect urgency, alpha signals, and new story categories.

Current file: scripts/selectStoryClusters.mjs

Reference implementation: /mnt/user-data/outputs/selectStoryClusters_UPGRADED.mjs

Changes needed:

1. ADD URGENCY DETECTION:
   - Time decay scoring (tweets < 6h = urgent)
   - Urgency signals: "too late", "closing soon", "limited", "manual verification"
   - Boost urgent stories by 1.5x

2. ADD NEW CATEGORIES with weights:
   - Alpha / Early Access: 2.0x (highest priority)
   - Security / Risk Alert: 1.9x
   - Product Launch / Live: 1.8x
   - DeFi Strategy / Alpha: 1.8x
   - Infrastructure / Tools: 1.7x
   - Investigative / Due Diligence: 1.7x

3. ADD SIGNAL DETECTION:
   - Alpha signals: "most people won't think of", "safer than buying"
   - Investigative: "I looked into", "mechanics breakdown"
   - Security: "🚨 BREAKING", "data breach", "hack"
   - Builder: "I built", "we shipped"
   - Launch: "just launched", "now live", "invite code:"

4. IMPROVE NARRATIVE EXTRACTION:
   - Extract specific narratives (e.g., "PayPal integrates Solana")
   - NOT generic categories (e.g., "Ecosystem Updates")
   - Use entities + actions to form narrative

5. ADD ENGAGEMENT WEIGHTING:
   - Retweets: 2.0x
   - Quotes: 3.0x
   - Replies: 1.5x
   - Likes: 1.0x

Please update my selectStoryClusters.mjs file with these improvements while maintaining my existing structure. Keep my file paths and export format.
```

**UPLOAD TO CODEX:**
- Your current `selectStoryClusters.mjs`
- Reference: `selectStoryClusters_UPGRADED.mjs` (from outputs folder)

**EXPECTED OUTPUT:**
Updated `selectStoryClusters.mjs` with all improvements

---

## 📝 CODEX PROMPT 2: Add Metrics Extraction

**COPY THIS TO CODEX:**

```
I need to add metrics extraction to my story generation pipeline.

Create a new file: scripts/extractStoryMetrics.mjs

Based on reference: /mnt/user-data/outputs/extract_story_metrics.py

This script should:

1. ANALYZE TWEET CLUSTER and extract:
   - Total tweets in cluster
   - Total engagement (sum of likes + RTs + quotes + replies)
   - Top tweet engagement (max in cluster)
   - Unique voices (count of unique users)
   - 5-day engagement trend (if timestamps available)

2. CALCULATE ENGAGEMENT SCORE:
   engagement = (likes × 1.0) + (retweets × 2.0) + (quotes × 3.0) + (replies × 1.5)

3. IDENTIFY TOP VOICES:
   - Top 3 users by total engagement
   - Include their total engagement and tweet count

4. OUTPUT FORMAT:
```json
{
  "metrics": {
    "tweets": 15,
    "engagement": 4200,
    "topTweet": 1204,
    "voices": 8,
    "engagementTrend": [1680, 2310, 2856, 3444, 4200]
  },
  "topVoices": [
    {
      "handle": "@solana_daily",
      "totalEngagement": 3663,
      "tweetCount": 19
    }
  ]
}
```

Make it importable and integrate with my existing pipeline.
```

**UPLOAD TO CODEX:**
- Reference: `extract_story_metrics.py` (from outputs folder)
- Your `signals_raw.json` (so it knows the data structure)

**EXPECTED OUTPUT:**
New `extractStoryMetrics.mjs` file

---

# PHASE 2: BACKEND - STORY GENERATION

## 📝 CODEX PROMPT 3: Update Story Generation Script

**COPY THIS TO CODEX:**

```
I need to upgrade my story generation script to create full 500-word articles with structured output.

Current file: scripts/generateCtStories.mjs

Reference implementation: /mnt/user-data/outputs/generateCtStories_UPGRADED.mjs

Changes needed:

1. LOAD NEW LLAMA3 PROMPT:
   Create prompts/llama3_full_story.txt
   Copy content from: /mnt/user-data/outputs/LLAMA3_FULL_STORY_PROMPT.md

2. ADD FULL STORY GENERATION:
   - 500-600 word articles (not just bullet points)
   - 6 paragraph structure: Hook → Context → Seeker angle → Watch → Risks → Conclusion
   - Include metrics from extractStoryMetrics.mjs

3. STRUCTURED OUTPUT:
```json
{
  "id": "story_001",
  "title": "Specific narrative title",
  "type": "critical" | "live" | "alpha",
  "category": "Security Alert" | "Product Launch" | etc,
  "author": "@source_handle",
  "timestamp": "2026-02-13T18:30:00Z",
  
  "metrics": {
    "tweets": 15,
    "engagement": 4200,
    "topTweet": 1204,
    "voices": 8,
    "engagementTrend": [1680, 2310, 2856, 3444, 4200]
  },
  
  "content": {
    "signal": "One-sentence hook",
    "story": "Full 500-600 word article with \\n\\n for paragraphs",
    "takeaways": ["Action 1", "Action 2", "Action 3"],
    "whoToFollow": [
      {
        "handle": "@user",
        "reason": "Why follow",
        "role": "Community" | "Official" | "Builder",
        "engagement": 1204
      }
    ]
  },
  
  "riskLevel": "low" | "medium" | "high",
  "narrativeStrength": 8.7
}
```

4. INTEGRATE METRICS:
   Import and use extractStoryMetrics.mjs to get engagement data
   Pass metrics to Llama3 prompt

5. QUALITY CHECKS:
   - Story must be 400-3000 characters
   - Must include specific numbers/names
   - No banned phrases: "buckle up", "LFG", "tape is two-way"

Please update generateCtStories.mjs to generate these full stories.
```

**UPLOAD TO CODEX:**
- Your current `generateCtStories.mjs`
- Reference: `generateCtStories_UPGRADED.mjs` (from outputs)
- Reference: `LLAMA3_FULL_STORY_PROMPT.md` (from outputs)
- Your `extractStoryMetrics.mjs` (from prompt 2)

**EXPECTED OUTPUT:**
- Updated `generateCtStories.mjs`
- New `prompts/llama3_full_story.txt`

---

# PHASE 3: FRONTEND - MAGAZINE UI

## 📝 CODEX PROMPT 4: Create Magazine Premium Component

**COPY THIS TO CODEX:**

```
I need to create a Magazine Premium UI component for displaying AI-generated stories.

Reference design: /mnt/user-data/outputs/magazine-premium-refined.jsx

Create a new component (or update existing): src/components/MagazinePremiumStory.jsx

REQUIREMENTS:

1. TWO-SCREEN EXPERIENCE:
   - Screen 1: Magazine Cover (story catalog)
   - Screen 2: Story Detail (full article)

2. MAGAZINE COVER MUST INCLUDE:
   - Header: VALIDATOR branding + Issue #47 + date
   - Global engagement stats (4-column grid):
     * Tweets Analyzed: 148
     * Total Engagement: 18.2K
     * Unique Voices: 26
     * Top Tweet: 1,482
   - Lead story (full width) with:
     * Category badge (red for critical, violet for live, emerald for alpha)
     * Large title
     * Story-specific metrics (3-column grid)
     * Preview text
     * "Read Full Analysis" button
   - Featured stories grid (2 columns)
   - AI disclosure (subtle, bottom)

3. STORY DETAIL PAGE MUST INCLUDE:
   - Back button
   - Story title + category badge
   - Story Intelligence card (4-column metrics grid)
   - 5-day engagement trend chart (visual bars)
   - "The Signal" card (one-sentence hook)
   - Full story (500-600 words with paragraphs)
   - Key Takeaways (numbered 1, 2, 3)
   - Who To Follow (with roles and engagement)
   - AI disclosure (full, at end)

4. DATA STRUCTURE:
Load from: public/data/validator_stories.json
Expected format:
```json
{
  "generated_at": "2026-02-13T18:30:00Z",
  "global_metrics": {
    "total_tweets": 148,
    "total_engagement": 18202,
    "unique_voices": 26,
    "top_tweet": 1482
  },
  "stories": [
    {
      "id": "story_001",
      "title": "...",
      "type": "critical" | "live" | "alpha",
      "category": "...",
      "metrics": {
        "tweets": 15,
        "engagement": 4200,
        "topTweet": 1204,
        "voices": 8,
        "engagementTrend": [1680, 2310, 2856, 3444, 4200]
      },
      "content": {
        "signal": "...",
        "story": "...",
        "takeaways": [...],
        "whoToFollow": [...]
      }
    }
  ]
}
```

5. STYLING:
   - Use Tailwind CSS
   - Dark theme (bg-black, zinc colors)
   - Emerald accent for primary
   - Red for critical, violet for time-sensitive
   - Proper grid layouts (grid grid-cols-4, not flex)
   - Consistent spacing

6. ICONS:
   Import from lucide-react:
   - MessageCircle (tweets)
   - TrendingUp (engagement)
   - Users (voices)
   - Activity (top tweet)
   - Shield (critical)
   - Rocket (live)
   - Brain (alpha)

Please create the complete component with both screens.
```

**UPLOAD TO CODEX:**
- Reference: `magazine-premium-refined.jsx` (from outputs)
- Your current story component (if exists)
- Example data: `story_metrics.json` (from outputs)

**EXPECTED OUTPUT:**
Complete `MagazinePremiumStory.jsx` component

---

## 📝 CODEX PROMPT 5: Update Story Output Format

**COPY THIS TO CODEX:**

```
I need to update my story generation script to output the correct format for the Magazine Premium UI.

Update: scripts/generateCtStories.mjs

Changes needed:

1. OUTPUT TO: public/data/validator_stories.json

2. INCLUDE GLOBAL METRICS:
```json
{
  "generated_at": "2026-02-13T18:30:00Z",
  "global_metrics": {
    "total_tweets": 148,
    "total_engagement": 18202,
    "unique_voices": 26,
    "top_tweet": 1482
  },
  "stories": [...]
}
```

3. CALCULATE GLOBAL METRICS:
   - total_tweets: Sum of all story metrics.tweets
   - total_engagement: Sum of all story metrics.engagement
   - unique_voices: Count of unique users across all stories
   - top_tweet: Max topTweet across all stories

4. FORMAT EACH STORY:
   Use the structure from Phase 2, Prompt 3

5. SAVE TO FILE:
   fs.writeFileSync('public/data/validator_stories.json', JSON.stringify(output, null, 2))

Make sure the output matches what MagazinePremiumStory.jsx expects.
```

**UPLOAD TO CODEX:**
- Your updated `generateCtStories.mjs` (from prompt 3)
- Reference: `magazine-premium-refined.jsx` (shows expected data structure)

**EXPECTED OUTPUT:**
Updated `generateCtStories.mjs` with correct output format

---

# PHASE 4: TESTING

## 📝 CODEX PROMPT 6: Create Test Script

**COPY THIS TO CODEX:**

```
Create a test script to verify the full pipeline works.

Create: scripts/test_story_pipeline.mjs

This script should:

1. RUN THE PIPELINE:
   - Import and run selectStoryClusters.mjs
   - Import and run extractStoryMetrics.mjs
   - Import and run generateCtStories.mjs

2. VERIFY OUTPUT:
   - Check validator_stories.json exists
   - Verify global_metrics are present
   - Verify each story has all required fields
   - Check story length (400-3000 chars)
   - Verify engagement metrics are numbers

3. PRINT SUMMARY:
   - Number of stories generated
   - Categories detected
   - Total engagement
   - Any warnings or errors

4. EXAMPLE OUTPUT:
```
✅ Story pipeline test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Generated 3 stories
✓ Global metrics: 148 tweets, 18.2K engagement
✓ Categories: Critical Alert, Product Launch, DeFi Strategy
✓ All stories have required fields
✓ Story lengths: 542, 618, 489 words
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Make it easy to run: npm run test:stories
```

**UPLOAD TO CODEX:**
- Your `package.json`
- All updated scripts from previous prompts

**EXPECTED OUTPUT:**
- New `test_story_pipeline.mjs`
- Updated `package.json` with test script

---

# DEPLOYMENT CHECKLIST

After Codex generates all files:

## Backend Files to Review:
- [ ] `scripts/selectStoryClusters.mjs` (urgency detection added)
- [ ] `scripts/extractStoryMetrics.mjs` (new file - metrics calculation)
- [ ] `scripts/generateCtStories.mjs` (full story generation)
- [ ] `prompts/llama3_full_story.txt` (new file - Llama3 prompt)
- [ ] `scripts/test_story_pipeline.mjs` (new file - testing)

## Frontend Files to Review:
- [ ] `src/components/MagazinePremiumStory.jsx` (new component)
- [ ] Route/integration into your app

## Configuration:
- [ ] `package.json` (test script added)
- [ ] Verify Ollama is installed and llama3 model available

## Testing:
```bash
# 1. Test story generation
npm run test:stories

# 2. Check output
cat public/data/validator_stories.json

# 3. Start dev server
npm run dev

# 4. Navigate to /stories (or wherever you mounted the component)
```

---

# TROUBLESHOOTING

## If Codex asks for clarification:

**Q: "What model of Llama should I use?"**  
A: Use llama3 via Ollama. Model string: "llama3"

**Q: "How should I handle errors?"**  
A: Wrap Ollama calls in try-catch. Log errors but don't crash. Return fallback data if generation fails.

**Q: "Should I use TypeScript?"**  
A: No, use JavaScript (.mjs files for scripts, .jsx for components)

**Q: "What about authentication?"**  
A: Stories are already behind Seeker gate. No additional auth needed.

**Q: "How should engagement trend work if I don't have historical data?"**  
A: Generate synthetic trend based on current engagement. Example: [current * 0.4, current * 0.55, current * 0.68, current * 0.82, current]

---

# QUICK REFERENCE

## File Locations:
```
/scripts/
  ├── selectStoryClusters.mjs       (upgrade)
  ├── extractStoryMetrics.mjs       (new)
  ├── generateCtStories.mjs         (upgrade)
  └── test_story_pipeline.mjs       (new)

/prompts/
  └── llama3_full_story.txt         (new)

/public/data/
  └── validator_stories.json        (output)

/src/components/
  └── MagazinePremiumStory.jsx      (new)
```

## npm Scripts to Add:
```json
{
  "scripts": {
    "stories:select": "node scripts/selectStoryClusters.mjs",
    "stories:generate": "node scripts/generateCtStories.mjs",
    "test:stories": "node scripts/test_story_pipeline.mjs"
  }
}
```

---

# SUMMARY

**6 Codex prompts = Complete implementation**

1. ✅ Upgrade story selection (urgency, categories)
2. ✅ Add metrics extraction
3. ✅ Upgrade story generation (500-word articles)
4. ✅ Create Magazine Premium UI
5. ✅ Update output format
6. ✅ Create test script

**Total time:** ~2 hours  
**Complexity:** Medium (Codex handles heavy lifting)  
**Result:** Premium story generation + Magazine UI

---

Good luck! Let me know if Codex needs clarification on anything. 🚀
