'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from "@components/header/header";
import { NewTicketButton } from "@components/ticket/newTicketButton";
import { TicketFilters } from "@/components/ticket/ticketFilters";
import { TicketCard } from "@/components/ticket/ticketCard";
import BasicModal from '@components/ticket/ticketModal';
import HouseLoader from '@/components/loader/houseLoader';
import Pagination from '@/components/pagination/pagination';
import { Ticket } from '@/models/ticket/ticket';
import useAuth from '@/hooks/useAuth';

interface Filters {
  status: { value: string; label: string } | null;
  ticketNumber: string;
  assignedUser: { value: string; label: string } | null;
  category: { value: string; label: string } | null;
}

const App = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { session } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    status: null,
    ticketNumber: '',
    assignedUser: null,
    category: null,
  });

  useEffect(() => {
    if (session && session.user.role !== 'user') {
      router.push('/login');
    }
  }, [session, router]);

  const fetchTickets = async (filtersToUse: Filters) => {
    setIsFetching(true);
    try {
      const queryParams = new URLSearchParams();
  
      if (session?.user?.id) {
        queryParams.append('userId', session.user.id);
      }
      if (filtersToUse.status) {
        queryParams.append('status', filtersToUse.status.value);
      }
      if (filtersToUse.ticketNumber) {
        queryParams.append('ticketNumber', filtersToUse.ticketNumber);
      }
      if (filtersToUse.assignedUser) {
        queryParams.append('assignedUser', filtersToUse.assignedUser.value);
      }
      if (filtersToUse.category) {
        queryParams.append('category', filtersToUse.category.value);
      }
  
      queryParams.append('page', currentPage.toString());
      queryParams.append('itemsPerPage', itemsPerPage.toString());
  
      const res = await fetch(`/api/services/ticket?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Error fetching tickets');
      const data = await res.json();
      setTickets(data.tickets);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error al cargar los tickets:', error);
    } finally {
      setIsFetching(false);
    }
  };
  

  useEffect(() => {
    if (session) {
      fetchTickets(filters);
    }
  }, [session]);

  const handleFilterApply = (newFilters: Filters) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      fetchTickets(updatedFilters);
      return updatedFilters;
    });
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
      <Header companyLogo="/images/finaer-logo-short.svg" />

      <div className="p-24 pt-16 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[35px] font-bold text-black">Centro de Control de Tickets</h1>
          <NewTicketButton onClick={handleNewTicketClick} />
        </div>
      </div>

      <div className="flex justify-center">
        <TicketFilters onFilterApply={handleFilterApply} />
      </div>

      <div className="flex justify-center mt-6">
        <div className="bg-[#EBEBEB] w-[90%] flex flex-col items-center justify-start rounded-[25px] shadow-md mb-6">
          {isFetching ? (
            <div className="flex justify-center items-center py-16">
              <HouseLoader />
            </div>
          ) : tickets.length > 0 ? (
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
      </div>

      {!isFetching && tickets.length > 0 && (
        <div className="flex justify-center items-center w-full">
          <Pagination
            currentPage={currentPage}
            onNextClick={() => setCurrentPage(prev => prev + 1)}
            onPreviousClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            onPageClick={page => setCurrentPage(page)}
            hasNext={currentPage < Math.ceil(totalItems / itemsPerPage)}
            hasPrevious={currentPage > 1}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}


      <BasicModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSupport={false}
        isCreatingTicket={!selectedTicket}
        hasAssignment={!!selectedTicket?.assignedUser}
        status={String(selectedTicket?.status)}
      />
    </div>
  );
};

export default App;
