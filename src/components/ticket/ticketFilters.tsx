"use client";

import { Input } from '@/components/ui/inputs/input';
import { useState, useEffect, useRef } from 'react';
import { Select } from '@/components/ui/selects/comboBox';
import ResetButton from '../reset/reset';
import { categoryOptions, statesOptions } from '@/constants/selectOptions';

interface Option {
  value: string;
  label: string;
}

interface TicketFiltersProps {
  onFilterApply: (filters: Filters) => void;
}

interface Filters {
  status: Option | null;
  ticketNumber: string;
  assignedUser: Option | null;
  category: Option | null;
}

export function TicketFilters({ onFilterApply }: TicketFiltersProps) {
  const [selectedEstado, setSelectedEstado] = useState<Option | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Option | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<Option | null>(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [supportOptions, setSupportOptions] = useState<Option[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const previousFilters = useRef<Filters>({
    status: null,
    ticketNumber: '',
    assignedUser: null,
    category: null,
  });

  useEffect(() => {
    const fetchSupportOptions = async () => {
      try {
        const res = await fetch('/api/services/support');
        if (!res.ok) throw new Error('Error fetching support options');
        const data = await res.json();
        const formattedOptions = data.map((item: { id: string; text: string }) => ({
          value: item.id,
          label: item.text,
        }));
        setSupportOptions(formattedOptions);
      } catch (error) {
        console.error('Error al cargar las opciones de soporte:', error);
      }
    };

    fetchSupportOptions();
  }, []);

  const applyFiltersIfChanged = (newFilters: Filters) => {
    const { current: prevFilters } = previousFilters;

    const isChanged =
      prevFilters.status?.value !== newFilters.status?.value ||
      prevFilters.ticketNumber !== newFilters.ticketNumber ||
      prevFilters.assignedUser?.value !== newFilters.assignedUser?.value ||
      prevFilters.category?.value !== newFilters.category?.value;

    if (isChanged) {
      previousFilters.current = newFilters;
      onFilterApply(newFilters);
    }
  };

  const handleEstadoChange = (estado: Option | null) => {
    setSelectedEstado(estado);
    applyFiltersIfChanged({
      status: estado,
      ticketNumber,
      assignedUser: selectedPersona,
      category: selectedCategoria,
    });
  };

  const handlePersonaChange = (persona: Option | null) => {
    setSelectedPersona(persona);
    applyFiltersIfChanged({
      status: selectedEstado,
      ticketNumber,
      assignedUser: persona,
      category: selectedCategoria,
    });
  };

  const handleCategoriaChange = (categoria: Option | null) => {
    setSelectedCategoria(categoria);
    applyFiltersIfChanged({
      status: selectedEstado,
      ticketNumber,
      assignedUser: selectedPersona,
      category: categoria,
    });
  };

  const handleTicketNumberChange = (value: string) => {
    setTicketNumber(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      applyFiltersIfChanged({
        status: selectedEstado,
        ticketNumber: value,
        assignedUser: selectedPersona,
        category: selectedCategoria,
      });
    }, 500);
  };

  const handleClearFilters = () => {
    setSelectedEstado(null);
    setSelectedPersona(null);
    setSelectedCategoria(null);
    setTicketNumber('');
    applyFiltersIfChanged({
      status: null,
      ticketNumber: '',
      assignedUser: null,
      category: null,
    });
  };

  return (
    <div
      className="flex flex-col md:flex-row  items-center flex-wrap gap-4 mb-6 bg-white p-4 shadow-md"
      style={{ borderRadius: '15px', maxWidth: '90%', width: '100%' }}
    >
      <div className="w-full md:flex-1">
        <Select
          options={statesOptions}
          placeholder="Estado"
          selected={selectedEstado}
          setSelected={handleEstadoChange}
          triggerClassName="border text-base text-gray-500 hover:bg-gray-100"
          textClassName="text-gray-800"
        />
      </div>

      <div className="w-full md:flex-1">
        <Input
          type="text"
          placeholder="Número de Ticket"
          value={ticketNumber}
          onChange={(e) => handleTicketNumberChange(e.target.value)}
          className="text-base h-8.5 w-full"
          style={{ borderRadius: '25px', color: 'black' }}
          maxLength={30}
        />
      </div>

      <div className="w-full md:flex-1">
        <Select
          options={supportOptions}
          placeholder="Persona Asignada"
          selected={selectedPersona}
          setSelected={handlePersonaChange}
          triggerClassName="border text-base text-gray-500 hover:bg-gray-100"
          textClassName="text-gray-800"
        />
      </div>

      <div className="w-full md:flex-1">
        <Select
          options={categoryOptions}
          placeholder="Categoría"
          selected={selectedCategoria}
          setSelected={handleCategoriaChange}
          triggerClassName="border text-base text-gray-500 hover:bg-gray-100"
          textClassName="text-gray-800"
        />
      </div>

      <div className="w-full md:w-auto ml-auto">
        <ResetButton onReset={handleClearFilters} />
      </div>
    </div>
  );
}
