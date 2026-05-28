import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL = 'llama-3.1-8b-instant';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

const SUMMARIZE_PROMPT = `Summarize the following study material for question-paper generation.
Focus on:
- chapter topics
- important concepts
- formulas
- definitions
- learning objectives

Keep summary concise and structured. Return plain text only.`;

export async function summarizeStudyMaterial(text: string): Promise<string> {
  // 1. Try Gemini
  try {
    if (!GEMINI_API_KEY) throw new Error('No Gemini API Key');
    
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(`${SUMMARIZE_PROMPT}\n\nStudy Material:\n${text}`);
    return result.response.text();
  } catch (error) {
    console.warn('Gemini summarization failed, falling back to Groq:', error);
  }

  // 2. Try Groq
  try {
    if (!GROQ_API_KEY) throw new Error('No Groq API Key');

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SUMMARIZE_PROMPT },
        { role: 'user', content: text }
      ],
      model: GROQ_MODEL,
    });
    return completion.choices[0]?.message?.content || text.slice(0, 4000);
  } catch (error) {
    console.error('Groq summarization also failed:', error);
    // Fallback: just truncate the text
    return text.slice(0, 4000);
  }
}
