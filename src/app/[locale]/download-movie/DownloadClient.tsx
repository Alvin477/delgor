'use client';

import { FaDownload, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';

interface DownloadClientProps {
  movieData: {
    title: string;
    downloads: Array<{ label: string; url: string }>;
  };
  reportViaEmail: string;
  reportViaTelegram: string;
}

const DownloadClient: React.FC<DownloadClientProps> = ({ movieData, reportViaEmail, reportViaTelegram }) => {
  const handleReportEmail = () => {
    window.location.href = `mailto:support@example.com?subject=Fix ${movieData.title}&body=Please fix the download link.`;
  };

  const handleReportTelegram = () => {
    window.open('https://t.me/delgomoviesdiscussion', '_blank');
  };

  return (
    <>
      {/* Download links */}
      <ul className="space-y-4 mb-24">
        {movieData.downloads.map((download, index) => (
          <li key={index}>
            <a
              href={download.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaDownload className="mr-2" /> {download.label}
            </a>
          </li>
        ))}
        <div className="h-24"></div> {/* Spacer */}
      </ul>

      {/* Report buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleReportEmail}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          <FaEnvelope className="mr-2" /> {reportViaEmail || 'Report Broken Link via Email'}
        </button>
        <button
          onClick={handleReportTelegram}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaTelegramPlane className="mr-2" /> {reportViaTelegram || 'Report via Telegram'}
        </button>
      </div>
    </>
  );
};

export default DownloadClient;
