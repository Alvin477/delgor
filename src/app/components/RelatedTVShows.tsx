"use client";

import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { generateSlug } from "@/app/lib/generateSlug";
import { useTranslations } from "next-intl";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
}

interface RelatedTVShowsProps {
  tvShowId: number;
}

const RelatedTVShows: React.FC<RelatedTVShowsProps> = ({ tvShowId }) => {
  const [relatedTVShows, setRelatedTVShows] = useState<TVShow[]>([]);
  const [latestTVShows, setLatestTVShows] = useState<TVShow[]>([]);
  const [itemsToShow, setItemsToShow] = useState(40);
  const [fadeKey, setFadeKey] = useState(0);

  const t = useTranslations('Related'); // Use translation for "You May Also Like"

  useEffect(() => {
    const calculateItemsToShow = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        setItemsToShow(40);
      } else {
        setItemsToShow(21);
      }
    };

    calculateItemsToShow();
    window.addEventListener("resize", calculateItemsToShow);

    return () => {
      window.removeEventListener("resize", calculateItemsToShow);
    };
  }, []);

  useEffect(() => {
    const fetchRelatedTVShows = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShowId}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();

        setRelatedTVShows(data.results.slice(0, itemsToShow));
      } catch (error) {
        console.error("Failed to fetch related TV shows:", error);
      }
    };

    const fetchLatestTVShows = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();

        setLatestTVShows(data.results.slice(0, itemsToShow));
      } catch (error) {
        console.error("Failed to fetch latest TV shows:", error);
      }
    };

    fetchRelatedTVShows();
    fetchLatestTVShows();
    setFadeKey((prevKey) => prevKey + 1);
  }, [tvShowId, itemsToShow]);

  const allTVShows = [...relatedTVShows, ...latestTVShows].slice(0, itemsToShow);

  return (
    <div className="relative mt-12">
      <h2 className="text-black dark:text-white text-2xl font-orbitron mb-6 pl-4">
        {t('youMayAlsoLike')} {/* Translated text */}
      </h2>
      <div
        key={fadeKey}
        className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 px-2 md:px-4 animate-fadeIn mb-20 md:mb-8"
      >
        {allTVShows.map((tvShow) => (
          <Link
            href={`/en/watch/tv/${generateSlug(tvShow.name, tvShow.id)}`}
            key={tvShow.id}
            passHref
          >
            <div
              className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300 ease-in-out cursor-pointer"
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
        ))}
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RelatedTVShows;
