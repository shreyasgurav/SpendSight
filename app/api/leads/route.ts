/**
 * POST /api/leads
 * Captures email leads after audit value is shown.
 * Includes honeypot field and basic rate limiting.
 */

import { NextResponse } from 'next/server'
import { LeadCaptureSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

// Simple in-memory rate limiting (resets on redeploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = LeadCaptureSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Honeypot check — if the hidden field has content, it is a bot
    if (parsed.data.honeypot) {
      // Return success to not tip off the bot
      return NextResponse.json({ success: true })
    }

    const { email, companyName, role, teamSize } = parsed.data

    // Try storing in Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import('@/lib/supabase')
        await supabase.from('leads').insert({
          email,
          company_name: companyName || null,
          role: role || null,
          team_size: teamSize || null,
        })
      } catch (dbErr) {
        logger.error('Supabase lead insert error:', dbErr)
      }
    }

    // Try sending confirmation email via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'SpendSight <noreply@credex.rocks>',
            to: email,
            subject: 'Your SpendSight AI Spend Audit',
            html: `<p>Thanks for using SpendSight! Your audit results are saved.</p><p>If you found significant savings, the Credex team can help you capture them through discounted AI credits.</p><p>— SpendSight by Credex</p>`,
          }),
        })
      } catch (emailErr) {
        logger.error('Resend email error:', emailErr)
      }
    }

    logger.info(`Lead captured: ${email}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('Leads API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
