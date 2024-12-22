'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/buttons/button';
import { Select } from '@/components/ui/selects/comboBox';
import { statesOptions } from '@/constants/selectOptions';

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isSupport: boolean;
  hasAssignment: boolean;
  children: ReactNode;
  ticketState?: string;
}

const stateStyles: Record<string, string> = {
  nuevo: "bg-green-100 text-green-800 w-[140px] h-[25px]",
  curso: "bg-blue-100 text-blue-800 w-[140px] h-[25px]",
  desarrollo: "bg-purple-300 text-orange-800 w-[155px] h-[25px]",
  contactado: "bg-orange-300 text-orange-800 w-[155px] h-[25px]",
  finalizado: "bg-gray-300 text-gray-800 w-[155px] h-[25px]",
};

const textStateStyles: Record<string, string> = {
  nuevo: "text-green-800",
  curso: "text-blue-800",
  desarrollo: "text-orange-800",
  contactado: "text-orange-800",
  finalizado: "text-gray-800",
};

export const Dialog = ({ title, isOpen, onClose, isSupport, hasAssignment, children, ticketState = 'nuevo' }: DialogProps) => {
  const [selectedState, setSelectedState] = useState<string>('nuevo');

  useEffect(() => {
    if (ticketState && statesOptions.some(option => option.value === ticketState)) {
      setSelectedState(ticketState);
    } else {
      setSelectedState('nuevo');
    }
  }, [ticketState]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[#F2F2F2] rounded-b-[25px] shadow-lg w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white p-4 shadow-lg rounded-t-md w-full flex justify-between items-center">
          <h1 className="text-black text-2xl font-semibold">{title}</h1>

          {isSupport && (
            <div className="flex items-center space-x-4">
              <Select
                options={statesOptions}
                placeholder="Estado"
                selected={statesOptions.find(option => option.value === selectedState) || null}
                setSelected={(option) => {
                  if (option) {
                    setSelectedState(option.value);
                  }
                }}
                triggerClassName={`font-bold flex items-center justify-center rounded-full ${stateStyles[selectedState] || stateStyles['nuevo']}`}
                dropdownStyle={{
                  borderRadius: '25px',
                  overflowY: 'auto', 
                  maxHeight: '120px', 
                }}
                itemClassName="hover:bg-gray-200"
                hideXCircle={true}
                hideSearchIcon={true}
                hideChevronDown={false}
                textClassName={`${textStateStyles[selectedState] || textStateStyles['nuevo']}`}
              />

              <Button
                className={`font-bold p-2 border rounded-[50px] w-[125px] h-[25px] flex items-center justify-center ${hasAssignment
                    ? 'bg-[#504D4F] hover:bg-[#3D3B3C] text-white'
                    : 'bg-[#0DBC2D] hover:bg-[#0B9E26] text-white'
                  }`}
                onClick={() => {
                  console.log(hasAssignment ? 'Desasignar' : 'Asignarme');
                }}
              >
                {hasAssignment ? 'Desasignar' : 'Asignarme'}
              </Button>
            </div>
          )}
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};
