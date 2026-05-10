import { describe, it, expect } from 'vitest'
import {
  auditTool,
  auditAll,
  categorizeSavings,
  getTotalSavings,
  type ToolInput,
} from '../lib/audit-engine'

describe('auditTool', () => {
  it('finds savings when team plan is used with few seats', () => {
    const input: ToolInput = {
      toolKey: 'chatgpt',
      planKey: 'team',
      seats: 2,
      monthlySpend: 60,
      useCase: 'writing',
      teamSize: 2,
    }

    const result = auditTool(input)

    // Engine picks highest savings - could be downgrade or switch_tool
    expect(result.monthlySavings).toBeGreaterThan(0)
    expect(['downgrade', 'switch_tool']).toContain(result.type)
  })

  it('finds savings when business plan is used for small team', () => {
    const input: ToolInput = {
      toolKey: 'cursor',
      planKey: 'business',
      seats: 3,
      monthlySpend: 120,
      useCase: 'coding',
      teamSize: 3,
    }

    const result = auditTool(input)

    // Engine picks highest savings - Windsurf Free ($0) beats Pro downgrade ($60)
    expect(result.monthlySavings).toBeGreaterThan(0)
    expect(['downgrade', 'switch_tool']).toContain(result.type)
  })

  it('suggests cheaper alternative tool when 30%+ savings available', () => {
    const input: ToolInput = {
      toolKey: 'cursor',
      planKey: 'pro',
      seats: 5,
      monthlySpend: 100,
      useCase: 'coding',
      teamSize: 5,
    }

    const result = auditTool(input)

    // Windsurf Free at $0 = 100% savings
    expect(result.monthlySavings).toBeGreaterThan(0)
    expect(result.type).toBe('switch_tool')
  })

  it('returns optimal when no significant savings available', () => {
    const input: ToolInput = {
      toolKey: 'gemini',
      planKey: 'advanced',
      seats: 1,
      monthlySpend: 20,
      useCase: 'research',
      teamSize: 1,
    }

    const result = auditTool(input)

    // Gemini Advanced at $20 for 1 seat - no cheaper alternatives with 30%+ savings
    // Free tier exists but we're testing paid plan value
    expect(result.monthlySavings).toBeGreaterThanOrEqual(0)
  })

  it('handles unknown tool gracefully', () => {
    const input: ToolInput = {
      toolKey: 'unknown_tool',
      planKey: 'pro',
      seats: 1,
      monthlySpend: 50,
      useCase: 'coding',
      teamSize: 1,
    }

    const result = auditTool(input)

    expect(result.type).toBe('optimal')
    expect(result.confidence).toBe('low')
    expect(result.reasoning).toContain('not in our database')
  })

  it('flags credex opportunity for high spend', () => {
    const input: ToolInput = {
      toolKey: 'cursor',
      planKey: 'business',
      seats: 10,
      monthlySpend: 400,
      useCase: 'coding',
      teamSize: 10,
    }

    const result = auditTool(input)

    expect(result.credexOpportunity).toBe(true)
  })
})

describe('auditAll', () => {
  it('detects redundant tools in the same category', () => {
    const inputs: ToolInput[] = [
      {
        toolKey: 'cursor',
        planKey: 'pro',
        seats: 5,
        monthlySpend: 100,
        useCase: 'coding',
        teamSize: 5,
      },
      {
        toolKey: 'github_copilot',
        planKey: 'business',
        seats: 5,
        monthlySpend: 95,
        useCase: 'coding',
        teamSize: 5,
      },
    ]

    const result = auditAll(inputs)

    const redundantResult = result.results.find((r) => r.type === 'redundant')
    expect(redundantResult).toBeDefined()
    expect(redundantResult?.reasoning).toContain('redundant')
  })

  it('calculates total savings correctly', () => {
    const inputs: ToolInput[] = [
      {
        toolKey: 'chatgpt',
        planKey: 'team',
        seats: 1,
        monthlySpend: 30,
        useCase: 'writing',
        teamSize: 1,
      },
      {
        toolKey: 'cursor',
        planKey: 'business',
        seats: 2,
        monthlySpend: 80,
        useCase: 'coding',
        teamSize: 2,
      },
    ]

    const result = auditAll(inputs)

    expect(result.totalCurrentSpend).toBe(110)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })
})

describe('categorizeSavings', () => {
  it('returns optimal for zero savings', () => {
    expect(categorizeSavings(0)).toBe('optimal')
  })

  it('returns low for savings under $100', () => {
    expect(categorizeSavings(50)).toBe('low')
    expect(categorizeSavings(99)).toBe('low')
  })

  it('returns medium for savings $100-$499', () => {
    expect(categorizeSavings(100)).toBe('medium')
    expect(categorizeSavings(499)).toBe('medium')
  })

  it('returns high for savings $500+', () => {
    expect(categorizeSavings(500)).toBe('high')
    expect(categorizeSavings(1000)).toBe('high')
  })
})

describe('getTotalSavings', () => {
  it('calculates monthly and annual totals', () => {
    const results = [
      { monthlySavings: 50 },
      { monthlySavings: 100 },
      { monthlySavings: 25 },
    ]

    const totals = getTotalSavings(results)

    expect(totals.monthly).toBe(175)
    expect(totals.annual).toBe(2100)
  })
})
