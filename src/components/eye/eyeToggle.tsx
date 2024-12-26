"use client";

import React, { useState } from "react";
import EyeOpen from "@/components/eye/eyeOpen";
import EyeClose from "@/components/eye/eyeClose";

interface EyeToggleProps {
  fill?: string;
  size?: number;
}

const EyeToggle: React.FC<EyeToggleProps> = ({ fill = "black", size = 60 }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        display: "inline-block",
        padding: "10px",
      }}
    >
      {isOpen ? (
        <EyeOpen fill={fill} size={size} />
      ) : (
        <EyeClose fill={fill} size={size} />
      )}
    </div>
  );
};

export default EyeToggle;
