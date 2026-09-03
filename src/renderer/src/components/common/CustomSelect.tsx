import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  group?: string;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  title?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Seleziona...',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  title
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Group options if groups exist
  const groups: { name: string; items: CustomSelectOption[] }[] = [];
  const noGroupItems: CustomSelectOption[] = [];

  options.forEach(opt => {
    if (opt.group) {
      let g = groups.find(x => x.name === opt.group);
      if (!g) {
        g = { name: opt.group, items: [] };
        groups.push(g);
      }
      g.items.push(opt);
    } else {
      noGroupItems.push(opt);
    }
  });

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef} title={title}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-white hover:bg-paper-100 border border-paper-300 hover:border-folia-400 rounded-xl text-xs font-semibold text-paper-900 transition-all cursor-pointer shadow-2xs focus:outline-hidden ${buttonClassName}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-paper-500 transition-transform ${isOpen ? 'rotate-180 text-folia-800' : ''}`} />
      </button>

      {/* Custom Folia Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute left-0 top-full mt-1 w-max min-w-full max-h-60 overflow-y-auto bg-paper-50 border border-paper-300 rounded-xl shadow-modal p-1.5 z-50 animate-in fade-in space-y-0.5 ${dropdownClassName}`}
        >
          {noGroupItems.map(opt => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-folia-100 text-folia-950 font-bold'
                    : 'text-paper-800 hover:bg-folia-50/80 hover:text-folia-900'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-folia-800 shrink-0" />}
              </div>
            );
          })}

          {groups.map(grp => (
            <div key={grp.name} className="pt-1.5 first:pt-0">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper-500 border-b border-paper-200/80 mb-1">
                {grp.name}
              </div>
              {grp.items.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-folia-100 text-folia-950 font-bold'
                        : 'text-paper-800 hover:bg-folia-50/80 hover:text-folia-900'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-folia-800 shrink-0" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
