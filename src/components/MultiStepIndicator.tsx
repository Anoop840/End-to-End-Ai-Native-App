import React from 'react';

interface MultiStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const MultiStepIndicator: React.FC<MultiStepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center py-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`flex flex-col items-center relative`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors duration-300 ${
                index < currentStep
                  ? 'bg-emerald-500 text-white' // Success step color
                  : index === currentStep
                  ? 'bg-blue-600 text-white animate-pulse' // Active step pulsing blue
                  : 'bg-gray-300 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400' // Inactive step
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-xs mt-2 text-center max-w-[80px] transition-colors duration-300 ${
                index <= currentStep ? 'text-gray-900 dark:text-zinc-50 font-bold' : 'text-gray-500 dark:text-zinc-500'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 rounded-full mx-2 transition-colors duration-500 ease-in-out`}
              style={{ minWidth: '50px', 
              background: index < currentStep ? 'var(--accent)' : '#d1d5db' // Use CSS variable for progress line
            }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MultiStepIndicator;
