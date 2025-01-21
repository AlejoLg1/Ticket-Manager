'use client';

import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Toast from './toast';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
}

export const ToastContext = createContext<ToastContextProps | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => removeToast(id), duration + 300);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toastContainer = (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
      style={{ maxWidth: '300px' }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`transform transition-all duration-300 ease-in-out ${
            index === 0 ? 'mt-0' : 'mt-2' 
          }`}
          style={{
            animation: `slideUp 0.3s ease-in-out`,
          }}
        >
          <Toast message={toast.message} type={toast.type} duration={toast.duration} />
        </div>
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {isClient && ReactDOM.createPortal(toastContainer, document.body)}
    </ToastContext.Provider>
  );
};
