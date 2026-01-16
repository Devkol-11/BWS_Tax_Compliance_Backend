import * as input from '../types/requestTypes';
import * as output from '../types/responseTypes';
import { TaxHelpers } from '../helpers/logic/taxHelpers';
import { Ai } from '@lib/config/Ai';
import { buildVatInvoicePrompt } from '../helpers/promptBuilders/buildVatInvoicePrompt';

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
