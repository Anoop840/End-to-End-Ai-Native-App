import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ModalProps {
  isOpen: boolean;
  message: string;
  codeSnippet: string;
  onApprove: () => void;
  onReject: () => void;
  onClose?: () => void;
  approveButtonText?: string;
  rejectButtonText?: string;
  modalTitle?: string;
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen,
    message, 
    codeSnippet, 
    onApprove, 
    onReject, 
    onClose,
    approveButtonText = 'Approve & Apply Code', 
    rejectButtonText = 'Reject & Refine', 
    modalTitle = 'AI Proposed Solution'
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };
  // Simple heuristic to determine language for highlighting
  const language = codeSnippet.trim().startsWith('import') || codeSnippet.trim().includes('const') 
    ? (codeSnippet.trim().includes('React.FC') || codeSnippet.trim().includes('.tsx') ? 'tsx' : 'typescript')
    : 'javascript';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl transform transition-transform scale-100 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Use dynamic title */}
        <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-zinc-50">{modalTitle}</h3> 
        <div className="mb-4 text-center">
          <p className="text-gray-700 dark:text-zinc-300 font-medium">{message}</p>
        </div>
        
        {/* Code Snippet with Syntax Highlighting */}
        <div className="mb-6 flex-grow overflow-y-auto rounded-lg border border-zinc-700">
          <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={true} customStyle={{ 
            borderRadius: '0.5rem', 
            padding: '1rem',
            margin: 0,
            fontSize: '0.8rem',
            lineHeight: '1.4'
          }}>
            {codeSnippet}
          </SyntaxHighlighter>
        </div>

        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={onReject}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            {rejectButtonText}
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {approveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
