"use client";

import React from "react";

interface EyeProps {
  fill?: string;
  size?: number;
}

const EyeOpen: React.FC<EyeProps> = ({ fill = "black", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-4 -4 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="2" fill={fill} />
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />

      <path d="M3 4l1 3" />
      <path d="M7 1l1 4" />
      <path d="M12 0l0 5" />
      <path d="M17 1l-1 4" />
      <path d="M21 4l-1 3" />
    </svg>
  );
};

export default EyeOpen;
