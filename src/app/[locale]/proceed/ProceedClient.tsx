'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl'; // To fetch the locale

interface ProceedClientProps {
  id: string;
  type: 'movie' | 'tv';
  releaseYear: string;
  proceedToDownload: string;
  pleaseWait: string;
  seconds: string;
  reportViaEmail: string;
  reportViaTelegram: string;
}

const ProceedClient: React.FC<ProceedClientProps> = ({
  id,
  type,
  releaseYear,
  proceedToDownload,
  pleaseWait,
  seconds,
  reportViaEmail,
  reportViaTelegram,
}) => {
  const [countdown, setCountdown] = useState(9); // 9-second countdown
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const router = useRouter();
  const locale = useLocale(); // Use useLocale inside the component body

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(interval);
          setIsButtonEnabled(true); // Enable the button after countdown
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleContinue = () => {
    if (isButtonEnabled) {
      const downloadPage = type === 'movie' ? 'download-movie' : 'download-tv';
      router.push(`/${locale}/${downloadPage}?id=${id}&type=${type}&year=${releaseYear}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={handleContinue}
        disabled={!isButtonEnabled}
        className={`px-6 py-2 rounded ${
          isButtonEnabled
            ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
        }`}
      >
        {isButtonEnabled
          ? proceedToDownload
          : `${pleaseWait} ${countdown} ${seconds}`}
      </button>

      <div className="mt-4 space-x-4">
        <button
          onClick={() =>
            window.location.href = `mailto:example@gmail.com?subject=Fix ${id}&body=Please fix the download link.`
          }
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          {reportViaEmail}
        </button>
        <button
          onClick={() => window.open('https://t.me/example', '_blank')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {reportViaTelegram}
        </button>
      </div>
    </div>
  );
};

export default ProceedClient;
