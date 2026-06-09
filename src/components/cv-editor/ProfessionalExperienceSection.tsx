import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const ProfessionalExperienceSection: React.FC = () => {
  const { cvData, updateCVData } = useGovernmentCVStore();

  const addExperience = () => {
    updateCVData({
      experience: [
        ...cvData.experience,
        {
          id: generateId(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          responsibilities: [],
          achievements: []
        }
      ]
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean | string[]) => {
    const updated = cvData.experience.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateCVData({ experience: updated });
  };

  const removeExperience = (id: string) => {
    updateCVData({
      experience: cvData.experience.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">4. Work Experience</h2>
        <button
          onClick={addExperience}
          className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
        >
          + Add Experience
        </button>
      </div>
      {cvData.experience.map((item) => (
        <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded relative space-y-3">
          <button
            onClick={() => removeExperience(item.id)}
            className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer"
          >
            Delete
          </button>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              placeholder="Position"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={item.jobTitle}
              onChange={(e) => updateExperience(item.id, 'jobTitle', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organization"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={item.company}
              onChange={(e) => updateExperience(item.id, 'company', e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={item.location}
              onChange={(e) => updateExperience(item.id, 'location', e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Start Date"
                className="w-1/2 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={item.startDate}
                onChange={(e) => updateExperience(item.id, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="End Date"
                className="w-1/2 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={item.endDate}
                onChange={(e) => updateExperience(item.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Responsibilities (Paragraphs separated by new lines)
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded h-16 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              value={item.responsibilities?.join('\n') || ''}
              onChange={(e) => updateExperience(item.id, 'responsibilities', e.target.value.split('\n').filter(Boolean))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Achievements (Bullets separated by new lines)
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded h-24 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              value={item.achievements.join('\n')}
              onChange={(e) => updateExperience(item.id, 'achievements', e.target.value.split('\n').filter(Boolean))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
