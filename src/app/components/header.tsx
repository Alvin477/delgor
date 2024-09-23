"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import LanguageSelector from '@/app/components/LanguageSelector';
import Toggler from '@/app/components/Toggler';
import { useTranslations } from 'next-intl';
import { FaHome, FaFilm, FaTv, FaListAlt, FaClipboard, FaUserPlus } from 'react-icons/fa'; // Importing icons
import { useParams } from 'next/navigation'; // Import useParams instead of useRouter

export default function Header() {
  const { theme } = useTheme();
  const t = useTranslations('Header');
  const params = useParams(); // Get params from the app router
  const locale = params?.locale || 'en'; // Get the locale from params

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 shadow-md text-black dark:text-white relative z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image 
          src={theme === 'dark' ? "/images/menulogo.png" : "/images/menulogodark.png"} 
          alt="Delgor Logo" 
          width={120} 
          height={40} 
        />
      </Link>

      {/* Navigation Menu */}
      <nav className="flex items-center space-x-8 relative">
        {/* Home */}
        <Link href="/" className="flex items-center hover:underline">
          <FaHome className="mr-2" /> {t('home')}
        </Link>

        {/* Watch Menu with Submenu */}
        <div className="relative group">
          <button className="flex items-center hover:underline relative z-50">
            <FaFilm className="mr-2" /> {t('watch')}
          </button>
          {/* Submenu */}
          <div className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-900 shadow-lg p-2 mt-2 rounded-md z-50">
            <Link href={`/${locale}/movies`} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center">
              <FaFilm className="mr-2" /> {t('movies')}
            </Link>
            <Link href={`/${locale}/tvshows`} className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center">
              <FaTv className="mr-2" /> {t('tvSeries')}
            </Link>
          </div>
        </div>

        {/* Report */}
        <Link href="/report" className="flex items-center hover:underline">
          <FaClipboard className="mr-2" /> {t('report')}
        </Link>

        {/* Watch List */}
        <Link href={`/${locale}/watchlist`} className="flex items-center hover:underline">
          <FaListAlt className="mr-2" /> {t('watchList')}
        </Link>

        {/* Join Us */}
        <Link href="/join-us" className="flex items-center hover:underline">
          <FaUserPlus className="mr-2" /> {t('joinUs')}
        </Link>
      </nav>

      {/* Language Selector and Theme Toggler */}
      <div className="flex items-center space-x-6">
        <LanguageSelector />
        <Toggler />
      </div>
    </header>
  );
}
