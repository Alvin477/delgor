"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import LanguageSelector from '@/app/components/LanguageSelector';
import Toggler from '@/app/components/Toggler';

export default function Header() {
  const { theme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 shadow-md text-black dark:text-white">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image 
          src={theme === 'dark' ? "/images/menulogo.png" : "/images/menulogodark.png"} 
          alt="Delgor Logo" 
          width={120} 
          height={40} 
        />
      </Link>

      {/* Language Selector and Theme Toggler */}
      <div className="flex items-center space-x-6">
        <LanguageSelector />
        <Toggler />
      </div>
    </header>
  );
}
