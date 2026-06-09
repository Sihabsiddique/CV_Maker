import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const CompetencyProfileSection: React.FC = () => {
  const { cvData, updateCVData } = useGovernmentCVStore();

  const addSkill = () => {
    updateCVData({
      skills: [...cvData.skills, { id: generateId(), category: '', skills: '' }]
    });
  };

  const updateSkill = (id: string, field: string, value: string) => {
    const updated = cvData.skills.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateCVData({ skills: updated });
  };

  const removeSkill = (id: string) => {
    updateCVData({
      skills: cvData.skills.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">3. Skills / Competencies</h2>
        <button
          onClick={addSkill}
          className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
        >
          + Add Skill
        </button>
      </div>
      {cvData.skills.map((item) => (
        <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded relative">
          <button
            onClick={() => removeSkill(item.id)}
            className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer"
          >
            Delete
          </button>
          <div className="grid grid-cols-1 gap-2 mt-2">
            <input
              type="text"
              placeholder="Category (e.g. Languages & Frameworks)"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={item.category}
              onChange={(e) => updateSkill(item.id, 'category', e.target.value)}
            />
            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={item.skills}
              onChange={(e) => updateSkill(item.id, 'skills', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
