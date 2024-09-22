"use client";

import React, { useEffect, useState } from "react";
import { FaStar, FaPlay, FaFilm, FaSearch, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { generateSlug } from "@/app/lib/generateSlug";
import { useParams } from 'next/navigation';
import Image from "next/image";

// Define types
interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  vote_average: number;
  poster_path: string;
  release_date?: string;
  overview?: string;
  backdrop_path?: string;
}

interface VideoResult {
  type: string;
  site: string;
  key: string;
}

const HeroPc: React.FC = () => {
  const [trending, setTrending] = useState<SearchResult | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const t = useTranslations('HeroPc');
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.TMDB_API_KEY}`
        );
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setTrending(data.results[randomIndex]);
      } catch (error) {
        console.error("Failed to fetch trending data:", error);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
          );
          const data = await response.json();
          const filteredResults = data.results.filter(
            (result: SearchResult) =>
              (result.media_type === "movie" || result.media_type === "tv") &&
              result.vote_average > 0 &&
              result.poster_path
          );
          setSearchResults(filteredResults);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
        }
      };
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (!trending) {
    return <div>{t('loading')}</div>;
  }

  const backgroundImage = `https://image.tmdb.org/t/p/original${trending.backdrop_path}`;
  const title = trending.title || trending.name || t('untitled');
  const description = trending.overview
    ? trending.overview.length > 200
      ? `${trending.overview.substring(0, 200)}...`
      : trending.overview
    : t('noDescription');

  const slug = generateSlug(title, trending.id);

  const openTrailer = async () => {
    try {
      const mediaTypeEndpoint = trending.media_type === "movie" ? "movie" : "tv";
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaTypeEndpoint}/${trending.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await response.json();
      const trailer = data.results.find(
        (video: VideoResult) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        setIsModalOpen(true);
      } else {
        console.error("No trailer found");
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className={`relative h-[90vh] bg-cover bg-center transition-all duration-300 ease-in-out ${searchActive ? "blur-sm" : ""}`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-red-900 bg-opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left p-8 lg:p-16">
          {!searchActive && (
            <>
              <div className="flex items-center text-white text-2xl lg:text-4xl font-bold mb-4 animate-slideInRight">
                {title} <FaStar className="ml-4 text-yellow-400" />{" "}
                {trending.vote_average.toFixed(1)}
              </div>
              <p className="text-white text-base lg:text-lg mb-6 max-w-2xl animate-slideInUp">
                {description}
              </p>
              <div className="flex space-x-4 animate-slideInUp">
                <Link href={`/${locale}/watch/${trending.media_type}/${slug}`} passHref>
                  <button className="px-8 py-3 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center transition-transform transform hover:scale-105 shadow-lg">
                    <FaPlay className="mr-2" /> {t('watch')}
                  </button>
                </Link>
                <button
                  className="px-8 py-3 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center transition-transform transform hover:scale-105 shadow-lg"
                  onClick={openTrailer}
                >
                  <FaFilm className="mr-2" /> {t('trailer')}
                </button>
                <button
                  className="px-8 py-3 backdrop-blur-md bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center transition-transform transform hover:scale-105 shadow-lg"
                  onClick={() => setSearchActive(true)}
                >
                  <FaSearch className="mr-2" /> {t('search')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {searchActive && (
        <div className="fixed inset-0 flex justify-center items-start mt-24 z-50">
          <div className="absolute top-4 right-4">
            <button
              className="text-white text-3xl"
              onClick={() => setSearchActive(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="relative w-4/5 lg:w-2/3 animate-popUp">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full px-6 py-5 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 text-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="mt-4 p-4 bg-gray-900 bg-opacity-90 rounded-lg max-h-[60vh] overflow-y-auto custom-scrollbar border-2 border-transparent focus-within:border-red-500 transition duration-300">
                {searchResults.map((result: SearchResult, index: number) => {
                  const resultTitle = result.title || result.name || t('untitled');
                  const resultSlug = generateSlug(resultTitle, result.id);
                  const watchUrl = `/${locale}/watch/${result.media_type}/${resultSlug}`;

                  return (
                    <Link key={result.id} href={watchUrl} passHref>
                      <div
                        className={`flex items-center justify-between p-2 mb-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-transform duration-300 ease-in-out cursor-pointer ${index % 2 === 0 ? "animate-moveUp" : "animate-moveDown"}`}
                      >
                        <div className="flex items-center">
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                            alt={resultTitle}
                            width={48}
                            height={72}
                            className="rounded-lg mr-4"
                          />
                          <div>
                            <span className="text-white text-sm lg:text-base block">
                              {resultTitle}
                            </span>
                            <span className="text-gray-400 text-xs lg:text-sm block">
                              {result.media_type === "movie" ? t('movie') : t('tvShow')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && trailerUrl && (
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
                src={trailerUrl}
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroPc;
