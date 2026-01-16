import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { envConfig } from './env';

export class Ai {
        private static GOOGLE_GEMINI_API_KEY = envConfig.GOOGLE_GEMINI_API_KEY;

        static async generateText(prompt: string) {
                const ai = createGoogleGenerativeAI({ apiKey: this.GOOGLE_GEMINI_API_KEY });
                const model = ai('gemini-2.0-flash-exp');
                const { text } = await generateText({
                        model,
                        prompt
                });

                return text;
        }
}
