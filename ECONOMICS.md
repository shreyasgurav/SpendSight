# Unit Economics

## What Is a Converted Lead Worth to Credex?

Credex sells discounted AI credits to startups. The average startup spending $1,000-3,000/mo on AI tools purchases credits in blocks.

Assumptions:
- Average first credit purchase: $3,000 (roughly 2-3 months of AI tool spend bought at discount)
- Credex margin on credits: 15-20% (buying surplus at 30-40% discount, selling at 15-20% discount)
- Average revenue per converted customer: $450-600 on first purchase
- Repeat purchase rate: 60% within 6 months
- Lifetime value (12 months): $450 x 2.2 purchases = ~$1,000

**Estimated LTV per converted customer: $1,000**

## Conversion Funnel

| Stage | Metric | Rate | Volume (per 100 audits) |
|-------|--------|------|------------------------|
| Audit completed | Baseline | 100% | 100 |
| Email captured | Audit -> Email | 20% | 20 |
| Consultation booked | Email -> Consult | 15% | 3 |
| Credit purchase | Consult -> Buy | 33% | 1 |

**Revenue per 100 audits:** 1 purchase x $450-600 = ~$500
**Revenue per 1,000 audits:** ~$5,000

These conversion rates are conservative. The tool pre-qualifies leads because only users with real AI spend reach the results page. High-savings audits (>$500/mo) get a stronger Credex CTA and should convert at 2-3x the average rate.

## Customer Acquisition Cost by Channel

| Channel | Effort (hours/week) | Audits/week | Emails captured | Cost per email | Cost per customer |
|---------|---------------------|-------------|-----------------|----------------|-------------------|
| Show HN | 2h (one post) | 50-100 (spike) | 10-20 | $0 (time only) | $0 |
| Reddit threads | 3h | 15-25 | 3-5 | $0 | $0 |
| LinkedIn cold DMs | 5h | 10-15 | 4-6 | $0 | $0 |
| Twitter replies | 2h | 5-10 | 1-2 | $0 | $0 |
| Product Hunt | 4h (one launch) | 30-50 (spike) | 6-10 | $0 | $0 |
| Credex sales outreach | 0h (existing flow) | 20-40 | 8-16 | $0 | $0 |

All channels are $0 paid spend. At a blended rate of $50/hour:
- Weekly effort: ~16 hours = $800
- Weekly audits (steady state): ~80
- Monthly emails: ~64
- Monthly customers: ~1
- CAC: $3,200/customer (at steady state, pre-product-market-fit)

This is too high. But launch spikes (HN, PH) and the Credex sales integration dramatically lower blended CAC to ~$800-1,200/customer, viable against $1,000 LTV if repeat rate holds.

## Path to $1M ARR

$1M ARR = ~$83,000/month in revenue.
At $450 revenue per customer: need 185 new customers per month.
At 1% audit-to-customer conversion: need 18,500 audits per month (~620/day).

What has to be true:
1. **Volume:** 600+ audits/day requires strong SEO or viral sharing.
2. **Conversion improvement:** At 2% conversion (better nurturing, in-app credit pricing), only need 310 audits/day.
3. **Higher ACV:** At $6,000 average (larger teams, annual contracts), only need ~14,000 audits/year.
4. **Organic compounding:** If 5% of users share results and each share drives 2 new audits, we get a 1.1x viral coefficient.

## Break-even

Fixed costs: hosting ($0 Vercel free tier), Supabase ($0 free tier), OpenAI API (~$0.001/audit), Resend ($0 free tier).

Variable cost per audit: ~$0.001 (OpenAI API).
Variable cost at 10,000 audits/month: ~$10.

The tool is essentially free to run. Break-even is immediate once any revenue comes through.
