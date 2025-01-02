'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getCurrentDateTime } from '@utils/commonFunctions';

interface CommentBoxProps {
  isSupport: boolean;
  messages: { id: string; text: string }[];
  onAddMessage: (newMessage: { id: string; text: string }) => void;
  onDeleteMessage: (id: string) => void;
}

export default function CommentBox({ isSupport, messages, onAddMessage, onDeleteMessage }: CommentBoxProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  const handleAddMessage = async (event: React.MouseEvent) => {
    event.preventDefault();
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
          ticketId: 3, // Reemplazar con el ID real
          supportId: 2, // Reemplazar con el ID support real
          message: messageWithDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el comentario');
      }

      const createdComment = await response.json();

      onAddMessage({
        id: createdComment.id.toString(),
        text: createdComment.message,
      });

      setNewMessage('');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al agregar el comentario. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Comentarios</h3>
      </div>

      <div className="flex-grow mb-4 max-h-40 overflow-y-auto">
        {messages.length === 0 ? (
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
                  onClick={() => onDeleteMessage(id)}
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
            onClick={handleAddMessage}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Agregar Comentario'}
          </button>
        </div>
      )}
    </div>
  );
}
