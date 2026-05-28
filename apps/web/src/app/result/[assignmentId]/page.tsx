'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, RefreshCcw } from 'lucide-react';
import { use } from 'react';
import { useAuthStore } from '@/store/authStore';
import Mermaid from '@/components/Mermaid';

interface Question {
  questionNumber: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  type?: string;
  options?: string[];
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

interface GeneratedPaper {
  title: string;
  subject: string;
  duration: string;
  totalMarks: number;
  sections: Section[];
  grade?: string;
}

interface AssignmentMeta {
  title: string;
  subject: string;
  grade: string;
}

const renderQuestionText = (text: string) => {
  const mermaidRegex = /<mermaid>([\s\S]*?)<\/mermaid>/i;
  const match = text.match(mermaidRegex);
  
  if (match) {
    const before = text.substring(0, match.index);
    const chart = match[1];
    const after = text.substring((match.index || 0) + match[0].length);
    
    return (
      <div className="inline">
        {before}
        <Mermaid chart={chart} />
        {after}
      </div>
    );
  }
  
  return text;
};

const getSectionQuestionType = (section: Section, assignment: AssignmentMeta | null): string => {
  const firstQuestion = section.questions[0];
  if (!firstQuestion) return 'Questions';

  if (assignment && (assignment as any).questionConfigurations) {
    const match = (assignment as any).questionConfigurations.find(
      (c: any) => c.marks === firstQuestion.marks
    );
    if (match) {
      const typeLower = match.type.toLowerCase();
      if (typeLower.includes('mcq') || typeLower.includes('multiple choice')) return 'Multiple Choice Questions';
      if (typeLower.includes('short')) return 'Short Answer Questions';
      if (typeLower.includes('long') || typeLower.includes('detailed')) return 'Long Answer Questions';
      return match.type.charAt(0).toUpperCase() + match.type.slice(1);
    }
  }

  const marks = firstQuestion.marks;
  if (marks === 1) return 'Multiple Choice Questions';
  if (marks <= 3) return 'Short Answer Questions';
  return 'Long Answer Questions';
};

export default function ResultPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const router = useRouter();
  const { assignmentId } = use(params);
  const { token, user } = useAuthStore();
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [assignment, setAssignment] = useState<AssignmentMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Fetch assignment metadata
        const assignRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments/${assignmentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (assignRes.ok) {
          const assignData = await assignRes.json();
          setAssignment(assignData);
        }

        // Fetch generated paper
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments/${assignmentId}/result`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPaper(data);
        }
      } catch (err) {
        console.error('Failed to fetch paper', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, token]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleRegenerate = async () => {
    if (!token) return;
    setIsRegenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments/${assignmentId}/regenerate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        router.push(`/generating/${assignmentId}`);
      }
    } catch (err) {
      console.error('Failed to regenerate', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Assignment Result Not Found</h2>
        <p className="text-sm text-gray-500">The paper may still be generating. Please check back shortly.</p>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Top Banner */}
      <div className="bg-[#2A2A2A] rounded-[20px] p-6 mb-8 print:hidden">
        <p className="text-white text-[20px] font-bold leading-relaxed mb-5">
          Certainly, {user?.name}! Here are customized Question Paper for your <strong>{assignment?.subject || paper.subject}</strong> {assignment?.grade || paper.grade || ''} classes on the NCERT chapters:
        </p>
        <div className="flex items-center gap-3">
          <button
  onClick={handleDownloadPDF}
  className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#303030] rounded-full text-[13px] font-bold hover:bg-gray-100 transition-colors shadow-sm font-[family-name:var(--font-bricolage)]"
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.224 5.05526C13.0206 5.00643 12.7929 5 12.0116 5H9.7998C8.94322 5 8.36092 5.00078 7.91083 5.03755C7.47242 5.07337 7.24821 5.1383 7.09181 5.21799C6.71549 5.40974 6.40953 5.7157 6.21778 6.09202C6.13809 6.24842 6.07317 6.47262 6.03735 6.91104C6.00057 7.36113 5.9998 7.94342 5.9998 8.8V12H3.9998L3.99979 8.7587C3.99978 7.95373 3.99977 7.28937 4.04399 6.74818C4.08991 6.18608 4.18848 5.66938 4.43577 5.18404C4.81926 4.43139 5.43118 3.81947 6.18383 3.43598C6.66917 3.18869 7.18587 3.09012 7.74797 3.0442C8.28916 2.99998 8.95353 2.99999 9.7585 3L12.0116 3C12.046 3 12.0799 2.99999 12.1135 2.99997C12.7484 2.99967 13.2282 2.99944 13.6909 3.11052C14.0991 3.20851 14.4893 3.37013 14.8471 3.58944C15.2529 3.83807 15.592 4.17749 16.0408 4.62672C16.0645 4.65043 16.0885 4.67445 16.1128 4.69878L18.301 6.88701C18.3253 6.91134 18.3494 6.93534 18.3731 6.95903C18.8223 7.40782 19.1617 7.74693 19.4104 8.15265C19.6297 8.51054 19.7913 8.90072 19.8893 9.30886C20.0004 9.77155 20.0001 10.2513 19.9998 10.8863C19.9998 10.9199 19.9998 10.9538 19.9998 10.9882V15.2413C19.9998 16.0463 19.9998 16.7106 19.9556 17.2518C19.9097 17.8139 19.8111 18.3306 19.5638 18.816C19.1803 19.5686 18.5684 20.1805 17.8158 20.564C17.3304 20.8113 16.8137 20.9099 16.2516 20.9558C15.7104 21 15.0461 21 14.2411 21H12.9998V19H14.1998C15.0564 19 15.6387 18.9992 16.0888 18.9625C16.5272 18.9266 16.7514 18.8617 16.9078 18.782C17.2841 18.5903 17.5901 18.2843 17.7818 17.908C17.8615 17.7516 17.9264 17.5274 17.9622 17.089C17.999 16.6389 17.9998 16.0566 17.9998 15.2V10.9882C17.9998 10.2069 17.9934 9.97916 17.9445 9.77575C17.8955 9.57168 17.8147 9.37659 17.7051 9.19765C17.5958 9.01929 17.4393 8.85373 16.8868 8.30122L14.6986 6.113C14.1461 5.56048 13.9805 5.40402 13.8022 5.29472C13.6232 5.18506 13.4281 5.10426 13.224 5.05526Z"
      fill="#303030"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.52545 16.5257L6.43059 13.8103H7.56901L8.47414 16.5257L11.1895 17.4308V18.5692L8.47414 19.4743L7.56901 22.1897H6.43059L5.52545 19.4743L2.81006 18.5692V17.4308L5.52545 16.5257Z"
      fill="#303030"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9998 5V9H17.9998V11H12.9998C12.4475 11 11.9998 10.5523 11.9998 10V5H13.9998Z"
      fill="#303030"
    />
  </svg>

  <span>Download as PDF</span>
</button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-full text-[13px] font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={15} className={isRegenerating ? 'animate-spin' : ''} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {/* Question Paper */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden print:overflow-visible print:shadow-none print:border-0 print:rounded-none">
        <div className="px-10 py-10 md:px-16 md:py-14">
          
          {/* Paper Header */}
          <div className="text-center mb-8 pb-6">
            <h1 className="font-[family-name:var(--font-bricolage)] text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">
              {user?.schoolName || 'School Name'}{user?.city ? `, ${user.city}` : ', Location'}
            </h1>
            <p className="text-sm font-semibold text-gray-700 mb-0.5">Subject: {paper.subject}</p>
            <p className="text-sm font-semibold text-gray-700">Class: {assignment?.grade || paper.grade || ''}</p>
          </div>

          {/* Time and Marks Row */}
          <div className="flex justify-between items-center mb-6 text-sm font-semibold text-gray-800">
            <span>Time Allowed: {paper.duration}</span>
            <span>Maximum Marks: {paper.totalMarks}</span>
          </div>

          {/* General Instructions */}
          <div className="mb-6 text-sm text-gray-700">
            <p className="font-semibold">All questions are compulsory unless stated otherwise.</p>
          </div>

          {/* Student Info Fields */}
          <div className="mb-10 text-sm text-gray-800 space-y-2">
            <p>Name: ____________________</p>
            <p>Roll Number: ____________________</p>
            <p>Class: {assignment?.grade || paper.grade || '___'} Section: _________</p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {paper.sections.map((section, sIndex) => (
              <div key={sIndex}>
                <h2 className="font-[family-name:var(--font-bricolage)] text-center text-lg font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-sm font-semibold text-gray-700 mb-1">{getSectionQuestionType(section, assignment)}</p>
                <p className="text-sm italic text-gray-600 mb-6">{section.instruction}</p>
                
                <div className="space-y-5">
                  {section.questions.map((q, qIndex) => (
                    <div key={qIndex} className="flex gap-3 text-sm leading-relaxed">
                      <span className="font-semibold text-gray-900 shrink-0">{q.questionNumber}.</span>
                      <div className="flex-1">
                        <span className="text-gray-800">
                          [{q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}] {renderQuestionText(q.text)} [{q.marks} Marks]
                        </span>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 ml-1">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="font-semibold text-gray-900 shrink-0">{String.fromCharCode(65 + optIdx)})</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* End of Paper */}
          <div className="mt-12 pt-6 text-center">
            <p className="text-sm font-bold text-gray-700">End of Question Paper</p>
          </div>

        </div>
      </div>
    </div>
  );
}