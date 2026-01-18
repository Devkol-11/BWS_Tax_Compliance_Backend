import * as input from '../types/requestTypes.js';
import * as output from '../types/responseTypes.js';
import { TaxHelpers } from '../helpers/logic/taxHelpers.js';
import { Ai } from '../../config/Ai.js';
import { buildVatInvoicePrompt } from '../helpers/promptBuilders/buildVatInvoicePrompt.js';

export class ValidateInvoiceService {
        static async execute(data: input.validateInvoiceRequest): Promise<output.validateInvoiceResponse> {
                const checks = [
                        TaxHelpers.checkSupplierDetails(data),
                        TaxHelpers.checkInvoiceMetadata(data),
                        TaxHelpers.checkLineItems(data),
                        TaxHelpers.checkVATDisclosure(data)
                ];

                const isCompliant = checks.every((c) => c.passed);

                const prompt = buildVatInvoicePrompt({ checks });
                const aiText = await Ai.generateText(prompt);

                const ai_analysis = {
                        legalExplanation: aiText,
                        plainEnglishSummary: aiText,
                        keyAssumptions: []
                };

                return {
                        isCompliant,
                        checks,
                        ai_analysis,
                        confidenceLevel: 'high'
                };
        }
}
