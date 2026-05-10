# DevLog

## Day 1 - 2025-05-07

**Hours worked:** 3

**What I did:** Read the full assignment PDF carefully, twice. Set up the project from scratch: Next.js with App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui. Created a Supabase project and wrote the database schema (audits and leads tables with RLS policies). Built the landing page with hero section, how-it-works steps, features grid, FAQ, and a bottom CTA. Set up environment variables and the .env.example file. Created all 13 required markdown files as placeholders. Deployed to Vercel to get a live URL from day one.

**What I learned:** The assignment is structured so that the entrepreneurial files (GTM, economics, user interviews) carry as much weight as the code. That changes how I plan the week. I also learned that Next.js 16 uses Tailwind v4 by default now, which has a different setup from v3. The shadcn/ui init handled it smoothly though.

**Blockers / what I'm stuck on:** Need to set up Supabase RLS policies correctly. Also need to decide whether to use a multi-step form wizard or a single-page form for the audit input. Leaning toward single-page for simplicity.

**Plan for tomorrow:** Build the full spend input form with all 8 tools, plan selectors, seat count, and localStorage persistence. Write lib/pricing-data.ts with verified pricing from every vendor.

## Day 2 - 2025-05-08

**Hours worked:** 4

**What I did:** Built the complete spend input form with dynamic tool add/remove, plan selectors that populate based on tool selection, auto-calculated spend based on plan price times seats, and localStorage persistence so users don't lose their data on refresh. Created lib/pricing-data.ts with pricing for all 8 tools (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, OpenAI API) with plans and per-user prices. Built the audit engine with explicit if/else rules for plan downgrades, cheaper alternatives, and redundancy detection. Added a basic results page that shows the audit output.

**What I learned:** The hydration issue with localStorage in Next.js App Router is real. You can't read localStorage during SSR because it doesn't exist on the server. The fix is to render a loading state first, then hydrate from localStorage in a useEffect. Also learned that the Select component in shadcn/ui v4 passes null on clear, not undefined, so TypeScript types need to handle that.

**Blockers / what I'm stuck on:** Nothing major. The form works well. Need to verify all pricing data against vendor pages tomorrow and fill in PRICING_DATA.md with the source URLs.

**Plan for tomorrow:** Build the full results page with animated savings counter, per-tool cards with color coding, and the Credex CTA. Write tests for the audit engine.

## Day 3 - 2025-05-09

**Hours worked:** 3.5

**What I did:** Built the full results page with animated count-up savings display using requestAnimationFrame for smooth 60fps animation. Added color-coded cards for actionable recommendations vs already-optimized tools. Implemented confidence badges (high/medium/low) and type badges (downgrade/switch/redundant). Added share button that copies the URL to clipboard. Created a Credex CTA card that appears when savings are $500+/mo. Set up Vitest and wrote 13 unit tests for the audit engine covering downgrade detection, alternative tool suggestions, redundancy detection, and edge cases.

**What I learned:** The useCountUp hook needs to use requestAnimationFrame with easing for smooth animation. Also learned that the audit engine correctly prioritizes the highest savings option - if switching to a free tier saves more than downgrading to a cheaper plan, it recommends the switch. This is the right behavior but I had to update my tests to match.

**Blockers / what I'm stuck on:** None. The core audit flow is complete. Need to add Supabase persistence and AI summary generation tomorrow.

**Plan for tomorrow:** Integrate Supabase for audit persistence, add lead capture form, implement AI summary generation with OpenAI, and create shareable URLs that load from the database.
