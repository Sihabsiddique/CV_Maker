import { create } from 'zustand';
import { GovernmentCVData, initialGovernmentCVData } from '@/types/governmentCV.types';

interface GovernmentCVState {
  cvData: GovernmentCVData;
  isGeneratingPDF: boolean;
  activeTemplateId: string;
  updateCVData: (data: Partial<GovernmentCVData>) => void;
  setGeneratingPDF: (isGenerating: boolean) => void;
  setTemplate: (templateId: string) => void;
}

export const useGovernmentCVStore = create<GovernmentCVState>((set) => ({
  cvData: initialGovernmentCVData,
  isGeneratingPDF: false,
  activeTemplateId: 'executive',
  updateCVData: (data) => set((state) => ({ cvData: { ...state.cvData, ...data } })),
  setGeneratingPDF: (isGenerating) => set({ isGeneratingPDF: isGenerating }),
  setTemplate: (templateId) => set({ activeTemplateId: templateId }),
}));
