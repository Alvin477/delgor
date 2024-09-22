"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image'; // Import Next.js Image component

// Define the Company interface
interface Company {
  id: number;
  name: string;
  logo_path: string | null;
}

const companyIds = [420, 429, 174, 33, 4, 34, 25, 5, 3, 1632]; // Example TMDB production company IDs

const CompanySlider: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]); // Use proper type
  const t = useTranslations('CompanySlider'); // Translations hook

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const responses = await Promise.all(
          companyIds.map((id) =>
            fetch(
              `https://api.themoviedb.org/3/company/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            ).then((res) => res.json())
          )
        );
        setCompanies(responses);
      } catch (error) {
        console.error('Failed to fetch company data:', error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="relative mt-6 animate-fadeInUp">
      <div className="flex justify-between items-center mb-4 mx-4 animate-slideInLeft">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white text-left">
          {t('topProductionCompanies')}
        </h2>
      </div>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={3} // Default for mobile
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 6 },
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
        {companies.map((company) => (
          <SwiperSlide key={company.id}>
            <Link href={`/company?id=${company.id}`} passHref>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer company-logo-container">
                {company.logo_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                    alt={company.name}
                    width={120} // Specify width
                    height={60} // Specify height
                    objectFit="contain"
                    className="h-12 object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-500">{company.name}</div>
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
          background-color: #1a202c;
          border-color: transparent;
        }

        :root:not(.dark) .company-logo-container {
          border-color: red;
        }
      `}</style>
    </div>
  );
};

export default CompanySlider;
