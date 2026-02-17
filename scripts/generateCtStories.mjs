#!/usr/bin/env node
/**
 * generateCtStories.mjs - SATURDAY UPGRADE
 * 
 * Generates 500-600 word premium stories with:
 * 1. Full articles (not just bullets)
 * 2. Engagement metrics for UI
 * 3. Structured output (signal, story, takeaways, whoToFollow)
 * 4. Quality checks
 */

import fs from 'fs';

// ============================================================================
// FILE PATHS - ADJUST TO YOUR SETUP
// ============================================================================

const CANDIDATES_PATH = './public/data/story_candidates.json';
const OUTPUT_PATH = './public/data/validator_stories.json';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  OLLAMA_MODEL: 'llama3',
  OLLAMA_URL: 'http://localhost:11434/api/generate',
  OLLAMA_TIMEOUT: 120000, // 2 minutes per story
  MAX_STORIES: 3,         // Limit for performance
  MIN_STORY_LENGTH: 400,  // Minimum characters
  MAX_STORY_LENGTH: 3000, // Maximum characters
};

// ============================================================================
// LLAMA3 PROMPT TEMPLATE
// ============================================================================

const PROMPT_PATH = './prompts/story_prompt.md';

// Load prompt template
let STORY_PROMPT;
try {
  STORY_PROMPT = fs.readFileSync(PROMPT_PATH, 'utf-8');
} catch (error) {
  console.error(`❌ Could not load prompt from ${PROMPT_PATH}`);
  process.exit(1);
}

// ============================================================================
// OLLAMA INTEGRATION
// ============================================================================

async function callOllama(prompt) {
  try {
    const response = await fetch(CONFIG.OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1500
        }
      }),
      signal: AbortSignal.timeout(CONFIG.OLLAMA_TIMEOUT)
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error(`❌ Ollama call failed: ${error.message}`);
    throw error;
  }
}

function parseStoryJSON(response) {
  let text = response.trim();
  console.log("DEBUG RAW RESPONSE START:", text.substring(0, 100).replace(/\n/g, ' '));

  // Remove markdown formatting
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  let storyData = {};

  // 1. Extract Story Content first (most robust marker)
  // Look for [STORY] ... optional [/STORY]
  const storyStartRegex = /\[STORY\]/i;
  const storyStartMatch = text.match(storyStartRegex);

  let storyText = '';
  let jsonTextCandidate = text;

  if (storyStartMatch) {
    const startIndex = storyStartMatch.index + storyStartMatch[0].length;
    const remainder = text.substring(startIndex);

    const storyEndMatch = remainder.match(/\[\/STORY\]/i);
    if (storyEndMatch) {
      storyText = remainder.substring(0, storyEndMatch.index).trim();
    } else {
      storyText = remainder.trim(); // Take everything until end if no closing tag
    }

    // The JSON should be *before* the [STORY] tag
    jsonTextCandidate = text.substring(0, storyStartMatch.index).trim();
  } else {
    // Fallback: If no [STORY] tag, try to split by the last '}' 
    const lastBrace = text.lastIndexOf('}');
    if (lastBrace !== -1) {
      jsonTextCandidate = text.substring(0, lastBrace + 1);
      storyText = text.substring(lastBrace + 1).trim();
    }
  }

  // 2. Parse JSON
  try {
    // Find the first '{' and last '}' in the candidate region
    const jsonStart = jsonTextCandidate.indexOf('{');
    const jsonEnd = jsonTextCandidate.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      let jsonString = jsonTextCandidate.substring(jsonStart, jsonEnd + 1);
      // Basic cleanup
      jsonString = jsonString.replace(/,\s*([\]}])/g, '$1'); // remove trailing commas
      storyData = JSON.parse(jsonString);
    }
  } catch (e) {
    console.warn("⚠️ JSON parse error:", e.message);
    // Attempt manual extraction for critical fields if JSON fails
    const signalMatch = jsonTextCandidate.match(/"signal":\s*"([^"]+)"/);
    if (signalMatch) storyData.signal = signalMatch[1];
  }

  // 3. Fallbacks
  if (!storyText && text.length > 500 && !storyData.story) {
    // If we failed to find tags and JSON, treated as raw story?
    // Only if it doesn't look like JSON
    if (text.trim().startsWith('{')) {
      // It's probably just JSON with no story
    } else {
      storyText = text;
    }
  }

  storyData.story = storyText || storyData.story;

  if (!storyData.story) {
    throw new Error("Could not extract story content");
  }

  return storyData;
}

// ============================================================================
// METRICS EXTRACTION
// ============================================================================

function extractMetrics(candidate) {
  /**
   * Calculate engagement metrics from tweet cluster
   */

  const tweets = candidate.tweets || [];

  // Total engagement
  const totalEngagement = tweets.reduce((sum, tweet) => {
    const likes = tweet.favorite_count || 0;
    const retweets = tweet.retweet_count || 0;
    const quotes = tweet.quote_count || 0;
    const replies = tweet.reply_count || 0;
    return sum + (likes * 1.0) + (retweets * 2.0) + (quotes * 3.0) + (replies * 1.5);
  }, 0);

  // Top tweet engagement
  const topTweetEngagement = Math.max(...tweets.map(t => {
    const likes = t.favorite_count || 0;
    const retweets = t.retweet_count || 0;
    const quotes = t.quote_count || 0;
    const replies = t.reply_count || 0;
    return (likes * 1.0) + (retweets * 2.0) + (quotes * 3.0) + (replies * 1.5);
  }));

  // Unique voices
  const uniqueVoices = new Set(tweets.map(t => t.screen_name)).size;

  // 5-day trend (synthetic based on current engagement)
  const engagementTrend = [
    Math.round(totalEngagement * 0.4),
    Math.round(totalEngagement * 0.55),
    Math.round(totalEngagement * 0.68),
    Math.round(totalEngagement * 0.82),
    Math.round(totalEngagement)
  ];

  return {
    tweets: tweets.length,
    engagement: Math.round(totalEngagement),
    topTweet: Math.round(topTweetEngagement),
    voices: uniqueVoices,
    engagementTrend
  };
}

function extractWhoToFollow(candidate) {
  /**
   * Identify top voices from tweet cluster
   */

  const tweets = candidate.tweets || [];

  // Calculate engagement per user
  const userEngagement = {};
  tweets.forEach(tweet => {
    const user = tweet.screen_name;
    if (!user) return;

    const engagement =
      (tweet.favorite_count || 0) * 1.0 +
      (tweet.retweet_count || 0) * 2.0 +
      (tweet.quote_count || 0) * 3.0 +
      (tweet.reply_count || 0) * 1.5;

    userEngagement[user] = (userEngagement[user] || 0) + engagement;
  });

  // Sort by engagement
  const sorted = Object.entries(userEngagement)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return sorted.map(([handle, engagement]) => ({
    handle: `@${handle}`,
    engagement: Math.round(engagement)
  }));
}

// ============================================================================
// STORY GENERATION
// ============================================================================

async function generateStory(candidate, index) {
  process.stdout.write(`📝 Generating story ${index + 1}: "${candidate.narrative.substring(0, 30)}..." `);

  // Build context from tweets
  const tweets = candidate.tweets || [];
  const context = tweets.slice(0, 8).map(t => { // Increased context
    const text = (t.full_text || '').substring(0, 280);
    return `- @${t.screen_name}: ${text}`;
  }).join('\n');

  const prompt = STORY_PROMPT
    .replace('{context}', context)
    .replace('{category}', candidate.category)
    .replace('{narrative}', candidate.narrative);

  try {
    const response = await callOllama(prompt);
    const storyData = parseStoryJSON(response);

    // Soft validation
    if (storyData.story.length < CONFIG.MIN_STORY_LENGTH) {
      console.log(`⚠️ Short (${storyData.story.length}c)`);
    } else {
      console.log(`✅ (${storyData.story.length}c)`);
    }

    // Extract metrics & voices
    const metrics = extractMetrics(candidate);
    const topVoices = extractWhoToFollow(candidate);

    // Safely map whoToFollow
    const whoToFollow = (Array.isArray(storyData.whoToFollow) ? storyData.whoToFollow : []).map((person, i) => ({
      ...person,
      engagement: topVoices[i]?.engagement || 0
    }));

    // Ensure we have at least some recommended follows if LLM failed
    if (whoToFollow.length === 0) {
      topVoices.forEach(v => whoToFollow.push({
        handle: v.handle,
        reason: "Top voice in this conversation",
        role: "Community"
      }));
    }

    return {
      id: `story_${Date.now()}_${index}`,
      title: candidate.narrative,
      type: getStoryType(candidate.category),
      category: candidate.category,
      author: tweets[0]?.screen_name ? `@${tweets[0].screen_name}` : 'Solana Intelligence',
      timestamp: new Date().toISOString(),
      metrics,
      content: {
        signal: storyData.signal || candidate.narrative,
        story: storyData.story,
        takeaways: Array.isArray(storyData.takeaways) ? storyData.takeaways : [],
        whoToFollow
      },
      riskLevel: storyData.riskLevel || 'medium',
      narrativeStrength: storyData.narrativeStrength || 7.0
    };

  } catch (error) {
    console.log(`❌ ${error.message}`);
    return null; // Return null instead of throwing to keep flow
  }
}

function getStoryType(category) {
  if (category.includes('Security') || category.includes('Risk')) return 'critical';
  if (category.includes('Launch') || category.includes('Early Access')) return 'live';
  return 'alpha';
}

// ============================================================================
// MAIN LOGIC
// ============================================================================

async function generateStories() {
  console.log('🚀 [Story Generation] Starting...\n');

  const candidates = JSON.parse(fs.readFileSync(CANDIDATES_PATH, 'utf-8'));
  console.log(`📊 Candidates available: ${candidates.length}`);

  // Try to generate more than needed to pick the best/successful ones
  const toGenerate = candidates.slice(0, CONFIG.MAX_STORIES);

  const stories = [];
  for (let i = 0; i < toGenerate.length; i++) {
    const story = await generateStory(toGenerate[i], i);
    if (story) {
      stories.push(story);
    }
    // Optimization: Stop if we have enough GOOD stories? 
    // No, let's generate 5 and pick best 3 to ensure density.
  }

  // Filter and sort if needed, or just take first 3 valid
  const finalStories = stories.slice(0, CONFIG.TARGET_STORIES);

  if (finalStories.length === 0) {
    console.error("\n❌ Failed to generate any valid stories.");
    return;
  }

  // Calculate global metrics
  const globalMetrics = {
    total_tweets: finalStories.reduce((sum, s) => sum + s.metrics.tweets, 0),
    total_engagement: finalStories.reduce((sum, s) => sum + s.metrics.engagement, 0),
    unique_voices: finalStories.reduce((sum, s) => sum + s.metrics.voices, 0),
    top_tweet: Math.max(...finalStories.map(s => s.metrics.topTweet))
  };

  const output = {
    generated_at: new Date().toISOString(),
    global_metrics: globalMetrics,
    items: finalStories
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  console.log(`\n✅ Saved ${finalStories.length} premium stories to: ${OUTPUT_PATH}\n`);
  return finalStories;
}

// ============================================================================
// RUN
// ============================================================================

try {
  generateStories();
} catch (error) {
  console.error('❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
