import { Button } from "@/components/ui/buttons/button"; 
import { PlusCircle } from "lucide-react";

interface NewTicketButtonProps {
  onClick: () => void;
  className?: string;
}

export function NewTicketButton({ onClick, className }: NewTicketButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center bg-gradient-to-r from-[rgb(159,4,13)] to-[rgb(227,6,19)] hover:from-[#B01E0D] hover:to-[#B01E0D] text-white px-9 py-3 rounded-full ${className || ''}`}
      type="button"
      aria-label="Crear nuevo ticket"
    >
      <PlusCircle className="mr-2 h-5 w-5" strokeWidth={3} />
      <span className="text-xl font-bold">Nuevo Ticket</span>
    </Button>
  );
}
