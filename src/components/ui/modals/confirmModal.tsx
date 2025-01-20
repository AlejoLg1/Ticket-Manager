'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/buttons/button';
import HouseLoader from '@/components/loader/houseLoader';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (query: string) => Promise<void>;
  query: string;
  title?: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  query,
  title = 'Confirmar acción',
  text = '¿Estás seguro de realizar esta acción?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleConfirm = async () => {
    setIsLoading(true);
    setIsContentVisible(false);
    try {
      await onConfirm(query);
    } catch (error) {
      console.error('Error ejecutando la acción:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-5/6 md:w-[460px] h-[230px] bg-white rounded-2xl shadow-light-blue p-6 flex flex-col justify-center items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isContentVisible && (
          <div className="flex justify-end w-full">
            <button
              onClick={onClose}
              className="text-black hover:text-gray-700 font-bold text-lg"
            >
              <Image src="/images/x.svg" alt="close" width={10} height={10} />
            </button>
          </div>
        )}

        <div className="w-full h-full flex flex-col items-center justify-center">
          {isContentVisible ? (
            <>
              <h2 className="text-xl font-bold text-[#1A2F63]">{title}</h2>
              <p className="text-[#4B4A49] px-4">{text}</p>
              <div className="flex justify-center w-full mt-6 gap-x-6">
                <Button
                  className="text-[#1A2F63] rounded-full border border-[#4B4A49] font-bold py-2 px-4 hover:bg-gray-100 w-1/3"
                  onClick={onClose}
                >
                  {cancelLabel}
                </Button>
                <Button
                  className="bg-[#1A2F63] rounded-full text-white font-bold py-2 px-4 hover:bg-[#264591] w-1/3"
                  onClick={handleConfirm}
                >
                  {confirmLabel}
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HouseLoader tiny />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
