// anoop840/end-to-end-ai-native-app/End-to-End-Ai-Native-App-abe9c590d0b9a39301bc24e51dd2618ef037fe4c/src/components/AICreationForm.tsx
'use client';

import React, { useState, FormEvent, useCallback } from 'react';
import Modal from './Modal';
import MultiStepIndicator from './MultiStepIndicator';

// Define the steps for the indicator
const steps = ['Submit Idea', 'AI Review', 'Approve Change', 'Complete'];

// New interface for the expected AI response to support structured output
interface AiResponse {
  message: string;
  codeSnippet: string; 
  fileName?: string; // New field from structured AI output
}

const AICreationForm: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>(''); 
  const [fileName, setFileName] = useState<string>('src/ai-generated-logic.ts'); // Default file name

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentStep(1); 

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data: AiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'AI generation failed');
      }

      setAiMessage(data.message);
      setCodeSnippet(data.codeSnippet);
      setFileName(data.fileName || 'src/ai-generated-logic.ts'); // Use the file name suggested by AI
      setCurrentStep(2); 
      setIsModalOpen(true);
      
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'An unexpected error occurred during AI processing.');
      setCurrentStep(0); 
    } finally {
      setIsLoading(false);
    }
  }, [text]);
  
  const handleApprove = async () => {
    setIsModalOpen(false);
    setCurrentStep(3);

    try {
        const response = await fetch('/api/apply-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codeSnippet, fileName }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to apply code.');
        }

        setCurrentStep(3);

        // Optional: Reset the form after success
        setTimeout(() => {
            setText('');
            setCodeSnippet('');
            setAiMessage('');
            setCurrentStep(0);
        }, 3000); 

    } catch (err: any) {
        console.error('Code Application Error:', err);
        setError(err.message || 'Failed to save the code to the file system.');
        setCurrentStep(2); 
        setIsModalOpen(true); 
    }
  };
  
  const handleReject = () => {
    alert('Change Rejected. Please refine your request.');
    setIsModalOpen(false);
    setCurrentStep(0); 
    setCodeSnippet('');
    setAiMessage('');
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };
  
  const isComplete = currentStep === 3;
  const isDisabled = isLoading || isModalOpen || isComplete;
  
  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-zinc-50">AI-Driven Feature Builder</h2>
      
      <MultiStepIndicator steps={steps} currentStep={currentStep} />
      
      {/* Main Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the feature or change you want the AI to generate (e.g., 'Add a dark mode toggle to the header')."
          className={`w-full h-32 p-4 border rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-opacity-50 dark:bg-zinc-800 dark:text-zinc-50 transition-all duration-300 ${
            isDisabled 
            ? 'border-gray-300 dark:border-zinc-700 cursor-not-allowed opacity-70'
            : 'border-blue-300 dark:border-blue-600 focus:ring-blue-500/50'
          }`}
          required
          disabled={isDisabled}
        />
        <button
          type="submit"
          className={`w-full font-extrabold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            isDisabled
              ? 'bg-gray-400 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.01] active:scale-[0.99] shadow-emerald-500/50'
          }`}
          disabled={isDisabled}
        >
          {isLoading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 014 12z"></path>
            </svg>
          )}
          {isLoading ? 'Consulting AI...' : isComplete ? 'Task Completed' : 'Generate Code Solution'}
        </button>
      </form>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-xl dark:bg-red-950 dark:text-red-300 dark:border-red-700 text-center">
          Error: {error}
        </div>
      )}
      
      {/* AI Review Modal */}
      <Modal 
        isOpen={isModalOpen}
        message={aiMessage || "The AI has generated a proposed solution."}
        codeSnippet={codeSnippet}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={handleClose}
      />
      
      {/* Completion Message */}
      {isComplete && (
        <div className="mt-4 p-4 bg-emerald-100 text-emerald-800 border border-emerald-400 rounded-xl dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700 text-center font-bold">
          ✅ AI-driven task completed and approved! Ready for a new task.
        </div>
      )}
    </div>
  );
};

export default AICreationForm;