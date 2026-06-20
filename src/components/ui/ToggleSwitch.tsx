
import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className={cn(
      'inline-flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <div
        className={cn(
          'toggle-switch',
          checked ? 'bg-mint' : 'bg-gray-300',
          disabled && 'cursor-not-allowed'
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={cn(
            'toggle-thumb',
            checked ? 'translate-x-7' : 'translate-x-1'
          )}
        />
      </div>
      {label && (
        <span className="text-slate font-medium select-none">{label}</span>
      )}
    </label>
  );
};
