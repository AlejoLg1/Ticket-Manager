import { Button } from "@/components/ui/buttons/button";
import { PlusCircle } from "lucide-react";

interface NewTicketButtonProps {
  onClick: () => void;
}

export function NewTicketButton({ onClick }: NewTicketButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center bg-[#CF230F] hover:bg-[#B01E0D] text-white px-6 py-2 rounded-full"
      type="button"
      aria-label="Crear nuevo ticket"
    >
      <PlusCircle className="mr-2 h-5 w-5" />
      <span className="text-xl">Nuevo Ticket</span>
    </Button>
  );
}
