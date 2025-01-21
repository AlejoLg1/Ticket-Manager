'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; 
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFading(true); 
    }, duration - 300);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  if (!isVisible) return null;

  const icons = {
    success: '/images/check.svg',
    error: '/images/error.svg',
    info: '/images/info.svg',
  };

  const containerClass = `
    fixed top-4 right-4 p-4 rounded-lg shadow-lg bg-white border flex items-center gap-2 z-50 
    transition-opacity duration-300
    ${isFading ? 'opacity-0' : 'opacity-100'}
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
