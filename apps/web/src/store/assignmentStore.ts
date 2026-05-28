import { create } from 'zustand';

export type QuestionType = {
  id: string;
  type: string;
  count: number;
  marks: number;
};

interface AssignmentState {
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  difficultyMix: string;
  additionalInstructions: string;
  questionTypes: QuestionType[];
  file: File | null;
  isLoading: boolean;
  error: string | null;
  
  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  setGrade: (grade: string) => void;
  setDueDate: (date: string) => void;
  setDifficultyMix: (mix: string) => void;
  setAdditionalInstructions: (instructions: string) => void;
  setFile: (file: File | null) => void;
  
  addQuestionType: () => void;
  updateQuestionType: (id: string, field: keyof QuestionType, value: any) => void;
  removeQuestionType: (id: string) => void;
  
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAssignmentStore = create<AssignmentState>((set) => ({
  title: '',
  subject: '',
  grade: '',
  dueDate: '',
  difficultyMix: 'Medium',
  additionalInstructions: '',
  questionTypes: [
    { id: generateId(), type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: generateId(), type: 'Short Questions', count: 3, marks: 2 },
    { id: generateId(), type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
    { id: generateId(), type: 'Numerical Problems', count: 5, marks: 5 },
  ],
  file: null,
  isLoading: false,
  error: null,

  setTitle: (title) => set({ title }),
  setSubject: (subject) => set({ subject }),
  setGrade: (grade) => set({ grade }),
  setDueDate: (dueDate) => set({ dueDate }),
  setDifficultyMix: (difficultyMix) => set({ difficultyMix }),
  setAdditionalInstructions: (additionalInstructions) => set({ additionalInstructions }),
  setFile: (file) => set({ file }),
  
  addQuestionType: () => set((state) => ({
    questionTypes: [...state.questionTypes, { id: generateId(), type: '', count: 1, marks: 1 }]
  })),
  
  updateQuestionType: (id, field, value) => set((state) => ({
    questionTypes: state.questionTypes.map((qt) => 
      qt.id === id ? { ...qt, [field]: value } : qt
    )
  })),
  
  removeQuestionType: (id) => set((state) => ({
    questionTypes: state.questionTypes.filter((qt) => qt.id !== id)
  })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    title: '',
    subject: '',
    grade: '',
    dueDate: '',
    difficultyMix: 'Medium',
    additionalInstructions: '',
    questionTypes: [
      { id: generateId(), type: 'Multiple Choice Questions', count: 4, marks: 1 },
      { id: generateId(), type: 'Short Questions', count: 3, marks: 2 },
      { id: generateId(), type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
      { id: generateId(), type: 'Numerical Problems', count: 5, marks: 5 },
    ],
    file: null,
    isLoading: false,
    error: null,
  })
}));
