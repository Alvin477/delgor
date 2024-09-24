"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // to check current active link
import { FaHome, FaSearch, FaFilm, FaList, FaEllipsisH } from "react-icons/fa"; // Import icons from react-icons

export default function BottomNavbar({ locale }: { locale: string }) {
  const pathname = usePathname(); // Get the current path to mark active link

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-gray-800 text-white shadow-lg z-50">
      <div className="flex justify-between items-center px-4 py-2">
        <Link href={`/${locale}/movies`}>
          <div className={`flex flex-col items-center ${pathname === `/${locale}/movies` ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-all duration-300`}>
            <FaFilm className="h-6 w-6" />
            <span className="sr-only">Movies</span>
          </div>
        </Link>

        <Link href={`/${locale}/tvshows`}>
          <div className={`flex flex-col items-center ${pathname === `/${locale}/tvshows` ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-all duration-300`}>
            <FaList className="h-6 w-6" />
            <span className="sr-only">TV Shows</span>
          </div>
        </Link>

        <Link href={`/${locale}`}>
          <div className={`flex flex-col items-center ${pathname === `/${locale}` ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-all duration-300`}>
            <FaHome className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </div>
        </Link>

        <Link href={`/${locale}/search`}>
          <div className={`flex flex-col items-center ${pathname === `/${locale}/search` ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-all duration-300`}>
            <FaSearch className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </div>
        </Link>

        <Link href={`/${locale}/more`}>
          <div className={`flex flex-col items-center ${pathname === `/${locale}/more` ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-all duration-300`}>
            <FaEllipsisH className="h-6 w-6" />
            <span className="sr-only">More</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
