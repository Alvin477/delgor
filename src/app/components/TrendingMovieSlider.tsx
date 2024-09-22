"use client";

import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay } from "swiper/modules";
import { generateSlug } from "@/app/lib/generateSlug";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Image from 'next/image'; // Import Image from next/image

// Define movie interface
interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
}

// Async function to fetch trending movies
async function fetchTrendingMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results.slice(0, 20); // Get the first 20 movies
}

const TrendingMovieSlider: React.FC = () => {
  const t = useTranslations("TrendingMovies");
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    const fetchData = async () => {
      const movies = await fetchTrendingMovies();
      setTrendingMovies(movies);
    };
    fetchData();
  }, []);

  return (
    <div className="relative -mt-8 animate-fadeInUp">
      <div className="flex justify-between items-center mb-4 mx-4 animate-slideInLeft">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white text-left">
          {t("trendingMovies")}
        </h2>
        <a
          href="/movies"
          className="text-red-500 dark:text-red-400 text-xs sm:text-sm md:text-lg hover:underline"
        >
          {t("seeAll")}
        </a>
      </div>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={5}
        slidesPerView={3}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 8 },
        }}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        className="mySwiper"
      >
        {trendingMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link href={`/${locale}/watch/movie/${generateSlug(movie.title, movie.id)}`} passHref>
              <div className="relative p-1 cursor-pointer group">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750} // Set a numeric height value
                  className="w-full h-auto rounded-lg shadow-lg transition-transform transform group-hover:scale-105 group-hover:ring-2 group-hover:ring-red-500 group-hover:glow-red"
                />
                <div className="absolute top-2 right-2 bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
                  <FaStar className="mr-1" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4 custom-pagination swiper-pagination"></div>
      <style jsx global>{`
        .swiper-pagination {
          position: relative;
          margin-top: 10px;
        }
        .swiper-pagination-bullet {
          background-color: rgba(0, 0, 0, 0.4);
        }
        .dark .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.4);
        }
        .swiper-pagination-bullet-active {
          background-color: red;
        }

        @keyframes glow-red {
          0% {
            box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000;
          }
          100% {
            box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
          }
        }

        .group-hover\\:glow-red {
          animation: glow-red 1s ease-in-out infinite alternate;
        }

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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-in-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TrendingMovieSlider;
