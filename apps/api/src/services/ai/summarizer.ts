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

const MAX_INPUT_CHARS = 18000;
const FALLBACK_CHARS = 4000;

const SYSTEM_PROMPT = `
You are an academic study-material summarizer.

Your summary will be used to generate exam questions.

Return only clean plain text.
Do not use markdown tables.
Do not add explanations outside the summary.
`.trim();

const SUMMARIZE_PROMPT = `
Summarize the given study material for question-paper generation.

Create a concise but useful academic summary using this structure:

TITLE:
Write the likely chapter/unit title if clear.

MAIN TOPICS:
- List the major topics covered.

KEY CONCEPTS:
- List important concepts students must understand.

DEFINITIONS:
- Include important definitions with short explanations.

FORMULAS:
- Include formulas, laws, equations, or rules if present.
- If no formulas are present, write: None found.

IMPORTANT FACTS:
- List important facts, dates, terms, examples, or classifications.

LEARNING OBJECTIVES:
- List what students should be able to understand, explain, apply, compare, analyze, or solve.

QUESTION GENERATION HINTS:
- Suggest what types of exam questions can be created from this material.

Rules:
- Use the study material as the primary source.
- Do not invent unrelated topics.
- Keep the summary compact but complete.
- Prefer bullet points.
- Return plain text only.
`.trim();

function cleanInputText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim()
    .slice(0, MAX_INPUT_CHARS);
}

function fallbackSummary(text: string): string {
  return `TITLE:
Unknown

MAIN TOPICS:
- Extracted study material content was too large or summarization failed.

KEY CONCEPTS:
- Use the available text directly for question generation.

DEFINITIONS:
- Refer to the provided study material.

FORMULAS:
- None found.

IMPORTANT FACTS:
- ${text.slice(0, FALLBACK_CHARS)}

LEARNING OBJECTIVES:
- Understand the main ideas from the given material.
- Apply concepts in exam-style questions.

QUESTION GENERATION HINTS:
- Generate MCQs, short answer questions, long answer questions, numerical questions, or diagram-based questions based on the available content.`;
}

export async function summarizeStudyMaterial(text: string): Promise<string> {
  const cleanedText = cleanInputText(text);

  if (!cleanedText) {
    return fallbackSummary('');
  }

  // 1. Try Gemini
  try {
    if (!GEMINI_API_KEY) throw new Error('No Gemini API Key');

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      `${SUMMARIZE_PROMPT}\n\nSTUDY MATERIAL:\n${cleanedText}`
    );

    const summary = result.response.text()?.trim();

    if (summary) {
      return summary;
    }

    throw new Error('Gemini returned empty summary');
  } catch (error) {
    console.warn('Gemini summarization failed, falling back to Groq:', error);
  }

  // 2. Try Groq
  try {
    if (!GROQ_API_KEY) throw new Error('No Groq API Key');

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 1800,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${SUMMARIZE_PROMPT}\n\nSTUDY MATERIAL:\n${cleanedText}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (summary) {
      return summary;
    }

    throw new Error('Groq returned empty summary');
  } catch (error) {
    console.error('Groq summarization also failed:', error);
    return fallbackSummary(cleanedText);
  }
}