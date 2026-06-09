import React from 'react';
import { useCVStore } from '@/store/cvStore';

export const ExecutiveSummarySection: React.FC = () => {
  const { cvData, updateCVData } = useCVStore();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">2. Professional Summary</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded h-28 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
        value={cvData.summary}
        onChange={(e) => updateCVData({ summary: e.target.value })}
        placeholder="Enter your professional summary..."
      />
    </div>
  );
};
