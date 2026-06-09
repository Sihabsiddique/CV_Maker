import React from 'react';
import { useFormContext } from 'react-hook-form';

export const CandidateProfileSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<any>();
  const personalErrors = errors.personalInfo as any;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">1. Personal Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
            {...register('personalInfo.fullName')}
          />
          {personalErrors?.fullName && (
            <p className="text-[10px] text-rose-500 font-semibold mt-1">
              {personalErrors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
            {...register('personalInfo.email')}
          />
          {personalErrors?.email && (
            <p className="text-[10px] text-rose-500 font-semibold mt-1">
              {personalErrors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
            {...register('personalInfo.phone')}
          />
          {personalErrors?.phone && (
            <p className="text-[10px] text-rose-500 font-semibold mt-1">
              {personalErrors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
            {...register('personalInfo.linkedin')}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
            {...register('personalInfo.address')}
          />
          {personalErrors?.address && (
            <p className="text-[10px] text-rose-500 font-semibold mt-1">
              {personalErrors.address.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
