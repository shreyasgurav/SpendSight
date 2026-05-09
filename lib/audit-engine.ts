/**
 * Audit engine - pure functions for analyzing AI tool spend.
 * No AI/LLM calls here - all logic is explicit if/else rules.
 */

import { TOOLS, type UseCase } from './pricing-data'

export interface ToolInput {
  toolKey: string
  planKey: string
  seats: number
  monthlySpend: number
  useCase: UseCase
  teamSize: number
}

export interface ToolAuditResult {
  tool: string
  toolName: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  projectedSpend: number
  monthlySavings: number
  annualSavings: number
  reasoning: string
  confidence: 'high' | 'medium' | 'low'
  type: 'optimal' | 'downgrade' | 'switch_plan' | 'switch_tool' | 'redundant'
  credexOpportunity: boolean
}

export interface AuditSummary {
  results: ToolAuditResult[]
  totalCurrentSpend: number
  totalProjectedSpend: number
  totalMonthlySavings: number
  totalAnnualSavings: number
  savingsCategory: 'optimal' | 'low' | 'medium' | 'high'
}

const ALTERNATIVE_TOOLS: Record<string, string[]> = {
  cursor: ['github_copilot', 'windsurf'],
  github_copilot: ['cursor', 'windsurf'],
  windsurf: ['cursor', 'github_copilot'],
  claude: ['chatgpt', 'gemini'],
  chatgpt: ['claude', 'gemini'],
  gemini: ['claude', 'chatgpt'],
}

const REDUNDANT_GROUPS = [
  ['cursor', 'github_copilot', 'windsurf'],
  ['claude', 'chatgpt'],
]

export function auditTool(input: ToolInput): ToolAuditResult {
  const tool = TOOLS[input.toolKey]
  if (!tool) {
    return {
      tool: input.toolKey,
      toolName: input.toolKey,
      currentPlan: input.planKey,
      currentSpend: input.monthlySpend,
      recommendedAction: 'Unknown tool',
      projectedSpend: input.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: 'This tool is not in our database.',
      confidence: 'low',
      type: 'optimal',
      credexOpportunity: false,
    }
  }

  const currentPlan = tool.plans[input.planKey]
  if (!currentPlan) {
    return {
      tool: input.toolKey,
      toolName: tool.name,
      currentPlan: input.planKey,
      currentSpend: input.monthlySpend,
      recommendedAction: 'Unknown plan',
      projectedSpend: input.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: 'This plan is not in our database.',
      confidence: 'low',
      type: 'optimal',
      credexOpportunity: false,
    }
  }

  let bestResult: ToolAuditResult | null = null

  // Check 1: Team plan with few users - downgrade to individual
  if (input.planKey === 'team' && input.seats <= 2) {
    const individualPlan = tool.plans['pro'] || tool.plans['plus']
    if (individualPlan && !individualPlan.isCustom && individualPlan.pricePerUser > 0) {
      const individualSpend = individualPlan.pricePerUser * input.seats
      if (individualSpend < input.monthlySpend) {
        const savings = input.monthlySpend - individualSpend
        bestResult = {
          tool: input.toolKey,
          toolName: tool.name,
          currentPlan: currentPlan.name,
          currentSpend: input.monthlySpend,
          recommendedAction: `Switch to ${individualPlan.name} plan (${input.seats} individual seat${input.seats > 1 ? 's' : ''}).`,
          projectedSpend: individualSpend,
          monthlySavings: savings,
          annualSavings: savings * 12,
          reasoning: `Team plan at $${input.monthlySpend}/mo is overkill for ${input.seats} user${input.seats > 1 ? 's' : ''}. Individual ${individualPlan.name} seats at $${individualPlan.pricePerUser}/user give you the same features.`,
          confidence: 'high',
          type: 'downgrade',
          credexOpportunity: input.monthlySpend > 50,
        }
      }
    }
  }

  // Check 2: Business plan for small team - downgrade to Pro
  if (input.planKey === 'business' && input.seats < 10) {
    const proPlan = tool.plans['pro']
    if (proPlan && !proPlan.isCustom && proPlan.pricePerUser > 0) {
      const proSpend = proPlan.pricePerUser * input.seats
      if (proSpend < input.monthlySpend) {
        const savings = input.monthlySpend - proSpend
        if (!bestResult || savings > bestResult.monthlySavings) {
          bestResult = {
            tool: input.toolKey,
            toolName: tool.name,
            currentPlan: currentPlan.name,
            currentSpend: input.monthlySpend,
            recommendedAction: `Switch to ${proPlan.name} plan.`,
            projectedSpend: proSpend,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning: `Business plan features like SSO and admin controls are rarely needed for teams under 10. Pro plan at $${proPlan.pricePerUser}/user covers most use cases.`,
            confidence: 'high',
            type: 'downgrade',
            credexOpportunity: input.monthlySpend > 50,
          }
        }
      }
    }
  }

  // Check 3: Cheaper alternative tool with 30%+ savings
  const alternatives = ALTERNATIVE_TOOLS[input.toolKey] || []
  for (const altKey of alternatives) {
    const altTool = TOOLS[altKey]
    if (!altTool) continue

    for (const [altPlanKey, altPlan] of Object.entries(altTool.plans)) {
      if (altPlan.isCustom) continue
      if (!altPlan.bestFor.includes(input.useCase)) continue

      const altSpend = altPlan.pricePerUser * input.seats
      const savingsPercent = (input.monthlySpend - altSpend) / input.monthlySpend

      if (savingsPercent >= 0.3 && altSpend < input.monthlySpend) {
        const savings = input.monthlySpend - altSpend
        if (!bestResult || savings > bestResult.monthlySavings) {
          bestResult = {
            tool: input.toolKey,
            toolName: tool.name,
            currentPlan: currentPlan.name,
            currentSpend: input.monthlySpend,
            recommendedAction: `Consider switching to ${altTool.name} ${altPlan.name}.`,
            projectedSpend: altSpend,
            monthlySavings: savings,
            annualSavings: savings * 12,
            reasoning: `${altTool.name} ${altPlan.name} at $${altPlan.pricePerUser}/user offers similar ${input.useCase} capabilities for ${Math.round(savingsPercent * 100)}% less.`,
            confidence: 'medium',
            type: 'switch_tool',
            credexOpportunity: input.monthlySpend > 50,
          }
        }
      }
    }
  }

  // If we found savings, return that
  if (bestResult) {
    return bestResult
  }

  // No savings found - optimal
  return {
    tool: input.toolKey,
    toolName: tool.name,
    currentPlan: currentPlan.name,
    currentSpend: input.monthlySpend,
    recommendedAction: 'Keep current plan.',
    projectedSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Your ${tool.name} ${currentPlan.name} plan is well-suited for your team size and use case.`,
    confidence: 'high',
    type: 'optimal',
    credexOpportunity: input.monthlySpend > 50,
  }
}

function detectRedundancy(inputs: ToolInput[]): Map<string, ToolAuditResult> {
  const redundantResults = new Map<string, ToolAuditResult>()
  const toolKeys = inputs.map((i) => i.toolKey)

  for (const group of REDUNDANT_GROUPS) {
    const presentTools = group.filter((t) => toolKeys.includes(t))
    if (presentTools.length < 2) continue

    // Find the most expensive one to flag as redundant
    let maxSpend = 0
    let redundantKey = ''
    for (const tk of presentTools) {
      const input = inputs.find((i) => i.toolKey === tk)
      if (input && input.monthlySpend > maxSpend) {
        maxSpend = input.monthlySpend
        redundantKey = tk
      }
    }

    if (redundantKey) {
      const input = inputs.find((i) => i.toolKey === redundantKey)!
      const tool = TOOLS[redundantKey]
      const otherTools = presentTools.filter((t) => t !== redundantKey).map((t) => TOOLS[t]?.name || t)

      redundantResults.set(redundantKey, {
        tool: redundantKey,
        toolName: tool?.name || redundantKey,
        currentPlan: input.planKey,
        currentSpend: input.monthlySpend,
        recommendedAction: `Consider dropping ${tool?.name || redundantKey} - you already have ${otherTools.join(' and ')}.`,
        projectedSpend: 0,
        monthlySavings: input.monthlySpend,
        annualSavings: input.monthlySpend * 12,
        reasoning: `Running both ${tool?.name} and ${otherTools.join('/')} for ${input.useCase} is redundant. Pick one and cancel the other.`,
        confidence: 'medium',
        type: 'redundant',
        credexOpportunity: false,
      })
    }
  }

  return redundantResults
}

export function auditAll(inputs: ToolInput[]): AuditSummary {
  const redundantMap = detectRedundancy(inputs)
  const results: ToolAuditResult[] = []

  for (const input of inputs) {
    if (redundantMap.has(input.toolKey)) {
      results.push(redundantMap.get(input.toolKey)!)
    } else {
      results.push(auditTool(input))
    }
  }

  const totalCurrentSpend = results.reduce((s, r) => s + r.currentSpend, 0)
  const totalProjectedSpend = results.reduce((s, r) => s + r.projectedSpend, 0)
  const totalMonthlySavings = results.reduce((s, r) => s + r.monthlySavings, 0)
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    results,
    totalCurrentSpend,
    totalProjectedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsCategory: categorizeSavings(totalMonthlySavings),
  }
}

export function getTotalSavings(results: Pick<ToolAuditResult, 'monthlySavings'>[]): {
  monthly: number
  annual: number
} {
  const monthly = results.reduce((s, r) => s + r.monthlySavings, 0)
  return { monthly, annual: monthly * 12 }
}

export function categorizeSavings(monthlySavings: number): 'optimal' | 'low' | 'medium' | 'high' {
  if (monthlySavings === 0) return 'optimal'
  if (monthlySavings < 100) return 'low'
  if (monthlySavings < 500) return 'medium'
  return 'high'
}
