
import React from 'react';
import { Check, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuoteTier } from '@/types';
import { formatPrice } from '@/utils/calculator';

interface QuoteTierCardProps {
  tier: QuoteTier;
  isSelected: boolean;
  isHighlighted?: boolean;
  onSelect: () => void;
  delay?: number;
}

export const QuoteTierCard: React.FC<QuoteTierCardProps> = ({
  tier,
  isSelected,
  isHighlighted = false,
  onSelect,
  delay = 0,
}) => {
  const getBorderColor = () => {
    if (isSelected) return 'border-primary ring-2 ring-primary/20';
    if (isHighlighted) return 'border-mint ring-2 ring-mint/20';
    return 'border-transparent';
  };

  const getHeaderBg = () => {
    if (isHighlighted) return 'bg-gradient-to-r from-mint to-mint-light text-white';
    return 'bg-gray-50 text-slate';
  };

  return (
    <div
      className={cn(
        'card overflow-hidden cursor-pointer transition-all duration-300 border-2',
        getBorderColor(),
        isSelected ? 'scale-[1.02] shadow-card-hover' : 'hover:scale-[1.01]',
        'animate-slide-up'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onSelect}
    >
      {/* 头部 */}
      <div className={cn('px-6 py-4', getHeaderBg())}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{tier.name}</h3>
            <p className="text-sm opacity-90 mt-0.5">{tier.tagline}</p>
          </div>
          {isHighlighted && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
              推荐
            </span>
          )}
        </div>
      </div>

      {/* 价格 */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-slate-light">¥</span>
          <span className="text-4xl font-bold text-slate">
            {formatPrice(tier.totalPrice)}
          </span>
        </div>
        {tier.originalPrice !== tier.totalPrice && (
          <span className="text-sm text-gray-400 line-through">
            原价 ¥{formatPrice(tier.originalPrice)}
          </span>
        )}
      </div>

      {/* 包含项目 */}
      <div className="p-6 space-y-3">
        <div>
          <p className="text-sm font-medium text-slate mb-2">包含项目</p>
          <ul className="space-y-2">
            {tier.includes.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-mint-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-mint-dark" />
                </div>
                <span className="text-slate-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {tier.excludes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate mb-2">不包含</p>
            <ul className="space-y-2">
              {tier.excludes.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X size={12} className="text-gray-400" />
                  </div>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 话术气泡 */}
      <div className="px-6 pb-6">
        <div className="bg-primary-50 rounded-2xl p-4 relative">
          <div className="absolute -top-2 left-6 w-4 h-4 bg-primary-50 rotate-45" />
          <div className="flex gap-2">
            <MessageCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary leading-relaxed">
              {tier.salesPitch}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
