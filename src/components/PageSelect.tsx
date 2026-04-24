import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PageSelectProps {
  pages: Array<{ name: string; cht: string; en: string }>;
  selectedPage: string;
  language: 'en' | 'cht';
  onPageChange: (pageName: string) => void;
}

export const PageSelect: React.FC<PageSelectProps> = ({
  pages,
  selectedPage,
  language,
  onPageChange,
}) => {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <select
        value={selectedPage}
        onChange={(e) => onPageChange(e.target.value)}
        className="block w-80 pl-3 pr-10 py-2 text-base border-2 border-[#DFE6F1] focus:outline-none focus:ring-2 focus:ring-[#4E6DB4] focus:border-[#4E6DB4] sm:text-sm rounded-md bg-white shadow-sm"
      >
        {pages.map((page) => (
          <option key={page.name} value={page.name}>
            {language === 'cht' ? page.cht : page.en}
          </option>
        ))}
      </select>
    </div>
  );
}