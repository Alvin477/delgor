// src/app/components/MoviesComponent.tsx

"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MoviesComponentProps {
  genres: Genre[];
  initialMovies: Movie[];
  totalPages: number;
  locale: string;
}

const MoviesComponent: React.FC<MoviesComponentProps> = ({ genres, initialMovies, totalPages, locale }) => {
  const t = useTranslations("MoviesPage");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [totalPagesState, setTotalPagesState] = useState(totalPages);
  const [isFiltering, setIsFiltering] = useState(false);

  const router = useRouter();

  const years = Array.from({ length: new Date().getFullYear() - 1998 }, (_, i) => `${new Date().getFullYear() - i}`);

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      setIsFiltering(true);
      let url = `/api/movies?locale=${locale}&page=${currentPage}`;

      if (selectedGenre) {
        url += `&genre=${selectedGenre}`;
      }

      if (selectedYear) {
        url += `&year=${selectedYear}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.results.length < 24) {
        const nextPageUrl = `/api/movies?locale=${locale}&page=${currentPage + 1}&genre=${selectedGenre || ""}&year=${selectedYear || ""}`;
        const nextRes = await fetch(nextPageUrl);
        const nextData = await nextRes.json();

        const combinedResults = [...data.results, ...nextData.results];
        setMovies(combinedResults.slice(0, 24));
      } else {
        setMovies(data.results.slice(0, 24));
      }

      setTotalPagesState(data.total_pages);
      setIsFiltering(false);
    };

    fetchFilteredMovies();
  }, [selectedGenre, selectedYear, currentPage, locale]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(Number(e.target.value) || null);
    setCurrentPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value || null);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPagesState, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-medium transition-all duration-300 ease-in-out
                      ${i === currentPage
                        ? "bg-red-600 text-white"
                        : "bg-white text-black dark:bg-gray-800 dark:text-white"
                      } 
                      border border-red-600 hover:bg-red-100 dark:hover:bg-red-900
                      focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="mx-1 w-10 h-10 rounded-full flex items-center justify-center
                     bg-white text-black dark:bg-gray-800 dark:text-white
                     border border-red-600 hover:bg-red-100 dark:hover:bg-red-900
                     transition-all duration-300 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="mx-1 w-10 h-10 rounded-full flex items-center justify-center
                     bg-white text-black dark:bg-gray-800 dark:text-white
                     border border-red-600 hover:bg-red-100 dark:hover:bg-red-900
                     transition-all duration-300 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          disabled={currentPage === totalPagesState}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  // Sort movies by release_date in descending order to show the latest movies first
  const sortedMovies = [...movies].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());

  return (
    <div className="relative mt-4 md:mt-0 mb-16 md:mb-8">
      <div className="flex flex-row justify-between items-center mb-4 md:mb-8 px-4 md:px-8">
        <div>
          <label className="mr-2 text-black dark:text-white">{t("genre")}:</label>
          <select
            className="p-2 rounded transition-all duration-300 ease-in-out focus:outline-none
                       bg-white dark:bg-black text-black dark:text-white
                       border-2 border-red-600 hover:border-red-700
                       hover:bg-gray-100 dark:hover:bg-gray-800"
            value={selectedGenre || ""}
            onChange={handleGenreChange}
          >
            <option value="">{t("all")}</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 text-black dark:text-white">{t("year")}:</label>
          <select
            className="p-2 rounded transition-all duration-300 ease-in-out focus:outline-none
                       bg-white dark:bg-black text-black dark:text-white
                       border-2 border-red-600 hover:border-red-700
                       hover:bg-gray-100 dark:hover:bg-gray-800"
            value={selectedYear || ""}
            onChange={handleYearChange}
          >
            <option value="">{t("all")}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4 px-2 md:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sortedMovies.map((movie) => {
            const slug = `${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${movie.id}`;
            const url = `/en/watch/movie/${slug}`;

            return (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={url} passHref>
                  <div
                    className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                      paddingBottom: "150%",
                    }}
                  >
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
                      <FaStar className="mr-1" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 md:mt-8 pb-4 md:pb-8">
        {renderPagination()}
      </div>
    </div>
  );
};

export default MoviesComponent;
