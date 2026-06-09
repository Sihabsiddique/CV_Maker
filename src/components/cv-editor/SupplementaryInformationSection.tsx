import React from 'react';
import { useGovernmentCVStore } from '@/store/governmentCVStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const SupplementaryInformationSection: React.FC = () => {
  const { cvData, updateCVData } = useGovernmentCVStore();

  const addCertification = () => {
    updateCVData({
      certifications: [...cvData.certifications, { id: generateId(), name: '' }]
    });
  };

  const updateCertification = (id: string, value: string) => {
    const updated = cvData.certifications.map(item =>
      item.id === id ? { ...item, name: value } : item
    );
    updateCVData({ certifications: updated });
  };

  const removeCertification = (id: string) => {
    updateCVData({
      certifications: cvData.certifications.filter(item => item.id !== id)
    });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    updateCVData({
      personalInfo: { ...cvData.personalInfo, [field]: value }
    });
  };

  return (
    <div className="space-y-8">
      {/* Certifications Sub-Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">6. Certifications / Additional Info</h2>
          <button
            onClick={addCertification}
            className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
          >
            + Add Certification
          </button>
        </div>
        {cvData.certifications.map((item) => (
          <div key={item.id} className="relative mt-2">
            <input
              type="text"
              placeholder="Certification Name"
              className="w-full p-2 pr-16 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={item.name}
              onChange={(e) => updateCertification(item.id, e.target.value)}
            />
            <button
              onClick={() => removeCertification(item.id)}
              className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer"
            >
              Delete
          </button>
          </div>
        ))}
      </div>

      {/* Personal Details Sub-Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">8/9. Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Father&apos;s Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.fatherName || ''}
              onChange={(e) => updatePersonalInfo('fatherName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mother&apos;s Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.motherName || ''}
              onChange={(e) => updatePersonalInfo('motherName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.dateOfBirth || ''}
              onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.gender || ''}
              onChange={(e) => updatePersonalInfo('gender', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.maritalStatus || ''}
              onChange={(e) => updatePersonalInfo('maritalStatus', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.nationality || ''}
              onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Religion</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.religion || ''}
              onChange={(e) => updatePersonalInfo('religion', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Permanent Address</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={cvData.personalInfo.permanentAddress || ''}
              onChange={(e) => updatePersonalInfo('permanentAddress', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
