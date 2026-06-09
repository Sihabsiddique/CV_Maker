import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

export const CVDesignControls: React.FC = () => {
  const { activeTemplateId, setTemplate } = useGovernmentCVStore();

  return (
    <div className="bg-white border-b border-gray-200 p-4 shrink-0 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">CV Design Configuration</h3>
        <p className="text-xs text-gray-500 font-medium">Select styling framework and typography mode</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTemplate('executive')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer border ${
            activeTemplateId === 'executive'
              ? 'bg-black text-white border-black shadow'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Executive Government
        </button>
        <button
          onClick={() => setTemplate('modern')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer border ${
            activeTemplateId === 'modern'
              ? 'bg-black text-white border-black shadow'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Modern Professional
        </button>
      </div>
    </div>
  );
};
