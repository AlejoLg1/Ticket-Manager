'use client'

import React, { useState, useEffect } from 'react';
import { Dialog } from '@components/ui/modals/dialog';
import { Input } from '@components/ui/inputs/input';
import { Button } from '@components/ui/buttons/button';
import { Select } from '@components/ui/selects/comboBox';
import { TextArea } from '@components/ui/inputs/textArea';
import Clipboard from '@components/ui/common/clipboard';
import Upload from '@components/ui/common/upload';
import CommentBox from '@components/ui/common/commentBox';
import ConfirmModal from '@components/ui/modals/confirmModal';
import { categoryOptions, statesOptions } from '@/constants/selectOptions';
import EyeToggle from "@components/eye/eyeToggle";
import { ModalProps } from '@/models/modal/modal';
import useAuth from '@/hooks/useAuth';

type Option = {
  value: string;
  label: string;
};

export default function BasicModal({
  ticket,
  isOpen,
  onClose,
  isSupport,
  isCreatingTicket,
  hasAssignment,
  status
}: ModalProps) {
  const { session } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(
    ticket ? categoryOptions.find(option => option.value === ticket.category) ?? null : null
  );
  const [selectedState, setSelectedState] = useState<Option | null>(
    ticket ? statesOptions.find(option => option.value === ticket.status) ?? null : null
  );
  const [message, setMessage] = useState<string>(ticket?.message || '');
  const [subject, setSubject] = useState<string>(ticket?.subject || '');
  const [files, setFiles] = useState<File[]>([]);
  const setComments = useState<{ id: string; text: string }[]>([])[1];
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'close' | null>(null);

  const isReadOnly = !isCreatingTicket && hasAssignment;
  const isEditable = isCreatingTicket || (!isCreatingTicket && !hasAssignment && !isSupport && status === 'nuevo');

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(
        categoryOptions.find(option => option.value === ticket?.category) || null
      );
      setSelectedState(
        statesOptions.find(option => option.value === ticket?.status) || null
      );
      setMessage(ticket?.message || '');
      setSubject(ticket?.subject || '');
    } else {
      setSelectedCategory(null);
      setSelectedState(null);
      setMessage('');
      setSubject('');
    }
  }, [isOpen, ticket]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('no-scroll');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const handleAddComment = (newComment: { id: string; text: string }) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleDeleteComment = (id: string) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    const payload = {
      subject,
      message,
      category: selectedCategory.value,
      status: selectedState?.value || 'nuevo',
      creatorId: Number(session?.user?.id),
      ticketNumber: ticket?.ticketNumber,
    };

    try {
      const endpoint = ticket
        ? `/api/services/ticket?ticketNumber=${ticket.ticketNumber}`
        : '/api/services/ticket';

      const method = ticket ? 'PUT' : 'POST';

      const ticketResponse = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!ticketResponse.ok) {
        throw new Error('Error al crear el ticket.');
      }

      const createdTicket = await ticketResponse.json();

      const uploadedFiles = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('fileName', file.name);
        formData.append('fileContent', file);
        formData.append('ticketNumber', String(createdTicket.id));

        const fileResponse = await fetch('/api/services/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await fileResponse.json();
        if (!data.success) {
          throw new Error(`Error al subir el archivo: ${file.name}`);
        }

        uploadedFiles.push({ name: file.name, url: data.url });
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      onClose();
    }
  };

  const handleCancel = () => {
    setConfirmAction('close');
    setIsConfirmModalOpen(true);
  };

  const confirmModalClose = () => {
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const confirmModalAction = async (query: string): Promise<void> => {
    if (query === "close") {
      confirmModalClose();
      onClose();
    }
  };
  

  const submitButtonText = isCreatingTicket
    ? 'Crear Ticket'
    : (isSupport || (!hasAssignment && ticket?.status === 'nuevo')) ? 'Guardar' : null;

  const ModalTitle = isCreatingTicket
    ? 'Creando Nuevo Ticket'
    : `Ticket-${ticket?.ticketNumber}`;

  const isSubmitDisabled = !selectedCategory || !message;

  return (
    <>
      <Dialog
        title={ModalTitle}
        isOpen={isOpen}
        onClose={handleCancel}
        isSupport={isSupport}
        hasAssignment={hasAssignment}
        selectedState={selectedState?.value || 'nuevo'}
        onStateChange={(newState) => {
          setSelectedState(statesOptions.find(option => option.value === newState) || null);
        }}
        ticketNumber={ticket?.ticketNumber || ''}
      >
        <div
          className="p-4 bg-white rounded-[25px] shadow-lg w-full max-w-4xl mx-auto"
          style={{
            maxHeight: '90vh',
            overflow: 'hidden',
          }}
        >
          <div
            className="custom-scrollbar-modal"
            style={{
              maxHeight: 'calc(90vh - 64px)',
            }}
          >
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <Input
                name="subject"
                placeholder="Asunto"
                className="w-full placeholder-gray-500"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                readOnly={isReadOnly || !isEditable}
              />

              <TextArea
                name="message"
                placeholder="Ingrese su consulta o mensaje"
                value={message}
                onChange={(value) => setMessage(value)}
                required
                readOnly={isReadOnly || !isEditable}
                className="rounded-[25px]"
              />

              <div className="flex items-center gap-4">
                <div className="w-1/3">
                  <Select
                    options={categoryOptions}
                    placeholder="Categoría"
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                    triggerClassName="rounded-[25px] w-full"
                    hideChevronDown={true}
                    dropdownStyle={{ borderRadius: '25px' }}
                    readOnly={isReadOnly || !isEditable}
                  />
                </div>
                {isSupport && (
                  <div className="w-1/3">
                    <Clipboard className="!h-[40px] w-full" text={String(ticket?.contact)} label={null} />
                  </div>
                )}

                {!isCreatingTicket ? (
                  <div className="ml-auto">
                    <EyeToggle ticketId={String(ticket?.ticketNumber)} fill="red" size={40} />
                  </div>
                ) : null}
              </div>

              {isEditable ? (
                <>
                  <h3 className="pt-6 text-black text-xl font-bold mb-2">Documentos</h3>
                  <Upload onFilesSelected={setFiles} />
                </>
              ) : null}

              {!isCreatingTicket ? (
                <div className="mt-4">
                  <CommentBox
                    isSupport={isSupport}
                    ticketId={Number(ticket?.ticketNumber)}
                    onAddMessage={handleAddComment}
                    onDeleteMessage={handleDeleteComment}
                  />
                </div>
              ) : null}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  className="bg-[#504D4F] text-white hover:bg-[#3D3B3C] px-4 !py-2 rounded-full min-w-[95px]"
                  onClick={handleCancel}
                >
                  Salir
                </Button>

                {submitButtonText ? (
                  <Button
                    type="submit"
                    className="bg-[#0DBC2D] text-white hover:bg-[#0AA626] px-4 !py-2 rounded-full min-w-[95px]"
                    disabled={isSubmitDisabled}
                  >
                    {submitButtonText}
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={confirmModalClose}
          onConfirm={confirmModalAction}
          query="close"
          title="Salir sin guardar"
          text="¿Estás seguro de que deseas salir? Perderás todos los cambios no guardados."
          confirmLabel="Salir"
          cancelLabel="Cancelar"
        />
      )}
    </>
  );
}
