
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Sparkles, Heart, Smile, ArrowRight, type LucideIcon } from 'lucide-react';
import type { DentalPackage } from '@/types';
import { formatPrice } from '@/utils/calculator';

const iconMap: Record<string, LucideIcon> = {
  Baby,
  Sparkles,
  Heart,
  Smile,
};

interface PackageCardProps {
  pkg: DentalPackage;
  delay?: number;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, delay = 0 }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[pkg.icon] || Heart;

  const handleClick = () => {
    navigate(`/quote/${pkg.id}`);
  };

  return (
    <div
      className="card card-hover cursor-pointer overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      <div
        className="h-32 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${pkg.gradientFrom} 0%, ${pkg.gradientTo} 100%)`
        }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        <div className="relative z-10 w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
          <IconComponent size={40} className="text-white drop-shadow-lg" />
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate mb-2">{pkg.name}</h3>
        <p className="text-slate-light text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-slate-light">参考价格</span>
            <div className="text-lg font-bold text-primary">
              ¥{formatPrice(pkg.priceRange.min)}
              <span className="text-sm font-normal text-slate-light mx-1">~</span>
              ¥{formatPrice(pkg.priceRange.max)}
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
