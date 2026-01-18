export {};

declare global {
        namespace NodeJS {
                interface ProcessEnv {
                        DATABASE_URL: string;
                        PORT: string;
                        NODE_ENV: 'development' | 'test' | 'production';
                        GOOGLE_GEMINI_API_KEY_1_VERCEL: string;
                        GOOGLE_GEMINI_API_KEY_DIRECT: string;
                }
        }
}

declare global {
        namespace Express {
                interface Request {
                        user: object;
                }
        }
}
