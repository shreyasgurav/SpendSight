# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was a hydration mismatch between server and client rendering caused by localStorage. On the audit form page, I was reading localStorage in the initial render to restore the user's saved form state. This worked fine in development but Next.js server-renders the page first with no localStorage (it does not exist on the server), then the client hydrates with the saved data. React threw a hydration error because the server HTML had default values while the client had the restored values.

My first hypothesis was that the issue was with the Select component's default value, so I spent time looking at the shadcn Select source code. That was wrong. The issue was more fundamental. I then added console logs to trace exactly when the state was being set and realized the useState initializer was running synchronously during SSR with no localStorage available.

The fix was to add a `hydrated` boolean state that starts as false. The component renders a loading spinner until a useEffect sets it to true after reading from localStorage. This ensures the server render and the first client render both show the loading state, avoiding the mismatch. Only after hydration completes does the form render with restored data.

I also tried using the `use client` directive alone, hoping it would skip SSR. It does not. Client Components in Next.js App Router are still server-rendered for the initial HTML. The `use client` directive only means the component hydrates on the client, it does not prevent SSR.

## 2. A decision you reversed mid-week, and what made you reverse it

I originally planned to build the audit form as a multi-step wizard with three screens: (1) select tools, (2) configure each tool's plan and seats, (3) review and submit. I thought this would feel more guided and less overwhelming for users adding 4-5 tools.

I reversed this on day 3 after thinking about form completion rates. Multi-step forms have higher abandonment at each step. For tools like this where users already know what they want to enter, a single-page form with inline validation actually converts better. The wizard added complexity (state management across steps, back navigation, progress indicator) without clear UX benefit.

The single-page approach is simpler: all tools are visible, you can add/remove dynamically, the running total updates in real-time. Users who are comparing their AI spend already know what tools they use. They do not need to be walked through it step by step.

The reversal saved about 2 hours of UI code and made the codebase simpler. The audit form went from 3 components to 1 self-contained client component. Sometimes less abstraction is the right call.

## 3. What you would build in week 2 if you had it

First priority would be benchmark mode. Right now the tool tells you what you could save, but it does not tell you how your spend compares to similar companies. "Your AI spend per developer is $85/mo, companies your size average $62/mo" is a much more compelling message than just absolute savings. I would build this by collecting anonymized spend data from completed audits and computing percentile benchmarks by team size and use case.

Second would be an embeddable widget. A script tag that bloggers and newsletter writers could drop into their posts. It would render a compact version of the audit form inline. Every "Cursor vs Copilot 2025" blog post could embed our audit tool, driving organic traffic without any paid spend.

Third would be Slack integration. A /spendsight command that lets an engineering manager audit their team's spend without leaving Slack. Submit tool data in a thread, get results back inline.

Fourth would be historical tracking. Let teams re-run audits monthly and see a trend line. "Your AI spend went from $2,400/mo to $1,800/mo over 3 months." This turns a one-time tool into a recurring check-in.

## 4. How you used AI tools

I used Windsurf (Cascade) as my primary coding assistant throughout the build. For specific tasks:

I used it heavily for boilerplate generation: the initial project structure, shadcn component setup, API route scaffolding, and Supabase schema. These are mechanical tasks where AI saves time without risk. I also used it for writing the landing page JSX, where the structure is straightforward and the AI just needs to apply the design system correctly.

For the audit engine, I wrote the core logic myself and used AI for code review. The audit rules need to be defensible — I need to understand every line because I would have to explain it in an interview. Having AI generate financial logic and then trusting it blindly is exactly the kind of thing that gets flagged.

One specific time the AI was wrong: it generated a test expecting Cursor Pro at 1 seat to return "optimal" (no savings). In reality, the audit engine correctly identifies Windsurf Free as a cheaper alternative — a 100% savings. The AI assumed "cheapest paid plan = optimal" without checking cross-tool alternatives. I caught this because I ran the tests (they failed) and understood the engine logic well enough to see the test expectation was wrong, not the engine.

I did not trust AI with: pricing data verification (manually checked every vendor page), user interview content (those are real conversations), and the entrepreneurial markdown files (GTM strategy, economics, and metrics require genuine thinking, not templated output).

## 5. Self-ratings

- **Discipline: 7/10** — I started on day 1 and worked every day, but hours were not evenly distributed. Days 2 and 4 were heavy while day 5 was lighter. Could have been more consistent.

- **Code quality: 8/10** — TypeScript strict mode with no `any` types. Pure functions in the audit engine. Zod validation on all API inputs. Proper error handling with fallbacks. Room for improvement: some components could be broken into smaller pieces.

- **Design sense: 7/10** — Clean Vercel/Linear aesthetic with proper spacing, typography hierarchy, and color coding. But I am not a designer — a real designer would improve the visual hierarchy of the results cards.

- **Problem-solving: 8/10** — The hydration bug took systematic debugging. The audit engine handles edge cases well (team plans for solo users, redundant tools, API-direct pricing). I made reasonable assumptions where the assignment was ambiguous and documented them.

- **Entrepreneurial thinking: 7/10** — The GTM strategy is specific and actionable. The economics breakdown has real numbers. The user interviews surfaced genuine insights. But I could have gone deeper on the competitive landscape and the Credex-specific distribution advantage.
