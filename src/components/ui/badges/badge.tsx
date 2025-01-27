import React from 'react';
import classNames from 'classnames';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={classNames('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className, {
      'bg-gray-100 text-gray-800': variant === 'default',
      'bg-blue-100 text-blue-800': variant === 'secondary',
    })}>
      {children}
    </span>
  );
}
