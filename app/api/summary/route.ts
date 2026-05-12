/**
 * POST /api/summary
 * Generates an AI-powered personalized audit summary using OpenAI.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateAuditSummary } from '@/lib/openai'
import { logger } from '@/lib/logger'
import type { AuditSummary } from '@/lib/audit-engine'

const SummaryRequestSchema = z.object({
  auditData: z.object({
    results: z.array(z.any()),
    totalCurrentSpend: z.number(),
    totalProjectedSpend: z.number(),
    totalMonthlySavings: z.number(),
    totalAnnualSavings: z.number(),
    savingsCategory: z.enum(['optimal', 'low', 'medium', 'high']),
  }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = SummaryRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const summary = await generateAuditSummary(parsed.data.auditData as AuditSummary)

    return NextResponse.json({ summary })
  } catch (err) {
    logger.error('Summary API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
