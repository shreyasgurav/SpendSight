/**
 * POST /api/audit
 * Runs the audit engine and returns results with a shareable slug.
 */

import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { AuditRequestSchema } from '@/lib/validations'
import { auditAll } from '@/lib/audit-engine'
import { logger } from '@/lib/logger'
import type { ToolInput } from '@/lib/audit-engine'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = AuditRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { tools, teamSize, useCase } = parsed.data

    // Build tool inputs with global team size and use case
    const toolInputs: ToolInput[] = tools.map((t) => ({
      ...t,
      teamSize: t.teamSize || teamSize,
      useCase: t.useCase || useCase,
    }))

    // Run the audit engine
    const auditSummary = auditAll(toolInputs)

    // Generate a share slug
    const shareSlug = nanoid(8)

    // Return audit results (Supabase storage will be added later)
    return NextResponse.json({
      ...auditSummary,
      shareSlug,
      auditId: null,
      stored: false,
    })
  } catch (err) {
    logger.error('Audit API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
