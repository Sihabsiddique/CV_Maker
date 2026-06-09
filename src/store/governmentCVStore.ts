import { create } from 'zustand';
import { GovernmentCVData, initialGovernmentCVData, AppearanceSettings, initialAppearanceSettings } from '@/types/governmentCV.types';

interface GovernmentCVState {
  cvData: GovernmentCVData;
  appearanceSettings: AppearanceSettings;
  isGeneratingPDF: boolean;
  activeTemplateId: string;
  updateCVData: (data: Partial<GovernmentCVData>) => void;
  updateAppearanceSettings: (settings: Partial<AppearanceSettings>) => void;
  resetAppearanceSettings: () => void;
  setGeneratingPDF: (isGenerating: boolean) => void;
  setTemplate: (templateId: string) => void;
}

export const useGovernmentCVStore = create<GovernmentCVState>((set) => ({
  cvData: initialGovernmentCVData,
  appearanceSettings: initialAppearanceSettings,
  isGeneratingPDF: false,
  activeTemplateId: 'executive',
  updateCVData: (data) => set((state) => {
    const isUnchanged = Object.keys(data).every(
      (key) => JSON.stringify(state.cvData[key as keyof GovernmentCVData]) === JSON.stringify(data[key as keyof GovernmentCVData])
    );
    if (isUnchanged) return state;
    return { cvData: { ...state.cvData, ...data } };
  }),
  updateAppearanceSettings: (settings) => set((state) => ({ appearanceSettings: { ...state.appearanceSettings, ...settings } })),
  resetAppearanceSettings: () => set({ appearanceSettings: initialAppearanceSettings }),
  setGeneratingPDF: (isGenerating) => set({ isGeneratingPDF: isGenerating }),
  setTemplate: (templateId) => set({ activeTemplateId: templateId }),
}));
