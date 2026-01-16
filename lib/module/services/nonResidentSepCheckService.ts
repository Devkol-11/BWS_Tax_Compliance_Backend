import * as input from '../types/requestTypes';
import * as output from '../types/responseTypes';
import { TaxHelpers } from '../helpers/logic/taxHelpers';
import { Ai } from '@lib/config/Ai';
import { buildSepCheckPrompt } from '../helpers//promptBuilders/buildSepCheckPrompt';

export class NonResidentSepCheckService {
        static async execute(data: input.nonResident_SEP_Request): Promise<output.nonResident_SEP_Response> {
                const indicators = TaxHelpers.evaluateSEPIndicators({
                        nigeriaActivities: data.nigeriaActivities
                });

                const hasSEP = TaxHelpers.determineSEP(indicators);

                const prompt = buildSepCheckPrompt({
                        indicators,
                        hasSEP
                });

                const aiText = await Ai.generateText(prompt);

                const ai_analysis = {
                        legalExplanation: aiText,
                        plainEnglishSummary: aiText,
                        keyAssumptions: []
                };

                return {
                        hasSEP,
                        indicators,
                        ai_analysis,
                        confidenceLevel: hasSEP ? 'high' : 'medium'
                };
        }
}
