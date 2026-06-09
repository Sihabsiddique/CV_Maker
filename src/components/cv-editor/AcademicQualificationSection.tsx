import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const AcademicQualificationSection: React.FC = () => {
  const { cvData, updateCVData } = useGovernmentCVStore();

  const addEducation = () => {
    updateCVData({
      education: [
        ...cvData.education,
        { id: generateId(), degree: '', institution: '', startDate: '', endDate: '', gpa: '' }
      ]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const updated = cvData.education.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateCVData({ education: updated });
  };

  const removeEducation = (id: string) => {
    updateCVData({
      education: cvData.education.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">5. Education & Training</h2>
        <button
          onClick={addEducation}
          className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
        >
          + Add Education
        </button>
      </div>
      {cvData.education.map((item) => (
        <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded relative grid grid-cols-2 gap-2">
          <button
            onClick={() => removeEducation(item.id)}
            className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer"
          >
            Delete
          </button>
          <input
            type="text"
            placeholder="Degree"
            className="col-span-2 w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none mt-4"
            value={item.degree}
            onChange={(e) => updateEducation(item.id, 'degree', e.target.value)}
          />
          <input
            type="text"
            placeholder="Institution"
            className="col-span-2 w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={item.institution}
            onChange={(e) => updateEducation(item.id, 'institution', e.target.value)}
          />
          <input
            type="text"
            placeholder="Start Date"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={item.startDate}
            onChange={(e) => updateEducation(item.id, 'startDate', e.target.value)}
          />
          <input
            type="text"
            placeholder="End Date"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={item.endDate || ''}
            onChange={(e) => updateEducation(item.id, 'endDate', e.target.value)}
          />
          <input
            type="text"
            placeholder="Result/GPA"
            className="col-span-2 w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={item.gpa || ''}
            onChange={(e) => updateEducation(item.id, 'gpa', e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};
