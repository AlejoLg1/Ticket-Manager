"use client";

import { Input } from '@/components/ui/inputs/input';
import { useState, CSSProperties } from 'react';
import { Search, XCircle } from 'lucide-react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  placeholder: string;
  selected: string;
  setSelected: (value: string) => void;
  triggerStyle?: CSSProperties;
  dropdownStyle?: CSSProperties;
};

function Select({ options, placeholder, selected, setSelected, triggerStyle, dropdownStyle }: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (option: Option) => {
    setSelected(option.label);
    setIsOpen(false);
  };

  const clearSelection = () => {
    setSelected('');
  };

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between p-2 border cursor-pointer"
        style={{ borderRadius: '25px', ...triggerStyle }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${selected ? 'text-black' : 'text-gray-400'}`}>
          {selected || placeholder}
        </span>
        <div className="flex items-center">
          {selected && (
            <XCircle
              className="ml-2 h-5 w-5 text-gray-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
            />
          )}
          <Search className="ml-2 h-5 w-5" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border z-10" style={{ borderRadius: '25px', ...dropdownStyle, boxShadow: '0 0px 4px rgba(0, 0, 0, 0.1)' }}>
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black"
              style={{ borderRadius: '25px' }}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TicketFilters() {
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 shadow-md" style={{ borderRadius: '25px', maxWidth: '1500px' }}>
      <Select
        options={[
          { value: 'nuevo', label: 'Nuevo' },
          { value: 'en-curso', label: 'En Curso' },
          { value: 'finalizado', label: 'Finalizado' },
        ]}
        placeholder="Estado"
        selected={selectedEstado}
        setSelected={setSelectedEstado}
        triggerStyle={{ borderRadius: '25px' }}
        dropdownStyle={{ borderRadius: '25px' }}
      />

      <Input
        type="text"
        placeholder="Número de Ticket"
        style={{ borderRadius: '25px', color: 'black' }}
      />

      <Select
        options={[
          { value: 'persona1', label: 'Persona 1' },
          { value: 'persona2', label: 'Persona 2' },
          { value: 'persona3', label: 'Persona 3' },
        ]}
        placeholder="Persona Asignada"
        selected={selectedPersona}
        setSelected={setSelectedPersona}
        triggerStyle={{ borderRadius: '25px' }}
        dropdownStyle={{ borderRadius: '25px' }}
      />

      <Select
        options={[
          { value: 'soporte-inmobiliaria', label: 'Soporte con Inmobiliaria' },
          { value: 'soporte-botmaker', label: 'Soporte Botmaker' },
          { value: 'soporte-telefonico', label: 'Soporte Telefónico IP' },
        ]}
        placeholder="Categoría"
        selected={selectedCategoria}
        setSelected={setSelectedCategoria}
        triggerStyle={{ borderRadius: '25px' }}
        dropdownStyle={{ borderRadius: '25px' }}
      />
    </div>
  );
}
