import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { envConfig } from './env.js';
import { InfrastructureError } from '../../lib/utils/appError.js';

export class Ai {
        private static readonly API_KEY = envConfig.GOOGLE_GEMINI_API_KEY_DIRECT;

        static async generateText(prompt: string): Promise<string> {
                // 1. Pre-flight check
                if (!this.API_KEY) {
                        throw new InfrastructureError(
                                'Gemini API Key is not configured in environment variables',
                                false // Not retryable until dev fixes .env
                        );
                }

                try {
                        const googleProvider = createGoogleGenerativeAI({
                                apiKey: this.API_KEY
                        });
                        const model = googleProvider('gemini-2.0-flash-exp');

                        const { text } = await generateText({
                                model,
                                prompt,
                                abortSignal: AbortSignal.timeout(20000) // 20s timeout
                        });

                        if (!text) {
                                throw new Error('AI provider returned an empty string');
                        }

                        return text;
                } catch (error: any) {
                        // 2. Wrap the external error in your InfrastructureError
                        // We check if it's a 429 (Rate Limit) or 5xx (Google Server Down) to decide if it's retryable
                        const isRetryable = Boolean(error.status === 429 || error.status >= 500);
                        if (isRetryable) {
                                throw new InfrastructureError(
                                        `AI Generation Failed: ${error.message}`,
                                        isRetryable,
                                        error // Pass the original error as 'cause' for debugging
                                );
                        }
                        throw error;
                }
        }
}
