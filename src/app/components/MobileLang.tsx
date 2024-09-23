"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaChevronDown } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '/images/flags/en.png' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '/images/flags/de.png' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '/images/flags/id.png' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '/images/flags/ar.png' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '/images/flags/fr.png' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '/images/flags/hi.png' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '/images/flags/pt.png' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '/images/flags/ru.png' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '/images/flags/zh-CN.png' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '/images/flags/ja.png' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '/images/flags/ur.png' },
];

export default function MobileLang() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (locale: string) => {
    const newPath = pathname.replace(/^\/(en|de|id|ar|fr|hi|pt|ru|zh-CN|ja|ur)/, `/${locale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const currentLanguage = languages.find(lang => pathname.startsWith(`/${lang.code}`)) || languages[0];

  return (
    <div className="relative">
      {/* Flag Button */}
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full p-2 transition-all duration-300 ease-in-out shadow-lg border-2 border-red-500"
      >
        <Image src={currentLanguage.flag} alt={currentLanguage.name} width={24} height={24} className="rounded-full" />
        <FaChevronDown className={`ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute mt-2 rounded-md shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out z-50 dropdown-center ${
          isOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'
        }`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-colors duration-150 whitespace-nowrap"
          >
            <Image src={lang.flag} alt={lang.name} width={24} height={24} className="mr-2 rounded-full" />
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
