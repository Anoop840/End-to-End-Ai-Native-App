import React from 'react';

interface ModalProps {
  isOpen: boolean;
  message: string;
  codeSnippet: string;
  onApprove: () => void;
  onReject: () => void;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, codeSnippet, onApprove, onReject, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
        <div className="mb-4">
          <p className="text-gray-700 text-center">{message}</p>
        </div>
        <div className="mb-6">
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{codeSnippet}</code>
          </pre>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
