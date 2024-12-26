'use client';

import { useRouter } from 'next/navigation';
import Header from "@components/header/header";
import { TicketFilters } from "@/components/ticket/ticketFilters";
import { TicketCard } from "@/components/ticket/ticketCard";
import { useState } from 'react';
import BasicModal from '@components/ticket/ticketModal';
import { Ticket } from '@/models/ticket/ticket'

const Support = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleLogout = () => {
    console.log("Usuario cerró sesión");
    router.push('/login');
  };

  const handleTicketCardClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const onAssign = () => {
    console.log("Asignado a ticket.");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <Header
        companyLogo="/images/finaer-logo-short.svg"
        logoutLogo="/images/logout.svg"
        onLogout={handleLogout}
      />

      <div className="p-24 pt-16 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[35px] font-bold text-black">Centro de Control de Tickets</h1>
        </div>
      </div>

      <div className="flex justify-center">
        <TicketFilters />
      </div>

      <div className="flex justify-center mt-6">
      <div className="bg-[#EBEBEB] w-[90%] h-[800px] flex flex-col items-center justify-start rounded-[25px] shadow-md overflow-y-auto custom-scrollbar">
        <div className="w-[90%] p-6 pb-0">
            <TicketCard
              status="nuevo"
              ticketNumber="12345"
              contact="Juan Perez"
              category="soporte-hardware"
              message="Borré la caperta System32 porque un amigo decía que era un Virus y ahora no prende la compu..."
              subject="No arranca windows"
              role="user"
              assignedUser={null}
              onAssign={onAssign}
              onClick={(ticketData) => handleTicketCardClick(ticketData)}
            />
          </div>
          <div className="w-[90%] p-6 pb-0">
            <TicketCard
              status="curso"
              ticketNumber="55421"
              contact="Emilio Juarez"
              category="soporte-inmobiliaria"
              message="Llamo a la inmobiliaria pero no me responde nadie y el sistema no me permite ingresar."
              subject="No me puedo comunicar con la inmobiliaria"
              role="user"
              assignedUser={{name:"Alejo Support" , email:"alejosupport@gmail.com" }}
              onAssign={onAssign}
              onClick={(ticketData) => handleTicketCardClick(ticketData)}
            />
          </div>
          <div className="w-[90%] p-6 pb-0">
            <TicketCard
              status="contactado"
              ticketNumber="99921"
              contact="Sonia Morales"
              category="soporte-emails"
              message="Intento enviar correos a juancito@yahgoo.com y no se manda. No sé por qué. Gracias"
              subject="No se envían los correos"
              role="user"
              assignedUser={{ name: "Pepe Support", email: "pepesupport@gmail.com" }}
              onAssign={onAssign}
              onClick={(ticketData) => handleTicketCardClick(ticketData)}
            />
          </div>
        </div>
        
        <BasicModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAction={(category: string) => {
            console.log('Categoria seleccionada:', category);
          }}
          isSupport={true}
          isCreatingTicket={!selectedTicket}
          hasAssignment={!!selectedTicket?.assignedUser}
        />

      </div>
    </div>
  );
};

export default Support;
