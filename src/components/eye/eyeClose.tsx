"use client";

import React from "react";

interface EyeProps {
  fill?: string;
  size?: number;
  fileCount?: number; // Nueva prop para el contador
}

const EyeClose: React.FC<EyeProps> = ({ fill = "black", size = 24, fileCount = 0 }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" fill={fill} />
        <path d="M3 20l1-3" />
        <path d="M7 23l1-4" />
        <path d="M12 24l0-5" />
        <path d="M17 23l-1-4" />
        <path d="M21 20l-1-3" />
      </svg>
      <span style={{ fontSize: "12px", color: "red", fontWeight: "bold"}}>({fileCount})</span>
    </div>
  );
};

export default EyeClose;
