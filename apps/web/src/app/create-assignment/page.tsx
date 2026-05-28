'use client';

import { useState, useCallback } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Plus, Minus, ArrowRight, ArrowLeft, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuthStore } from '@/store/authStore';

export default function CreateAssignment() {
  const router = useRouter();
  const { token, _hasHydrated } = useAuthStore();
  const [step, setStep] = useState(1);
  
  const {
    title, setTitle, subject, setSubject, grade, setGrade,
    dueDate, setDueDate, difficultyMix, setDifficultyMix,
    additionalInstructions, setAdditionalInstructions,
    questionTypes, addQuestionType, updateQuestionType, removeQuestionType,
    file, setFile, isLoading, setIsLoading, error, setError
  } = useAssignmentStore();

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in
  if (_hasHydrated && !token) {
    router.push('/login');
    return null;
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
    maxSize: 10485760, // 10MB
  });

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
  const totalMarks = questionTypes.reduce((sum, qt) => sum + (qt.count * qt.marks), 0);

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Assignment title is required';
    if (!subject.trim()) errors.subject = 'Subject is required';
    if (!grade.trim()) errors.grade = 'Class/grade is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!dueDate) errors.dueDate = 'Due date is required';
    
    if (questionTypes.length === 0) {
      errors.questionTypes = 'At least one question type is required';
    } else {
      questionTypes.forEach((qt, idx) => {
        if (!qt.type.trim()) errors[`qt-${idx}`] = 'Question type cannot be empty';
      });
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('grade', grade);
      formData.append('dueDate', dueDate);
      formData.append('difficultyMix', difficultyMix);
      formData.append('additionalInstructions', additionalInstructions);
      
      const questionConfigurations = questionTypes.map(qt => ({
        type: qt.type,
        count: qt.count,
        marks: qt.marks
      }));
      formData.append('questionConfigurations', JSON.stringify(questionConfigurations));

      if (file) {
        formData.append('file', file);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create assignment');
      }

      const assignment = await res.json();
      
      const genRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments/${assignment._id}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!genRes.ok) {
        throw new Error('Failed to start generation');
      }

      router.push(`/generating/${assignment._id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-6 pb-32 animate-fade-in">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="font-bold text-gray-900">Create Assignment</span>
        </div>
        <p className="text-sm text-gray-500 mb-8">Set up a new assignment for your students</p>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-center relative w-full h-[40px] mb-6">
        <button 
          onClick={() => router.back()}
          className="absolute left-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-[#303030]" />
        </button>
        <h1 className="text-[18px] font-bold text-[#303030]">
          Create Assignment
        </h1>
      </div>

      {/* Progress Line */}
      <div className="flex gap-1 mb-8">
        <div className="h-1 bg-gray-600 rounded-full flex-1"></div>
        <div className={`h-1 rounded-full flex-1 transition-colors duration-500 ${step === 2 ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
      </div>

      <div className="bg-[#F8F9FA] rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 relative">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Assignment Details</h2>
          <p className="text-sm text-gray-500">Basic information about your assignment</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quiz on Electricity"
                  className={`w-full px-4 py-3.5 rounded-xl border ${validationErrors.title ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm bg-white`}
                />
                {validationErrors.title && <p className="text-red-500 text-xs mt-1.5">{validationErrors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Physics"
                  className={`w-full px-4 py-3.5 rounded-xl border ${validationErrors.subject ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm bg-white`}
                />
                {validationErrors.subject && <p className="text-red-500 text-xs mt-1.5">{validationErrors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Class / Grade</label>
                <input 
                  type="text" 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 10th Grade"
                  className={`w-full px-4 py-3.5 rounded-xl border ${validationErrors.grade ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm bg-white`}
                />
                {validationErrors.grade && <p className="text-red-500 text-xs mt-1.5">{validationErrors.grade}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Mix</label>
                <select 
                  value={difficultyMix}
                  onChange={(e) => setDifficultyMix(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-sm appearance-none bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer bg-white ${isDragActive ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input {...getInputProps()} />
                <UploadCloud size={28} className="text-gray-800 mb-4" />
                <p className="text-[15px] font-semibold text-gray-900 mb-1">
                  {file ? file.name : 'Choose a file or drag & drop it here'}
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'JPEG, PNG, up to 10MB'}
                </p>
                <button type="button" className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                  {file ? 'Change File' : 'Browse Files'}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 font-medium">Upload images of your preferred document/image</p>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-800 mb-2">Due Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-5 py-4 rounded-xl border ${validationErrors.dueDate ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-gray-400 transition-colors text-[13px] bg-white`}
                />
                {validationErrors.dueDate && <p className="text-red-500 text-xs mt-1.5">{validationErrors.dueDate}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <label className="text-[13px] font-bold text-gray-800">Question Type</label>
                <div className="flex gap-12 text-[13px] font-bold text-gray-800">
                  <span>No. of Questions</span>
                  <span className="w-16">Marks</span>
                </div>
              </div>

              <div className="space-y-3">
                {questionTypes.map((qt, index) => (
                  <div key={qt.id} className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <select 
                        value={qt.type}
                        onChange={(e) => updateQuestionType(qt.id, 'type', e.target.value)}
                        className={`w-full px-5 py-4 rounded-xl border ${validationErrors[`qt-${index}`] ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-gray-400 transition-colors text-[13px] font-medium bg-white appearance-none`}
                      >
                        <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                        <option value="Short Questions">Short Questions</option>
                        <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                        <option value="Numerical Problems">Numerical Problems</option>
                        <option value="Long Answer Questions">Long Answer Questions</option>
                      </select>
                    </div>
                    <button onClick={() => removeQuestionType(qt.id)} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <X size={16} />
                    </button>
                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-1 py-1 w-[120px] justify-between">
                      <button onClick={() => updateQuestionType(qt.id, 'count', Math.max(1, qt.count - 1))} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Minus size={14} /></button>
                      <span className="text-[13px] font-bold text-gray-800">{qt.count}</span>
                      <button onClick={() => updateQuestionType(qt.id, 'count', qt.count + 1)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center bg-white border border-gray-200 rounded-full px-1 py-1 w-[100px] justify-between">
                      <button onClick={() => updateQuestionType(qt.id, 'marks', Math.max(1, qt.marks - 1))} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Minus size={14} /></button>
                      <span className="text-[13px] font-bold text-gray-800">{qt.marks}</span>
                      <button onClick={() => updateQuestionType(qt.id, 'marks', qt.marks + 1)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              {validationErrors.questionTypes && <p className="text-red-500 text-xs mt-2">{validationErrors.questionTypes}</p>}

              <button onClick={addQuestionType} className="flex items-center gap-3 text-[13px] font-bold text-gray-800 mt-6 hover:text-black transition-colors">
                <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center">
                  <Plus size={14} />
                </div>
                Add Question Type
              </button>
              
              <div className="flex flex-col items-end mt-4 text-[13px] text-gray-700 space-y-1 font-medium">
                <div>Total Questions : <span className="font-bold">{totalQuestions}</span></div>
                <div>Total Marks : <span className="font-bold">{totalMarks}</span></div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[13px] font-bold text-gray-800 mb-2">Additional Information (For better output)</label>
              <div className="relative">
                <textarea 
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors text-[13px] h-28 resize-none bg-white/50"
                ></textarea>
                <button className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-800">
                  <Mic size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-[88px] lg:bottom-0 left-0 lg:left-[280px] right-0 bg-transparent p-6 flex justify-center gap-4 items-center z-20 max-w-4xl mx-auto lg:px-8 pointer-events-none">
        <button 
          onClick={handlePrevious}
          className="pointer-events-auto px-5 lg:px-6 py-3 bg-white text-gray-800 font-bold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex items-center gap-2 text-sm lg:text-base h-[48px]"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={isLoading}
          className="pointer-events-auto px-8 lg:px-10 py-3 bg-[#1C1C1C] hover:bg-black text-white font-bold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm lg:text-base h-[48px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Generating...</span>
            </div>
          ) : (
            <>
              Next
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
