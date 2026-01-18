import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

// Mock the ai-sdk modules before importing the Ai class
vi.mock('@ai-sdk/google', () => ({
        createGoogleGenerativeAI: vi.fn(() => vi.fn(() => 'mocked-model'))
}));

vi.mock('ai', () => ({
        generateText: vi.fn()
}));

vi.mock('../config/env', () => ({
        envConfig: {
                GOOGLE_GEMINI_API_KEY: 'test-api-key'
        }
}));

// Import after mocking
import { Ai } from '../../config/Ai.js';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

describe('Ai Class', () => {
        beforeEach(() => {
                vi.clearAllMocks();
        });

        describe('generateText', () => {
                it('should initialize Google Generative AI client with correct API key', async () => {
                        (generateText as Mock).mockResolvedValueOnce({ text: 'Test response' });

                        await Ai.generateText('Test prompt');

                        expect(createGoogleGenerativeAI).toHaveBeenCalledWith({
                                apiKey: 'test-api-key'
                        });
                });

                it('should send request with correct model (gemini-2.0-flash-exp)', async () => {
                        const mockModelFactory = vi.fn(() => 'mocked-model');
                        (createGoogleGenerativeAI as Mock).mockReturnValueOnce(mockModelFactory);
                        (generateText as Mock).mockResolvedValueOnce({ text: 'Test response' });

                        await Ai.generateText('Test prompt');

                        expect(mockModelFactory).toHaveBeenCalledWith('gemini-2.0-flash-exp');
                });

                it('should pass prompt correctly to generateText', async () => {
                        const testPrompt = 'Generate a tax summary for Q4 2025';
                        (generateText as Mock).mockResolvedValueOnce({ text: 'Tax summary response' });

                        await Ai.generateText(testPrompt);

                        expect(generateText).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        prompt: testPrompt
                                })
                        );
                });

                it('should return text from successful response', async () => {
                        const expectedText = 'This is the generated tax compliance report.';
                        (generateText as Mock).mockResolvedValueOnce({ text: expectedText });

                        const result = await Ai.generateText('Generate report');

                        expect(result).toBe(expectedText);
                });

                it('should propagate errors from the API', async () => {
                        const apiError = new Error('API rate limit exceeded');
                        (generateText as Mock).mockRejectedValueOnce(apiError);

                        await expect(Ai.generateText('Test prompt')).rejects.toThrow(
                                'API rate limit exceeded'
                        );
                });

                it('should handle empty prompt', async () => {
                        (generateText as Mock).mockResolvedValueOnce({ text: '' });

                        const result = await Ai.generateText('');

                        expect(generateText).toHaveBeenCalledWith(
                                expect.objectContaining({
                                        prompt: ''
                                })
                        );
                        expect(result).toBe('');
                });
        });
});
