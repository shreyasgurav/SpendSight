# SpendSight — AI Spend Audit Tool

SpendSight is a free web app that helps startup founders and engineering managers audit their AI tool spend. Input your subscriptions, get an instant audit showing where you are overspending, what to switch to, and how much you could save monthly and annually.

Built as a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Live:** [https://spendsight.vercel.app](https://spendsight.vercel.app)

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your OpenAI, Supabase, and Resend keys

# Run locally
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

## Decisions

1. **Next.js App Router over Pages Router** — Server Components reduce client bundle size. API routes colocated in the same repo simplify deployment. App Router is the future of Next.js.

2. **Hardcoded audit rules over LLM-based analysis** — The audit engine uses explicit if/else logic, not AI. Financial recommendations must be deterministic and auditable. AI is used only for the summary paragraph where creativity adds value.

3. **localStorage for form persistence over server-side sessions** — No login required means no server session. localStorage provides instant form recovery on page reload without any backend dependency.

4. **Honeypot + rate limiting over CAPTCHA** — CAPTCHAs add friction for legitimate users. A hidden honeypot field catches bots silently, and IP-based rate limiting prevents abuse without hurting UX.

5. **nanoid for share slugs over UUIDs** — 8-character nanoid slugs are URL-friendly, shorter, and still collision-resistant enough for our scale. Makes shared links cleaner.

6. **OpenAI GPT-4o-mini over larger models** — For ~100-word summaries, GPT-4o-mini produces equivalent quality output at ~10x lower cost than GPT-4o. The fallback template ensures the feature works even without an API key.

## Tech Stack

- **Framework:** Next.js 16, App Router, TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **AI:** OpenAI GPT-4o-mini (for personalized summaries)
- **Testing:** Vitest (13 tests)
- **CI:** GitHub Actions (lint + test + build)
- **Deployment:** Vercel

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `OPENAI_API_KEY` — For AI summary generation (optional, falls back to template)
- `RESEND_API_KEY` — For transactional email (optional)
- `NEXT_PUBLIC_APP_URL` — Your deployment URL
