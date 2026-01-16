import * as input from '../types/requestTypes';
import * as output from '../types/responseTypes';
import { TaxHelpers } from '../helpers/logic/taxHelpers';
import { Ai } from '@lib/config/Ai';

export class TinRegistrationGuideService {
        static async execute(data?: input.tinRegistrationRequest): Promise<output.tinRegistrationResponse> {
                const taxpayerType = data?.taxpayerType ?? 'individual';

                const steps = TaxHelpers.getTinSteps(taxpayerType);
                const requiredDocuments = TaxHelpers.getTinRequiredDocuments(taxpayerType);
                const channels = TaxHelpers.getTinChannels();

                // Optional AI simplification
                const aiText = await Ai.generateText(
                        `Summarize the following Nigerian TIN registration steps in simple terms:\n${steps
                                .map((s: any) => `${s.step}. ${s.title}: ${s.description}`)
                                .join('\n')}`
                );

                return {
                        taxpayerType,
                        steps,
                        requiredDocuments,
                        channels,
                        ai_analysis: {
                                plainEnglishSummary: aiText
                        },
                        confidenceLevel: 'high'
                };
        }
}
