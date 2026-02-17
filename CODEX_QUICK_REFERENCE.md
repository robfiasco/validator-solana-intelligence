# 🎯 QUICK REFERENCE CARD - Codex Implementation

## 📦 Files You Need from Outputs Folder

Upload these to Codex when prompted:

```
✅ BACKEND REFERENCES:
- selectStoryClusters_UPGRADED.mjs
- generateCtStories_UPGRADED.mjs
- extract_story_metrics.py
- LLAMA3_FULL_STORY_PROMPT.md

✅ FRONTEND REFERENCES:
- magazine-premium-refined.jsx
- story_metrics.json (example data)

✅ DOCUMENTATION:
- IMPLEMENTATION_GUIDE_FULL_STORIES.md
- TODO_SATURDAY_FEB_14.md
```

---

## 🔢 Implementation Order

**DO IN THIS ORDER:**

1. **Backend Story Selection** (Prompt 1 + 2)
2. **Backend Story Generation** (Prompt 3)
3. **Frontend UI** (Prompt 4 + 5)
4. **Testing** (Prompt 6)

**DON'T:** Try to do everything at once  
**DO:** One prompt at a time, test, then move on

---

## 📝 Codex Session Template

For each prompt:

```
1. COPY prompt from guide
2. UPLOAD reference files mentioned
3. UPLOAD your current file (if updating existing)
4. WAIT for Codex response
5. REVIEW generated code
6. TEST before moving to next prompt
```

---

## ⚠️ Common Codex Mistakes to Watch For

**❌ Codex might:**
- Forget to import dependencies
- Use TypeScript when you need JavaScript
- Mix up file paths
- Create files in wrong directory

**✅ How to fix:**
- Review imports carefully
- Specify ".mjs for scripts, .jsx for components"
- Double-check file paths in prompt
- Tell Codex exact directory structure

---

## 🎯 Success Criteria

After each prompt, verify:

**Prompt 1 (Story Selection):**
- [ ] File exports candidate stories
- [ ] Has urgency detection
- [ ] Has new categories
- [ ] Runs without errors

**Prompt 2 (Metrics):**
- [ ] Calculates engagement correctly
- [ ] Returns proper JSON
- [ ] Identifies top voices

**Prompt 3 (Story Generation):**
- [ ] Generates 500+ word stories
- [ ] Includes all fields (signal, story, takeaways)
- [ ] Calls Ollama correctly
- [ ] Parses JSON response

**Prompt 4 (Magazine UI):**
- [ ] Two screens (cover + detail)
- [ ] Loads data correctly
- [ ] Renders without errors
- [ ] Mobile responsive

**Prompt 5 (Output Format):**
- [ ] Saves to correct location
- [ ] Includes global_metrics
- [ ] Valid JSON format

**Prompt 6 (Testing):**
- [ ] Runs full pipeline
- [ ] Reports success/failure
- [ ] Easy to debug

---

## 🔧 Testing Commands

```bash
# After each backend change:
node scripts/selectStoryClusters.mjs
node scripts/extractStoryMetrics.mjs
node scripts/generateCtStories.mjs

# After frontend change:
npm run dev

# Full pipeline test:
npm run test:stories
```

---

## 🚨 If Something Breaks

**Codex generated bad code?**
1. Tell Codex the specific error
2. Upload error log
3. Ask it to fix

**Example:**
```
The code you generated has this error:

[paste error]

Please fix it. The file should import X from Y and export Z.
```

**Pipeline not working?**
1. Test each script individually
2. Find which one fails
3. Go back to that Codex prompt
4. Ask for fix

---

## 📊 Data Flow

```
signals_raw.json
       ↓
selectStoryClusters.mjs  → candidates
       ↓
extractStoryMetrics.mjs  → metrics
       ↓
generateCtStories.mjs    → Llama3 → stories
       ↓
validator_stories.json
       ↓
MagazinePremiumStory.jsx → UI
```

---

## 💾 Expected File Sizes

```
selectStoryClusters.mjs     ~300 lines
extractStoryMetrics.mjs     ~150 lines
generateCtStories.mjs       ~400 lines
llama3_full_story.txt       ~200 lines
MagazinePremiumStory.jsx    ~500 lines
validator_stories.json      ~5-20KB
```

If files are much larger/smaller, review carefully.

---

## 🎨 UI Color Reference

```
Critical:     red-500     #ef4444
Time-Sensitive: violet-500 #8b5cf6
Alpha:        emerald-500 #10b981
Builder:      blue-500    #3b82f6
Background:   black       #000000
Text Primary: white       #ffffff
Text Secondary: zinc-500  #71717a
```

---

## 📦 Required npm Packages

Make sure these are installed:

```json
{
  "dependencies": {
    "react": "^18.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x"
  }
}
```

If missing:
```bash
npm install lucide-react
```

---

## 🔑 Key Variables to Configure

In your scripts, you might need to update:

```javascript
// File paths
const SIGNALS_PATH = './public/data/signals_raw.json';
const OUTPUT_PATH = './public/data/validator_stories.json';

// Ollama config
const OLLAMA_MODEL = 'llama3';
const OLLAMA_TIMEOUT = 120000; // 2 minutes

// Story limits
const MAX_STORIES = 5;
const MIN_ENGAGEMENT = 100;
```

---

## ⏱️ Time Estimates

```
Prompt 1: 15 min (story selection)
Prompt 2: 10 min (metrics)
Prompt 3: 20 min (story generation)
Prompt 4: 30 min (UI component)
Prompt 5: 10 min (output format)
Prompt 6: 10 min (testing)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Testing:  15 min
Debugging: 30 min (buffer)
━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:    ~2.5 hours
```

---

## ✅ Final Checklist

Before considering it done:

- [ ] All 6 prompts completed
- [ ] Test script passes
- [ ] validator_stories.json has data
- [ ] UI renders on /stories route
- [ ] Magazine cover shows global stats
- [ ] Story detail page works
- [ ] Engagement charts render
- [ ] AI disclosure visible
- [ ] Mobile responsive
- [ ] No console errors

---

## 🆘 Emergency Contacts

If completely stuck:

1. Check `/mnt/user-data/outputs/IMPLEMENTATION_GUIDE_FULL_STORIES.md`
2. Review `/mnt/user-data/outputs/TODO_SATURDAY_FEB_14.md`
3. Look at example files in outputs folder
4. Come back to me with specific error

---

**Remember:** One prompt at a time. Test between each. You got this! 🚀
