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
OPTIONS: A) <option1> | B) <option2> | C) <option3> | D) <option4>

(You can have multiple SECTION blocks)

RULES FOR SPECIFIC QUESTION TYPES:

1. **Multiple Choice Questions (MCQs):**
   Every MCQ MUST have an OPTIONS: line immediately after the question line.
   The OPTIONS: line must contain exactly 4 choices labeled A), B), C), D) separated by |.
   One of the options must be the correct answer.
   Example:
   Q1 | easy | 1 | What is the SI unit of force?
   OPTIONS: A) Joule | B) Newton | C) Watt | D) Pascal

2. **Diagram/Graph-Based Questions:**
   Every Diagram/Graph-Based question MUST include a Mermaid.js diagram inside <mermaid>...</mermaid> tags directly in the question text.
   The diagram must be relevant and meaningful to the question being asked.
   Use valid Mermaid.js syntax (flowcharts, pie charts, graphs, class diagrams, etc.).
   Do NOT skip the diagram. Do NOT use placeholder text instead of a diagram.
   CRITICAL MERMAID SYNTAX RULE: Always wrap node text labels inside Mermaid shapes in double quotes. For example, use A["Battery 12V"] instead of A[Battery 12V], and D["Voting Classifier (Soft Voting)"] instead of D[Voting Classifier (Soft Voting)]. Never put raw parentheses or special characters inside labels without enclosing the entire label text in double quotes. This prevents parser render errors.
   Example:
   Q5 | medium | 5 | Study the following circuit diagram and answer: What is the total resistance? <mermaid>graph LR; A["Battery 12V"] --> B["R1 = 4Ω"]; B --> C["R2 = 6Ω"]; C --> A;</mermaid>

3. **All Other Question Types (Short, Long, Numerical):**
   These do not need OPTIONS: or <mermaid> tags. Just provide the question text.

Full Example:
PAPER_TITLE: Science Mid Term
SUBJECT: Physics
DURATION: 3 Hours
TOTAL_MARKS: 30

SECTION: A
INSTRUCTION: Choose the correct option for each question.
Q1 | easy | 1 | What is the unit of force?
OPTIONS: A) Joule | B) Newton | C) Watt | D) Pascal
Q2 | easy | 1 | Which law explains F = ma?
OPTIONS: A) First law | B) Second law | C) Third law | D) Law of gravitation

SECTION: B
INSTRUCTION: Answer the following short questions.
Q3 | medium | 2 | Define Newton's second law of motion.
Q4 | medium | 2 | What is the difference between mass and weight?

SECTION: C
INSTRUCTION: Study the diagrams and answer the questions.
Q5 | hard | 5 | Observe the following circuit and calculate the total resistance when R1 and R2 are connected in series. <mermaid>graph LR; A["Battery"] --> B["R1 = 3Ω"]; B --> C["R2 = 7Ω"]; C --> A;</mermaid>
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
