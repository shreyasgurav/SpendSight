# DevLog

## Day 1 - 2025-05-07

**Hours worked:** 3

**What I did:** Read the full assignment PDF carefully, twice. Set up the project from scratch: Next.js with App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui. Created a Supabase project and wrote the database schema (audits and leads tables with RLS policies). Built the landing page with hero section, how-it-works steps, features grid, FAQ, and a bottom CTA. Set up environment variables and the .env.example file. Created all 13 required markdown files as placeholders. Deployed to Vercel to get a live URL from day one.

**What I learned:** The assignment is structured so that the entrepreneurial files (GTM, economics, user interviews) carry as much weight as the code. That changes how I plan the week. I also learned that Next.js 16 uses Tailwind v4 by default now, which has a different setup from v3. The shadcn/ui init handled it smoothly though.

**Blockers / what I'm stuck on:** Need to set up Supabase RLS policies correctly. Also need to decide whether to use a multi-step form wizard or a single-page form for the audit input. Leaning toward single-page for simplicity.

**Plan for tomorrow:** Build the full spend input form with all 8 tools, plan selectors, seat count, and localStorage persistence. Write lib/pricing-data.ts with verified pricing from every vendor.
