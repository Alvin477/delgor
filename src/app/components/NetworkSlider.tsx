"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link'; // Import Link from Next.js
import { useTranslations } from 'next-intl'; // For translations
import Image from 'next/image'; // Import Next.js Image component

// Define the network interface
interface Network {
  id: number;
  name: string;
  logo_path: string;
}

const networkIds = [213, 49, 1024, 2739, 174, 453, 2552]; // List of network IDs

const NetworkSlider: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const t = useTranslations('NetworkSlider'); // Translations hook

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const responses = await Promise.all(
          networkIds.map((id) =>
            fetch(
              `https://api.themoviedb.org/3/network/${id}?api_key=${process.env.TMDB_API_KEY}`
            ).then((res) => res.json())
          )
        );
        setNetworks(responses);
      } catch (error) {
        console.error('Failed to fetch network data:', error);
      }
    };

    fetchNetworks();
  }, []);

  return (
    <div className="relative mt-12 animate-fadeInUp">
      <div className="flex justify-between items-center mb-4 mx-4 animate-slideInLeft">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white text-left">
          {t('popularNetworks')}
        </h2>
      </div>
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
            slidesPerView: 6, // 6 slides per view on PC
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
        {networks.map((network) => (
          <SwiperSlide key={network.id}>
            <Link href={`/network?id=${network.id}`} passHref> {/* Navigate with query parameter */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer company-logo-container">
                {network.logo_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${network.logo_path}`}
                    alt={network.name}
                    width={120}
                    height={60}
                    objectFit="contain"
                    className="h-12 object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-500">{network.name}</div>
                )}
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

        .company-logo-container {
          border: 2px solid transparent;
          background-color: white;
        }

        .dark .company-logo-container {
          background-color: #1a202c; /* dark gray for dark mode */
        }

        :root:not(.dark) .company-logo-container {
          border-color: red;
        }
      `}</style>
    </div>
  );
};

export default NetworkSlider;
