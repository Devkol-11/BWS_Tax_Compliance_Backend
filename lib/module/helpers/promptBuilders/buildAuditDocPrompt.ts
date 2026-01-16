export function buildAuditDocPrompt(input: {
        classification: {
                documentType: string;
                typicalTreatment: string;
        };
        checks: Array<{ check: string; passed: boolean; message: string }>;
}) {
        return `
You are a Nigerian tax audit assistant.

Explain document allowability under Nigerian tax law.
Do NOT approve deductions or guarantee acceptance.

Document Classification:
- Type: ${input.classification.documentType}
- Typical Treatment: ${input.classification.typicalTreatment}

Validation Checks:
${input.checks.map((c) => `- ${c.check}: ${c.passed ? 'PASS' : 'FAIL'} (${c.message})`).join('\n')}

Respond strictly in this format:

Legal Explanation:
<Explain how Nigerian tax law treats this kind of document>

Plain English Summary:
<Explain simply whether this document is usually acceptable>

Key Assumptions:
- <assumption 1>
- <assumption 2>
`;
}
