import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  align?: 'center' | 'start';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  align = 'center'
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex ${align === 'start' ? 'items-start' : 'items-center'} gap-2.5 cursor-pointer select-none group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className={`relative flex items-center justify-center shrink-0 ${align === 'start' ? 'mt-0.5' : ''}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 ${
            checked
              ? 'bg-folia-700 border-folia-700 text-white shadow-xs'
              : 'bg-paper-50 border-paper-300 hover:border-folia-500 group-hover:border-paper-400 peer-focus-visible:ring-2 peer-focus-visible:ring-folia-600/30'
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
      {label && (
        <span className="text-xs text-paper-700 group-hover:text-paper-900 font-medium transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};
