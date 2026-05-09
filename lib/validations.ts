/**
 * Zod schemas for API input validation.
 */

import { z } from 'zod'

const UseCaseSchema = z.enum(['coding', 'writing', 'data', 'research', 'mixed'])

export const ToolInputSchema = z.object({
  toolKey: z.string().min(1),
  planKey: z.string().min(1),
  seats: z.number().int().min(1).max(10000),
  monthlySpend: z.number().min(0),
  useCase: UseCaseSchema.optional(),
  teamSize: z.number().int().min(1).max(10000).optional(),
})

export const AuditRequestSchema = z.object({
  tools: z.array(ToolInputSchema).min(1).max(20),
  teamSize: z.number().int().min(1).max(10000),
  useCase: UseCaseSchema,
})

export const LeadCaptureSchema = z.object({
  auditId: z.string().uuid().optional(),
  email: z.string().email(),
  companyName: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().int().min(1).max(10000).optional(),
  honeypot: z.string().max(0).optional(),
})

export const SummaryRequestSchema = z.object({
  auditId: z.string().uuid(),
})

export type ToolInputType = z.infer<typeof ToolInputSchema>
export type AuditRequestType = z.infer<typeof AuditRequestSchema>
export type LeadCaptureType = z.infer<typeof LeadCaptureSchema>
export type SummaryRequestType = z.infer<typeof SummaryRequestSchema>
