/**
 * Pricing data for supported AI tools.
 * All prices verified against official vendor pages - see PRICING_DATA.md for sources.
 */

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export interface PlanInfo {
  name: string
  pricePerUser: number
  bestFor: UseCase[]
  features: string[]
  maxRecommendedTeamSize: number // -1 means unlimited
  isCustom?: boolean
}

export interface ToolInfo {
  name: string
  vendor: string
  category: 'ide' | 'chat' | 'api'
  plans: Record<string, PlanInfo>
  pricingUrl: string
}

export const TOOLS: Record<string, ToolInfo> = {
  cursor: {
    name: 'Cursor',
    vendor: 'Anysphere',
    category: 'ide',
    pricingUrl: 'https://www.cursor.com/pricing',
    plans: {
      hobby: {
        name: 'Hobby',
        pricePerUser: 0,
        bestFor: ['coding'],
        features: ['2000 completions', '50 slow premium requests'],
        maxRecommendedTeamSize: 1,
      },
      pro: {
        name: 'Pro',
        pricePerUser: 20,
        bestFor: ['coding'],
        features: ['Unlimited completions', '500 fast premium requests', 'Unlimited slow requests'],
        maxRecommendedTeamSize: 50,
      },
      business: {
        name: 'Business',
        pricePerUser: 40,
        bestFor: ['coding'],
        features: ['Everything in Pro', 'Admin dashboard', 'SAML SSO', 'Enforce privacy mode'],
        maxRecommendedTeamSize: -1,
      },
    },
  },
  github_copilot: {
    name: 'GitHub Copilot',
    vendor: 'GitHub/Microsoft',
    category: 'ide',
    pricingUrl: 'https://github.com/features/copilot#pricing',
    plans: {
      individual: {
        name: 'Individual',
        pricePerUser: 10,
        bestFor: ['coding'],
        features: ['Code completions', 'Chat in IDE', 'CLI assistance'],
        maxRecommendedTeamSize: 1,
      },
      business: {
        name: 'Business',
        pricePerUser: 19,
        bestFor: ['coding'],
        features: ['Everything in Individual', 'Organization management', 'Policy controls'],
        maxRecommendedTeamSize: 100,
      },
      enterprise: {
        name: 'Enterprise',
        pricePerUser: 39,
        bestFor: ['coding'],
        features: ['Everything in Business', 'Fine-tuned models', 'SAML SSO'],
        maxRecommendedTeamSize: -1,
      },
    },
  },
  claude: {
    name: 'Claude',
    vendor: 'Anthropic',
    category: 'chat',
    pricingUrl: 'https://www.anthropic.com/pricing',
    plans: {
      free: {
        name: 'Free',
        pricePerUser: 0,
        bestFor: ['writing', 'research'],
        features: ['Basic access', 'Limited messages'],
        maxRecommendedTeamSize: 1,
      },
      pro: {
        name: 'Pro',
        pricePerUser: 20,
        bestFor: ['writing', 'research', 'coding'],
        features: ['5x more usage', 'Priority access', 'Claude 3 Opus'],
        maxRecommendedTeamSize: 10,
      },
      team: {
        name: 'Team',
        pricePerUser: 30,
        bestFor: ['writing', 'research', 'coding'],
        features: ['Everything in Pro', 'Team management', 'Higher limits'],
        maxRecommendedTeamSize: 100,
      },
    },
  },
  chatgpt: {
    name: 'ChatGPT',
    vendor: 'OpenAI',
    category: 'chat',
    pricingUrl: 'https://openai.com/chatgpt/pricing/',
    plans: {
      free: {
        name: 'Free',
        pricePerUser: 0,
        bestFor: ['writing', 'research'],
        features: ['GPT-3.5', 'Limited GPT-4'],
        maxRecommendedTeamSize: 1,
      },
      plus: {
        name: 'Plus',
        pricePerUser: 20,
        bestFor: ['writing', 'research', 'coding'],
        features: ['GPT-4', 'DALL-E', 'Advanced Data Analysis'],
        maxRecommendedTeamSize: 10,
      },
      team: {
        name: 'Team',
        pricePerUser: 30,
        bestFor: ['writing', 'research', 'coding'],
        features: ['Everything in Plus', 'Admin console', 'Higher limits'],
        maxRecommendedTeamSize: 100,
      },
    },
  },
  gemini: {
    name: 'Gemini',
    vendor: 'Google',
    category: 'chat',
    pricingUrl: 'https://ai.google.dev/pricing',
    plans: {
      free: {
        name: 'Free',
        pricePerUser: 0,
        bestFor: ['writing', 'research'],
        features: ['Gemini Pro', 'Basic access'],
        maxRecommendedTeamSize: 1,
      },
      advanced: {
        name: 'Advanced',
        pricePerUser: 20,
        bestFor: ['writing', 'research', 'data'],
        features: ['Gemini Ultra', '2TB storage', 'Google One benefits'],
        maxRecommendedTeamSize: 10,
      },
    },
  },
  windsurf: {
    name: 'Windsurf',
    vendor: 'Codeium',
    category: 'ide',
    pricingUrl: 'https://windsurf.com/pricing',
    plans: {
      free: {
        name: 'Free',
        pricePerUser: 0,
        bestFor: ['coding'],
        features: ['Unlimited autocomplete', 'Limited premium models'],
        maxRecommendedTeamSize: 1,
      },
      pro: {
        name: 'Pro',
        pricePerUser: 15,
        bestFor: ['coding'],
        features: ['Unlimited flows', 'Premium models', 'Priority support'],
        maxRecommendedTeamSize: 50,
      },
      team: {
        name: 'Team',
        pricePerUser: 35,
        bestFor: ['coding'],
        features: ['Everything in Pro', 'Admin controls', 'Usage analytics'],
        maxRecommendedTeamSize: -1,
      },
    },
  },
  anthropic_api: {
    name: 'Anthropic API',
    vendor: 'Anthropic',
    category: 'api',
    pricingUrl: 'https://www.anthropic.com/pricing',
    plans: {
      paygo: {
        name: 'Pay-as-you-go',
        pricePerUser: 0,
        bestFor: ['coding', 'writing', 'data'],
        features: ['Usage-based', 'Claude 3.5 Sonnet: $3/$15 per MTok'],
        maxRecommendedTeamSize: -1,
        isCustom: true,
      },
    },
  },
  openai_api: {
    name: 'OpenAI API',
    vendor: 'OpenAI',
    category: 'api',
    pricingUrl: 'https://openai.com/api/pricing/',
    plans: {
      paygo: {
        name: 'Pay-as-you-go',
        pricePerUser: 0,
        bestFor: ['coding', 'writing', 'data'],
        features: ['Usage-based', 'GPT-4o: $2.50/$10 per MTok'],
        maxRecommendedTeamSize: -1,
        isCustom: true,
      },
    },
  },
}

/** Get all tool keys */
export function getToolKeys(): string[] {
  return Object.keys(TOOLS)
}

/** Get plan keys for a specific tool */
export function getPlanKeys(toolKey: string): string[] {
  return Object.keys(TOOLS[toolKey]?.plans || {})
}

/** Calculate default monthly spend based on tool, plan, and seats */
export function calculateDefaultSpend(toolKey: string, planKey: string, seats: number): number {
  const plan = TOOLS[toolKey]?.plans[planKey]
  if (!plan || plan.isCustom) return 0
  return plan.pricePerUser * seats
}

/** Get display label for a tool + plan combo */
export function getToolPlanLabel(toolKey: string, planKey: string): string {
  const tool = TOOLS[toolKey]
  const plan = tool?.plans[planKey]
  if (!tool || !plan) return ''
  return `${tool.name} ${plan.name}`
}
