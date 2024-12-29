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
