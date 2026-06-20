
import type { DentalPackage, QuoteConfig, QuoteResult, QuoteTier, AnyDiscount, FullReduceDiscount, InstallmentDiscount, ReferralDiscount } from '@/types';
import { MAX_AUTHORIZED_DISCOUNT_RATE } from '@/data/packages';

export function formatPrice(price: number): string {
  return price.toLocaleString('zh-CN');
}

export function calculateQuote(pkg: DentalPackage, config: QuoteConfig): QuoteResult {
  const material = pkg.configOptions.materials.find(m => m.id === config.materialId);
  if (!material) {
    return {
      basePrice: 0,
      xrayPrice: 0,
      followUpPrice: 0,
      tiers: []
    };
  }

  const toothCount = config.toothCount || 1;
  const baseMaterialPrice = material.basePrice * toothCount;
  const xrayPrice = config.includesXray ? (pkg.configOptions.xrayPrice || 0) : 0;
  const followUpPrice = config.includesFollowUp ? (pkg.configOptions.followUpPrice || 0) : 0;
  const basePrice = baseMaterialPrice + xrayPrice + followUpPrice;

  const tiers: QuoteTier[] = pkg.tiers.map(tier => ({
    id: tier.id,
    name: tier.name,
    tagline: tier.tagline,
    totalPrice: Math.round(basePrice * tier.multiplier),
    originalPrice: Math.round(basePrice * tier.multiplier),
    includes: tier.includes,
    excludes: tier.excludes,
    salesPitch: tier.salesPitch
  }));

  return {
    basePrice,
    xrayPrice,
    followUpPrice,
    tiers
  };
}

export function applyDiscount(price: number, discount: AnyDiscount | null): number {
  if (!discount) return price;

  switch (discount.type) {
    case 'fullReduce': {
      const fr = discount as FullReduceDiscount;
      if (price >= fr.threshold) {
        return price - fr.reduceAmount;
      }
      return price;
    }
    case 'referral': {
      const rd = discount as ReferralDiscount;
      return Math.round(price * rd.discountRate);
    }
    case 'installment':
      return price;
    default:
      return price;
  }
}

export function calculateInstallment(price: number, discount: AnyDiscount | null): number | null {
  if (!discount || discount.type !== 'installment') return null;
  const ins = discount as InstallmentDiscount;
  return Math.round(price / ins.periods);
}

export function getDiscountAmount(originalPrice: number, finalPrice: number, discount: AnyDiscount | null): number {
  if (!discount) return 0;
  
  if (discount.type === 'installment') return 0;
  
  return originalPrice - finalPrice;
}

export function getDiscountRate(originalPrice: number, discountAmount: number): number {
  if (originalPrice === 0) return 0;
  return discountAmount / originalPrice;
}

export function requiresManagerApproval(originalPrice: number, finalPrice: number): boolean {
  const discountAmount = originalPrice - finalPrice;
  const discountRate = getDiscountRate(originalPrice, discountAmount);
  return discountRate > MAX_AUTHORIZED_DISCOUNT_RATE;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
