
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
  discountApplied: boolean;
  onSelectDiscount: (discount: AnyDiscount | null) => void;
  onManagerApprove: () => void;
  onApplyDiscount: () => void;
}

export const DiscountPanel: React.FC<DiscountPanelProps> = ({
  isOpen,
  onClose,
  originalPrice,
  selectedDiscount,
  managerApproved,
  discountApplied,
  onSelectDiscount,
  onManagerApprove,
  onApplyDiscount,
}) => {
  if (!isOpen) return null;

  const needsApproval = selectedDiscount?.requiresManagerApproval === true;
  const authorized = !needsApproval || managerApproved;

  const discountedPrice = applyDiscount(originalPrice, selectedDiscount);
  const installmentPerMonth = calculateInstallment(discountedPrice, selectedDiscount);

  const displayPrice = discountApplied ? discountedPrice : originalPrice;
  const discountAmount = originalPrice - displayPrice;

  const pendingApproval = needsApproval && !managerApproved;
  const pendingApply = needsApproval && managerApproved && !discountApplied;
  const applied = discountApplied || (!needsApproval && selectedDiscount);

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
    const cardPendingApproval = selected && requiresApproval && !managerApproved;
    const cardPendingApply = selected && requiresApproval && managerApproved && !discountApplied;
    const cardApproved = selected && !requiresApproval;
    const cardApplied = selected && requiresApproval && discountApplied;

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
          cardApplied
            ? 'border-mint bg-mint-50'
            : cardPendingApply
            ? 'border-primary bg-primary-50'
            : cardApproved
            ? 'border-primary bg-primary-50'
            : cardPendingApproval
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
            cardApplied
              ? 'bg-mint border-mint'
              : cardPendingApply
              ? 'bg-primary border-primary'
              : cardApproved
              ? 'bg-primary border-primary'
              : cardPendingApproval
              ? 'bg-coral border-coral'
              : 'border-gray-300'
          )}>
            {(cardApplied || cardApproved) && <Check size={14} className="text-white" />}
            {cardPendingApply && <ShieldCheck size={14} className="text-white" />}
            {cardPendingApproval && <AlertTriangle size={14} className="text-white" />}
          </div>
        </div>
        {requiresApproval && (
          <div className={cn(
            'mt-3 flex items-center gap-1.5 text-xs',
            cardApplied
              ? 'text-mint-dark font-medium'
              : cardPendingApply
              ? 'text-primary font-medium'
              : cardPendingApproval
              ? 'text-coral font-medium'
              : 'text-coral/70'
          )}>
            {cardApplied ? (
              <>
                <Check size={14} />
                <span>已应用</span>
              </>
            ) : cardPendingApply ? (
              <>
                <ShieldCheck size={14} />
                <span>已授权，请点击下方「确认应用优惠」</span>
              </>
            ) : cardPendingApproval ? (
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
          applied
            ? 'bg-gradient-to-r from-primary-50 to-mint-50'
            : pendingApply
            ? 'bg-gradient-to-r from-primary-50 to-primary-50/50'
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
                {applied
                  ? '优惠后（已应用）'
                  : pendingApply
                  ? '成交价（优惠待应用）'
                  : pendingApproval
                  ? '成交价（不含待确认优惠）'
                  : '成交价'}
              </span>
              <p className={cn(
                'text-2xl font-bold',
                applied ? 'text-primary' : pendingApply ? 'text-slate' : 'text-coral'
              )}>
                ¥{formatPrice(displayPrice)}
              </p>
              {installmentPerMonth && applied && (
                <p className="text-xs text-slate-light mt-0.5">
                  约 ¥{formatPrice(installmentPerMonth)}/期
                </p>
              )}
              {(pendingApply || pendingApproval) && (
                <p className="text-xs text-slate-light mt-0.5">
                  {pendingApply ? '应用后可至' : '确认后可至'} ¥{formatPrice(discountedPrice)}
                  {installmentPerMonth ? ` · 约 ¥${formatPrice(installmentPerMonth)}/期` : ''}
                </p>
              )}
            </div>
          </div>
          {/* 授权状态提示 */}
          {needsApproval && (
            <div className={cn(
              'mt-3 p-3 rounded-xl flex items-center gap-2',
              discountApplied
                ? 'bg-mint-50 border border-mint/20'
                : managerApproved
                ? 'bg-primary-50 border border-primary/20'
                : 'bg-white/80'
            )}>
              {discountApplied ? (
                <>
                  <Check size={18} className="text-mint-dark" />
                  <span className="text-sm font-medium text-mint-dark">
                    优惠已应用
                  </span>
                </>
              ) : managerApproved ? (
                <>
                  <ShieldCheck size={18} className="text-primary" />
                  <span className="text-sm font-medium text-primary">
                    主管已授权，请点击下方「确认应用优惠」
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
          {pendingApproval ? (
            <button
              className="flex-1 btn-primary bg-coral hover:bg-coral-light flex items-center justify-center gap-2"
              onClick={onManagerApprove}
            >
              <ShieldCheck size={18} />
              主管确认授权
            </button>
          ) : pendingApply ? (
            <button
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              onClick={onApplyDiscount}
            >
              <Check size={18} />
              确认应用优惠
            </button>
          ) : (
            <button
              className="flex-1 btn-primary"
              onClick={onClose}
            >
              {applied ? '关闭' : '确认应用'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
