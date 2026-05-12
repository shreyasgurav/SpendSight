/**
 * OpenAI wrapper for generating personalized audit summaries.
 * Falls back to a templated summary if the API is unavailable.
 */

import { logger } from './logger'
import type { AuditSummary } from './audit-engine'

const SYSTEM_PROMPT = `You are a concise financial advisor specializing in AI tool spend optimization for startups. Write like a CFO's assistant: specific, numbers-forward, no fluff. Never use markdown formatting. Keep it to exactly one paragraph, approximately 100 words. Be direct and actionable.`

function buildUserPrompt(audit: AuditSummary): string {
  const toolLines = audit.results
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}): currently $${r.currentSpend}/mo, recommended: ${r.recommendedAction} (saves $${r.monthlySavings}/mo)`
    )
    .join('\n')

  return `Write a personalized ~100-word summary paragraph for this AI spend audit. Be specific with numbers and recommendations.

Current total spend: $${audit.totalCurrentSpend}/mo
Potential savings: $${audit.totalMonthlySavings}/mo ($${audit.totalAnnualSavings}/year)
Savings category: ${audit.savingsCategory}

Tool breakdown:
${toolLines}

Write one conversational paragraph summarizing the key findings and top 1-2 actions they should take first. Address the reader as "you" / "your team".`
}

function buildFallbackSummary(audit: AuditSummary): string {
  const topSaving = audit.results
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]

  if (!topSaving || audit.totalMonthlySavings === 0) {
    return `Your AI tool stack looks well-optimized. Your current spend of $${audit.totalCurrentSpend}/mo is reasonable for your setup and we did not find significant savings opportunities. Keep monitoring as vendor pricing changes frequently.`
  }

  const credexNote =
    audit.savingsCategory === 'high'
      ? ` For savings of this size, Credex can help you capture additional discounts through bulk AI credits.`
      : ''

  return `Your team is spending $${audit.totalCurrentSpend}/mo on AI tools with $${audit.totalMonthlySavings}/mo ($${audit.totalAnnualSavings}/year) in potential savings. The biggest opportunity is ${topSaving.toolName}: ${topSaving.recommendedAction.toLowerCase()} This alone saves $${topSaving.monthlySavings}/mo. We recommend starting there and reviewing the remaining ${audit.results.filter((r) => r.monthlySavings > 0).length - 1} optimization${audit.results.filter((r) => r.monthlySavings > 0).length - 1 !== 1 ? 's' : ''} in order of impact.${credexNote}`
}

export async function generateAuditSummary(audit: AuditSummary): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    logger.info('OpenAI API key not configured, using fallback summary')
    return buildFallbackSummary(audit)
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(audit) },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      logger.error(`OpenAI API error: ${res.status}`)
      return buildFallbackSummary(audit)
    }

    const data = await res.json()
    const summary = data.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      return buildFallbackSummary(audit)
    }

    return summary
  } catch (err) {
    logger.error('OpenAI summary generation failed:', err)
    return buildFallbackSummary(audit)
  }
}

export { SYSTEM_PROMPT, buildUserPrompt, buildFallbackSummary }
