"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

type WatchHeroProps = {
  movie: {
    backdrop_path?: string;
    title?: string;
    release_date?: string;
    vote_average?: number;
    genres?: { id: number; name: string }[];
    overview?: string;
  };
};

// Mapping function to match genre names with translation keys
const getGenreTranslationKey = (genreName: string) => {
  const genreKeyMap: { [key: string]: string } = {
    "Science Fiction": "scienceFiction",
    "TV Movie": "tvMovie",
    "Sci-Fi & Fantasy": "sciFiFantasy", // Handle custom mapping
    // Add more mappings as needed
  };

  // Check the manual map first
  const key = genreKeyMap[genreName] || genreName.toLowerCase().replace(/[\s&-]/g, ''); // Remove spaces, hyphens, and special characters
  return key;
};

const WatchHero: React.FC<WatchHeroProps> = ({ movie }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const t = useTranslations('WatchHero');
  const genreTranslations = useTranslations('Genres'); // For genres translation

  const backgroundImage = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/default-backdrop.jpg";

  const title = movie.title || t('untitled');
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : t('notAvailable');
  const voteAverage = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : t('notAvailable');

  // Updated genre translation logic
  const genres = movie.genres?.length
    ? movie.genres
        .map((genre) => {
          const translationKey = getGenreTranslationKey(genre.name);
          const translatedGenre = genreTranslations(translationKey);
          return translatedGenre !== translationKey
            ? translatedGenre
            : genre.name; // Fallback to original name if translation not found
        })
        .join(', ')
    : t('notAvailable');

  const overview = movie.overview || t('noSynopsis');

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
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

      <div className="relative z-10 text-white mb-12 px-4 animate-fadeInUp">
        {/* Movie Title */}
        <h1 className="text-3xl lg:text-5xl font-bold mb-4 animate-slideInUp">
          {title} {releaseYear !== t('notAvailable') && `(${releaseYear})`}
        </h1>

        {/* Rating, Release Date, and Genres */}
        <div className="flex justify-center items-center space-x-4 mb-2 animate-fadeIn">
          <div className="flex items-center">
            <FaStar className="h-5 w-5 text-yellow-400 mr-1" />
            <span>{voteAverage}</span>
          </div>
          <span>•</span>
          <span>{releaseYear}</span>
        </div>

        {/* Genres */}
        <p className="text-sm lg:text-lg animate-slideInUp">
          {t('genres')}: {genres}
        </p>

        {/* Movie Description */}
        <div className="mt-4 text-sm lg:text-lg animate-slideInUp">
          <motion.p
            ref={descriptionRef}
            className={`${
              isExpanded ? "max-h-full" : "max-h-[1.5em] overflow-hidden"
            } transition-all duration-500 ease-in-out`}
            style={{ lineClamp: !isExpanded ? 1 : "unset" }}
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
    </div>
  );
};

export default WatchHero;
