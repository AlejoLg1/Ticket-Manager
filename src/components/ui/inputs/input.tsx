import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  style?: React.CSSProperties;
};

export function Input({ className, style, readOnly, ...props }: InputProps) {
  return (
    <input
      className={`border p-2 rounded-lg focus:outline-none 
        ${readOnly ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed' : ''} 
        ${className}`}
      style={{ borderRadius: '25px', color: 'black', ...style }}
      readOnly={readOnly}
      {...props}
    />
  );
}
