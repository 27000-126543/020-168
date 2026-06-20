
import { create } from 'zustand';
import type { QuoteConfig, AnyDiscount, PatientInfo, ConsultationForm, QuoteTier } from '@/types';
import { generateId, addDays } from '@/utils/calculator';

const STORAGE_KEY = 'dental_consultations';

function loadFromStorage(): ConsultationForm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(forms: ConsultationForm[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch {}
}

interface QuoteState {
  currentConfig: QuoteConfig;
  selectedTierId: string | null;
  selectedDiscount: AnyDiscount | null;
  managerApproved: boolean;
  discountApplied: boolean;
  patientInfo: PatientInfo;
  consultationHistory: ConsultationForm[];

  setConfig: (config: Partial<QuoteConfig>) => void;
  setSelectedTier: (tierId: string) => void;
  setDiscount: (discount: AnyDiscount | null) => void;
  setManagerApproved: (approved: boolean) => void;
  setDiscountApplied: (applied: boolean) => void;
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
    discount: AnyDiscount | null;
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
  managerApproved: false,
  discountApplied: false,
  patientInfo: {
    name: '',
    age: '',
    complaint: ''
  },
  consultationHistory: loadFromStorage(),

  setConfig: (config) => set((state) => ({
    currentConfig: { ...state.currentConfig, ...config }
  })),

  setSelectedTier: (tierId) => set({ selectedTierId: tierId }),

  setDiscount: (discount) => set({
    selectedDiscount: discount,
    managerApproved: false,
    discountApplied: false
  }),

  setManagerApproved: (approved) => set({ managerApproved: approved }),

  setDiscountApplied: (applied) => set({ discountApplied: applied }),

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
      discount: params.discount,
      finalPrice: params.finalPrice,
      originalPrice: params.originalPrice,
      expiresAt: addDays(now, 7).toISOString()
    };

    const newHistory = [...state.consultationHistory, form];
    set({ consultationHistory: newHistory });
    saveToStorage(newHistory);

    return form;
  },

  getConsultation: (id) => {
    const stored = loadFromStorage();
    const fromMemory = get().consultationHistory.find(c => c.id === id);
    const fromStorage = stored.find(c => c.id === id);
    return fromMemory || fromStorage;
  }
}));
