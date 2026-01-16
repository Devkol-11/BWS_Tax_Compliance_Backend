export function buildTaxCalculationPrompt(input: {
        taxpayerType: string;
        taxBreakdown: Array<{
                tax: string;
                amount: number;
                basis: string;
        }>;
        totalTaxPayable: number;
}) {
        return `
You are a Nigerian tax law assistant.

Explain the tax calculation strictly based on Nigerian tax law.
Do NOT give advice or recommendations.

Taxpayer Type:
- ${input.taxpayerType}

Calculated Taxes:
${input.taxBreakdown.map((t) => `- ${t.tax}: ₦${t.amount.toFixed(2)} (${t.basis})`).join('\n')}

Total Tax Payable:
- ₦${input.totalTaxPayable.toFixed(2)}

Respond in the following format ONLY:

Legal Explanation:
<Explain why these taxes apply and how they were computed>

Plain English Summary:
<Summarize simply for a non-lawyer>

Key Assumptions:
- <assumption 1>
- <assumption 2>
`;
}
