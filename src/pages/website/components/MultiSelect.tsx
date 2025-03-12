import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  className = ''
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className={`min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg cursor-pointer
          ${isOpen ? 'ring-2 ring-purple-600 border-transparent' : 'hover:border-gray-400'}
          transition-all duration-200`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-wrap gap-2">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            value.map(v => {
              const option = options.find(opt => opt.value === v);
              return (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm"
                >
                  {option?.icon}
                  {option?.label}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-purple-600"
                    onClick={(e) => handleRemoveValue(v, e)}
                  />
                </span>
              );
            })
          )}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 
              ${isOpen ? 'transform -rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg bottom-[calc(100%+4px)]"
          style={{
            maxHeight: '240px',
            overflowY: 'auto'
          }}
        >
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-purple-50
                  ${value.includes(option.value) ? 'bg-purple-50' : ''}`}
                onClick={() => handleToggleOption(option.value)}
              >
                <div className="flex items-center flex-1 gap-2">
                  {option.icon}
                  <span className="text-gray-700">{option.label}</span>
                </div>
                {value.includes(option.value) && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}