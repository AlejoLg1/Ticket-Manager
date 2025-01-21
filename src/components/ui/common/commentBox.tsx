'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCurrentDateTime } from '@utils/commonFunctions';
import ConfirmModal from '@/components/ui/modals/confirmModal';
import { CommentBoxProps } from '@/models/comment/comment';
import useAuth from '@/hooks/useAuth';

export default function CommentBox({ isSupport, ticketId, onAddMessage, onDeleteMessage }: CommentBoxProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [action, setAction] = useState<'add' | 'delete' | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/services/comment?ticketid=${ticketId}`);
        if (!response.ok) {
          throw new Error('Error al cargar los comentarios');
        }

        const comments = await response.json();
        setMessages(
          comments.map((comment: { id: number; comment: string }) => ({
            id: comment.id.toString(),
            text: comment.comment,
          }))
        );
      } catch (error) {
        console.error(error);
        alert('Hubo un error al cargar los comentarios.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [ticketId]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  const openConfirmModal = (event: React.MouseEvent, actionType: 'add' | 'delete', commentId?: string) => {
    event.stopPropagation();
    event.preventDefault();
    setAction(actionType);
    if (commentId) setSelectedCommentId(commentId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
    setAction(null);
    setSelectedCommentId(null);
  };

  const handleAddMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageWithDate = `[${getCurrentDateTime()}] ${newMessage}`;

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/services/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId,
          supportId: Number(session?.user?.id),
          message: messageWithDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }

      const createdComment = await response.json();

      const newComment = {
        id: createdComment.id.toString(),
        text: createdComment.comment,
      };
      setMessages((prevMessages) => [...prevMessages, newComment]);
      onAddMessage(newComment);

      setNewMessage('');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al agregar el comentario. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
      handleCloseModal();
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedCommentId) return;

    try {
      const response = await fetch(`/api/services/comment?commentid=${selectedCommentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el comentario');
      }

      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== selectedCommentId));
      onDeleteMessage(selectedCommentId);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      alert('Hubo un error al eliminar el comentario. Inténtalo nuevamente.');
    } finally {
      handleCloseModal();
    }
  };

  const confirmAction = async () => {
    if (action === 'add') {
      await handleAddMessage();
    } else if (action === 'delete') {
      await handleDeleteMessage();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Comentarios</h3>
      </div>

      <div className="flex-grow mb-4 max-h-40 overflow-y-auto custom-scrollbar-left-spacing">
        {isLoading ? (
          <p className="text-gray-500">Cargando comentarios...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No hay comentarios aún.</p>
        ) : (
          messages.map(({ id, text }) => (
            <div key={id} className="bg-gray-100 p-2 rounded-lg mb-2 flex justify-between items-center">
              <p className="text-gray-700">{text}</p>
              {isSupport && (
                <Image
                  src="/images/trash-can.svg"
                  height={30}
                  width={30}
                  alt="Eliminar comentario"
                  className="cursor-pointer ml-4"
                  onClick={(event) => openConfirmModal(event, 'delete', id)}
                />
              )}
            </div>
          ))
        )}
      </div>

      {isSupport && (
        <div className="mt-4">
          <textarea
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none text-black"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={handleMessageChange}
            rows={1}
            disabled={isSubmitting}
          />
          <button
            className={`mt-2 bg-[#CF230F] hover:bg-[#B01E0D] text-white px-4 py-2 rounded-full ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={(event) => openConfirmModal(event, 'add')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Agregar Comentario'}
          </button>
        </div>
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={confirmAction}
          query=""
          title={action === 'add' ? 'Agregar comentario' : 'Eliminar comentario'}
          text={
            action === 'add'
              ? '¿Estás seguro de que deseas agregar este comentario?'
              : '¿Estás seguro de que deseas eliminar este comentario?'
          }
          confirmLabel={action === 'add' ? 'Agregar' : 'Eliminar'}
          cancelLabel="Cancelar"
        />
      )}
    </div>
  );
}
