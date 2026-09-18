# RootQuest — SAT Vocab Game

Learn SAT vocabulary by mastering the **roots, prefixes and suffixes** words are built from.
301 words across 60 word-parts in 12 unlockable branches.

**How a round works** — up to 3 new words are introduced with a learn card (word, parts,
definition, example, synonyms), then 10 questions. Question types adapt to how well you know
each word:

- New / shaky words: **Define it**, **Fill the blank**, **Decode the parts**, **Root check**
- Solid words: **Words in context** (the SAT's "most nearly means" format), **Opposite**
  (with a synonym trap), **Type it** (recall from the definition)

**Spaced repetition** — each word gets a due date (1 → 2 → 5 → 12 days…) that stretches
when you're right and resets when you're wrong. The Review tab shows what's due, what keeps
slipping, and what's coming up.

**Progression** — XP, levels, daily streak, combos, a weekly XP goal and 17 badges. Each branch
unlocks when the previous one is 50% mastered.

**Accounts** — anyone can create an account with an email magic link (no password). Progress
syncs across devices; guest progress on a device merges into the account on first sign-in.

## Setup

```bash
npm install
cp .env.example .env    # add your Supabase URL + anon/publishable key
npm run dev
```

### Supabase (one time)

1. In the Supabase dashboard open **SQL Editor** and run `supabase/schema.sql`
   (creates the `progress` table with row-level security).
2. **Authentication → URL Configuration**: add your site URL (e.g. `https://your-app.vercel.app`
   and `http://localhost:5173`) to **Redirect URLs** so magic links land back in the app.
3. Magic links are on by default under **Authentication → Providers → Email**.

### Deploy to Vercel

Import the repo, framework preset **Vite**, and add the two environment variables from `.env.example`.

## Project layout

```
src/data/parts.js     roots, prefixes, suffixes; the 8 skill-tree families
src/data/words.js     merges words.js (F1–F8) + words2.js (F9–F12) + synonyms.js
src/data/synonyms.js  synonyms/antonyms per word (drive the context and opposite modes)
src/lib/game.js       mastery, unlock rules, levels, question generation
src/lib/progress.js   progress shape, local cache, merge + Supabase sync
src/components/       Welcome, Home (tree), Lesson, Play, Summary, Review, WordList, Profile
supabase/schema.sql   progress table + RLS policies
```

### Adding words

Append to `src/data/words2.js` with `r` set to an existing root and every id in `p` present in
the glossary in `parts.js`; keep the `___` blank in the sentence; add a `synonyms.js` entry
(first synonym is the "most nearly means" answer).
