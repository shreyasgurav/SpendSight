# Metrics

## North Star Metric

**Audits completed per week.**

Not "visitors" or "signups" — audits completed. This is the moment the user gets value. Everything upstream (landing page, form UX, load time) exists to drive this number up, and everything downstream (lead capture, Credex CTA, sharing) depends on it.

Why not "leads captured" or "consultations booked"? Those are lagging indicators that depend on conversion rates we cannot fully control yet. Audits completed is the leading indicator we can directly influence through distribution, UX, and form completion rate. At this stage (pre-PMF, zero users), the priority is proving that people will complete an audit at all. Conversion optimization comes after we have volume.

A tool people use once a quarter (like a spend audit) should not be measured by DAU. Weekly cohorts are the right cadence — we want to see if new users are finding the tool each week, not whether the same users return daily.

## 3 Input Metrics That Drive the North Star

1. **Form completion rate** (started audit / completed audit). Currently unmeasured but target is >60%. If users start but do not finish, the form is too long or confusing. This is the highest-leverage metric because every percentage point increase directly increases completed audits at zero acquisition cost.

2. **Unique visitors to /audit** (weekly). This measures whether our distribution channels are working. If we post on HN and get 500 visitors but only 50 reach the audit page, the landing page is not converting. If 400 reach /audit but only 100 complete, the form needs work. Separating traffic from conversion tells us where to focus.

3. **Share rate** (audits shared / audits completed). This is the viral coefficient driver. If 5% of users share their results and each share brings 2 new visitors, we get organic growth. Measuring this tells us whether the results page is compelling enough to share and whether the share UX (copy link button, OG previews) is working.

## What I Would Instrument First

Add a single analytics event at form submission: `audit_completed` with properties `tool_count`, `total_spend`, `savings_found`, `savings_category`. This one event, tracked via PostHog or Vercel Analytics, gives us the North Star metric plus enough segmentation to understand which types of users find value (high spenders vs low, many tools vs few).

Second priority: track `share_clicked` and `lead_captured` events to measure the downstream funnel.

## What Number Triggers a Pivot Decision

If after 4 weeks of active distribution (HN post, Reddit, LinkedIn DMs, Product Hunt launch) we have fewer than 50 completed audits per week, the tool is not solving a problem people care about enough to spend 2 minutes on. At that point, pivot options are:

1. **Narrow the audience** — focus only on teams spending >$1,000/mo and make the tool more specific to their needs.
2. **Change the entry point** — instead of a standalone tool, embed the audit as a widget in AI tool comparison blog posts.
3. **Change the value prop** — maybe the audit is not compelling but a "benchmark your AI spend vs similar companies" framing is.
