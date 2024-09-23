"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import Image from 'next/image'; 

// Define the Company interface
interface Company {
  id: number;
  name: string;
  logo_path: string | null;
}

const companyIds = [420, 429, 174, 33, 4, 34, 25, 5, 3, 1632];

const CompanySlider: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const params = useParams();  
  const locale = params.locale as string;  // Extract locale from URL

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
          Top Production Companies
        </h2>
      </div>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
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
            <Link href={`/${locale}/company/${company.id}`}>
              {/* We no longer need an <a> tag */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer company-logo-container">
                {company.logo_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                    alt={company.name}
                    width={120}
                    height={60}
                    unoptimized
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
        /* Custom styles here */
      `}</style>
    </div>
  );
};

export default CompanySlider;
