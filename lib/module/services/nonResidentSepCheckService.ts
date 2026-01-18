import * as input from '../types/requestTypes.js';
import * as output from '../types/responseTypes.js';
import { TaxHelpers } from '../helpers/logic/taxHelpers.js';
import { Ai } from '../../config/Ai.js';
import { buildSepCheckPrompt } from '../helpers//promptBuilders/buildSepCheckPrompt.js';

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
