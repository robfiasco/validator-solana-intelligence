# 🔧 CODEX TROUBLESHOOTING GUIDE

## Common Issues & Quick Fixes

---

## 🚨 ISSUE 1: Codex Generates TypeScript Instead of JavaScript

**Symptoms:**
```typescript
import type { Story } from './types';
interface StoryMetrics { ... }
```

**Fix:**
Add to your prompt:
```
IMPORTANT: Use JavaScript (.mjs for scripts, .jsx for React). 
NO TypeScript. NO type annotations. NO interfaces.
```

---

## 🚨 ISSUE 2: Codex Forgets to Import Dependencies

**Symptoms:**
```javascript
// File uses 'fs' but no import
fs.readFileSync(...)  // Error: fs is not defined
```

**Fix:**
Tell Codex:
```
Make sure to include ALL imports at the top:
- import fs from 'fs';
- import path from 'path';
- etc.
```

---

## 🚨 ISSUE 3: Wrong File Paths

**Symptoms:**
```javascript
const data = fs.readFileSync('./data/signals.json');
// Error: ENOENT: no such file or directory
```

**Fix:**
Specify exact paths in prompt:
```
Use these EXACT file paths:
- Input: ./public/data/signals_raw.json
- Output: ./public/data/validator_stories.json
- Prompt: ./prompts/llama3_full_story.txt
```

---

## 🚨 ISSUE 4: Ollama Call Fails

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:11434
```

**Fixes:**

**Check 1:** Is Ollama running?
```bash
ollama list
# Should show llama3
```

**Check 2:** Start Ollama
```bash
ollama serve
```

**Check 3:** Pull model
```bash
ollama pull llama3
```

**Check 4:** Update your code
```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3',
    prompt: yourPrompt,
    stream: false
  })
});
```

---

## 🚨 ISSUE 5: JSON Parse Error from Llama3

**Symptoms:**
```
SyntaxError: Unexpected token in JSON at position 0
```

**Root cause:**
Llama3 returned text before JSON or added markdown backticks

**Fix:**
Add this to your parsing code:
```javascript
function parseStoryJSON(response) {
  let text = response.response || response;
  
  // Remove markdown code blocks
  text = text.replace(/```json\n?/g, '');
  text = text.replace(/```\n?/g, '');
  
  // Extract JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  
  return JSON.parse(jsonMatch[0]);
}
```

---

## 🚨 ISSUE 6: Engagement Metrics Are Wrong

**Symptoms:**
```json
{
  "engagement": NaN,
  "topTweet": undefined
}
```

**Fix:**
Check your calculation:
```javascript
function calculateEngagement(tweet) {
  // Use || 0 to handle missing fields
  const likes = tweet.favorite_count || 0;
  const retweets = tweet.retweet_count || 0;
  const quotes = tweet.quote_count || 0;
  const replies = tweet.reply_count || 0;
  
  return (likes * 1.0) + (retweets * 2.0) + (quotes * 3.0) + (replies * 1.5);
}
```

---

## 🚨 ISSUE 7: UI Component Won't Render

**Symptoms:**
```
Error: Cannot read property 'map' of undefined
```

**Fixes:**

**Check 1:** Data loading
```jsx
const [stories, setStories] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/data/validator_stories.json')
    .then(r => r.json())
    .then(data => {
      setStories(data.stories || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to load stories:', err);
      setLoading(false);
    });
}, []);

if (loading) return <div>Loading...</div>;
if (!stories.length) return <div>No stories available</div>;
```

**Check 2:** Data structure
```jsx
// Make sure you're accessing the right property
{stories.map(story => ...)}  // Not data.map(...)
```

---

## 🚨 ISSUE 8: Chart Not Rendering

**Symptoms:**
Empty space where chart should be

**Fixes:**

**Check 1:** Style object syntax
```jsx
// CORRECT
<div style={{height: `${value}%`}} />

// WRONG
<div style="height: 40%" />  // Missing curly braces
```

**Check 2:** Height container
```jsx
// Chart needs defined height
<div className="h-40 flex items-end">  // h-40 = 160px
  {/* bars */}
</div>
```

**Check 3:** Data format
```javascript
// Trend should be array of numbers
engagementTrend: [1680, 2310, 2856, 3444, 4200]

// NOT
engagementTrend: "1680,2310,2856"  // String won't work
```

---

## 🚨 ISSUE 9: Stories Are Too Generic

**Symptoms:**
```
Title: "Ecosystem Updates"
Title: "Token Launch Activity"
Title: "DeFi Developments"
```

**Fix:**
Update prompt to be more specific:
```
BAD TITLES:
❌ "Ecosystem Updates"
❌ "Token Launches"
❌ "DeFi Activity"

GOOD TITLES:
✅ "PayPal Integrates Solana as Default Blockchain"
✅ "Cash City Launches with Ponzi Mechanics"
✅ "LP SOL-USD1 Strategy Outperforms Buying Memecoins"

Generate SPECIFIC titles with entity names and actions.
```

---

## 🚨 ISSUE 10: AI Disclosure Not Showing

**Symptoms:**
Disclosure text missing from UI

**Fixes:**

**Check 1:** Component includes it
```jsx
{/* At bottom of story detail */}
<div className="pt-5 border-t border-zinc-800">
  <div className="bg-zinc-900/30 rounded-lg p-4">
    <p className="text-xs text-zinc-500">
      AI-Generated Analysis: This story was compiled by AI...
    </p>
  </div>
</div>
```

**Check 2:** Not accidentally hidden
```jsx
// Make sure no display:none or hidden class
className="..." // No 'hidden' in here
```

---

## 🚨 ISSUE 11: Module Import Error

**Symptoms:**
```
Error: Cannot find module 'lucide-react'
```

**Fix:**
Install missing packages:
```bash
npm install lucide-react
```

Or if using different icon library:
```
Tell Codex: "Don't use lucide-react. Use <YourIconLibrary> instead."
```

---

## 🚨 ISSUE 12: Stories Not Saving to File

**Symptoms:**
Script runs but `validator_stories.json` is empty or not created

**Fixes:**

**Check 1:** Directory exists
```javascript
import { mkdir } from 'fs/promises';

// Create directory if it doesn't exist
await mkdir('./public/data', { recursive: true });
```

**Check 2:** Write permissions
```bash
# Check if you can write to directory
touch public/data/test.txt
rm public/data/test.txt
```

**Check 3:** Proper JSON stringification
```javascript
// CORRECT
fs.writeFileSync(
  './public/data/validator_stories.json',
  JSON.stringify(data, null, 2)  // Pretty print with 2 spaces
);

// WRONG
fs.writeFileSync('validator_stories.json', data);  // Not stringified
```

---

## 🚨 ISSUE 13: Codex Won't Follow Instructions

**Symptoms:**
Codex keeps doing things its own way despite clear instructions

**Fixes:**

**Strategy 1:** Be MORE specific
```
BAD PROMPT:
"Update the story selection"

GOOD PROMPT:
"In scripts/selectStoryClusters.mjs, add a function called detectUrgency() 
that checks for these exact phrases: 'too late', 'closing soon'. 
Return a number between 0-10. Put this function on line 45."
```

**Strategy 2:** Show exact example
```
Create a function that looks EXACTLY like this:

function calculateEngagement(tweet) {
  return (tweet.likes * 1) + (tweet.retweets * 2);
}

Keep the same name, parameters, and logic.
```

**Strategy 3:** Upload reference file
Instead of describing, upload the reference file and say:
```
Make my file look like the reference file I uploaded, 
but keep my existing imports and exports.
```

---

## 🚨 ISSUE 14: Performance Issues

**Symptoms:**
Script takes forever to run or UI is slow

**Fixes:**

**Backend:**
```javascript
// Limit story generation
const MAX_STORIES = 3;  // Don't try to generate 50 stories

// Add timeout
const OLLAMA_TIMEOUT = 60000;  // 60 seconds max per story
```

**Frontend:**
```jsx
// Lazy load images
<img loading="lazy" src={...} />

// Virtualize long lists
import { FixedSizeList } from 'react-window';

// Memo expensive components
const StoryCard = React.memo(({ story }) => ...);
```

---

## 🚨 ISSUE 15: Alignment Issues in UI

**Symptoms:**
Numbers/text not perfectly aligned (like you saw in screenshots)

**Fixes:**

**Always use grid for columns:**
```jsx
// ✅ CORRECT
<div className="grid grid-cols-4 gap-3">
  <div className="text-center">...</div>
</div>

// ❌ WRONG
<div className="flex justify-between">
  <div>...</div>
</div>
```

**Consistent sizing:**
```jsx
// Icons: Same size in same section
<Icon className="w-4 h-4" />  // Not mixing w-3 and w-5

// Numbers: Same text size
<div className="text-2xl font-bold leading-none">

// Labels: Same size and leading
<div className="text-[10px] leading-tight">
```

---

## 📞 When to Come Back to Me

Come back if:

1. ❌ Tried 3 different prompts and Codex still doesn't get it
2. ❌ Getting errors you can't Google
3. ❌ Something fundamentally broken in architecture
4. ❌ Need clarification on design decisions
5. ❌ Want to add new features beyond Saturday scope

DON'T come back for:
1. ✅ Missing npm package (just install it)
2. ✅ Typo in file path (fix the path)
3. ✅ Codex using wrong syntax (tell Codex to fix)
4. ✅ Need to tweak colors/spacing (edit directly)

---

## 🎯 Quick Debug Checklist

When something breaks:

```
1. [ ] Read the error message carefully
2. [ ] Check file paths are correct
3. [ ] Verify imports at top of file
4. [ ] Console.log the data to see what you have
5. [ ] Check data structure matches what UI expects
6. [ ] Test each script individually
7. [ ] Look for typos in function names
8. [ ] Verify Ollama is running (backend)
9. [ ] Check browser console (frontend)
10. [ ] Review Codex output for obvious mistakes
```

---

## 💡 Pro Tips

**Tip 1:** Test incrementally
Don't write 500 lines then test. Test after every 50 lines.

**Tip 2:** Keep reference files open
Have the reference files open in another tab while reviewing Codex output.

**Tip 3:** Use console.log liberally
```javascript
console.log('📊 Metrics:', metrics);
console.log('🎯 Stories:', stories.length);
```

**Tip 4:** Git commit often
```bash
git commit -m "Added urgency detection"
git commit -m "Created metrics extraction"
# Easy to roll back if something breaks
```

**Tip 5:** Comment your config
```javascript
const CONFIG = {
  MAX_STORIES: 5,        // Limit for Ollama performance
  MIN_ENGAGEMENT: 100,   // Filter low-quality tweets
  OLLAMA_TIMEOUT: 60000  // 60s max per story
};
```

---

Good luck! 99% of issues can be fixed by reading the error and telling Codex to fix it. 🚀
