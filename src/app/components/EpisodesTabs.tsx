"use client";

import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from 'next-intl';

interface EpisodesTabProps {
  tvShowId: number;
  seasons: number[]; // Expect an array of season numbers
  selectedSeason: number; // Use selectedSeason prop to control season
  onSeasonChange: (season: number) => void; // Handle season change callback
}

const EpisodesTab: React.FC<EpisodesTabProps> = ({ tvShowId, seasons, selectedSeason, onSeasonChange }) => {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const t = useTranslations('EpisodesTab'); // Translations for this component

  // Fetch episodes for the selected season
  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShowId}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
        setEpisodes(data.episodes || []); // Ensure episodes are valid
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    }

    async function fetchBackgroundImage() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
        setBackgroundImage(data.backdrop_path ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` : null);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    }

    fetchEpisodes();
    fetchBackgroundImage();
  }, [selectedSeason, tvShowId]);

  const handleEpisodeClick = (episodeNumber: number) => {
    const embedUrl = `https://www.2embed.cc/embedtv/${tvShowId}&s=${selectedSeason}&e=${episodeNumber}`;
    setSelectedEpisode(embedUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectSeason = (season: number) => {
    onSeasonChange(season); // Call the parent handler to update the season
    setIsDropdownOpen(false); // Close the dropdown
  };

  const episodeVariants = {
    enterRight: { opacity: 0, x: 100 },
    enterLeft: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
    exitRight: { opacity: 0, x: 100 },
    exitLeft: { opacity: 0, x: -100 },
  };

  return (
    <div className="text-black dark:text-white px-4">
      <div className="mb-6 relative w-full md:w-1/2">
        {/* Dropdown button for selecting season */}
        <button
          className="bg-gray-200 dark:bg-gray-800 p-4 w-full rounded-lg shadow-lg flex items-center justify-between hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
          onClick={toggleDropdown}
        >
          <span className="font-bold">{t('season')} {selectedSeason}</span> {/* Translated 'Season' */}
          <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            ▼
          </motion.span>
        </button>

        {isDropdownOpen && (
          <motion.div
            className="absolute mt-2 bg-gray-100 dark:bg-gray-900 w-full rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ul className="max-h-60 overflow-y-auto">
              {seasons.map((season) => (
                <li
                  key={season}
                  className={`p-4 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer ${
                    selectedSeason === season ? "bg-red-600" : "bg-gray-200 dark:bg-gray-800"
                  }`}
                  onClick={() => selectSeason(season)}
                >
                  {t('season')} {season} {/* Translated 'Season' */}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Episodes list */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24 md:mb-6">
        {episodes.length > 0 ? (
          episodes.map((episode, index) => (
            <React.Fragment key={episode.id}>
              <motion.div
                className="flex space-x-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-300 relative"
                variants={episodeVariants}
                initial="enterRight"
                whileInView="visible"
                exit="exitLeft"
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleEpisodeClick(episode.episode_number)}
              >
                <Image
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                      : backgroundImage || "/fallback.jpg"
                  }
                  alt={episode.name}
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                />

                <div className="flex flex-col justify-center">
                  <h3 className="text-base md:text-lg font-bold">{episode.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    {t('episode')} {episode.episode_number} {/* Translated 'Episode' */}
                  </p>
                </div>
                <FaPlay className="absolute right-2 bottom-2 h-8 w-8 text-red-600 opacity-75" />
              </motion.div>
            </React.Fragment>
          ))
        ) : (
          <motion.div key="noEpisodes" className="text-center">{t('noEpisodes')}</motion.div>
        )}
      </motion.div>

      {/* Modal for episode playback */}
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
              ✕
            </button>

            <iframe
              className="w-full h-[30vh] md:h-[60vh] rounded-lg"
              src={selectedEpisode || ""}
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EpisodesTab;
