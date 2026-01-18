import * as input from '../types/requestTypes.js';
import * as output from '../types/responseTypes.js';
import * as Errors from '../../utils/appError.js';
import { TaxHelpers } from '../helpers/logic/taxHelpers.js';
import { Ai } from '../../config/Ai.js';
import { buildOptimizeSavingsPrompt } from '../helpers/promptBuilders/buildOptimizeSavingsPrompt.js';

export class OptimizeSavingsService {
        constructor() {}
        static async execute(data: input.optimizeSavingsReuest): Promise<output.optimizeSavingsResponse> {
                // 1. Classify taxpayer (local, independent)
                const taxpayerType = TaxHelpers.classifyTaxPayerType({
                        taxpayer: data.taxpayer,
                        residencyAndPresence: data.residencyAndPresence,
                        incomeProfile: data.incomeProfile,
                        sizeProfile: { annualTurnoverRange: '<25m' }
                } as any);

                if (taxpayerType === 'undetermined') {
                        throw new Errors.InvalidRequestError(
                                'Unable to determine taxpayer type for savings analysis'
                        );
                }

                // 2. Detect relief categories deterministically
                let detectedReliefs: string[] = [];

                if (taxpayerType.includes('individual')) {
                        detectedReliefs = TaxHelpers.detectIndividualReliefs(data);
                } else {
                        detectedReliefs = TaxHelpers.detectCompanyReliefs(data);
                }

                // 3. Build AI prompt
                const prompt = buildOptimizeSavingsPrompt({
                        taxpayerType,
                        detectedReliefs
                });

                const aiText = await Ai.generateText(prompt);

                // 4. Parse AI (simple, non-authoritative)
                const ai_analysis = {
                        legalExplanation: aiText,
                        plainEnglishSummary: aiText,
                        keyAssumptions: []
                };

                // 5. Shape response
                return {
                        potentialReliefs: detectedReliefs.map((r) => ({
                                relief: r,
                                description: '',
                                conditions: []
                        })),
                        ai_analysis,
                        confidenceLevel: 'medium'
                };
        }
}
