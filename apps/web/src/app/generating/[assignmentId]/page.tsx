'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
import { use } from 'react';
import { useAuthStore } from '@/store/authStore';

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
  const { token } = useAuthStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const hasRedirected = useRef(false);

  const redirectToResult = () => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    router.push(`/result/${assignmentId}`);
  };

  // Socket-based real-time updates
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    // Socket needs the base URL without /api path
    const socketUrl = apiUrl.replace(/\/api\/?$/, '');

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('Socket connected for assignment:', assignmentId);
      socket.emit('join-assignment-room', assignmentId);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    steps.forEach((step, index) => {
      socket.on(step.id, () => {
        setCurrentStepIndex(index);

        if (step.id === 'generation:completed') {
          setTimeout(redirectToResult, 1000);
        }
      });
    });

    socket.on('generation:failed', (data: { error: string }) => {
      setError(data.error || 'Generation failed.');
    });

    return () => {
      socket.disconnect();
    };
  }, [assignmentId]);

  // Polling fallback — checks assignment status every 5 seconds
  // This ensures redirect works even if socket connection fails
  useEffect(() => {
    if (!token) return;

    const pollInterval = setInterval(async () => {
      if (hasRedirected.current) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments/${assignmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed') {
            setCurrentStepIndex(steps.length - 1);
            setTimeout(redirectToResult, 1000);
          } else if (data.status === 'failed') {
            setError('Generation failed. Please try again.');
            clearInterval(pollInterval);
          }
        }
      } catch {
        // Silently ignore polling errors — socket might still work
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [assignmentId, token]);

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

