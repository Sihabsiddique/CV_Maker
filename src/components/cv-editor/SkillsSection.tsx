import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CVFormValues } from '@/utils/cvSchema';

export const SkillsSection: React.FC = () => {
  const { register, control } = useFormContext<CVFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills'
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">3. Skills / Competencies</h2>
        <button
          onClick={() => append({ id: `sk_${Date.now()}`, category: '', skills: '' })}
          className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Skill
        </button>
      </div>
      {fields.map((item, idx) => (
        <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded relative">
          <button
            onClick={() => remove(idx)}
            className="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
          <div className="grid grid-cols-1 gap-2 mt-2">
            <input
              type="text"
              placeholder="Category (e.g. Languages & Frameworks)"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
              {...register(`skills.${idx}.category` as const)}
            />
            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-gray-800"
              {...register(`skills.${idx}.skills` as const)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
