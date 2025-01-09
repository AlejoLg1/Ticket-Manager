'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from "@components/header/header";
import { TicketFilters } from "@/components/ticket/ticketFilters";
import { TicketCard } from "@/components/ticket/ticketCard";
import BasicModal from '@components/ticket/ticketModal';
import { Ticket } from '@/models/ticket/ticket';

const Support = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/services/ticket');
        if (!res.ok) throw new Error('Error fetching tickets');
        const data: Ticket[] = await res.json();
        setTickets(data);
      } catch (error) {
        console.error('Error al cargar los tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleLogout = () => {
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
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <div key={ticket.ticketNumber} className="w-[90%] p-6 pb-0">
                <TicketCard
                  status={ticket.status}
                  ticketNumber={ticket.ticketNumber}
                  contact={ticket.contact}
                  category={ticket.category}
                  message={ticket.message}
                  subject={ticket.subject}
                  role={ticket.role}
                  assignedUser={ticket.assignedUser}
                  onAssign={onAssign}
                  onClick={() => handleTicketCardClick(ticket)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No hay tickets disponibles.</p>
          )}
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
