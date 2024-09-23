"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

type WatchHeroTvProps = {
  tvShow: {
    backdrop_path?: string;
    name?: string;
    first_air_date?: string;
    vote_average?: number;
    genres?: { id: number; name: string }[];
    overview?: string;
  };
};

const WatchHeroTv: React.FC<WatchHeroTvProps> = ({ tvShow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const t = useTranslations('WatchHero'); // For dynamic translations
  const genreTranslations = useTranslations('Genres'); // For translating genres

  const backgroundImage = tvShow.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
    : "/default-backdrop.jpg";

  const title = tvShow.name || t('untitled');
  const releaseYear = tvShow.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : t('notAvailable');
  const voteAverage = tvShow.vote_average ? tvShow.vote_average.toFixed(1) : t('notAvailable');

  // Function to handle genre translation
  const translateGenre = (genreName: string) => {
    const formattedKey = genreName.toLowerCase().replace(/\s/g, ''); // Convert to lowercase, remove spaces
    return genreTranslations(formattedKey) || genreName; // Translate or fallback to the original name
  };

  // Translate genres
  const genres = tvShow.genres?.length
    ? tvShow.genres.map((genre) => translateGenre(genre.name)).join(", ")
    : t('notAvailable');

  const overview = tvShow.overview || t('noSynopsis');

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    const descriptionEl = descriptionRef.current;
    if (descriptionEl) {
      const lineHeight = parseFloat(window.getComputedStyle(descriptionEl).lineHeight);
      const maxHeight = 1 * lineHeight;
      if (descriptionEl.scrollHeight > maxHeight) {
        setShowReadMore(true);
      }
    }
  }, []);

  return (
    <div
      className="relative h-[60vh] md:h-[70vh] w-screen flex flex-col justify-end text-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Bottom fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-black"></div>

      <div className="relative z-10 text-black dark:text-white mb-12 px-4 animate-fadeInUp">
        {/* TV Show Title */}
        <h1 className="text-3xl lg:text-5xl font-bold mb-4 animate-slideInUp">
          {title} {releaseYear !== t('notAvailable') && `(${releaseYear})`}
        </h1>

        {/* Rating, Release Date, and Genres */}
        <div className="flex justify-center items-center space-x-4 mb-2 animate-fadeIn">
          <div className="flex items-center">
            <FaStar className="h-5 w-5 text-black dark:text-yellow-400 mr-1" />
            <span>{voteAverage}</span>
          </div>
          <span>•</span>
          <span>{releaseYear}</span>
        </div>

        {/* Genres */}
        <p className="text-sm lg:text-lg animate-slideInUp">
          {t('genres')}: {genres}
        </p>

        {/* TV Show Description */}
        <div className="mt-4 text-sm lg:text-lg animate-slideInUp">
          <motion.p
            ref={descriptionRef}
            className={`${isExpanded ? "max-h-full" : "line-clamp-2"} transition-all duration-500 ease-in-out`}
          >
            {overview}
          </motion.p>

          {showReadMore && (
            <button
              onClick={toggleExpanded}
              className="text-red-500 mt-2 underline hover:text-red-700 transition-colors duration-300"
            >
              {isExpanded ? t('showLess') : t('readMore')}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 1s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WatchHeroTv;
