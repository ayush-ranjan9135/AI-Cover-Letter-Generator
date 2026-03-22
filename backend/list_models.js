import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The SDK might not have listModels directly in the class, but we can try to find where it is or use fetch.
        // Actually, the SDK documentation shows listModels is available on the client? 
        // Wait, it might be on a different package? No, it should be here.
        
        // Let's use fetch instead to be 100% sure we get the list if the key works.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Failure:', err.message);
    }
}

listModels();
