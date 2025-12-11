'use client';

import React, { useState, FormEvent, useCallback } from 'react';
import Modal from './Modal';
import MultiStepIndicator from './MultiStepIndicator';
// Note: We use the existing Modal and MultiStepIndicator from the components folder.

// Define the steps for the indicator
const steps = ['Submit Idea', 'AI Review', 'Approve Change', 'Complete'];

const AICreationForm: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    // Start at step 1: AI Review
    setCurrentStep(1); 

    try {
      // 1. Call the new API route
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI generation failed');
      }

      // 2. Store the AI response and open the modal
      setAiMessage(data.message);
      setCodeSnippet(data.codeSnippet);
      setCurrentStep(2); // Move to step 3: Approve Change
      setIsModalOpen(true);
      
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'An unexpected error occurred during AI processing.');
      setCurrentStep(0); // Reset on error
    } finally {
      setIsLoading(false);
    }
  }, [text]);
  
  const handleApprove = async () => {
    setIsModalOpen(false);
    setCurrentStep(3); // Temporarily move to Complete step while processing

    try {
        // Call the new API to apply the code
        const response = await fetch('/api/apply-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codeSnippet }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to apply code.');
        }

        alert(data.message); // Show success message
        setCurrentStep(3); // Lock the "Complete" step

        // Optional: Reset the form after success
        setTimeout(() => {
            setText('');
            setCodeSnippet('');
            setAiMessage('');
            setCurrentStep(0);
        }, 5000);

    } catch (err: any) {
        console.error('Code Application Error:', err);
        setError(err.message || 'Failed to save the code to the file system.');
        setCurrentStep(2); // Move back to review step on error
    }
  };
  
  const handleReject = () => {
    // Logic for rejection (e.g., dismissing the change, allowing user to edit prompt)
    alert('Change Rejected. Please refine your request.');
    setIsModalOpen(false);
    setCurrentStep(0); // Reset to step 1: Submit Idea for refinement
  };

  const handleClose = () => {
    // Allow closing the modal to review the prompt
    setIsModalOpen(false);
  };
  
  return (
    <div className="max-w-xl w-full mx-auto p-4 bg-white dark:bg-black rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-zinc-50">Code Generation Workflow</h2>
      
      {/* Multi-Step Indicator */}
      <MultiStepIndicator steps={steps} currentStep={currentStep} />
      
      {/* Main Form Area */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the feature or change you want the AI to generate (e.g., 'Add a dark mode toggle to the header')."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700"
          required
          disabled={isLoading || isModalOpen}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400"
          disabled={isLoading || isModalOpen || currentStep === 3}
        >
          {isLoading ? 'AI Thinking...' : currentStep === 3 ? 'Process Complete' : 'Generate Code Idea'}
        </button>
      </form>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg">
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
      {currentStep === 3 && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded-lg text-center font-medium">
          ✅ AI-driven task completed and approved! Ready for a new task.
        </div>
      )}
    </div>
  );
};

export default AICreationForm;