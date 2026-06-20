
import React from 'react';
import { X, Percent, Calendar, Users, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnyDiscount, FullReduceDiscount, InstallmentDiscount, ReferralDiscount } from '@/types';
import { fullReduceDiscounts, installmentDiscounts, referralDiscounts } from '@/data/packages';
import { formatPrice, applyDiscount, calculateInstallment } from '@/utils/calculator';

interface DiscountPanelProps {
  isOpen: boolean;
  onClose: () => void;
  originalPrice: number;
  selectedDiscount: AnyDiscount | null;
  managerApproved: boolean;
  onSelectDiscount: (discount: AnyDiscount | null) => void;
  onManagerApprove: () => void;
}

export const DiscountPanel: React.FC<DiscountPanelProps> = ({
  isOpen,
  onClose,
  originalPrice,
  selectedDiscount,
  managerApproved,
  onSelectDiscount,
  onManagerApprove,
}) => {
  if (!isOpen) return null;

  const needsApproval = selectedDiscount?.requiresManagerApproval === true;
  const approved = !needsApproval || managerApproved;

  const discountedPrice = applyDiscount(originalPrice, selectedDiscount);
  const installmentPerMonth = calculateInstallment(discountedPrice, selectedDiscount);

  const displayPrice = approved ? discountedPrice : originalPrice;
  const discountAmount = originalPrice - displayPrice;

  const isDiscountSelected = (discount: AnyDiscount) => {
    return selectedDiscount?.type === discount.type && selectedDiscount?.id === discount.id;
  };

  const handleDiscountClick = (discount: AnyDiscount) => {
    if (isDiscountSelected(discount)) {
      onSelectDiscount(null);
    } else {
      onSelectDiscount(discount);
    }
  };

  const DiscountCard = ({ discount, icon: Icon, color }: { discount: AnyDiscount; icon: React.ElementType; color: string }) => {
    const selected = isDiscountSelected(discount);
    const requiresApproval = discount.requiresManagerApproval;
    const isSelectedAndNeedsApproval = selected && requiresApproval && !managerApproved;
    const isSelectedAndApproved = selected && requiresApproval && managerApproved;

    let priceDisplay = '';
    if (discount.type === 'fullReduce') {
      const fr = discount as FullReduceDiscount;
      priceDisplay = `满${formatPrice(fr.threshold)}减${formatPrice(fr.reduceAmount)}`;
    } else if (discount.type === 'installment') {
      const ins = discount as InstallmentDiscount;
      priceDisplay = `${ins.periods}期${ins.interestRate === 0 ? '免息' : ''}`;
    } else if (discount.type === 'referral') {
      const rd = discount as ReferralDiscount;
      priceDisplay = `${(rd.discountRate * 10).toFixed(1)}折优惠`;
    }

    return (
      <div
        className={cn(
          'p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200',
          isSelectedAndApproved
            ? 'border-mint bg-mint-50'
            : selected && !requiresApproval
            ? 'border-primary bg-primary-50'
            : isSelectedAndNeedsApproval
            ? 'border-coral bg-coral-50/50'
            : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50',
          requiresApproval && !selected && 'border-dashed border-coral/40'
        )}
        onClick={() => handleDiscountClick(discount)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-medium text-slate">{discount.name}</p>
              <p className="text-sm text-slate-light mt-0.5">{priceDisplay}</p>
            </div>
          </div>
          <div className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
            isSelectedAndApproved
              ? 'bg-mint border-mint'
              : selected && !requiresApproval
              ? 'bg-primary border-primary'
              : isSelectedAndNeedsApproval
              ? 'bg-coral border-coral'
              : 'border-gray-300'
          )}>
            {isSelectedAndApproved && <Check size={14} className="text-white" />}
            {selected && !requiresApproval && <Check size={14} className="text-white" />}
            {isSelectedAndNeedsApproval && <AlertTriangle size={14} className="text-white" />}
          </div>
        </div>
        {requiresApproval && (
          <div className={cn(
            'mt-3 flex items-center gap-1.5 text-xs',
            isSelectedAndApproved
              ? 'text-mint-dark font-medium'
              : isSelectedAndNeedsApproval
              ? 'text-coral font-medium'
              : 'text-coral/70'
          )}>
            {isSelectedAndApproved ? (
              <>
                <Check size={14} />
                <span>已授权</span>
              </>
            ) : isSelectedAndNeedsApproval ? (
              <>
                <AlertTriangle size={14} />
                <span>待主管确认，仅测算展示</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} />
                <span>需主管确认</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-scale-in m-6 max-h-[85vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate">优惠调整</h3>
            <p className="text-sm text-slate-light mt-0.5">请在授权范围内选择优惠方案</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-slate-light hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 价格概览 */}
        <div className={cn(
          'px-6 py-4 border-b border-gray-100',
          approved
            ? 'bg-gradient-to-r from-primary-50 to-mint-50'
            : 'bg-gradient-to-r from-coral-50 to-coral-50/30'
        )}>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-sm text-slate-light">原总价</span>
              <p className="text-lg font-medium text-slate line-through">
                ¥{formatPrice(originalPrice)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-light">
                {approved ? '优惠后' : '成交价（不含待确认优惠）'}
              </span>
              <p className={cn(
                'text-2xl font-bold',
                approved ? 'text-primary' : 'text-coral'
              )}>
                ¥{formatPrice(displayPrice)}
              </p>
              {installmentPerMonth && approved && (
                <p className="text-xs text-slate-light mt-0.5">
                  约 ¥{formatPrice(installmentPerMonth)}/期
                </p>
              )}
            </div>
          </div>
          {/* 授权状态提示 */}
          {needsApproval && (
            <div className={cn(
              'mt-3 p-3 rounded-xl flex items-center gap-2',
              managerApproved
                ? 'bg-mint-50 border border-mint/20'
                : 'bg-white/80'
            )}>
              {managerApproved ? (
                <>
                  <Check size={18} className="text-mint-dark" />
                  <span className="text-sm font-medium text-mint-dark">
                    主管已授权，优惠将在确认应用后生效
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="text-coral" />
                  <span className="text-sm font-medium text-coral">
                    该优惠需主管确认，当前仅做测算展示
                  </span>
                </>
              )}
              {!managerApproved && (
                <div className="flex items-center justify-between text-sm w-full ml-2">
                  <span className="text-slate-light">测算优惠后</span>
                  <span className="text-coral font-medium">¥{formatPrice(discountedPrice)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 优惠选项 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Percent size={18} className="text-primary" />
              <h4 className="font-semibold text-slate">满减优惠</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fullReduceDiscounts.map((discount) => (
                <DiscountCard
                  key={discount.id}
                  discount={discount}
                  icon={Percent}
                  color="bg-primary-50 text-primary"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-mint" />
              <h4 className="font-semibold text-slate">分期方案</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {installmentDiscounts.map((discount) => (
                <DiscountCard
                  key={discount.id}
                  discount={discount}
                  icon={Calendar}
                  color="bg-mint-50 text-mint-dark"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-coral" />
              <h4 className="font-semibold text-slate">老客转介绍</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {referralDiscounts.map((discount) => (
                <DiscountCard
                  key={discount.id}
                  discount={discount}
                  icon={Users}
                  color="bg-coral-50 text-coral"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            className="flex-1 btn-secondary"
            onClick={() => onSelectDiscount(null)}
          >
            清除优惠
          </button>
          {needsApproval && !managerApproved ? (
            <button
              className="flex-1 btn-primary bg-coral hover:bg-coral-light flex items-center justify-center gap-2"
              onClick={onManagerApprove}
            >
              <ShieldCheck size={18} />
              主管确认授权
            </button>
          ) : (
            <button
              className="flex-1 btn-primary"
              onClick={onClose}
            >
              {needsApproval && managerApproved ? '确认应用优惠' : '确认应用'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
