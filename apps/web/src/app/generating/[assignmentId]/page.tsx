'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
import { use } from 'react';

const steps = [
  { id: 'generation:processing', label: 'Processing Request' },
  { id: 'generation:prompt-created', label: 'Building AI Prompt' },
  { id: 'generation:ai-started', label: 'Generating Content via AI' },
  { id: 'generation:parsing', label: 'Structuring Paper' },
  { id: 'generation:validated', label: 'Validating Format' },
  { id: 'generation:saved', label: 'Saving to Database' },
  { id: 'generation:completed', label: 'Ready!' }
];

export default function GeneratingPage({ params }: { params: Promise<{ assignmentId: string }> }) {
  const router = useRouter();
  const { assignmentId } = use(params);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      socket.emit('join-assignment-room', assignmentId);
    });

    steps.forEach((step, index) => {
      socket.on(step.id, () => {
        setCurrentStepIndex(index);
        
        if (step.id === 'generation:completed') {
          setTimeout(() => {
            router.push(`/result/${assignmentId}`);
          }, 1000);
        }
      });
    });

    socket.on('generation:failed', (data: { error: string }) => {
      setError(data.error || 'Generation failed.');
    });

    return () => {
      socket.disconnect();
    };
  }, [assignmentId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white rounded-[32px] p-12 max-w-lg w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center">
        
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 relative">
          <Sparkles className="text-[#FF5722] w-10 h-10 animate-pulse" />
          <div className="absolute inset-0 border-4 border-[#FF5722] rounded-full border-t-transparent animate-spin opacity-20"></div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {error ? 'Generation Failed' : 'Crafting your assignment...'}
        </h1>
        
        <p className="text-sm text-gray-500 mb-10 max-w-[280px]">
          {error ? error : 'Our AI is analyzing your requirements and structuring the perfect paper.'}
        </p>

        {error ? (
          <button 
            onClick={() => router.push('/create-assignment')}
            className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-black transition-colors"
          >
            Try Again
          </button>
        ) : (
          <div className="w-full space-y-5 text-left">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : isCurrent ? (
                      <Loader2 className="w-6 h-6 text-[#FF5722] animate-spin" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-200" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-[#FF5722]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
