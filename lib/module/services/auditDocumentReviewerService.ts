import * as input from '../types/requestTypes.js';
import * as output from '../types/responseTypes.js';
import { TaxHelpers } from '../helpers/logic/taxHelpers.js';
import { Ai } from '@lib/config/Ai.js';
import { buildAuditDocPrompt } from '../helpers/promptBuilders/buildAuditDocPrompt.js';

export class AuditDocumentReviewerService {
        static async execute(data: input.auditDocumentRequest): Promise<output.auditDocumentResponse> {
                const classification = TaxHelpers.classifyDocumentType(data.document.type);

                const checks = [
                        TaxHelpers.checkBasicDocumentFields(data),
                        TaxHelpers.checkBusinessRelevance(data),
                        TaxHelpers.checkCapitalVsRevenue(data)
                ];

                const prompt = buildAuditDocPrompt({
                        classification,
                        checks
                });

                const aiText = await Ai.generateText(prompt);

                const ai_analysis = {
                        legalExplanation: aiText,
                        plainEnglishSummary: aiText,
                        keyAssumptions: []
                };

                return {
                        classification,
                        checks,
                        ai_analysis,
                        confidenceLevel: classification.typicalTreatment === 'allowable' ? 'high' : 'medium'
                };
        }
}
