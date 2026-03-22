import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The SDK doesn't have a direct listModels, but we can try a known one or check documentation.
        // Actually, let's just try the most common ones.
        const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`Model ${m} is available.`);
            } catch (e) {
                console.log(`Model ${m} failed: ${e.message}`);
            }
        }
    } catch (err) {
        console.error('Failure:', err.message);
    }
}

listModels();
