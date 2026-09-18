# RootQuest — SAT Vocab Game

Learn SAT vocabulary by mastering the **roots, prefixes and suffixes** words are built from.
181 words across 40 word-parts, organized as an unlockable skill tree.

**Modes** (mixed into every 10-question round)

- **Define it** — pick the meaning of a word
- **Fill the blank** — SAT-style sentence completion
- **Decode the parts** — see the parts (`circum` + `spec`) and name the word they build
- **Root check** — what does the highlighted root mean?

**Progression** — XP, levels with titles, daily streak, combo bonuses. Each branch of the tree
unlocks when the previous branch is 50% mastered. Tap any root to study it and its words.

**Sync** — progress is always saved on the device; sign in with an email magic link (Supabase)
to sync across phone and laptop.

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
src/data/words.js     181 words: definition, part breakdown, SAT-style sentence
src/lib/game.js       mastery, unlock rules, levels, question generation
src/lib/progress.js   progress shape, local cache, merge + Supabase sync
src/components/       Home (tree), Lesson, Play, Summary, Account
supabase/schema.sql   progress table + RLS policies
```

### Adding words

Append to `src/data/words.js` with `r` set to an existing root and every id in `p` present in
the glossary in `parts.js`. Keep the `___` blank in the sentence.
