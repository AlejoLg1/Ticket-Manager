import React from 'react';

interface TextAreaProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

export const TextArea = ({
  name,
  placeholder,
  value,
  onChange,
  required,
  readOnly,
  className,
}: TextAreaProps) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      readOnly={readOnly}
      className={`w-full h-[150px] placeholder-gray-500 resize-none p-2 border rounded-[15px] focus:outline-none text-black 
        ${readOnly ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed' : 'focus:border-gray-300'} 
        ${className} custom-scrollbar`}
    />
  );
};
