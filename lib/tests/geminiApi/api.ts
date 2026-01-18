import { Ai } from '../../config/Ai.js';

const systemPrompt = 'You are an expert Tax Compliance AI for the Nigerian tax system...';
const userQuery = 'What is the current VAT rate in Nigeria?';

// Combine prompts for a better result
const fullPrompt = `${systemPrompt}\n\nUser Question: ${userQuery}`;

async function runTest() {
        console.log('⏳ Sending request to Gemini...');

        const result = await Ai.generateText(fullPrompt);

        console.log('--- AI RESPONSE ---');
        console.log(result);
}

runTest();
