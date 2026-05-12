# Prompts

## AI Summary Prompt

Used in `lib/openai.ts` to generate a personalized ~100-word audit summary via `gpt-4o-mini`.

### System Prompt

```
You are a concise financial advisor specializing in AI tool spend optimization for startups. Write like a CFO's assistant: specific, numbers-forward, no fluff. Never use markdown formatting. Keep it to exactly one paragraph, approximately 100 words. Be direct and actionable.
```

### User Prompt Template

```
Write a personalized ~100-word summary paragraph for this AI spend audit. Be specific with numbers and recommendations.

Current total spend: ${totalCurrentSpend}/mo
Potential savings: ${totalMonthlySavings}/mo (${totalAnnualSavings}/year)
Savings category: ${savingsCategory}

Tool breakdown:
- [ToolName] ([Plan]): currently $[spend]/mo, recommended: [action] (saves $[savings]/mo)
- ...

Write one conversational paragraph summarizing the key findings and top 1-2 actions they should take first. Address the reader as "you" / "your team".
```

### Why this prompt design

1. **System prompt sets tone:** "CFO's assistant" anchors the output in financial language without being stiff. The constraint to one paragraph prevents the model from over-explaining.

2. **Numbers in the user prompt:** Providing exact dollar amounts and savings ensures the output references real numbers rather than hallucinating them. The model has all the data it needs inline.

3. **"No markdown" instruction:** The summary renders as plain text in a card. Markdown asterisks or headers would look broken in the UI.

4. **"you" / "your team" framing:** Makes the output feel personal rather than generic. Users are more likely to share a summary that addresses them directly.

### What I tried that did not work

- **First attempt:** Asked the model to "write a detailed analysis" without word count constraints. Output was 300+ words, way too long for the card format. Fixed by adding "approximately 100 words" and "exactly one paragraph."

- **Second attempt:** Used a more formal tone ("Dear stakeholder"). Sounded corporate and impersonal. Changed to "conversational paragraph" which reads better for the target audience (startup founders/eng managers).

- **Third attempt:** Included all check types in the prompt. The model tried to mention every single finding, making the summary bloated. Simplified to "top 1-2 actions they should take first" which forces prioritization.

### Fallback Strategy

If the OpenAI API fails (429 rate limit, 500 server error, 8-second timeout, or missing API key), the system falls back to a templated summary built from the audit data using string interpolation. The fallback:

- References the total spend and savings numbers
- Mentions the top saving opportunity by name
- Adjusts messaging based on savings category (high = suggest Credex consultation, low/medium = suggest starting with highest-impact change)
- Never references AI or OpenAI, so users do not know they missed the AI version
