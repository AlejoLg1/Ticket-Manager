'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/buttons/button';

export default function Upload({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setError(null);
      const newFiles = Array.from(event.target.files);
      const validFiles = newFiles.filter((file) => {
        if (file.size > 4.5 * 1024 * 1024) {
          setError(`El archivo "${file.name}" excede el tamaño máximo de 4.5MB.`);
          return false;
        }
        return true;
      });

      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      onFilesSelected([...files, ...validFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-[15px]">
      <label className="mb-4 inline-block">
        <Button
          type="button"
          className="bg-[#CF230F] text-white bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)] hover:from-[#B01E0D] hover:to-[#B01E0D] !px-4 !py-1 rounded-full flex items-center"
          onClick={handleButtonClick}
        >
          Adjuntar Archivos
          <Image
            src="/images/upload.svg"
            alt="upload-logo"
            width={40}
            height={40}
            className="ml-1 stroke-white stroke-1"
          />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {files.length > 0 && (
        <div className="max-h-40 overflow-y-auto">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-white rounded-[25px] shadow-sm"
              >
                <span className="text-gray-700">{file.name}</span>
                <button
                  type="button"
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  <Image
                    src="/images/trash-can.svg"
                    alt="delete-logo"
                    width={28}
                    height={16}
                    className="ml-1 stroke-white stroke-1"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
