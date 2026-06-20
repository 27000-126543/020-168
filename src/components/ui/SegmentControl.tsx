
import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentOption {
  id: string;
  label: string;
  description?: string;
}

interface SegmentControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn(
      'flex bg-gray-100 rounded-2xl p-1.5',
      className
    )}>
      {options.map((option) => (
        <button
          key={option.id}
          className={cn(
            'segment-item',
            value === option.id && 'segment-item-active'
          )}
          onClick={() => onChange(option.id)}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">{option.label}</span>
            {option.description && (
              <span className={cn(
                'text-xs mt-0.5',
                value === option.id ? 'text-white/80' : 'text-gray-400'
              )}>
                {option.description}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
