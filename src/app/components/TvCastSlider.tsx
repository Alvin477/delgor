"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image component for optimization
import { useTranslations } from 'next-intl'; // Import translations

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
}

interface TvCastSliderProps {
  tvShowId: number;
}

const TvCastSlider: React.FC<TvCastSliderProps> = ({ tvShowId }) => {
  const [cast, setCast] = useState<CastMember[]>([]);
  const t = useTranslations('CastSlider'); // Translation hook

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShowId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await response.json();
        setCast(data.cast.slice(0, 16)); // Limit to the first 16 cast members
      } catch (error) {
        console.error('Failed to fetch cast data:', error);
      }
    };

    fetchCast();
  }, [tvShowId]);

  return (
    <div className="relative mt-0 animate-fadeInUp">
      <div className="flex justify-between items-center mb-4 mx-4 animate-slideInLeft">
        <h2 className="text-2xl font-bold text-black dark:text-white text-left md:text-2xl sm:text-xl">
          {t('cast')}
        </h2>
      </div>
      <div className="w-full">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={3} // Default for mobile
          breakpoints={{
            640: {
              slidesPerView: 3, // 3 slides per view on mobile
            },
            768: {
              slidesPerView: 5, // 5 slides per view on tablets
            },
            1024: {
              slidesPerView: 8, // 8 slides per view on PC
            },
          }}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          className="mySwiper"
        >
          {cast.map((member) => (
            <SwiperSlide key={member.id}>
              <Link href={`/cast/?id=${member.id}`} passHref>
                <div className="relative flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                    alt={member.name}
                    width={100}
                    height={150}
                    className="rounded-lg object-cover border-2 border-black dark:border-white hover:border-red-500 transition-colors duration-300"
                    unoptimized
                  />
                </div>
                <p className="text-center text-black dark:text-white mt-2 text-sm">{member.name}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-4 custom-pagination swiper-pagination"></div>
      <style jsx global>{`
        .swiper-container {
          width: 100%;
          overflow: hidden;
        }

        .swiper-wrapper {
          display: flex;
        }

        .swiper-pagination {
          position: relative;
          margin-top: 10px;
        }

        .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.4);
        }

        .swiper-pagination-bullet-active {
          background-color: red;
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

export default TvCastSlider;
