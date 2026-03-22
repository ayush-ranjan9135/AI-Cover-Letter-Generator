import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import PDFParser from 'pdf2json';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// Polyfills for PDF parsing libraries in Serverless/Modern Node environments
if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
        constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; }
    };
}

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;

// Set up uploads directory (use /tmp on Vercel as it is the only writable directory)
const uploadsDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir) && !process.env.VERCEL) {
    fs.mkdirSync(uploadsDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(cors());
app.use(express.json());

// PDF Parsing Endpoint
app.post('/api/parse-pdf', upload.single('resume'), async (req, res) => {
  console.log('[Parser] PDF upload request received...');
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  let text = '';
  const dataBuffer = fs.readFileSync(req.file.path);
  console.log(`[Parser] File size: ${dataBuffer.length} bytes`);

  // Engine 1: pdf2json (Fast, manual map)
  try {
    const pdfParser = new PDFParser(null, 1);
    const pdf2jsonText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", err => {
        console.error('[Parser] Engine 1 Error event:', err);
        reject(err);
      });
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const extracted = pdfData.Pages
            .flatMap(p => p.Texts)
            .map(t => t.R.map(r => {
              try { return decodeURIComponent(r.T); } catch { return r.T; }
            }).join(''))
            .join(' ');
          resolve(extracted);
        } catch (e) { 
          console.error('[Parser] Engine 1 Mapping Error:', e);
          reject(e); 
        }
      });
      pdfParser.parseBuffer(dataBuffer);
    });
    if (pdf2jsonText?.trim().length > 20) {
      text = pdf2jsonText;
      console.log('[Parser] Engine 1 (pdf2json) Success');
    } else {
      console.warn('[Parser] Engine 1 returned insufficient text length');
    }
  } catch (e) { console.warn('[Parser] Engine 1 Failed:', e.message); }

  // Engine 2: pdfjs-dist (Standard-compliant fallback)
  if (!text || text.trim().length < 20) {
    console.log('[Parser] Starting Engine 2 (pdfjs-dist)...');
    try {
      const loadingTask = pdfjs.getDocument({ data: dataBuffer, useSystemFonts: true });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + ' ';
      }
      if (fullText.trim().length > 20) {
        text = fullText;
        console.log('[Parser] Engine 2 (pdfjs) Success');
      } else {
        console.warn('[Parser] Engine 2 returned insufficient text length');
      }
    } catch (e) { console.warn('[Parser] Engine 2 Failed:', e.message); }
  }

  // Engine 3: Gemini AI (Ultimate AI failover)
  if (!text || text.trim().length < 20) {
    console.log('[Parser] Starting Engine 3 (Gemini Failover)...');
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent([
        { inlineData: { data: dataBuffer.toString("base64"), mimeType: "application/pdf" } },
        "Extract all text from this resume. Return only the extracted text."
      ]);
      const geminiText = result.response.text();
      if (geminiText?.trim().length > 20) {
        text = geminiText;
        console.log('[Parser] Engine 3 (Gemini) Success');
      } else {
        console.warn('[Parser] Engine 3 returned insufficient text length');
      }
    } catch (e) { console.warn('[Parser] Engine 3 Failed:', e.message); }
  }

  try {
    if (!text || text.trim().length < 10) throw new Error("All extraction engines failed to recover text.");
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
});


// AI Generation Endpoint
// ATS Scoring Endpoint
app.post('/api/ats-score', async (req, res) => {
  try {
    const { name, role, company, skills, resumeText } = req.body;
    console.log(`[ATS] Scoring resume for ${name} at ${company}...`);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'zyx') {
      return res.status(500).json({ error: 'Gemini API key is NOT configured correctly.' });
    }

    if (!resumeText || !role || !skills) {
      return res.status(400).json({ error: 'Missing required professional context (Resume, Role, or Skills)' });
    }

    const prompt = `
      As an expert ATS (Applicant Tracking System) analyzer, evaluate the following resume against the target role and skills.
      
      Target Role: ${role}
      Key Skills Required: ${skills}
      Resume Content: ${resumeText}

      Provide a detailed analysis in JSON format:
      {
        "score": (a number between 0 and 100),
        "feedback": ["point 1", "point 2", ...],
        "missingKeywords": ["keyword 1", "keyword 2", ...],
        "strengths": ["strength 1", "strength 2", ...]
      }
      
      Return ONLY the JSON.
    `;

    // Initialize Gemini AI SDK
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelInstance = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log(`[ATS] Generating ATS score for ${name} at ${company}...`);

    const result = await modelInstance.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from potential Markdown formatting or extra text
    let parsed;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error("No JSON found in AI response");
      }
      const cleanJson = text.substring(jsonStart, jsonEnd);
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      console.error('[ATS] JSON Extraction Failed. Raw text:', text);
      throw new Error("Failed to parse AI evaluation into structured data.");
    }

    const finalResult = {
        score: parsed.score || 0,
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
        missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : []
    };

    console.log('[ATS] Score calculated successfully:', finalResult.score);
    res.json(finalResult);
  } catch (error) {
    console.error('[ATS] Scoring Error:', error.message);
    res.status(500).json({ error: 'Failed to calculate ATS score: ' + error.message });
  }
});

app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { name, role, company, skills, resumeText } = req.body;
    console.log(`[AI] Generating letter for ${name} at ${company}...`);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY === 'zyx') {
      console.warn(`[AI] Gemini API key is invalid or is a placeholder: "${process.env.GEMINI_API_KEY}"`);
      return res.status(500).json({ error: `Gemini API key is NOT configured correctly. Current value is "${process.env.GEMINI_API_KEY}". Please update the backend/.env file with a real key starting with AIza.` });
    }

    // Basic format check for Gemini API key
    if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
       console.warn(`[AI] WARNING: Received key: "${process.env.GEMINI_API_KEY.substring(0, 4)}..." - This does not look like a valid Google API key (expected AIza...).`);
    }

    if (!name || !role || !company || !skills) {
      console.warn('[AI] Missing required fields in request body.');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `
      As an expert career consultant, write a professional and highly personalized cover letter for:
      Name: ${name}
      Applying for: ${role}
      Company: ${company}
      Key Skills/Job Description: ${skills}
      ${resumeText ? `Additional Resume Context: ${resumeText}` : ''}

       CRITICAL INSTRUCTIONS FOR FORMATTING:
       - You MUST use double line breaks (a full empty line) between EVERY section.
       - Use a strict formal business block format.
       
       TEMPLATE STRUCTURE:
       [Date]
       
       [Candidate Name]
       [Contact Info if provided in resume, otherwise placeholder]
       
       To the Hiring Manager,
       [Company Name]
       
       Dear Hiring Manager (or specific name if available),
       
       [Paragraph 1: Compelling Hook & Introduction. State the role and why you are excited about this specific company.]
       
       [Paragraph 2: The 'Why Me'. Connect the skills (${skills}) and resume experience to the company's needs. Highlight specific impact.]
       
       [Paragraph 3: Achievements & Evidence. Use specific examples from calculations or history to show readiness.]
       
       [Paragraph 4: Call to Action. Express desire for an interview and thank them.]
       
       Sincerely,
       
       ${name}

       DO NOT use brackets like [Company Name] in the final text; replace them with actual values.
       Ensure there is an empty line between the greeting and the first paragraph, and between all paragraphs.
       Return ONLY the final cover letter text.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelInstance = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log(`[AI] Generating letter for ${name} at ${company}...`);

    const result = await modelInstance.generateContent(prompt);
    const text = result.response.text();

    console.log('[AI] Cover letter generated successfully.');
    res.json({ letter: text });
  } catch (error) {
    console.error('[AI] Gemini API Error:', error.message);
    res.status(500).json({ error: 'Gemini AI error: ' + error.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Force-listen on local environments
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

export default app;
