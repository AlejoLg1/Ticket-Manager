'use client';

import '@/styles/states.css';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/buttons/button';
import { Select } from '@/components/ui/selects/comboBox';
import { statesOptions } from '@/constants/selectOptions';
import ConfirmModal from '@/components/ui/modals/confirmModal';
import { useToast } from '@/hooks/useToast';
import useAuth from '@/hooks/useAuth';

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isSupport: boolean;
  hasAssignment: boolean;
  children: React.ReactNode;
  selectedState: string;
  onStateChange: (newState: string) => void;
  ticketNumber: string;
}

export const Dialog = ({
  title,
  isOpen,
  onClose,
  isSupport,
  hasAssignment,
  children,
  selectedState,
  onStateChange,
  ticketNumber,
}: DialogProps) => {
  const { session } = useAuth();
  const { addToast } = useToast();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [action, setAction] = useState<'assign' | 'unassign' | null>(null);

  const handleAssign = async () => {
    const assignedId = Number(session?.user?.id);
    try {
      const response = await fetch(`/api/services/assigned?ticketNumber=${ticketNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedtoid: assignedId }),
      });

      if (!response.ok) {
        throw new Error('Error al asignar el ticket');
      }

      addToast('¡Ticket asignado con éxito!', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error al asignar el ticket', error);
      addToast('Hubo un error al asignar el ticket.', 'error');
    }
  };

  const handleUnassign = async () => {
    try {
      const response = await fetch(`/api/services/assigned?ticketNumber=${ticketNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedtoid: null }),
      });

      if (!response.ok) {
        throw new Error('Error al desasignar el ticket');
      }

      addToast('¡Ticket desasignado con éxito!', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error al desasignar el ticket', error);
      addToast('Hubo un error al desasignar el ticket.', 'error');
    }
  };

  const openConfirmModal = (actionType: 'assign' | 'unassign') => {
    setAction(actionType);
    setIsConfirmModalOpen(true);
  };

  const confirmModalClose = () => {
    setIsConfirmModalOpen(false);
    setAction(null);
  };

  const confirmModalAction = async (query: string) => {
    if (action === 'assign') {
      await handleAssign();
    } else if (action === 'unassign') {
      await handleUnassign();
    }
    confirmModalClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
                  selected={statesOptions.find((option) => option.value === selectedState) || null}
                  setSelected={(option) => {
                    if (option) {
                      onStateChange(option.value);
                      addToast(`El estado ha sido cambiado a "${option.label}".`, 'info');
                    }
                  }}
                  triggerClassName={`font-bold flex items-center justify-center rounded-full state-${selectedState} || state-nuevo`}
                  dropdownStyle={{
                    borderRadius: '25px',
                    overflowY: 'auto',
                    maxHeight: '120px',
                  }}
                  itemClassName="hover:bg-gray-200"
                  hideXCircle
                  hideSearchIcon
                  hideChevronDown={false}
                  textClassName={`text-${selectedState} || text-nuevo`}
                />

                <Button
                  className={`font-bold p-2 border rounded-[50px] w-[125px] h-[25px] flex items-center justify-center ${
                    hasAssignment
                      ? 'bg-[#504D4F] hover:bg-[#3D3B3C] text-white'
                      : 'bg-[#0DBC2D] hover:bg-[#0B9E26] text-white'
                  }`}
                  onClick={() => openConfirmModal(hasAssignment ? 'unassign' : 'assign')}
                >
                  {hasAssignment ? 'Desasignar' : 'Asignarme'}
                </Button>
              </div>
            )}
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={confirmModalClose}
          onConfirm={confirmModalAction}
          query={ticketNumber}
          title={action === 'assign' ? 'Asignar ticket' : 'Desasignar ticket'}
          text={
            action === 'assign'
              ? '¿Estás seguro de que deseas asignarte este ticket?'
              : '¿Estás seguro de que deseas desasignar este ticket?'
          }
          confirmLabel={action === 'assign' ? 'Asignar' : 'Desasignar'}
          cancelLabel="Cancelar"
        />
      )}
    </>,
    document.body
  );
};
