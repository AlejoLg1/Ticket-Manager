'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; 
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 300);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: '/images/check.svg',
    error: '/images/error.svg',
    info: '/images/info.svg',
  };

  const containerClass = `
    relative w-full max-w-[300px] p-4 rounded-lg shadow-lg bg-white border flex items-center gap-2 z-50
    transition-all duration-300 ease-in-out
    ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
  `;

  return (
    <div className={containerClass} role="alert">
      {type && (
        <Image
          src={icons[type]}
          alt={type}
          width={24}
          height={24}
          className="shrink-0"
        />
      )}
      <span className="text-black font-medium">{message}</span>
    </div>
  );
};

export default Toast;
