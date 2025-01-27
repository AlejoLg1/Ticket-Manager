import { Ticket } from '@/models/ticket/ticket';

export interface ModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  isSupport: boolean;
  isCreatingTicket: boolean;
  hasAssignment: boolean;
  status: string
}