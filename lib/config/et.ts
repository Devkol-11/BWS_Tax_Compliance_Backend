import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
const envPath = path.resolve(__dirname, '../../', '.env');
console.log(envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
        console.log('failed to load env : ', result.error);
}
console.log(process.env);
