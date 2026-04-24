import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { PageSelect } from './components/PageSelect';
import { ParameterSettings } from './components/ParameterSettings';
import { getApiUrl } from './config';
import type { Page, PageParameter, APIResponse } from './types';

const pages: Page[] = [
  {
    name: "none",
    cht: "請選擇頁面",
    en: "Select a Page"
  },
  {
    name: "medicine_cart",
    cht: "住院藥車",
    en: "Medicine Cart"
  },
  {
    name: "inventory",
    cht: "盤點功能",
    en: "Inventory"
  }
];

function App() {
  const [language, setLanguage] = useState<'en' | 'cht'>('cht');
  const [selectedPage, setSelectedPage] = useState('none');
  const [parameters, setParameters] = useState<PageParameter[]>([]);
  const [originalParameters, setOriginalParameters] = useState<PageParameter[]>([]);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPage === 'none') {
      setParameters([]);
      setOriginalParameters([]);
      return;
    }

    const fetchPageParameters = async () => {
      try {
        const apiUrl = await getApiUrl('/api/settingPage/get_by_page_name');
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ValueAry: [selectedPage]
          })
        });

        const data: APIResponse = await response.json();
        if (data.Code === 200) {
          console.log("頁面參數回傳", data.Data);
          setParameters(data.Data);
          setOriginalParameters(data.Data);
        } else {
          setApiError(`錯誤 : ${data.Result}`);
          setTimeout(() => setApiError(null), 3000);
        }
      } catch (error) {
        console.error('Error fetching page parameters:', error);
        setApiError('錯誤 : 系統發生錯誤');
        setTimeout(() => setApiError(null), 3000);
      }
    };

    fetchPageParameters();
  }, [selectedPage]);

  const handleParameterChange = (guid: string, value: any) => {
    setParameters(prev => prev.map(param => 
      param.GUID === guid ? { ...param, value } : param
    ));
  };

  const hasChanges = () => {
    return parameters.some((param, index) => {
      const original = originalParameters[index];
      if (param.value_type === 'checkbox_group') {
        const currentValue = (param.value as any[])
          .filter(v => v.value === 'True')
          .map(v => v.name)
          .join(';');
        const originalValue = (original.value as any[])
          .filter(v => v.value === 'True')
          .map(v => v.name)
          .join(';');
        return currentValue !== originalValue;
      }
      return param.value !== original.value;
    });
  };

  const handleSave = async () => {
    const changedParameters = parameters.filter((param, index) => {
      const original = originalParameters[index];
      if (param.value_type === 'checkbox_group') {
        const currentValue = (param.value as any[])
          .filter(v => v.value === 'True')
          .map(v => v.name)
          .join(';');
        const originalValue = (original.value as any[])
          .filter(v => v.value === 'True')
          .map(v => v.name)
          .join(';');
        return currentValue !== originalValue;
      }
      return param.value !== original.value;
    });

    for (const param of changedParameters) {
      try {
        const value = param.value_type === 'checkbox_group'
          ? (param.value as any[])
            .filter(v => v.value === 'True')
            .map(v => v.name)
            .join(';')
          : param.value;

        const apiUrl = await getApiUrl('/api/settingPage/update');
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ValueAry: [param.GUID, value]
          })
        });

        const data = await response.json();
        
        if (data.Code === 200) {
          setSaveStatus({ type: 'success', message: language === 'cht' ? '儲存成功' : 'Save successful' });
          setOriginalParameters(parameters);
        } else {
          setApiError(`錯誤 : ${data.Result}`);
          setSaveStatus({ 
            type: 'error', 
            message: language === 'cht' 
              ? `儲存失敗: ${data.Result}` 
              : `Save failed: ${data.Result}` 
          });
        }
      } catch (error) {
        console.error('Error updating parameter:', error);
        setApiError('錯誤 : 系統發生錯誤');
        setSaveStatus({ 
          type: 'error', 
          message: language === 'cht' 
            ? '儲存時發生錯誤' 
            : 'An error occurred while saving' 
        });
      }
    }

    setTimeout(() => {
      setSaveStatus({ type: null, message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      
      <main className="flex-1 w-full mx-auto py-6">
        <div className="w-4/5 mx-auto">
          <div className="mb-8">
            <PageSelect
              pages={pages}
              selectedPage={selectedPage}
              language={language}
              onPageChange={setSelectedPage}
            />
          </div>

          {selectedPage !== 'none' && (
            <ParameterSettings
              parameters={parameters}
              language={language}
              onChange={handleParameterChange}
              onSave={handleSave}
              hasChanges={hasChanges()}
            />
          )}

          {saveStatus.type && (
            <div
              className={`fixed bottom-24 right-8 px-6 py-3 rounded-lg shadow-lg text-white ${
                saveStatus.type === 'success' ? 'bg-[#4E6DB4]' : 'bg-[#D9534F]'
              }`}
            >
              {saveStatus.message}
            </div>
          )}

          {apiError && (
            <div
              className="fixed top-8 right-8 px-6 py-3 rounded-lg shadow-lg bg-[#FFE8E8] text-[#D9534F] transform transition-transform duration-300 ease-in-out"
              style={{ animation: 'slideIn 0.3s ease-out' }}
            >
              {apiError}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full border-t border-[#DFE6F1] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[#666666]">
            Copyright ©2025 鴻森智能科技
          </p>
        </div>
      </footer>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;