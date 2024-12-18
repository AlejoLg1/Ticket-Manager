import React, { useState } from 'react';
import { Dialog } from '@components/ui/modals/dialog';
import { Input } from '@components/ui/inputs/input';
import { Button } from '@components/ui/buttons/button';
import { Select } from '@components/ui/selects/comboBox';
import { TextArea } from '@components/ui/inputs/textArea';
import Clipboard from '@components/ui/common/clipboard';
import Upload from '@components/ui/common/upload';
import CommentBox from '@components/ui/common/commentBox';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (category: string) => void;
  isSupport: boolean;
  isCreatingTicket: boolean;
  hasAssignment: boolean;
}

export default function BasicModal({
  isOpen,
  onClose,
  onAction,
  isSupport,
  isCreatingTicket,
  hasAssignment,
}: ModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [comments, setComments] = useState<{ id: string; text: string }[]>([]);

  const handleAddComment = (newComment: { id: string; text: string }) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleDeleteComment = (id: string) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
  };

  const copyToClipboard = () => {
    const email = 'support@example.com';
    navigator.clipboard.writeText(email);
    alert('Correo electrónico copiado: ' + email);
  };

  const submitButtonText = isSupport ? (isCreatingTicket ? 'Crear Ticket' : 'Guardar') : null;

  const isSubmitDisabled = !selectedCategory || !message;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} isSupport={isSupport} hasAssignment={hasAssignment}>
      <div className="p-4 bg-white rounded-[25px] shadow-lg w-full max-w-4xl mx-auto">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAction(selectedCategory);
          }}
        >
          <Input
            name="subject"
            placeholder="Asunto"
            className="w-full placeholder-gray-500"
            required
          />

          <TextArea
            name="message"
            placeholder="Ingrese su consulta o mensaje"
            value={message}
            onChange={(value) => setMessage(value)}
            required
            className="rounded-[25px]"
          />

          <div className="flex items-center gap-4">
            <div className="w-1/3">
              <Select
                options={[
                  { value: 'soporte-inmobiliaria', label: 'Soporte con Inmobiliaria' },
                  { value: 'soporte-botmaker', label: 'Soporte Botmaker' },
                  { value: 'soporte-telefonico', label: 'Soporte Telefónico IP' },
                ]}
                placeholder="Categoría"
                selected={selectedCategory}
                setSelected={setSelectedCategory}
                triggerClassName="rounded-[25px] w-full"
                hideChevronDown={true}
                dropdownStyle={{ borderRadius: '25px' }}
              />
            </div>
            {isSupport && (
              <div className="w-1/3">
                <Clipboard className="h-[42px] w-full" text="contacto@ejemplo.com" label={null} />
              </div>
            )}
          </div>

          {isCreatingTicket ? (
            <>
              <h3 className="pt-6 text-black text-xl font-bold mb-2">Documentos</h3>
              <Upload />
            </>
          ) : (
            <div className="mt-4">
              <CommentBox
                isSupport={isSupport}
                messages={comments}
                onAddMessage={handleAddComment}
                onDeleteMessage={handleDeleteComment}
              />
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
            {isSupport && (
              <Button
                type="submit"
                className="bg-[#0DBC2D] text-white hover:bg-[#0AA626] px-4 !py-2 rounded-full"
                disabled={isSubmitDisabled}
              >
                {submitButtonText}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
}
