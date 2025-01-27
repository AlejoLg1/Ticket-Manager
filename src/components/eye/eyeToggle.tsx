"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import EyeOpen from "@/components/eye/eyeOpen";
import EyeClose from "@/components/eye/eyeClose";
import { Button } from '@/components/ui/buttons/button';
import { EyeToggleProps , FileDetails } from '@/models/eyeToggle/eyeToggle'

const EyeToggle: React.FC<EyeToggleProps> = ({ ticketId, fill = "black", size = 60 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileDetails[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/services/upload?ticketNumber=${ticketId}`);
        const data = await response.json();
        if (data.success) {
          setFiles(data.files);
        }
      } catch (error) {
        console.error("Error al cargar los archivos:", error);
      }
    };

    fetchFiles();
  }, [ticketId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentFileIndex((prev) => (prev + 1) % files.length);
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentFileIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        cursor: "pointer",
        display: "inline-block",
        padding: "10px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {isOpen ? <EyeOpen fill={fill} size={size} /> : <EyeClose fill={fill} size={size} fileCount={files.length}/> }
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",    
              justifyContent: "center", 
              textAlign: "center",
              gap: "1rem",             
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {files[currentFileIndex].name.endsWith(".png") ||
            files[currentFileIndex].name.endsWith(".jpg") ? (
              <img
                src={files[currentFileIndex].url}
                alt={files[currentFileIndex].name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  borderRadius: "10px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  width: "300px",
                  height: "300px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                }}
              >
                <Image src="/images/file.svg" alt="file" width={120} height={120} />
              </div>
            )}

            <p style={{ margin: 0 }}>{files[currentFileIndex].name}</p>

            <Button
              type="button"
              className="flex items-center bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)] hover:from-[#B01E0D] hover:to-[#B01E0D] text-white px-5 py-1 rounded-full"
              onClick={() => window.open(files[currentFileIndex].downloadUrl, "_blank", "noopener noreferrer")}
            >
              Descargar Archivo
              <Image
                src="/images/dowload.svg"
                alt="download"
                width={40}
                height={40}
                className="ml-1 stroke-white stroke-1"
              />
            </Button>
          </div>

          <button
            type="button"
            onClick={handlePrevious}
            style={{
              position: "fixed",
              top: "50%",
              left: "20px",
              fontSize: "2rem",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              transition: "transform 0.2s, scale 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/chevron-left.svg" alt="previous" width={30} height={120} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            style={{
              position: "fixed",
              top: "50%",
              right: "20px",
              fontSize: "2rem",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              transition: "transform 0.2s, scale 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/chevron-right.svg" alt="next" width={30} height={120} />
          </button>

          <button
            type="button"
            onClick={closeModal}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              fontSize: "1.5rem",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              transition: "transform 0.2s, scale 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Image src="/images/x.svg" alt="close" width={40} height={40} style={{ marginRight: "10px" }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EyeToggle;
