'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from "@components/header/header";
import { NewTicketButton } from "@components/ticket/newTicketButton";
import { TicketFilters } from "@/components/ticket/ticketFilters";
import { TicketCard } from "@/components/ticket/ticketCard";
import BasicModal from '@components/ticket/ticketModal';
import { Ticket } from '@/models/ticket/ticket';
import useAuth from '@/hooks/useAuth';

const App = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { session } = useAuth();
  
  useEffect(() => {
    if (!session || session.user.role !== 'user') {
      router.push('/login');
    }
  }, [session, router]);

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

  const handleNewTicketClick = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const handleTicketCardClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
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
          <NewTicketButton onClick={handleNewTicketClick} />
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
                  onAssign={() => console.log('Asignar ticket', ticket.ticketNumber)}
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
          isSupport={false}
          isCreatingTicket={!selectedTicket}
          hasAssignment={!!selectedTicket?.assignedUser}
        />
      </div>
    </div>
  );
};

export default App;
