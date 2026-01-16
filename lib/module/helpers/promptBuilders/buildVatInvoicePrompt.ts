export function buildVatInvoicePrompt(input: {
        checks: Array<{ rule: string; passed: boolean; message: string }>;
}) {
        return `
You are a Nigerian VAT compliance assistant.

Explain VAT invoice compliance strictly under current Nigerian VAT law.
Do NOT approve or certify the invoice.

Validation Results:
${input.checks.map((c) => `- ${c.rule}: ${c.passed ? 'PASS' : 'FAIL'} (${c.message})`).join('\n')}

Respond strictly in this format:

Legal Explanation:
<Explain why these invoice elements are required under Nigerian VAT law>

Plain English Summary:
<Explain in simple terms what is missing or compliant>

Key Assumptions:
- <assumption 1>
- <assumption 2>
`;
}
