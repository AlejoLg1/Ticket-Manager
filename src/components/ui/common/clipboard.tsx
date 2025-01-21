'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/buttons/button';
import { copyToClipboard } from '@utils/commonFunctions';
import Toast from '@/components/ui/toasts/toast';

interface Props {
  text: string;
  label: string | null;
  classes?: string;
  className?: string;
}

function Clipboard({ text, classes, label, className }: Props) {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    copyToClipboard(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div
      className={`col gap-2 w-full h-[76px] ${className || ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {label && <p className="text-body-m">{label}</p>}
      <Button
        className={`w-full p-2 border rounded-full text-black flex items-center justify-between bg-gray-200 hover:bg-gray-300 ${classes || ''}`}
        onClick={handleCopy}
      >
        <span className="whitespace-nowrap overflow-hidden text-ellipsis text-left text-gray-500">
          {text}
        </span>
        <div className="ml-2 shrink-0">
          <Image
            src="/images/clipboard.svg"
            alt="clipboard"
            width={24}
            height={24}
          />
        </div>
      </Button>
      {showToast && <Toast message="¡Correo copiado con éxito!" type="success" />}
    </div>
  );
}

export default Clipboard;
