import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { IAssignment } from '../../models/Assignment';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL = 'llama-3.1-8b-instant';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const groq = new Groq({ apiKey: GROQ_API_KEY });

function buildPrompt(assignment: IAssignment): string {
  const studyContext = assignment.uploadedFile?.compressedSummary || 
                       assignment.uploadedFile?.extractedText?.slice(0, 4000) || '';
  
  let prompt = `You are an expert exam creator. Generate a structured question paper based on the following details.

Subject: ${assignment.subject}
Title: ${assignment.title}
Grade: ${assignment.grade}
Difficulty Mix: ${assignment.difficultyMix}
Additional Instructions: ${assignment.additionalInstructions}

`;

  if (studyContext) {
    prompt += `Use the following study material summary as context:\n${studyContext}\n\n`;
  }

  prompt += `Questions Required:\n`;
  assignment.questionConfigurations.forEach(qt => {
    prompt += `- ${qt.count} questions of type '${qt.type}' (${qt.marks} marks each)\n`;
  });

  prompt += `
CRITICAL INSTRUCTION:
Do NOT return JSON. Do NOT return markdown formatting.
Return the output EXACTLY in this compact DSL format:

PAPER_TITLE: <title>
SUBJECT: <subject>
DURATION: <duration>
TOTAL_MARKS: <marks>

SECTION: <section letter>
INSTRUCTION: <section instruction>
Q<number> | <easy/medium/hard> | <marks> | <question text>
Q<number> | <easy/medium/hard> | <marks> | <question text>

(You can have multiple SECTION blocks)
Example:
PAPER_TITLE: Science Mid Term
SUBJECT: Physics
DURATION: 3 Hours
TOTAL_MARKS: 20

SECTION: A
INSTRUCTION: Attempt all multiple choice questions.
Q1 | easy | 1 | What is the unit of force?
Q2 | medium | 1 | Define Newton's second law. <mermaid>graph TD; A-->B;</mermaid>

NOTE ON DIAGRAMS:
If a question requires a diagram or graph, include Mermaid.js syntax inside a <mermaid>...</mermaid> tag directly within the question text. Do NOT use markdown code blocks.
`;

  return prompt;
}

export async function generateQuestionPaper(assignment: IAssignment): Promise<{ text: string, provider: 'gemini' | 'groq' | 'mock' }> {
  const prompt = buildPrompt(assignment);

  // 1. Try Gemini
  try {
    if (!GEMINI_API_KEY) throw new Error('No Gemini API Key');
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), provider: 'gemini' };
  } catch (error) {
    console.warn('Gemini generation failed, falling back to Groq:', error);
  }

  // 2. Try Groq
  try {
    if (!GROQ_API_KEY) throw new Error('No Groq API Key');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
    });
    return { text: completion.choices[0]?.message?.content || '', provider: 'groq' };
  } catch (error) {
    console.warn('Groq generation failed, falling back to mock:', error);
  }

  // 3. Mock fallback
  return {
    provider: 'mock',
    text: `PAPER_TITLE: ${assignment.title}
SUBJECT: ${assignment.subject}
DURATION: 2 Hours
TOTAL_MARKS: 10

SECTION: A
INSTRUCTION: Attempt all questions.
Q1 | easy | 2 | This is a mock easy question.
Q2 | medium | 3 | This is a mock medium question.
Q3 | hard | 5 | This is a mock hard question.`
  };
}
