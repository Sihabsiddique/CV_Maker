import { create } from 'zustand';
import { CVData, initialCVData, AppearanceSettings, initialAppearanceSettings } from '@/types/cv.types';

interface CVState {
  cvData: CVData;
  appearanceSettings: AppearanceSettings;
  isGeneratingPDF: boolean;
  activeTemplateId: string;
  updateCVData: (data: Partial<CVData>) => void;
  updateAppearanceSettings: (settings: Partial<AppearanceSettings>) => void;
  resetAppearanceSettings: () => void;
  setGeneratingPDF: (isGenerating: boolean) => void;
  setTemplate: (templateId: string) => void;
}

export const useCVStore = create<CVState>((set) => ({
  cvData: initialCVData,
  appearanceSettings: initialAppearanceSettings,
  isGeneratingPDF: false,
  activeTemplateId: 'executive',
  updateCVData: (data) => set((state) => {
    const isUnchanged = Object.keys(data).every(
      (key) => JSON.stringify(state.cvData[key as keyof CVData]) === JSON.stringify(data[key as keyof CVData])
    );
    if (isUnchanged) return state;
    return { cvData: { ...state.cvData, ...data } };
  }),
  updateAppearanceSettings: (settings) => set((state) => ({ appearanceSettings: { ...state.appearanceSettings, ...settings } })),
  resetAppearanceSettings: () => set({ appearanceSettings: initialAppearanceSettings }),
  setGeneratingPDF: (isGenerating) => set({ isGeneratingPDF: isGenerating }),
  setTemplate: (templateId) => set({ activeTemplateId: templateId }),
}));
