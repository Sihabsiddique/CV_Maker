import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

export const CandidateProfileSection: React.FC = () => {
  const { cvData, updateCVData } = useGovernmentCVStore();

  const updatePersonalInfo = (field: string, value: string) => {
    updateCVData({ personalInfo: { ...cvData.personalInfo, [field]: value } });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">1. Personal Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={cvData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={cvData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={cvData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={cvData.personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={cvData.personalInfo.address}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
