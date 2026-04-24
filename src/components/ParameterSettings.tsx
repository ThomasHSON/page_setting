import React from 'react';
import { Save } from 'lucide-react';
import type { PageParameter } from '../types';

interface ParameterSettingsProps {
  parameters: PageParameter[];
  language: 'en' | 'cht';
  onChange: (guid: string, value: any) => void;
  onSave: () => void;
  hasChanges: boolean;
}

export const ParameterSettings: React.FC<ParameterSettingsProps> = ({
  parameters,
  language,
  onChange,
  onSave,
  hasChanges,
}) => {
  const renderParameter = (param: PageParameter) => {
    switch (param.value_type) {
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={param.GUID}
              checked={param.value === 'True'}
              onChange={(e) => onChange(param.GUID, e.target.checked ? 'True' : 'False')}
              className="h-4 w-4 text-[#4E6DB4] focus:ring-[#4E6DB4] border-[#DFE6F1] rounded"
            />
            <label htmlFor={param.GUID} className="text-sm font-medium text-[#333333]">
              {param.cht}
            </label>
          </div>
        );

      case 'checkbox_group':
        if (!Array.isArray(param.value)) return null;
        const maxSelections = parseInt(param.option_str || '0', 10);
        const selectedCount = param.value.filter(v => v.value === 'True').length;

        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#333333] mb-2">
              {param.cht} {maxSelections > 0 && `(最多選擇 ${maxSelections} 個)`}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {param.value.map((option, idx) => (
                <div key={option.name} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`${param.GUID}-${idx}`}
                    checked={option.value === 'True'}
                    disabled={option.value !== 'True' && selectedCount >= maxSelections}
                    onChange={(e) => {
                      const newValue = [...param.value];
                      newValue[idx] = { ...option, value: e.target.checked ? 'True' : 'False' };
                      onChange(param.GUID, newValue);
                    }}
                    className="h-4 w-4 text-[#4E6DB4] focus:ring-[#4E6DB4] border-[#DFE6F1] rounded disabled:opacity-50"
                  />
                  <label 
                    htmlFor={`${param.GUID}-${idx}`} 
                    className={`text-sm ${option.value === 'True' ? 'text-[#333333]' : 'text-[#666666]'}`}
                  >
                    {option.cht}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'radio':
        if (!param.option) return null;
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#333333] mb-2">
              {param.cht}
            </label>
            <div className="space-y-2">
              {param.option.map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`${param.GUID}-${option}`}
                    name={param.GUID}
                    value={option}
                    checked={param.value === option}
                    onChange={(e) => onChange(param.GUID, e.target.value)}
                    className="h-4 w-4 text-[#4E6DB4] focus:ring-[#4E6DB4] border-[#DFE6F1]"
                  />
                  <label htmlFor={`${param.GUID}-${option}`} className="text-[#333333]" style={{
              fontSize: param.name.includes("font_size") ? `${option}px` : "",
            }}>
                    {param.name.includes("font_size") ? `${option} pixels` : option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'time':
        const [hours, minutes] = (param.value as string).split(':');
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#333333] mb-2">
              {param.cht}
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={hours}
                onChange={(e) => onChange(param.GUID, `${e.target.value}:${minutes}`)}
                className="block w-24 pl-3 pr-10 py-2 text-base border-2 border-[#DFE6F1] focus:outline-none focus:ring-2 focus:ring-[#4E6DB4] focus:border-[#4E6DB4] sm:text-sm rounded-md"
              >
                {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="text-xl self-center text-[#666666]">:</span>
              <select
                value={minutes}
                onChange={(e) => onChange(param.GUID, `${hours}:${e.target.value}`)}
                className="block w-24 pl-3 pr-10 py-2 text-base border-2 border-[#DFE6F1] focus:outline-none focus:ring-2 focus:ring-[#4E6DB4] focus:border-[#4E6DB4] sm:text-sm rounded-md"
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {parameters.map((param) => (
        <div key={param.GUID} className="bg-white p-6 rounded-lg shadow-sm border border-[#DFE6F1]">
          {renderParameter(param)}
        </div>
      ))}
      
      <div className="fixed bottom-8 right-8">
        <button
          onClick={onSave}
          disabled={!hasChanges}
          className={`inline-flex items-center px-6 py-3 rounded-full shadow-lg text-white text-lg font-medium transition-all transform hover:scale-105 ${
            hasChanges
              ? 'btn-primary'
              : 'bg-[#666666] cursor-not-allowed'
          }`}
        >
          <Save className="h-5 w-5 mr-2" />
          {language === 'cht' ? '儲存變更' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};