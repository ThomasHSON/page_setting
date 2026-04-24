import React, { useEffect, useState } from 'react';
import { Home, Globe } from 'lucide-react';
import { getHomepageUrl } from '../config';

interface NavigationProps {
  language: 'en' | 'cht';
  onLanguageChange: (lang: 'en' | 'cht') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ language, onLanguageChange }) => {
  const [homepageUrl, setHomepageUrl] = useState<string>('');

  useEffect(() => {
    getHomepageUrl().then(url => {
      setHomepageUrl(`${url}/phar_system/frontpage`);
    });
  }, []);

  return (
    <nav className="bg-white border-b border-[#DFE6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a
              href={homepageUrl}
              className="flex items-center gap-3 text-text-primary hover:text-primary transition-colors mr-4"
            >
              <Home className="w-7 h-7" />
            </a>
            <span className="text-xl font-medium">
              {language === 'cht' ? '頁面設定' : 'Page Settings'}
            </span>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => onLanguageChange(language === 'cht' ? 'en' : 'cht')}
              className="inline-flex items-center px-3 py-1.5 border border-[#DFE6F1] rounded text-sm font-medium text-[#333333] hover:bg-[#F4F7FC] transition-colors"
            >
              <Globe className="h-4 w-4 mr-1.5 text-[#666666]" />
              {language === 'cht' ? '繁體中文' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}