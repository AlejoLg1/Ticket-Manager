import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  className?: string;
};

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
