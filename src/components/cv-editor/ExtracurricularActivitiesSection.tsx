import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const ExtracurricularActivitiesSection: React.FC = () => {
  const { cvData, updateCVData } = useGovernmentCVStore();

  const addActivity = () => {
    updateCVData({
      extracurricular: [...cvData.extracurricular, { id: generateId(), role: '', organization: '' }]
    });
  };

  const updateActivity = (id: string, field: string, value: string) => {
    const updated = cvData.extracurricular.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateCVData({ extracurricular: updated });
  };

  const removeActivity = (id: string) => {
    updateCVData({
      extracurricular: cvData.extracurricular.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">10. Extracurricular Activities</h2>
        <button
          onClick={addActivity}
          className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
        >
          + Add Activity
        </button>
      </div>
      {cvData.extracurricular.map((item) => (
        <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded relative grid grid-cols-2 gap-2">
          <button
            onClick={() => removeActivity(item.id)}
            className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer"
          >
            Delete
          </button>
          <input
            type="text"
            placeholder="Role (e.g. Executive Member)"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none mt-4"
            value={item.role}
            onChange={(e) => updateActivity(item.id, 'role', e.target.value)}
          />
          <input
            type="text"
            placeholder="Organization"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none mt-4"
            value={item.organization}
            onChange={(e) => updateActivity(item.id, 'organization', e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};
