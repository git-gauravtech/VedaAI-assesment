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
  const studyContext =
    assignment.uploadedFile?.compressedSummary ||
    assignment.uploadedFile?.extractedText?.slice(0, 4000) ||
    '';

  const hasDiagramQuestion = assignment.questionConfigurations.some(qt =>
    qt.type.toLowerCase().includes('diagram') ||
    qt.type.toLowerCase().includes('graph')
  );

  let totalMarks = 0;

  let prompt = `
You are an experienced examination setter and curriculum expert.

Create a high-quality question paper that tests:
- conceptual understanding
- application of concepts
- reasoning ability
- problem-solving skills

ASSIGNMENT DETAILS:
Subject: ${assignment.subject}
Title: ${assignment.title}
Grade: ${assignment.grade}
Difficulty Mix: ${assignment.difficultyMix}
Additional Instructions: ${assignment.additionalInstructions || 'None'}

`;

  if (studyContext) {
    prompt += `
STUDY MATERIAL:
The following material is the PRIMARY source for generating questions.
Generate most questions from this content.

${studyContext}

`;
  }

  prompt += `
QUESTION REQUIREMENTS:
`;

  assignment.questionConfigurations.forEach(qt => {
    totalMarks += qt.count * qt.marks;
    prompt += `- ${qt.count} ${qt.type} questions (${qt.marks} marks each)\n`;
  });

  prompt += `
QUESTION QUALITY RULES:
1. Generate questions mainly from the uploaded study material.
2. Cover different topics from the material.
3. Avoid duplicate or repeated questions.
4. Match the grade level.
5. Use clear exam-style language.
6. Do not include answers, hints, or solutions.
7. Do not mention difficulty inside the question text.
8. Follow the requested question count exactly.

DIFFICULTY GUIDE:
easy = recall, definitions, basic understanding
medium = application, comparison, short reasoning
hard = analysis, multi-step thinking, real-world application

OUTPUT FORMAT:
Return ONLY this DSL format.

PAPER_TITLE: ${assignment.title}
SUBJECT: ${assignment.subject}
DURATION: 2 Hours
TOTAL_MARKS: ${totalMarks}

SECTION: A
INSTRUCTION: <section instruction>
Q<number> | <easy/medium/hard> | <marks> | <question text>

MCQ FORMAT:
Every MCQ must have exactly 4 options.

Q1 | easy | 1 | What is the SI unit of force?
OPTIONS: A) Joule | B) Newton | C) Watt | D) Pascal

`;

  if (hasDiagramQuestion) {
    prompt += `
DIAGRAM / GRAPH QUESTION FORMAT:
Every diagram or graph-based question must include exactly ONE Mermaid diagram.

Use only simple graph LR Mermaid syntax.

Example:
Q5 | medium | 5 | Study the diagram and answer the question. <mermaid>graph LR; A["Input"] --> B["Process"]; B --> C["Output"];</mermaid>

MERMAID RULES:
- Use graph LR only.
- Keep Mermaid on one line.
- Use node IDs like A, B, C, D.
- Wrap labels in double quotes.
- Do not use markdown code blocks.
- Do not use the pipe symbol inside Mermaid labels.
`;
  }

  prompt += `
FINAL RULES:
- Do NOT return JSON.
- Do NOT return markdown.
- Do NOT use code fences.
- Do NOT explain anything.
- Return only the final question paper in DSL format.
`;

  return prompt.trim();
}

const SYSTEM_PROMPT = `
You are an examination paper generator.

Always follow the requested DSL format exactly.

Never return:
- JSON
- Markdown
- Code blocks
- Explanations
- Notes
- Introductory text

Return only the final question paper.
`.trim();

export async function generateQuestionPaper(
  assignment: IAssignment
): Promise<{ text: string; provider: 'gemini' | 'groq' | 'mock' }> {
  const prompt = buildPrompt(assignment);

  // 1. Try Gemini
  try {
    if (!GEMINI_API_KEY) throw new Error('No Gemini API Key');

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (text?.trim()) {
      return { text, provider: 'gemini' };
    }

    throw new Error('Gemini returned empty response');
  } catch (error) {
    console.warn('Gemini generation failed, falling back to Groq:', error);
  }

  // 2. Try Groq
  try {
    if (!GROQ_API_KEY) throw new Error('No Groq API Key');

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 3500,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '';

    if (text.trim()) {
      return { text, provider: 'groq' };
    }

    throw new Error('Groq returned empty response');
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
Q3 | hard | 5 | This is a mock hard question.`,
  };
}
