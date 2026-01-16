import * as input from '../types/requestTypes';
import * as output from '../types/responseTypes';
import * as Errors from '../../utils/appError';
import { TaxHelpers } from '../helpers/logic/taxHelpers';
import { Ai } from '@lib/config/Ai';
import { buildIncentiveFinderPrompt } from '../helpers/promptBuilders/buildIncentiveFinderPrompt';

export class AiIncentiveFinderService {
        static async execute(
                data: input.aiIncentiveFinderRequest
        ): Promise<output.aiIncentiveFinderResponse> {
                // 1. Classify taxpayer locally
                const taxpayerType = TaxHelpers.classifyTaxPayerType({
                        taxpayer: data.taxpayer,
                        residencyAndPresence: data.residencyAndPresence,
                        incomeProfile: { incomeTypes: [] },
                        sizeProfile: { annualTurnoverRange: '<25m' }
                } as any);

                if (taxpayerType === 'undetermined') {
                        throw new Errors.InvalidRequestError(
                                'Unable to determine taxpayer type for incentive matching'
                        );
                }

                // 2. Deterministic incentive detection
                const matchedIncentives = TaxHelpers.detectIncentiveCategories({
                        businessProfile: data.businessProfile
                });

                // 3. Build AI prompt
                const prompt = buildIncentiveFinderPrompt({
                        taxpayerType,
                        matchedIncentives,
                        businessDescription: data.businessProfile.activitiesDescription
                });

                const aiText = await Ai.generateText(prompt);

                const ai_analysis = {
                        legalExplanation: aiText,
                        plainEnglishSummary: aiText,
                        keyAssumptions: []
                };

                return {
                        matchedIncentives,
                        ai_analysis,
                        confidenceLevel: matchedIncentives.length > 0 ? 'medium' : 'low'
                };
        }
}
