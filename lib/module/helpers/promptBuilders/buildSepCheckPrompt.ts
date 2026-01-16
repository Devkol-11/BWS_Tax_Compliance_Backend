export function buildSepCheckPrompt(input: {
        indicators: Array<{
                indicator: string;
                present: boolean;
                explanation: string;
        }>;
        hasSEP: boolean;
}) {
        return `
You are a Nigerian international tax assistant.

Explain Significant Economic Presence (SEP) strictly under Nigerian tax rules.
Do NOT give advice or enforcement guidance.

SEP Indicators:
${input.indicators.map((i) => `- ${i.indicator}: ${i.present ? 'YES' : 'NO'} (${i.explanation})`).join('\n')}

Overall SEP Determination:
- ${input.hasSEP ? 'Likely SEP present' : 'SEP not clearly established'}

Respond strictly in this format:

Legal Explanation:
<Explain SEP and how these indicators relate to Nigerian tax law>

Plain English Summary:
<Explain simply whether Nigerian tax obligations may arise>

Key Assumptions:
- <assumption 1>
- <assumption 2>
`;
}
