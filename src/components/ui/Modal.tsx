import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 ${className}`}>
        <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;
