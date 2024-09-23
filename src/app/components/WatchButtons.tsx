"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaShareAlt, FaTimes, FaCheck } from 'react-icons/fa';
import { useTranslations } from 'next-intl'; // Import translations
import DownloadButton from './DownloadButton'; // Import the DownloadButton component

interface WatchButtonsProps {
  movieId: number;
  trailerUrl: string | null;
  title: string;
}

export default function WatchButtons({
  movieId,
  trailerUrl: initialTrailerUrl,
  title,
}: WatchButtonsProps) {
  const t = useTranslations('WatchButtons'); // Translation hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(initialTrailerUrl);
  const [isInList, setIsInList] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [releaseYear, setReleaseYear] = useState<string | number>("unknown");

  const fetchReleaseYear = async (movieId: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.release_date ? new Date(data.release_date).getFullYear() : "unknown";
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      return "unknown";
    }
  };

  useEffect(() => {
    const fetchYear = async () => {
      const year = await fetchReleaseYear(movieId);
      setReleaseYear(year);
    };

    fetchYear();
  }, [movieId]);

  const videoEmbedUrl = `https://www.2embed.cc/embed/${movieId}`;

  useEffect(() => {
    if (!trailerUrl) {
      const fetchTrailer = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          );
          const data = await response.json();
          const trailer = data.results.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
          }
        } catch (error) {
          console.error('Failed to fetch trailer:', error);
        }
      };
      fetchTrailer();
    }
  }, [movieId, trailerUrl]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('myList') || '[]');
    setIsInList(storedList.some((item: { id: number, media_type: string }) => item.id === movieId && item.media_type === 'movie'));
  }, [movieId]);

  const openModal = (url: string) => {
    setModalContent(url);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeShareModal = () => setShareModalOpen(false);

  const handleAddOrRemoveFromList = () => {
    const storedList = JSON.parse(localStorage.getItem('myList') || '[]');
    const itemExists = storedList.some((item: { id: number, media_type: string }) => item.id === movieId && item.media_type === 'movie');

    if (itemExists) {
      const updatedList = storedList.filter((item: { id: number, media_type: string }) => !(item.id === movieId && item.media_type === 'movie'));
      localStorage.setItem('myList', JSON.stringify(updatedList));
      setIsInList(false);
      setNotification(`${title} ${t('removedFromList')}`);
    } else {
      storedList.push({ id: movieId, media_type: 'movie' });
      localStorage.setItem('myList', JSON.stringify(storedList));
      setIsInList(true);
      setNotification(`${title} ${t('addedToList')}`);
    }

    setTimeout(() => setNotification(null), 2000);
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setNotification(t('linkCopied'));
    setShareModalOpen(false);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <>
      <div className="relative z-10 text-white mb-4 px-4">
        {/* Buttons for Mobile */}
        <div className="flex flex-col space-y-4 md:hidden mt-[-50px]">
          <motion.button
            className="bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg w-[85%] mx-auto flex items-center justify-center space-x-2 text-base shadow-lg shadow-red-500/50 hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
            onClick={() => openModal(videoEmbedUrl)}
          >
            <FaPlay className="h-6 w-6" />
            <span>{t('play')}</span>
          </motion.button>

          <div className="flex justify-center space-x-4">
            {trailerUrl && (
              <motion.button
                className="flex items-center justify-center space-x-1 bg-gray-800 bg-opacity-70 px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 text-sm"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                onClick={() => openModal(trailerUrl)}
              >
                <FaPlay className="h-5 w-5 text-red-600" />
                <span>{t('trailer')}</span>
              </motion.button>
            )}

            <motion.button
              className="flex items-center justify-center space-x-1 bg-gray-800 bg-opacity-70 px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 text-sm whitespace-nowrap"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1, ease: 'easeOut' }}
              onClick={handleAddOrRemoveFromList}
            >
              {isInList ? (
                <>
                  <FaCheck className="h-5 w-5 text-green-600" />
                  <span>{t('added')}</span>
                </>
              ) : (
                <>
                  <FaPlus className="h-5 w-5 text-white" />
                  <span>{t('addList')}</span>
                </>
              )}
            </motion.button>

            <motion.button
              className="flex items-center justify-center space-x-1 bg-gray-800 bg-opacity-70 px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 text-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 1, ease: 'easeOut' }}
              onClick={handleShare}
            >
              <FaShareAlt className="h-5 w-5 text-white" />
              <span>{t('share')}</span>
            </motion.button>
          </div>

          {/* Download Button for Mobile */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
          >
            {/* Pass releaseYear to DownloadButton */}
            <DownloadButton id={movieId.toString()} type="movie" releaseYear={releaseYear} />
          </motion.div>
        </div>

        {/* Buttons for PC */}
        <div className="hidden md:flex justify-center space-x-4 mt-[-20px]">
          <motion.button
            className="bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-lg px-12 flex items-center justify-center space-x-2 text-lg shadow-lg shadow-red-500/50 hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: 'easeOut' }}
            onClick={() => openModal(videoEmbedUrl)}
          >
            <FaPlay className="h-8 w-8" />
            <span>{t('play')}</span>
          </motion.button>

          {trailerUrl && (
            <motion.button
              className="flex items-center justify-center space-x-2 bg-gray-800 bg-opacity-70 px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300 text-base hover:scale-110 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
              onClick={() => openModal(trailerUrl)}
            >
              <FaPlay className="h-6 w-6 text-red-600" />
              <span>{t('trailer')}</span>
            </motion.button>
          )}

          <motion.button
            className="flex items-center justify-center space-x-2 bg-gray-800 bg-opacity-70 px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300 text-base hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1, ease: 'easeOut' }}
            onClick={handleAddOrRemoveFromList}
          >
            {isInList ? (
              <>
                <FaCheck className="h-6 w-6 text-green-600" />
                <span>{t('added')}</span>
              </>
            ) : (
              <>
                <FaPlus className="h-6 w-6 text-white" />
                <span>{t('addList')}</span>
              </>
            )}
          </motion.button>

          <motion.button
            className="flex items-center justify-center space-x-2 bg-gray-800 bg-opacity-70 px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300 text-base hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1, ease: 'easeOut' }}
            onClick={handleShare}
          >
            <FaShareAlt className="h-6 w-6 text-white" />
            <span>{t('share')}</span>
          </motion.button>

          {/* Download Button for PC */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
          >
            {/* Pass releaseYear to DownloadButton */}
            <DownloadButton id={movieId.toString()} type="movie" releaseYear={releaseYear} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl w-full max-w-4xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-white text-xl focus:outline-none"
              >
                <FaTimes className="h-8 w-8" />
              </button>

              <iframe
                className="w-full h-[30vh] md:h-[60vh] rounded-lg"
                src={modalContent || trailerUrl || ""} // Provide a fallback empty string
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-xl w-full max-w-xs md:max-w-lg mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-6xl">😊</span>
              </div>

              <h3 className="text-2xl font-bold text-center text-white mb-4">
                {t('sharingMessage')}
              </h3>
              <p className="text-center text-gray-300 mb-6">
                {t('shareWithFriend', { title })}
              </p>

              <button
                className="bg-red-600 text-white py-3 px-6 rounded-lg w-full font-bold shadow hover:bg-red-700 focus:outline-none transition-all duration-300"
                onClick={copyToClipboard}
              >
                {t('copyLink')}
              </button>

              <button
                onClick={closeShareModal}
                className="absolute top-3 right-3 text-white text-xl focus:outline-none"
              >
                <FaTimes className="h-8 w-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 text-white py-2 px-4 rounded-lg shadow-lg z-50 ${
              notification.includes('Link copied') ? 'bg-red-600' : 'bg-green-600'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
