import { XCircle, Search, ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  placeholder: string;
  selected: Option | null;
  setSelected: (option: Option | null) => void;
  triggerClassName?: string;
  dropdownStyle?: React.CSSProperties;
  itemClassName?: string;
  hideXCircle?: boolean;
  hideSearchIcon?: boolean;
  hideChevronDown?: boolean;
  textClassName?: string;
  readOnly?: boolean;
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
  readOnly = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    if (!readOnly) {
      setSelected(option);
      setIsOpen(false);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readOnly) setSelected(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <div
        className={`flex items-center justify-between p-2 border cursor-pointer rounded-[25px] ${triggerClassName}`}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
      >
        <span className={`${selected ? 'text-black' : 'text-gray-400'} ${textClassName}`}>
          {selected ? selected.label : placeholder}
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
      {isOpen && !readOnly && (
        <div
          className="custom-scrollbar absolute mt-1 w-full bg-white border z-10 rounded-[25px] shadow-md overflow-auto "
          style={{
            maxHeight: '120px',
            overflowY: 'auto',
            ...dropdownStyle,
          }}
        >
          {options.map((option) => (
            <DropdownOption key={option.value} option={option} onSelect={handleSelect} itemClassName={itemClassName} />
          ))}
        </div>
      )}
    </div>
  );
}
