import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const pdfPath = 'uploads/1773815821839-Qa_Up_resume.pdf';
        const dataBuffer = fs.readFileSync(pdfPath);

        console.log('Sending to Gemini...');
        const result = await model.generateContent([
            {
                inlineData: {
                    data: dataBuffer.toString("base64"),
                    mimeType: "application/pdf"
                }
            },
            "Extract all text from this resume faithfully. Return only the extracted text."
        ]);
        
        const text = result.response.text();
        console.log('Gemini success! Length:', text.length);
        process.exit(0);
    } catch (err) {
        console.error('Gemini failure:', err.message);
        process.exit(1);
    }
}

testGemini();
