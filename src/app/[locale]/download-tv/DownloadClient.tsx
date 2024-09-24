'use client';

import { FaDownload, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';

interface DownloadClientProps {
  tvData: {
    title: string;
    seasons: Array<{
      seasonLabel: string;  // Updated to use seasonLabel
      episodes: Array<{ label: string; url: string }>;
    }>;
  };
  reportViaEmail: string;
  reportViaTelegram: string;
}

const DownloadClient: React.FC<DownloadClientProps> = ({ tvData, reportViaEmail, reportViaTelegram }) => {
  const handleReportEmail = () => {
    window.location.href = `mailto:support@example.com?subject=Fix ${tvData.title}&body=Please fix the download link.`;
  };

  const handleReportTelegram = () => {
    window.open('https://t.me/delgomoviesdiscussion', '_blank');
  };

  return (
    <>
      {/* Display download links by season and episode */}
      {tvData.seasons.map((season, seasonIndex) => (
        <div key={seasonIndex} className="mb-8">
          <h2 className="text-2xl text-black dark:text-white mb-4">{season.seasonLabel}</h2> {/* Updated to use seasonLabel */}
          <ul className="space-y-4 mb-8">
            {season.episodes.map((episode, episodeIndex) => (
              <li key={episodeIndex}>
                <a
                  href={episode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaDownload className="mr-2" /> {episode.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

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
