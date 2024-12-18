import { Badge } from "@/components/ui/badges/badge";
import { Card, CardContent } from "@/components/ui/cards/card";
import { Button } from '@/components/ui/buttons/button';
import EyeToggle from "@/components/eye/eyeToggle";

interface TicketCardProps {
  status: "nuevo" | "curso" | "desarrollo" | "contactado" | "finalizado";
  ticketNumber: string;
  contact: string;
  category: string;
  message: string;
  subject: string;
  role: "user" | "support";
  assignedUser: { name?: string; email?: string } | null;
  onAssign: () => void;
}

const AssignedLabel = ({ assignedUser }: { assignedUser: { name?: string; email?: string } | null }) => (
  <div className="text-sm font-bold text-black absolute right-10">
    {assignedUser?.name || assignedUser?.email || "No asignado"}
  </div>
);

export function TicketCard({
  status,
  ticketNumber,
  contact,
  category,
  message,
  subject,
  role,
  assignedUser,
  onAssign,
}: TicketCardProps) {
  const statusStyles = {
    nuevo: "bg-green-100 text-green-800 w-[125px] h-[25px]",
    curso: "bg-blue-100 text-blue-800 w-[125px] h-[25px]",
    desarrollo: "bg-purple-300 text-orange-800 w-[125px] h-[25px]",
    contactado: "bg-orange-300 text-orange-800 w-[125px] h-[25px]",
    finalizado: "bg-gray-300 text-gray-800 w-[125px] h-[25px]",
  };

  const statusText = {
    nuevo: "Nuevo",
    curso: "En Curso",
    desarrollo: "En Desarrollo",
    contactado: "Contactado",
    finalizado: "Finalizado",
  };

  const renderAssignedSection = () => {
    if (role === 'support') {
      return assignedUser ? (
        <AssignedLabel assignedUser={assignedUser} />
      ) : (
        <Button
          className="bg-[#0DBC2D] hover:bg-[#0B9E26] text-white font-bold p-2 border rounded-[50px] absolute right-4 w-[125px] h-[25px] flex items-center justify-center"
          onClick={onAssign}
        >
          Asignarme
        </Button>
      );
    }
    return <AssignedLabel assignedUser={assignedUser} />;
  };

  return (
    <Card className="mb-4 w-[1300px] rounded-[55px] relative">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-black">{subject}</h2>
            <Badge
              variant="secondary"
              className={`${statusStyles[status]} flex items-center justify-center !font-bold !text-base`}
            >
              {statusText[status]}
            </Badge>
          </div>

          <div className="mb-4">
            {renderAssignedSection()}
          </div>

          <div className="flex mb-4 mt-4">
            <div className="w-1/4 space-y-6 mr-8">
              <ul className="list-disc ml-4 space-y-2">
                <li className="flex items-center">
                  <p className="text-sm font-bold text-black">Número de Ticket:</p>
                  <p className="font-medium text-black ml-2">{ticketNumber}</p>
                </li>
                <li className="flex items-center">
                  <p className="text-sm font-bold text-black">Contacto:</p>
                  <p className="font-medium text-black ml-2">{contact}</p>
                </li>
              </ul>
              <ul className="list-disc ml-4">
                <li className="flex items-center">
                  <p className="text-sm font-bold text-black mt-3">Categoría:</p>
                  <Badge variant="secondary" className="!bg-[#1A2F63] text-white mt-3 ml-2 whitespace-nowrap py-1">
                    {category}
                  </Badge>
                </li>
              </ul>
            </div>
            <div className="flex-1 ml-4">
              <div
                className="bg-white border border-black px-5 py-8 inline-block"
                style={{
                  borderRadius: '25px',
                  width: '75%',
                  height: '115px',
                  paddingTop: '10px',
                  paddingBottom: '50px',
                }}
              >
                <p className="text-sm text-gray-600 text-left">{message}</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-14 flex flex-col items-start space-y-4" role="button" aria-label="Toggle eye visibility">
            <EyeToggle fill="red" size={40} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
