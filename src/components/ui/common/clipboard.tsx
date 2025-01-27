'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/buttons/button';
import { copyToClipboard } from '@utils/commonFunctions';
import { useToast } from '@/hooks/useToast';

interface Props {
  text: string;
  label: string | null;
  classes?: string;
  className?: string;
}

function Clipboard({ text, classes, label, className }: Props) {
  const { addToast } = useToast();

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    copyToClipboard(text);
    addToast('¡Correo copiado con éxito!', 'success');
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
    </div>
  );
}

export default Clipboard;
