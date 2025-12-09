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
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-xs mt-1 ${
                index <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'
              }`}
              style={{ minWidth: '50px' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MultiStepIndicator;
