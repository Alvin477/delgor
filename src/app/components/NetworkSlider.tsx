"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Network {
  id: number;
  name: string;
  logo_path: string;
}

const networkIds = [213, 49, 1024, 2739, 174, 453, 2552];

const NetworkSlider: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const t = useTranslations('NetworkSlider');

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const responses = await Promise.all(
          networkIds.map((id) =>
            fetch(
              `https://api.themoviedb.org/3/network/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
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
        slidesPerView={3}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 6,
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
            <Link href={`/en/network/${network.id}`}>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer network-logo-container">
                {network.logo_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${network.logo_path}`}
                    alt={network.name}
                    width={120}
                    height={60}
                    unoptimized
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
    </div>
  );
};

export default NetworkSlider;
