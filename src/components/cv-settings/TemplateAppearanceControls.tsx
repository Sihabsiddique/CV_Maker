import React from 'react';
import { useCVStore } from '@/store/cvStore';

export const TemplateAppearanceControls: React.FC = () => {
  const { appearanceSettings, updateAppearanceSettings, resetAppearanceSettings } = useCVStore();

  const handleSliderChange = (key: keyof typeof appearanceSettings, value: number) => {
    updateAppearanceSettings({ [key]: value });
  };

  const handleSelectChange = (key: keyof typeof appearanceSettings, value: string) => {
    updateAppearanceSettings({ [key]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-150 pb-3">
        <div>
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
            🎨 Appearance Configuration
          </h2>
          <p className="text-[11px] text-gray-500 font-medium">Fine-tune template typography and borders</p>
        </div>
        <button
          onClick={resetAppearanceSettings}
          className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded border border-gray-300 hover:border-gray-400 active:scale-95 transition cursor-pointer"
        >
          Reset To Defaults
        </button>
      </div>

      {/* Font Size Group */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Typography Dimensions</h3>
        <div className="space-y-3">
          {/* Candidate Name Size */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Candidate Name Size</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.candidateNameSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={appearanceSettings.candidateNameSize}
              onChange={(e) => handleSliderChange('candidateNameSize', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Contact Info Size */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Contact Info Size</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.contactInfoSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="24"
              value={appearanceSettings.contactInfoSize}
              onChange={(e) => handleSliderChange('contactInfoSize', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Section Heading Size */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Section Heading Size</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.sectionHeadingSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="30"
              value={appearanceSettings.sectionHeadingSize}
              onChange={(e) => handleSliderChange('sectionHeadingSize', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Body Text Size */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Body Text Size</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.bodyTextSize}px</span>
            </div>
            <input
              type="range"
              min="9"
              max="20"
              value={appearanceSettings.bodyTextSize}
              onChange={(e) => handleSliderChange('bodyTextSize', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Experience Description Size */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Experience Description Size</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.experienceDescriptionSize}px</span>
            </div>
            <input
              type="range"
              min="9"
              max="18"
              value={appearanceSettings.experienceDescriptionSize}
              onChange={(e) => handleSliderChange('experienceDescriptionSize', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Font Weight and Color Group */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Typography Weights & Color</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Name Weight</label>
            <select
              value={appearanceSettings.candidateNameWeight}
              onChange={(e) => handleSelectChange('candidateNameWeight', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer bg-white"
            >
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Section Heading Weight</label>
            <select
              value={appearanceSettings.sectionHeadingWeight}
              onChange={(e) => handleSelectChange('sectionHeadingWeight', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer bg-white"
            >
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        {/* Text Darkness */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
            <span>Text Darkness</span>
            <span className="text-blue-600 font-bold">{appearanceSettings.textDarkness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={appearanceSettings.textDarkness}
            onChange={(e) => handleSliderChange('textDarkness', parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>Light Gray</span>
            <span>Pure Black</span>
          </div>
        </div>
      </div>

      {/* Border Configuration Group */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Divider Line Layout</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Border Color */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Divider Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={appearanceSettings.borderColor}
                onChange={(e) => handleSelectChange('borderColor', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <span className="text-xs font-mono text-gray-500 font-semibold">{appearanceSettings.borderColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Border Width (Percentage) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Divider Width</label>
            <select
              value={appearanceSettings.borderWidthPercent}
              onChange={(e) => handleSliderChange('borderWidthPercent', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer bg-white font-semibold"
            >
              <option value="80">80% Center</option>
              <option value="90">90% Center</option>
              <option value="100">100% Full</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Border Thickness */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Thickness</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.borderThickness}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={appearanceSettings.borderThickness}
              onChange={(e) => handleSliderChange('borderThickness', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Border Opacity */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
              <span>Opacity</span>
              <span className="text-blue-600 font-bold">{appearanceSettings.borderOpacity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={appearanceSettings.borderOpacity}
              onChange={(e) => handleSliderChange('borderOpacity', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
