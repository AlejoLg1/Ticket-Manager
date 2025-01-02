import React, { useState, useEffect } from 'react';
import { Dialog } from '@components/ui/modals/dialog';
import { Input } from '@components/ui/inputs/input';
import { Button } from '@components/ui/buttons/button';
import { Select } from '@components/ui/selects/comboBox';
import { TextArea } from '@components/ui/inputs/textArea';
import Clipboard from '@components/ui/common/clipboard';
import Upload from '@components/ui/common/upload';
import CommentBox from '@components/ui/common/commentBox';
import { categoryOptions } from '@/constants/selectOptions';
import EyeToggle from "@components/eye/eyeToggle";
import { Ticket } from '@/models/ticket/ticket';

interface ModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (category: string) => void;
  isSupport: boolean;
  isCreatingTicket: boolean;
  hasAssignment: boolean;
}

type Option = {
  value: string;
  label: string;
};

export default function BasicModal({
  ticket,
  isOpen,
  onClose,
  onAction,
  isSupport,
  isCreatingTicket,
  hasAssignment,
}: ModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(
    ticket ? categoryOptions.find(option => option.value === ticket.category) ?? null : null
  );
  const [message, setMessage] = useState<string>(ticket?.message || '');
  const [subject, setSubject] = useState<string>(ticket?.subject || '');
  const [notification, setNotification] = useState<string | null>(null);
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]);
  const isReadOnly = !isCreatingTicket && hasAssignment;
  const isEditable = isCreatingTicket || (!isCreatingTicket && !hasAssignment && !isSupport);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(
        categoryOptions.find(option => option.value === ticket?.category) || null
      );
      setMessage(ticket?.message || '');
      setSubject(ticket?.subject || '');
    } else {
      setSelectedCategory(null);
      setMessage('');
      setSubject('');
    }
  }, [isOpen, ticket]);  

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
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
      creatorId: '2', // TODO Cambiar por el id del usuario creador
      ticketNumber: ticket?.ticketNumber,
    };

    try {
      const endpoint = ticket
        ? `/api/services/ticket?ticketNumber=${ticket.ticketNumber}`
        : '/api/services/ticket';

      const method = ticket ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNotification(ticket ? 'Ticket modificado correctamente.' : 'Ticket creado correctamente.');
        setTimeout(() => setNotification(null), 3000);
        onAction(selectedCategory.value);
        onClose();
      } else {
        throw new Error('Error en la respuesta del servidor.');
      }
    } catch (error) {
      console.error(error);
      setNotification('Hubo un problema al procesar la solicitud.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const submitButtonText = isCreatingTicket ? 'Crear Ticket' : ( (isSupport || (!hasAssignment && ticket?.status == 'nuevo'))? 'Guardar' : null);
  const ModalTitle = isCreatingTicket ? 'Creando Nuevo Ticket' : `Ticket-${ticket?.ticketNumber}`;

  const isSubmitDisabled = !selectedCategory || !message;

  return (
    <Dialog
      title={ModalTitle}
      isOpen={isOpen}
      onClose={() => {}}
      isSupport={isSupport}
      hasAssignment={hasAssignment}
      ticketState={ticket?.status || 'nuevo'}
    >
      <div className="p-4 bg-white rounded-[25px] shadow-lg w-full max-w-4xl mx-auto">
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
                <Clipboard className="!h-[40px] w-full" text="contacto@ejemplo.com" label={null} />
              </div>
            )}
          </div>

          {notification && (
            <div className="p-4 bg-green-100 text-green-700 rounded-md text-center">
              {notification}
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              className="bg-[#504D4F] text-white hover:bg-[#3D3B3C] px-4 !py-2 rounded-full"
              onClick={onClose}
            >
              Cancelar
            </Button>

            {submitButtonText ? (
              <Button
                type="submit"
                className="bg-[#0DBC2D] text-white hover:bg-[#0AA626] px-4 !py-2 rounded-full"
                disabled={isSubmitDisabled}
              >
                {submitButtonText}
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </Dialog>
  );
}
