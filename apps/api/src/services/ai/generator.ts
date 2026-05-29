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

  let prompt = `You are an expert exam creator who creates exam papers that truly test students' understanding and ability. Generate a structured question paper based on the following details.

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
Do NOT return JSON.
Do NOT return markdown formatting.
Do NOT wrap output in code blocks.
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
   Every Diagram/Graph-Based question MUST include one Mermaid.js diagram inside <mermaid>...</mermaid> tags directly in the question text.
   The diagram must be relevant and meaningful to the uploaded study material and the question.
   Do NOT skip the diagram.
   Do NOT use placeholder text instead of a diagram.
   Do NOT include more than one Mermaid diagram in a single question.

   CRITICAL MERMAID SAFETY RULES:
   - The Mermaid code must be valid and renderable by Mermaid.js.
   - Prefer simple graph/flowchart diagrams because they are safest.
   - Use graph LR; or flowchart LR; for most diagrams.
   - Use sequenceDiagram only when the question is about communication, request flow, process interaction, or networking.
   - Use classDiagram only when the question is specifically about OOP/classes/entities/relationships.
   - If you are uncertain which diagram type is valid, always use graph LR;.
   - Never invent Mermaid syntax.
   - Do NOT use markdown code fences inside <mermaid> tags.
   - Do NOT use escaped newline characters like \\n inside Mermaid code.
   - Keep the Mermaid diagram on one line.
   - Do NOT use semicolons inside labels.
   - Do NOT use the pipe character | inside Mermaid labels because | is used by the DSL parser.
   - Do NOT use double quotes inside labels except the outer label quotes.
   - Avoid curly braces unless Mermaid syntax requires them.

   SAFE GRAPH/FLOWCHART RULES:
   - Use node IDs like A, B, C, D, E.
   - Always wrap visible node text in double quotes.
   - Correct: A["Population"] --> B["Random sample"]
   - Wrong: A[Population (Group A)] --> B[Sample]
   - If label text has parentheses, symbols, commas, or special characters, keep the entire label inside double quotes.
   - Example:
   <mermaid>graph LR; A["Population"] --> B["Sampling method"]; B --> C["Selected sample"]; C --> D["Possible limitation: under-representation"];</mermaid>

   CLASS DIAGRAM RULES:
   - Use classDiagram only for real class/entity relationship questions.
   - Class names must be single identifiers without spaces.
   - Correct: class SimpleRandomSampling
   - Wrong: class "Simple Random Sampling"
   - Do NOT put long descriptions as class attributes.
   - Do NOT use quoted class names.
   - Do NOT use invalid custom fields like -description: "text".
   - Prefer relationships only.
   - Example:
   <mermaid>classDiagram; class Teacher; class Assignment; class Question; Teacher --> Assignment; Assignment --> Question;</mermaid>

   SEQUENCE DIAGRAM RULES:
   - Use sequenceDiagram only for step-by-step interaction questions.
   - Use simple participant names without special characters.
   - Example:
   <mermaid>sequenceDiagram; participant Student; participant System; Student->>System: Upload file; System->>System: Extract text; System-->>Student: Show generated paper;</mermaid>

   PIE CHART RULES:
   - Use pie chart only for percentage/proportion questions.
   - Do NOT use pie charts if exact Mermaid syntax is uncertain.
   - Example:
   <mermaid>pie title Question Type Distribution; "MCQ" : 40; "Short Answer" : 35; "Long Answer" : 25;</mermaid>

   Example:
   Q5 | medium | 5 | Study the following circuit diagram and answer: What is the total resistance? <mermaid>graph LR; A["Battery 12V"] --> B["R1 = 4 ohm"]; B --> C["R2 = 6 ohm"]; C --> A;</mermaid>

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
Q5 | hard | 5 | Observe the following circuit and calculate the total resistance when R1 and R2 are connected in series. <mermaid>graph LR; A["Battery"] --> B["R1 = 3 ohm"]; B --> C["R2 = 7 ohm"]; C --> A;</mermaid>
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
