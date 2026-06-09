import React from 'react';
import { useCVStore } from '@/store/cvStore';
import { ExecutiveResumeTemplate } from '@/templates/ExecutiveResumeTemplate';
import { ExportCVActions } from './ExportCVActions';

export const CVPreview: React.FC = () => {
  const { cvData } = useCVStore();

  return (
    <div className="w-[55%] h-full bg-[#e5e7eb] flex flex-col relative overflow-hidden">
      {/* Preview Toolbar */}
      <div className="h-14 border-b border-gray-300 bg-gray-100 flex justify-between items-center px-6 shrink-0 shadow-sm z-10">
        <div className="text-gray-500 text-xs font-bold flex items-center gap-2 tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          LIVE ATS PREVIEW
        </div>
        <ExportCVActions />
      </div>
      
      {/* Preview Container */}
      <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
        <div className="origin-top scale-[0.6] 2xl:scale-[0.8] transition-transform duration-300 shadow-xl bg-white">
          <ExecutiveResumeTemplate data={cvData} />
        </div>
      </div>
    </div>
  );
};
