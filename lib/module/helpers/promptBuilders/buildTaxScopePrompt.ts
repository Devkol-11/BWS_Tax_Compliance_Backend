export function buildTaxScopePrompt(params: {
        taxpayerType: string;
        taxReach: string;
        sizeCategory: string;
        applicableLaws: string[];
        applicableTaxes: Array<{ tax: string; basis: string }>;
}) {
        return `
You are a Nigerian tax law assistant.

Your task is to EXPLAIN the tax classification below strictly based on Nigerian tax law.
Do NOT speculate.
Do NOT give advice.
Do NOT suggest avoidance strategies.
Explain only what the law states.

TAXPAYER CLASSIFICATION
- Taxpayer Type: ${params.taxpayerType}
- Tax Reach: ${params.taxReach}
- Business Size Category: ${params.sizeCategory}

APPLICABLE LAWS
${params.applicableLaws.map((law) => `- ${law}`).join('\n')}

APPLICABLE TAXES
${params.applicableTaxes.map((t) => `- ${t.tax}: ${t.basis}`).join('\n')}

RESPONSE REQUIREMENTS
1. Legal Explanation:
   - Explain why this taxpayer falls under these laws.
   - Reference Nigerian tax principles (residency, source, SEP, thresholds).

2. Plain English Summary:
   - Explain the same thing in simple terms for a non-lawyer.

3. Key Assumptions:
   - List assumptions made due to limited information.
   - Do not invent facts.

FORMAT YOUR RESPONSE EXACTLY AS:
Legal Explanation:
<text>

Plain English Summary:
<text>

Key Assumptions:
- assumption 1
- assumption 2
`;
}
