import '@/styles/states.css';
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badges/badge";
import { Card, CardContent } from "@/components/ui/cards/card";
import { Button } from '@/components/ui/buttons/button';
import EyeToggle from "@/components/eye/eyeToggle";
import { TextArea } from "@ui/inputs/textArea";
import ConfirmModal from '@/components/ui/modals/confirmModal';
import { TicketCardProps } from '@/models/ticket/ticket';
import useAuth from '@/hooks/useAuth';

const AssignedLabel = ({ assignedUser }: { assignedUser: { name?: string; email?: string } | null }) => (
  <div className="text-sm font-bold text-black absolute right-10">
    {assignedUser?.name || assignedUser?.email || "No asignado"}
  </div>
);

import { categoryOptions } from '@/constants/selectOptions';

export function TicketCard({
  status,
  ticketNumber,
  contact,
  category,
  message,
  subject,
  role,
  assignedUser,
  onAssign,
  onClick,
}: TicketCardProps) {
  const statusText = {
    nuevo: "Nuevo",
    curso: "En Curso",
    desarrollo: "En Desarrollo",
    contactado: "Contactado",
    finalizado: "Finalizado",
  };

  const categoryLabel = categoryOptions.find(option => option.value === category)?.label || category;
  const { session } = useAuth();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

      onAssign();
      window.location.reload();
    } catch (error) {
      console.error('Error al asignar el ticket', error);
    }
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const renderAssignedSection = () => {
    if (role === 'support') {
      return assignedUser ? (
        <AssignedLabel assignedUser={assignedUser} />
      ) : (
        <Button
        className="bg-[#0DBC2D] hover:bg-[#0B9E26] text-white font-bold border rounded-[50px] ml-auto right-4 w-[125px] h-[25px] flex items-center justify-center lg:w-[125px] lg:h-[25px] sm:w-[100px] sm:h-[20px] sm:p-1"
        onClick={(e) => {
            e.stopPropagation();
            openConfirmModal();
          }}
        >
          Asignarme
        </Button>
      );
    }
    return <AssignedLabel assignedUser={assignedUser} />;
  };

  return (
    <>
      <Card
        className="mb-4 w-full max-w-[1500px] !rounded-[25px] relative cursor-pointer hover:outline hover:outline-2 hover:outline-[#CF230F]"
        onClick={() =>
          onClick({ status, ticketNumber, contact, category, message, subject, role, assignedUser, onAssign })
        }
      >
        <CardContent className="pt-5">
          <div className="flex flex-col h-full">
            <div className="flex flex-wrap items-start mb-4">
              <h2 className="text-xl font-bold text-black">{subject}</h2>
              <Badge
                variant="secondary"
                className={`state-${status} !w-[125px] !h-[25px] flex items-center justify-center !font-bold !text-base ml-auto`}
              >
                {statusText[status]}
              </Badge>
            </div>


            <div className="mb-4 w-full">{renderAssignedSection()}</div>

            <div className="flex flex-wrap mb-4 mt-4">
              <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 space-y-6 mr-8">
                <ul className="list-disc ml-4 space-y-2">
                  <li className="flex items-center">
                    <p className="text-sm font-bold text-black">Número de Ticket:</p>
                    <p className="font-medium text-black ml-2">{ticketNumber}</p>
                  </li>
                  <li className="flex items-center">
                    <p className="text-sm font-bold text-black">Contacto:</p>
                    <p className="font-medium text-black ml-2">{contact}</p>
                  </li>
                </ul>
                <ul className="list-disc ml-4 mb-4">
                  <li className="flex items-center mb-4">
                    <p className="text-sm font-bold text-black mt-4">Categoría:</p>
                    <Badge
                      variant="secondary"
                      className="!bg-[#1A2F63] text-white mt-4 ml-2 whitespace-nowrap py-1"
                    >
                      {categoryLabel}
                    </Badge>
                  </li>
                </ul>
              </div>

              <div className="w-full sm:w-1/2 md:w-2/3 flex gap-4 ml-4">
                <TextArea
                  name="message"
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={() => {}}
                  readOnly={true}
                  className="border-gray-300 rounded-[15px] p-2 text-sm w-full max-w-[700px]"
                />
                <div
                  className="flex items-end justify-end"
                  style={{
                    marginLeft: "auto",
                    marginTop: "24px",
                  }}
                  role="button"
                  aria-label="Toggle eye visibility"
                >
                  <EyeToggle ticketId={ticketNumber} fill="red" size={40} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmModal}
          onConfirm={handleAssign}
          query={ticketNumber}
          title="Asignar ticket"
          text="¿Estás seguro de que deseas asignarte este ticket?"
          confirmLabel="Asignar"
          cancelLabel="Cancelar"
        />
      )}
    </>
  );
}
