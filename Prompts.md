# AI Prompt Engineering - Cover Letter Generator

This document outlines the prompt engineering strategy used to generate high-quality, personalized cover letters.

## Base Prompt

```
Write a professional and highly personalized cover letter for:
Name: ${name}
Applying for: ${role}
Company: ${company}
Key Skills/Job Description: ${skills}
${resumeText ? `Additional Resume Context: ${resumeText}` : ''}

The cover letter should:
- Have a clear header (Professional greeting).
- Be formatted in 3-4 professional paragraphs.
- Highlight how the candidate's skills align with the role/company.
- Be enthusiastic but professional.
- End with a strong call to action/closing.
- DO NOT include placeholders like [Company Name]. Fill everything based on provided info.
- Return ONLY the cover letter text.
```

## Strategy Details

1.  **Context Injection**: We feed both the user-provided "Key Skills" and any extracted text from their uploaded resume into the prompt. This allows the AI (Gemini 1.5 Flash) to cross-reference the job requirements with the candidate's background.
2.  **Formatting Constraints**: By explicitly requesting 3-4 paragraphs and a clear header/footer, we ensure the output is ready for use without extra editing.
3.  **Removal of Placeholders**: One common issue with LLM-generated letters is the inclusion of `[Your Name]` or `[Company Name]`. We use a negative constraint ("DO NOT include placeholders") to force the AI to use the real data provided.
4.  **Tone Control**: Instructions like "enthusiastic but professional" ensure the letter is neither too stiff nor too casual for a corporate SaaS environment.
5.  **Clean Output**: "Return ONLY the cover letter text" prevents the AI from adding introductory conversational text like "Here is your cover letter:".
