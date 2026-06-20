
import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightContent,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <header className={cn(
      'bg-white px-8 py-5 shadow-sm flex items-center justify-between z-10',
      className
    )}>
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-slate-light hover:bg-primary-50 hover:text-primary transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate">{title}</h1>
          {subtitle && (
            <p className="text-slate-light text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {rightContent}
        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>
    </header>
  );
};
