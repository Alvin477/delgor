"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "/images/flags/en.png" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "/images/flags/de.png" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "/images/flags/id.png" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "/images/flags/ar.png" },
  { code: "fr", name: "French", nativeName: "Français", flag: "/images/flags/fr.png" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "/images/flags/hi.png" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "/images/flags/pt.png" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "/images/flags/ru.png" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "/images/flags/zh-CN.png" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "/images/flags/ja.png" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "/images/flags/ur.png" },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (locale: string) => {
    const searchParams = new URLSearchParams(window.location.search); // Get the current query parameters
    const newPath = pathname.replace(/^\/(en|de|id|ar|fr|hi|pt|ru|zh-CN|ja|ur)/, `/${locale}`);

    // Rebuild the URL with the new locale and the original query parameters
    const fullPath = `${newPath}?${searchParams.toString()}`;

    router.push(fullPath);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const currentLanguage = languages.find((lang) => pathname.startsWith(`/${lang.code}`)) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-52 h-10 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-full p-2 transition-all duration-300 ease-in-out shadow-lg border-2 border-red-500"
      >
        <div className="flex items-center">
          <Image src={currentLanguage.flag} alt={currentLanguage.name} width={24} height={24} className="mr-2 rounded-full" />
          <span className="text-sm font-medium truncate">{currentLanguage.nativeName}</span>
        </div>
        <FaChevronDown className={`transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
      </button>

      {/* Only render the dropdown if isOpen is true */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white dark:bg-gray-800 border-2 border-red-500 overflow-hidden transition-all duration-300 ease-in-out origin-top z-50`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <Image src={lang.flag} alt={lang.name} width={24} height={24} className="mr-2 rounded-full" />
              <span className="truncate">{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
