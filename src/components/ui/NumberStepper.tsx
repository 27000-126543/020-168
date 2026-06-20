
import React from 'react';
import { cn } from '@/lib/utils';

interface NumberStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  disabled?: boolean;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  label,
  unit = '颗',
  disabled = false,
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-slate font-medium text-base">{label}</span>
      )}
      <div className={cn(
        'flex items-center gap-4',
        disabled && 'opacity-50'
      )}>
        <button
          className={cn(
            'number-input-btn',
            value <= min && 'opacity-40 cursor-not-allowed'
          )}
          onClick={handleDecrease}
          disabled={disabled || value <= min}
          aria-label="减少"
        >
          −
        </button>
        <div className="text-center min-w-[60px]">
          <span className="text-3xl font-bold text-slate">{value}</span>
          <span className="text-sm text-slate-light ml-1">{unit}</span>
        </div>
        <button
          className={cn(
            'number-input-btn',
            value >= max && 'opacity-40 cursor-not-allowed'
          )}
          onClick={handleIncrease}
          disabled={disabled || value >= max}
          aria-label="增加"
        >
          +
        </button>
      </div>
    </div>
  );
};
