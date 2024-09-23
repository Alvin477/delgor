"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
}

interface Genre {
  id: number;
  name: string;
}

interface TVSeriesComponentProps {
  genres: Genre[];
  tvShows: TVShow[];
  totalPages: number;
  locale: string;
}

const TVSeriesComponent: React.FC<TVSeriesComponentProps> = ({ genres, tvShows, totalPages, locale }) => {
  const t = useTranslations("TVPage");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [shows, setShows] = useState(tvShows);
  const [totalPagesState, setTotalPagesState] = useState(totalPages);
  const [isFiltering, setIsFiltering] = useState(false);

  const router = useRouter();

  const years = Array.from({ length: new Date().getFullYear() - 1998 }, (_, i) => `${new Date().getFullYear() - i}`);

  useEffect(() => {
    const fetchFilteredShows = async () => {
      setIsFiltering(true);
      let url = `/api/tv-series?locale=${locale}&page=${currentPage}`;

      if (selectedGenre) {
        url += `&genre=${selectedGenre}`;
      }

      if (selectedYear) {
        url += `&year=${selectedYear}`;
      }

      // Fetching the first page
      const res = await fetch(url);
      const data = await res.json();

      // If we need more items to reach 24 for PC or 21 for Mobile, fetch the next page
      if (data.results.length < 24) {
        const nextPageUrl = `/api/tv-series?locale=${locale}&page=${currentPage + 1}&genre=${selectedGenre || ""}&year=${selectedYear || ""}`;
        const nextRes = await fetch(nextPageUrl);
        const nextData = await nextRes.json();

        // Combine results from the first and next pages
        const combinedResults = [...data.results, ...nextData.results];
        setShows(combinedResults.slice(0, 24)); // Limit to 24 items for PC
      } else {
        setShows(data.results.slice(0, 24)); // Limit to 24 items directly
      }

      setTotalPagesState(data.total_pages);
      setIsFiltering(false);
    };

    fetchFilteredShows();
  }, [selectedGenre, selectedYear, currentPage, locale]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(Number(e.target.value) || null);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value || null);
    setCurrentPage(1); // Reset to first page on filter change
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

  const sortedShows = [...shows].sort((a, b) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime());

  return (
    <div className="relative mt-4 md:mt-0 mb-16 md:mb-8"> {/* Reduced top margin for mobile */}
      <div className="flex flex-row justify-between items-center mb-4 md:mb-8 px-4 md:px-8 mt-4 md:mt-8">
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
          {sortedShows.slice(0, 24).map((tvShow) => { // Limit to 24 items on PC
            const slug = `${tvShow.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${tvShow.id}`;
            const url = `/en/watch/tv/${slug}`;

            return (
              <motion.div
                key={tvShow.id}
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
                      backgroundImage: `url(https://image.tmdb.org/t/p/w500${tvShow.poster_path})`,
                      paddingBottom: "150%",
                    }}
                  >
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
                      <FaStar className="mr-1" />
                      {tvShow.vote_average.toFixed(1)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 md:mt-8 pb-4 md:pb-8"> {/* Reduced bottom padding on mobile */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default TVSeriesComponent;
