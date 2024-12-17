import { XCircle, Search, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  placeholder: string;
  selected: string;
  setSelected: (value: string) => void;
  triggerClassName?: string;
  dropdownStyle?: React.CSSProperties;
  itemClassName?: string;
  hideXCircle?: boolean;
  hideSearchIcon?: boolean;
  hideChevronDown?: boolean;
  textClassName?: string;
};

const DropdownOption: React.FC<{ option: Option; onSelect: (option: Option) => void; itemClassName?: string }> = ({
  option,
  onSelect,
  itemClassName,
}) => (
  <div
    className={`p-2 hover:bg-gray-100 cursor-pointer text-black ${itemClassName}`}
    style={{ borderRadius: '25px' }}
    onClick={() => onSelect(option)}
  >
    {option.label}
  </div>
);

export function Select({
  options,
  placeholder,
  selected,
  setSelected,
  triggerClassName,
  dropdownStyle,
  itemClassName,
  hideXCircle = false,
  hideSearchIcon = false,
  hideChevronDown = false,
  textClassName,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (option: Option) => {
    setSelected(option.value);
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected('');
  };

  const selectedOption = options.find((option) => option.value === selected);

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between p-2 border cursor-pointer ${triggerClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${selectedOption ? 'text-black' : 'text-gray-400'} ${textClassName}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center">
          {!hideXCircle && selected && (
            <XCircle
              className="ml-2 h-5 w-5 text-gray-500 cursor-pointer"
              onClick={clearSelection}
            />
          )}
          {!hideSearchIcon && <Search className="ml-2 h-5 w-5" />}
          {!hideChevronDown && <ChevronDown className="ml-2 h-5 w-5" />}
        </div>
      </div>
      {isOpen && (
        <div
          className="absolute mt-1 w-full bg-white border z-10 rounded-[25px] shadow-md"
          style={dropdownStyle}
        >
          {options.map((option) => (
            <DropdownOption key={option.value} option={option} onSelect={handleSelect} itemClassName={itemClassName} />
          ))}
        </div>
      )}
    </div>
  );
}
