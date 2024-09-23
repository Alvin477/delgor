"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FaStar, FaTrashAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image"; // Import Next.js Image component

interface MediaItem {
  id: number;
  title: string;
  media_type: "movie" | "tv" | "youtube";
  poster_path: string | null;
  vote_average: number | null;
  country?: string;
}

export default function MyListPage({ locale }: { locale: string }) {
  const [myList, setMyList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const t = useTranslations("MyList");

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("myList") || "[]");
    const fetchItems = async () => {
      const items: MediaItem[] = await Promise.all(
        storedList.reverse().map(async (item: { id: string; media_type: string; title: string }) => {
          if (item.media_type === "youtube") {
            try {
              const response = await fetch("/data/african.json");
              const data = await response.json();
              const foundMovie = data.find((movie: MediaItem) => movie.id === Number(item.id));
              return {
                id: item.id,
                title: item.title,
                media_type: "youtube",
                country: foundMovie?.country,
              };
            } catch (error) {
              console.error("Failed to fetch YouTube item details:", error);
              return null;
            }
          } else {
            try {
              const mediaType = item.media_type;
              const response = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
              );
              const data = await response.json();
              if (!data.id) {
                console.error(`No data found for ID: ${item.id}`);
                return null;
              }
              return {
                id: data.id,
                title: data.title || data.name,
                media_type: mediaType,
                poster_path: data.poster_path,
                vote_average: data.vote_average,
              };
            } catch (error) {
              console.error(`Failed to fetch details for ID: ${item.id}`, error);
              return null;
            }
          }
        })
      );

      setMyList(items.filter((item) => item !== null));
      setLoading(false);
    };

    fetchItems();
  }, []);

  const handleRemove = (id: string, media_type: string) => {
    const numericId = media_type === "youtube" ? id : Number(id);
    setMyList((prevList) => {
      const updatedList = prevList.filter((item) => item.id !== numericId);
      localStorage.setItem(
        "myList",
        JSON.stringify(updatedList.map((item) => ({ id: item.id, media_type: item.media_type, title: item.title })))
      );
      return updatedList;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image src="/gif/512.gif" alt="Loading" width={100} height={100} />
        <div className="mt-4 text-xl font-bold">
          {t('loading')}<span className="animated-dots">...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow p-4 mt-8 md:mt-16">
          {myList.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
              <AnimatePresence>
                {myList.map((item, index) => {
                  const isYouTube = item.media_type === "youtube";
                  const slug = `${item.title.replace(/ /g, "-").replace(/[^\w-]+/g, "")}-${item.id}`;
                  const url = isYouTube
                    ? `/watch/afriq/?videoId=${slug}`
                    : item.media_type === "movie"
                    ? `/${locale}/watch/movie/${slug}`
                    : `/${locale}/watch/tv/${slug}`;

                  return (
                    <motion.div
                      key={item.id}
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50, rotateX: 90 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={url} passHref>
                        <div className="relative cursor-pointer animate-filter group">
                          {isYouTube ? (
                            <div className="relative z-10 flex justify-center items-center h-[180px] md:h-[280px]">
                              <Image
                                src={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                                alt={item.title}
                                width={320}
                                height={180}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                              alt={item.title}
                              width={200}
                              height={300}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-xs px-2 py-1 rounded flex items-center z-20">
                            {isYouTube ? (
                              <>
                                <Image src={`/flags/${item.country?.toLowerCase() || 'default'}.png`} alt={item.country || 'Unknown'} width={24} height={16} />
                                {item.country || 'Unknown'}
                              </>
                            ) : (
                              <>
                                <FaStar className="mr-1 text-yellow-500" /> {/* Always yellow star */}
                                <span className="text-yellow-500">{item.vote_average ? item.vote_average.toFixed(1) : "N/A"}</span> {/* Always yellow text */}
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.id.toString(), item.media_type);
                        }}
                        className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition duration-300 z-30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        exit={{ opacity: 0, y: 50, rotateX: 90, transition: { duration: 0.5 } }}
                      >
                        <FaTrashAlt />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow h-screen">
              <div className="flex flex-col items-center">
                <Image src="/gif/sleep.gif" alt="Empty List" width={100} height={100} />
                <p className="text-black dark:text-white text-lg mt-4">{t('emptyList')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
