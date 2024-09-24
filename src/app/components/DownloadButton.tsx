import React from 'react';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';
import { useTranslations } from 'next-intl'; // Import translations

interface DownloadButtonProps {
  id: string;
  type: 'movie' | 'tv';
  releaseYear: number | string;  // Accept number or "unknown"
  locale: string;  // Include locale as a prop
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ id, type, releaseYear, locale }) => {
  const t = useTranslations('DownloadButton'); // Translation hook

  return (
    <Link href={`/${locale}/processing?id=${id}&type=${type}&year=${releaseYear !== "unknown" ? releaseYear : "unknown"}`}>
      <button className="bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-lg px-12 flex items-center justify-center space-x-2 text-lg shadow-lg shadow-red-500/50 hover:scale-110 transition-transform duration-300">
        <FaDownload className="h-6 w-6" /> {/* Download icon */}
        <span>{t('download')}</span>
      </button>
    </Link>
  );
};

export default DownloadButton;
