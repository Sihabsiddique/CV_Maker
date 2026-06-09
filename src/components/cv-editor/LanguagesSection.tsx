import React from 'react';
import { useCVStore } from '@/store/cvStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const LanguagesSection: React.FC = () => {
  const { cvData, updateCVData } = useCVStore();

  const addLanguage = () => {
    updateCVData({
      languages: [...cvData.languages, { id: generateId(), name: '', fluency: '' }]
    });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    const updated = cvData.languages.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateCVData({ languages: updated });
  };

  const removeLanguage = (id: string) => {
    updateCVData({
      languages: cvData.languages.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">7. Language Proficiency</h2>
        <button
          onClick={addLanguage}
          className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
        >
          + Add Language
        </button>
      </div>
      {cvData.languages.map((item) => (
        <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded relative grid grid-cols-2 gap-2">
          <button
            onClick={() => removeLanguage(item.id)}
            className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer"
          >
            Delete
          </button>
          <input
            type="text"
            placeholder="Language (e.g. English)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none mt-4"
            value={item.name}
            onChange={(e) => updateLanguage(item.id, 'name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Proficiency (e.g. Fluent)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none mt-4"
            value={item.fluency}
            onChange={(e) => updateLanguage(item.id, 'fluency', e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};
