'use client'

import { Button } from '@/components/ui/buttons/button'
import React, { useRef, useState } from 'react'

export default function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-[15px]">
      <label className="mb-4 inline-block">
        <Button
          type="button"
          className="bg-[#CF230F] text-white hover:bg-[#B01E0D] !px-4 !py-1 rounded-full flex items-center"
          onClick={handleButtonClick}
        >
          Adjuntar Archivos
          <img
            src="/images/upload.svg"
            alt="upload-logo"
            className="ml-1 w-10 h-10 stroke-white stroke-1"
          />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="max-h-40 overflow-y-auto">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-white rounded-[25px] shadow-sm">
                <span className="text-gray-700">{file.name}</span>
                <button
                  type="button"
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  <img
                    src="/images/trash-can.svg"
                    alt="upload-logo"
                    className="ml-1 w-8 h-5 stroke-white stroke-1"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
