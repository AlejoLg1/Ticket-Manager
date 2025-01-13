"use client";

import { Input } from '@/components/ui/inputs/input';
import { useState } from 'react';
import { Select } from '@/components/ui/selects/comboBox';
import { categoryOptions, statesOptions } from '@/constants/selectOptions';

export function TicketFilters() {
  const [selectedEstado, setSelectedEstado] = useState<{ value: string; label: string } | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<{ value: string; label: string } | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<{ value: string; label: string } | null>(null);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 shadow-md"
      style={{ borderRadius: '15px', maxWidth: '90%', width: '100%' }}
    >
      <Select
        options={statesOptions}
        placeholder="Estado"
        selected={selectedEstado}
        setSelected={setSelectedEstado}
        triggerClassName="border text-sm text-gray-500 hover:bg-gray-100"
        textClassName="text-gray-800"
      />

      <Input
        type="text"
        placeholder="Número de Ticket"
        className="text-sm h-8.5"
        style={{ borderRadius: '25px', color: 'black' }}
      />

      <Select
        options={[
          { value: 'persona1', label: 'Pepe Support' },
          { value: 'persona2', label: 'Juli Support' },
          { value: 'persona3', label: 'Ale Support' },
        ]}
        placeholder="Persona Asignada"
        selected={selectedPersona}
        setSelected={setSelectedPersona}
        triggerClassName="border text-sm text-gray-500 hover:bg-gray-100"
        textClassName="text-gray-800"
      />

      <Select
        options={categoryOptions}
        placeholder="Categoría"
        selected={selectedCategoria}
        setSelected={setSelectedCategoria}
        triggerClassName="border text-sm text-gray-500 hover:bg-gray-100"
        textClassName="text-gray-800"
      />
    </div>
  );
}
