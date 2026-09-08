import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface CustomSelectOption {
  value: string;
  label: string;
  group?: string;
  badge?: string;
  icon?: React.ReactNode;
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
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
}

interface MenuCoords {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  minWidth: number;
  maxHeight: number;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Seleziona...',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  title,
  align,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuCoords, setMenuCoords] = useState<MenuCoords | null>(null);

  const updateCoords = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUpward = spaceBelow < 180 && spaceAbove > spaceBelow;

    const maxHeight = Math.max(100, Math.min(280, openUpward ? spaceAbove : spaceBelow));
    let top: number | undefined;
    let bottom: number | undefined;

    if (openUpward) {
      bottom = window.innerHeight - rect.top + 6;
    } else {
      top = rect.bottom + 6;
    }

    let left: number | undefined;
    let right: number | undefined;
    const isRight = align === 'right' || (!align && (rect.right + 220 > window.innerWidth || rect.left > window.innerWidth * 0.55));

    if (isRight) {
      right = Math.max(8, window.innerWidth - rect.right);
    } else {
      left = Math.max(8, Math.min(window.innerWidth - 220, rect.left));
    }

    setMenuCoords({
      top,
      bottom,
      left,
      right,
      minWidth: Math.max(rect.width, 150),
      maxHeight
    });
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      const handleScrollOrResize = () => {
        updateCoords();
      };
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }
  }, [isOpen, align]);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
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

  const isFullWidth = className.includes('w-full');

  const sizeClasses = size === 'sm'
    ? 'h-7 px-2.5 py-0 rounded-lg text-[11px] bg-paper-100/90 hover:bg-paper-200 border-paper-300 shadow-2xs font-medium text-paper-800'
    : 'px-3 py-2 rounded-xl text-xs bg-white hover:bg-paper-50 border-paper-300 hover:border-folia-500 shadow-xs font-medium text-paper-900';

  const menuElement = isOpen && menuCoords ? (
    <div 
      ref={menuRef}
      style={{
        position: 'fixed',
        top: menuCoords.top !== undefined ? `${menuCoords.top}px` : undefined,
        bottom: menuCoords.bottom !== undefined ? `${menuCoords.bottom}px` : undefined,
        left: menuCoords.left !== undefined ? `${menuCoords.left}px` : undefined,
        right: menuCoords.right !== undefined ? `${menuCoords.right}px` : undefined,
        minWidth: `${menuCoords.minWidth}px`,
        maxWidth: '320px',
        maxHeight: `${menuCoords.maxHeight}px`,
        zIndex: 99999
      }}
      className={`overflow-y-auto bg-white border border-paper-300/90 rounded-xl shadow-2xl ring-1 ring-black/10 p-1.5 animate-in fade-in space-y-0.5 select-none ${dropdownClassName}`}
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
            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              isSelected
                ? 'bg-folia-100/90 text-folia-950 font-bold'
                : 'text-paper-800 hover:bg-folia-50 hover:text-folia-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 truncate">
              {opt.icon && (
                <span className="shrink-0 flex items-center">{opt.icon}</span>
              )}
              <span className="truncate">{opt.label}</span>
              {opt.badge && (
                <span className="px-1.5 py-0.5 rounded bg-paper-150 border border-paper-250 text-paper-700 text-[10px] font-semibold font-mono shrink-0">
                  {opt.badge}
                </span>
              )}
            </div>
            {isSelected && <Check className="w-3.5 h-3.5 text-folia-800 shrink-0 ml-1.5" />}
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
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-folia-100/90 text-folia-950 font-bold'
                    : 'text-paper-800 hover:bg-folia-50 hover:text-folia-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {opt.icon && (
                    <span className="shrink-0 flex items-center">{opt.icon}</span>
                  )}
                  <span className="truncate">{opt.label}</span>
                  {opt.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-paper-150 border border-paper-250 text-paper-700 text-[10px] font-semibold font-mono shrink-0">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-folia-800 shrink-0 ml-1.5" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className={`relative ${isFullWidth ? 'w-full block' : 'inline-block'} ${className}`} ref={containerRef} title={title}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          'flex items-center justify-between gap-1.5 border transition-all cursor-pointer focus:outline-hidden',
          sizeClasses,
          buttonClassName
        )}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 flex items-center">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-paper-500 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180 text-folia-800' : ''}`} />
      </button>

      {/* Custom Folia Dropdown Menu rendered into document.body to avoid clipping by parent overflow */}
      {typeof document !== 'undefined' && menuElement && createPortal(menuElement, document.body)}
    </div>
  );
};
