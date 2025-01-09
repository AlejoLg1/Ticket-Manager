export interface Ticket {
    status: "nuevo" | "curso" | "desarrollo" | "contactado" | "finalizado";
    ticketNumber: string;
    contact: string;
    category: string;
    message: string;
    subject: string;
    role: string;
    assignedUser: { name?: string; email?: string } | null;
  }
 
export interface TicketPayload {
  ticketNumber?: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  assignedUser?: { id: string; email: string } | null;
  creatorId: string;
}

export interface TicketCardProps {
  status: "nuevo" | "curso" | "desarrollo" | "contactado" | "finalizado";
  ticketNumber: string;
  contact: string;
  category: string;
  message: string;
  subject: string;
  role: "user" | "support";
  assignedUser: { name?: string; email?: string } | null;
  onAssign: () => void;
  onClick: (ticketData: Omit<TicketCardProps, 'onClick'>) => void;
}
