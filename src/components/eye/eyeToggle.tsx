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

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      style={{ cursor: "pointer", display: "inline-block" }}
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
