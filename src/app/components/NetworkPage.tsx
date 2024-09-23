"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface NetworkPageProps {
  locale: string;
  networkData: any;
}

const NetworkPage: React.FC<NetworkPageProps> = ({ locale, networkData }) => {
  const t = useTranslations('NetworkPage');
  const [currentPage, setCurrentPage] = useState(1);
  const [shows, setShows] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(networkData.total_pages || 1);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchShows = async () => {
      let allShows: any[] = [];
      let fetchedPage = currentPage;

      // Fetch the first page to get total pages
      const firstPageRes = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_networks=${networkData.id}&page=${fetchedPage}`
      );
      const firstPageData = await firstPageRes.json();
      
      allShows = [...firstPageData.results];
      setTotalPages(firstPageData.total_pages);  // Set total pages from the first page

      // Fetch additional pages if fewer than 24 items
      while (allShows.length < itemsPerPage && fetchedPage < firstPageData.total_pages) {
        fetchedPage += 1;
        const nextPageRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_networks=${networkData.id}&page=${fetchedPage}`
        );
        const nextPageData = await nextPageRes.json();
        allShows = [...allShows, ...nextPageData.results];
      }

      setShows(allShows.slice(0, itemsPerPage)); // Show only up to itemsPerPage
    };

    fetchShows();
  }, [currentPage, networkData.id]);

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-medium transition-all duration-300 ease-in-out
                      ${i === currentPage
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-black dark:bg-gray-800 dark:text-white'
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
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black dark:text-white">
      {/* Network Logo */}
      <div className="flex justify-center mb-6">
        {networkData.logo_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${networkData.logo_path}`}
            alt={networkData.name}
            width={200}
            height={100}
            className="rounded-lg"
          />
        ) : (
          <div className="w-48 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span>{t('noLogo')}</span>
          </div>
        )}
      </div>

      {/* Network Name */}
      <h1 className="text-3xl font-bold text-center mb-4">{networkData.name}</h1>

      {/* Shows List */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4">
        {shows.length > 0 ? (
          shows.map((show: any) => (
            <Link
              href={`/${locale}/watch/tv/${show.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')}-${show.id}`}
              key={show.id}
            >
              <div className="relative cursor-pointer">
                <div
                  className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${show.poster_path})`,
                    paddingBottom: "150%", // Keeps aspect ratio
                  }}
                />
              </div>
            </Link>
          ))
        ) : (
          <p>{t('noShows')}</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <div className="mt-6">{renderPagination()}</div>}
    </div>
  );
};

export default NetworkPage;
