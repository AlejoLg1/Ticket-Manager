import React, { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  style?: React.CSSProperties;
};

export function Input({ className, style, ...props }: InputProps) {
  return (
    <input
      className={`border p-2 rounded-lg focus:outline-none ${className}`}
      style={{ borderRadius: '25px', color: 'black', ...style }}
      {...props}
    />
  );
}
