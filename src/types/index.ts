
export type PackageCategory = 'child' | 'adult' | 'implant' | 'orthodontics';

export type MaterialLevel = 'basic' | 'standard' | 'premium';

export type DiscountType = 'fullReduce' | 'installment' | 'referral';

export interface MaterialOption {
  id: string;
  name: string;
  level: MaterialLevel;
  basePrice: number;
  description: string;
}

export interface QuoteTierConfig {
  id: string;
  name: string;
  tagline: string;
  multiplier: number;
  includes: string[];
  excludes: string[];
  salesPitch: string;
}

export interface PackageConfigOptions {
  toothCount?: {
    min: number;
    max: number;
    default: number;
  };
  materials: MaterialOption[];
  includesXray: boolean;
  includesFollowUp: boolean;
  xrayPrice?: number;
  followUpPrice?: number;
}

export interface DentalPackage {
  id: string;
  name: string;
  category: PackageCategory;
  description: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  priceRange: {
    min: number;
    max: number;
  };
  configOptions: PackageConfigOptions;
  tiers: QuoteTierConfig[];
}

export interface QuoteConfig {
  packageId: string;
  toothCount: number;
  materialId: string;
  includesXray: boolean;
  includesFollowUp: boolean;
}

export interface QuoteTier {
  id: string;
  name: string;
  tagline: string;
  totalPrice: number;
  originalPrice: number;
  includes: string[];
  excludes: string[];
  salesPitch: string;
}

export interface QuoteResult {
  basePrice: number;
  xrayPrice: number;
  followUpPrice: number;
  tiers: QuoteTier[];
}

export interface DiscountConfig {
  type: DiscountType;
  id: string;
  name: string;
  description: string;
  requiresManagerApproval: boolean;
}

export interface FullReduceDiscount extends DiscountConfig {
  type: 'fullReduce';
  threshold: number;
  reduceAmount: number;
}

export interface InstallmentDiscount extends DiscountConfig {
  type: 'installment';
  periods: number;
  interestRate: number;
}

export interface ReferralDiscount extends DiscountConfig {
  type: 'referral';
  discountRate: number;
}

export type AnyDiscount = FullReduceDiscount | InstallmentDiscount | ReferralDiscount;

export interface PatientInfo {
  name: string;
  age: string;
  complaint: string;
}

export interface ConsultationForm {
  id: string;
  createdAt: string;
  patientInfo: PatientInfo;
  packageName: string;
  packageId: string;
  selectedTier: QuoteTier | null;
  toothCount: number;
  materialName: string;
  includesXray: boolean;
  includesFollowUp: boolean;
  discount: AnyDiscount | null;
  finalPrice: number;
  originalPrice: number;
  expiresAt: string;
}
