"use client";

import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { generateSlug } from "@/app/lib/generateSlug"; // Helper function for better slugs
import Image from "next/image"; // Next.js Image component

// Define the types for movie/TV show items
interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  poster_path: string;
}

const LatestGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [itemsToShow, setItemsToShow] = useState(40);
  const [fadeKey, setFadeKey] = useState(0);
  const t = useTranslations("LatestGrid"); // Translations

  // Responsive item count based on screen size
  useEffect(() => {
    const calculateItemsToShow = () => {
      const screenWidth = window.innerWidth;
      setItemsToShow(screenWidth >= 1024 ? 40 : 21);
    };

    calculateItemsToShow();
    window.addEventListener("resize", calculateItemsToShow);

    return () => {
      window.removeEventListener("resize", calculateItemsToShow);
    };
  }, []);

  // Fetch trending movies/TV shows
  useEffect(() => {
    const fetchItems = async () => {
      const type = activeTab === "movie" ? "movie" : "tv";
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/${type}/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();

        let allItems = [...data.results];
        if (allItems.length < itemsToShow) {
          const nextPageResponse = await fetch(
            `https://api.themoviedb.org/3/trending/${type}/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=2`
          );
          const nextPageData = await nextPageResponse.json();
          allItems = [...allItems, ...nextPageData.results];
        }

        setItems(allItems.slice(0, itemsToShow));
      } catch (error) {
        console.error(`Failed to fetch trending ${type} data:`, error);
      }
    };

    fetchItems();
    setFadeKey((prevKey) => prevKey + 1);
  }, [activeTab, itemsToShow]);

  return (
    <div className="relative mt-12">
      {/* Header with Tab Switch */}
      <div className="flex justify-start items-center mb-6 pl-4">
        <h2 className="text-black dark:text-white text-2xl mr-4 font-orbitron">
          {t("latest")} {/* Translated title */}
        </h2>
        <div
          className="relative inline-block w-36 h-10 bg-gray-200 dark:bg-gray-800 rounded-full cursor-pointer"
          onClick={() => setActiveTab(activeTab === "movie" ? "tv" : "movie")}
        >
          <div
            className={`absolute top-0.5 bottom-0.5 left-0.5 w-[50%] h-9 rounded-full bg-red-600 transition-transform duration-500 ease-in-out ${
              activeTab === "tv" ? "translate-x-full" : ""
            }`}
          ></div>
          <div className="absolute inset-0 flex justify-between items-center px-4">
            <span
              className={`text-sm font-orbitron ${
                activeTab === "movie" ? "text-white" : "text-gray-600"
              }`}
            >
              {t("movie")} {/* Translated Movie */}
            </span>
            <span
              className={`text-sm font-orbitron ${
                activeTab === "tv" ? "text-white" : "text-gray-600"
              }`}
            >
              {t("tvShow")} {/* Translated TV */}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of items */}
      <div
        key={fadeKey}
        className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 px-4 animate-fadeIn"
      >
        {items.map((item) => {
          const slug = generateSlug(item.name || item.title || '', item.id); // Ensure a string is passed
          const url =
            activeTab === "movie"
              ? `/watch/movie/${slug}`
              : `/watch/tv/${slug}`;

          return (
            <Link key={item.id} href={url} passHref>
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.name || item.title || "Media Item"}
                  width={500}
                  height={750}
                  unoptimized
                  className="rounded-lg"
                  placeholder="blur"
                  blurDataURL={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                />
                <div className="absolute top-2 right-2 bg-black dark:bg-white bg-opacity-70 dark:bg-opacity-70 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
                  <FaStar className="mr-1" />
                  {item.vote_average.toFixed(1)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Spacer for Mobile Navbar */}
      <div className="md:hidden h-24"></div>
      {/* Spacer for PC */}
      <div className="hidden md:block h-12"></div>
    </div>
  );
};

export default LatestGrid;
