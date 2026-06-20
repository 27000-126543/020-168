
import { create } from 'zustand';
import type { QuoteConfig, AnyDiscount, PatientInfo, ConsultationForm, QuoteTier } from '@/types';
import { generateId, addDays } from '@/utils/calculator';

interface QuoteState {
  currentConfig: QuoteConfig;
  selectedTierId: string | null;
  selectedDiscount: AnyDiscount | null;
  patientInfo: PatientInfo;
  consultationHistory: ConsultationForm[];
  
  setConfig: (config: Partial<QuoteConfig>) => void;
  setSelectedTier: (tierId: string) => void;
  setDiscount: (discount: AnyDiscount | null) => void;
  setPatientInfo: (info: Partial<PatientInfo>) => void;
  createConsultation: (params: {
    packageId: string;
    packageName: string;
    tier: QuoteTier;
    finalPrice: number;
    originalPrice: number;
    toothCount: number;
    materialName: string;
    includesXray: boolean;
    includesFollowUp: boolean;
  }) => ConsultationForm;
  getConsultation: (id: string) => ConsultationForm | undefined;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  currentConfig: {
    packageId: '',
    toothCount: 1,
    materialId: '',
    includesXray: false,
    includesFollowUp: false
  },
  selectedTierId: null,
  selectedDiscount: null,
  patientInfo: {
    name: '',
    age: '',
    complaint: ''
  },
  consultationHistory: [],

  setConfig: (config) => set((state) => ({
    currentConfig: { ...state.currentConfig, ...config }
  })),

  setSelectedTier: (tierId) => set({ selectedTierId: tierId }),

  setDiscount: (discount) => set({ selectedDiscount: discount }),

  setPatientInfo: (info) => set((state) => ({
    patientInfo: { ...state.patientInfo, ...info }
  })),

  createConsultation: (params) => {
    const state = get();
    const now = new Date();
    const form: ConsultationForm = {
      id: generateId(),
      createdAt: now.toISOString(),
      patientInfo: { ...state.patientInfo },
      packageId: params.packageId,
      packageName: params.packageName,
      selectedTier: params.tier,
      toothCount: params.toothCount,
      materialName: params.materialName,
      includesXray: params.includesXray,
      includesFollowUp: params.includesFollowUp,
      discount: state.selectedDiscount,
      finalPrice: params.finalPrice,
      originalPrice: params.originalPrice,
      expiresAt: addDays(now, 7).toISOString()
    };
    
    set((s) => ({
      consultationHistory: [...s.consultationHistory, form]
    }));
    
    return form;
  },

  getConsultation: (id) => {
    return get().consultationHistory.find(c => c.id === id);
  }
}));
