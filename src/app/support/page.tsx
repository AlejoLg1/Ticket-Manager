'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from "@components/header/header";
import { TicketFilters } from "@/components/ticket/ticketFilters";
import { TicketCard } from "@/components/ticket/ticketCard";
import BasicModal from '@components/ticket/ticketModal';
import HouseLoader from '@/components/loader/houseLoader';
import Pagination from '@/components/pagination/pagination';
import { Ticket } from '@/models/ticket/ticket';
import useAuth from '@/hooks/useAuth';
import Footer from '@/components/footer/footer';

interface Filters {
  status: { value: string; label: string } | null;
  ticketNumber: string;
  assignedUser: { value: string; label: string } | null;
  category: { value: string; label: string } | null;
}

const Support = () => {
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
    if (session && session.user?.role !== 'support') {
      router.push('/login');
    }
  }, [session, router]);

  const fetchTickets = useCallback(async (filtersToUse: Filters, pageOverride?: number) => {
    setIsFetching(true);

    try {
      const queryParams = new URLSearchParams();

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

      const pageToUse = pageOverride || currentPage;
      queryParams.append('page', pageToUse.toString());
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
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (session) {
      fetchTickets(filters);
    }
  }, [session, filters, currentPage, fetchTickets]);

  const handleFilterApply = (newFilters: Filters) => {
    setCurrentPage(1);

    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    fetchTickets(updatedFilters, 1);
  };

  const handleTicketCardClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2] overflow-x-hidden">
      <Header companyLogo="/images/finaer-logo-short.svg" />

      <main className="flex-grow">
        <div className="p-6 sm:p-8 md:p-16 lg:p-24 pt-8 !pb-0">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mb-4">
            <h1 className="text-[24px] sm:text-[28px] md:text-[35px] font-bold text-black">
              Centro de Control de Tickets
            </h1>
          </div>
        </div>

        <div className="flex justify-center">
          <TicketFilters onFilterApply={handleFilterApply} />
        </div>

        <div className="flex justify-center mt-6">
          <div className="bg-[#EBEBEB] max-w-[90%] sm:w-[90%] w-[90%] flex flex-col items-center justify-center rounded-[25px] shadow-md shadow-[#212E5F] mb-6">
            {isFetching ? (
              <div className="flex justify-center items-center py-16">
                <HouseLoader />
              </div>
            ) : tickets.length > 0 ? (
              tickets.map(ticket => (
                <div
                  key={ticket.ticketNumber}
                  className="w-full flex justify-center p-6 pb-0"
                >
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
      </main>
      
      <BasicModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSupport={true}
        isCreatingTicket={!selectedTicket}
        hasAssignment={!!selectedTicket?.assignedUser}
        status={String(selectedTicket?.status)}
      />

      <Footer />
    </div>
  );
};

export default Support;
