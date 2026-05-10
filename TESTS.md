# Tests

## Test Framework

Using **Vitest** for unit testing. Run tests with:

```bash
npm test        # Run once
npm run test:watch  # Watch mode
```

## Test Coverage

### Audit Engine (`tests/audit-engine.test.ts`)

**13 tests covering:**

#### `auditTool` (6 tests)
- **finds savings when team plan is used with few seats** - Verifies that team plans with 1-2 users trigger savings recommendations
- **finds savings when business plan is used for small team** - Verifies business plans for <10 users trigger downgrade suggestions
- **suggests cheaper alternative tool when 30%+ savings available** - Tests cross-tool recommendations (e.g., Cursor → Windsurf)
- **returns optimal when no significant savings available** - Confirms no false positives for well-fitted plans
- **handles unknown tool gracefully** - Tests fallback behavior for tools not in our database
- **flags credex opportunity for high spend** - Verifies `credexOpportunity` flag is set for $50+/mo tools

#### `auditAll` (2 tests)
- **detects redundant tools in the same category** - Tests redundancy detection (e.g., Cursor + Copilot)
- **calculates total savings correctly** - Verifies aggregate savings math

#### `categorizeSavings` (4 tests)
- **returns optimal for zero savings**
- **returns low for savings under $100**
- **returns medium for savings $100-$499**
- **returns high for savings $500+**

#### `getTotalSavings` (1 test)
- **calculates monthly and annual totals** - Verifies monthly × 12 = annual

## Manual Testing Checklist

### Audit Form (`/audit`)
- [ ] Add/remove tools dynamically
- [ ] Plan dropdown populates based on tool selection
- [ ] Spend auto-calculates from plan price × seats
- [ ] Form persists in localStorage on refresh
- [ ] Running total updates in nav
- [ ] Submit triggers API call and redirects to results

### Results Page (`/results/[slug]`)
- [ ] Animated count-up displays correctly
- [ ] Actionable recommendations show with yellow border
- [ ] Optimal tools show with green border
- [ ] Share button copies URL to clipboard
- [ ] Credex CTA appears for high savings ($500+/mo)

### API (`/api/audit`)
- [ ] Returns valid JSON with results array
- [ ] Generates unique shareSlug
- [ ] Handles invalid input with 400 error
