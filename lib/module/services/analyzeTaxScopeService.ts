import * as input from '../types/requestTypes.js';
import * as output from '../types/responseTypes.js';
import * as Errors from '../../utils/appError.js';
import { TaxHelpers } from '../helpers/logic/taxHelpers.js';
import { Ai } from '../../config/Ai.js';
import { buildTaxScopePrompt } from '../helpers/promptBuilders/buildTaxScopePrompt.js';

export class AnalyzeTaxScopeService {
        static async execute(data: input.analyzeTaxScopeRequest): Promise<output.analyzeTaxScopeResponse> {
                // classify what type the tax payer is
                const taxpayerType = TaxHelpers.classifyTaxPayerType(data);

                if (taxpayerType === 'undetermined') {
                        throw new Errors.InvalidRequestError(
                                'Unable to determine taxpayer classification from provided data'
                        );
                }

                const taxReach = TaxHelpers.determineTaxReach(taxpayerType);

                const sizeCategory = TaxHelpers.determineSizeCategory(data.sizeProfile.annualTurnoverRange);

                const applicableTaxes = TaxHelpers.determineApplicableTaxes(taxpayerType, data);

                const applicableLaws = TaxHelpers.determineApplicableLaws(taxpayerType);

                // 2. Build AI prompt from FACTS + RESULTS
                const prompt = buildTaxScopePrompt({
                        taxpayerType,
                        taxReach,
                        sizeCategory,
                        applicableLaws,
                        applicableTaxes
                });

                // 3. Call Gemini
                const aiText = await Ai.generateText(prompt);

                // 4. Parse AI response safely
                const ai_analysis = this.parseAiResponse(aiText);

                // 5. Return exact DTO shape
                return {
                        classification: {
                                taxpayerType,
                                taxReach,
                                sizeCategory
                        },

                        applicableLaws,

                        applicableTaxes,

                        ai_analysis,

                        confidenceLevel: 'high'
                };
        }

        private static parseAiResponse(text: string): output.analyzeTaxScopeResponse['ai_analysis'] {
                const legalExplanationMatch = text.match(
                        /Legal Explanation:\s*([\s\S]*?)\n\nPlain English Summary:/i
                );

                const plainEnglishMatch = text.match(
                        /Plain English Summary:\s*([\s\S]*?)\n\nKey Assumptions:/i
                );

                const assumptionsMatch = text.match(/Key Assumptions:\s*([\s\S]*)/i);

                const assumptions =
                        assumptionsMatch?.[1]
                                ?.split('\n')
                                .map((a) => a.replace(/^-/, '').trim())
                                .filter(Boolean) ?? [];

                return {
                        legalExplanation: legalExplanationMatch?.[1]?.trim() ?? '',
                        plainEnglishSummary: plainEnglishMatch?.[1]?.trim() ?? '',
                        keyAssumptions: assumptions
                };
        }
}
