import HeroPC from '@/app/components/HeroPC';
import TrendingTvSlider from '@/app/components/TrendingTvSlider';
import TrendingMovieSlider from '@/app/components/TrendingMovieSlider';
import NetworkSlider from '@/app/components/NetworkSlider'; // Import NetworkSlider
import CompanySlider from '@/app/components/CompanySlider'; // Import CompanySlider
import LatestGrid from '@/app/components/LatestGrid'; // Import LatestGrid
import { getMessages } from 'next-intl/server';

// Fetch translation messages for the given locale
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const messages = await getMessages({ locale: params.locale });
  return {
    title: (messages.HomePage as { title: string }).title,
    description: (messages.HomePage as { metaDescription: string }).metaDescription,
    keywords: (messages.HomePage as { metaKeywords: string }).metaKeywords,
  };
}

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Render the HeroPc Component in Full Screen */}
      <div className="h-screen">
        <HeroPC />
      </div>

      {/* Trending TV Shows Section */}
      <div className="px-4 pt-2 pb-8 bg-white dark:bg-black text-black dark:text-white">
        <TrendingTvSlider />
      </div>

      {/* Trending Movies Section */}
      <div className="px-4 pt-2 pb-8 bg-white dark:bg-black text-black dark:text-white">
        <TrendingMovieSlider />
      </div>

      {/* Network Slider Section */}
      <div className="px-4 pt-2 pb-8 bg-white dark:bg-black text-black dark:text-white">
        <NetworkSlider />
      </div>

      {/* Company Slider Section */}
      <div className="px-4 pt-2 pb-8 bg-white dark:bg-black text-black dark:text-white">
        <CompanySlider />
      </div>

      {/* Latest Grid Section */}
      <div className="px-4 pt-2 pb-8 bg-white dark:bg-black text-black dark:text-white">
        <LatestGrid />
      </div>
    </div>
  );
}
