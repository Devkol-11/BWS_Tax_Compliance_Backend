import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });
export const envConfig = Object.freeze({
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        GOOGLE_GEMINI_API_KEY_VERCEL: process.env.GOOGLE_GEMINI_API_KEY_VERCEL,
        GOOGLE_GEMINI_API_KEY_DIRECT: process.env.GOOGLE_GEMINI_API_KEY_DIRECT
});

console.log(envConfig);
