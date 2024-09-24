import { fetchMovieData } from '@/app/lib/fetchMovieData';
import DownloadClient from './DownloadClient'; // Client component
import { getMessages } from 'next-intl/server';

interface DownloadPageMessages {
  title: string;
  description: string;
  noLinksFound: string;
  reportViaEmail: string;
  reportViaTelegram: string;
}

interface SearchParams {
  id: string;
  type: 'tv';
  year: string;
}

interface DownloadPageProps {
  params: { locale: string };
  searchParams: SearchParams;
}

// Type definition for TV Series Data
interface TvSeriesData {
  id: number;
  title: string;
  type: 'tv';
  seasons: Array<{
    seasonLabel: string;  // Updated to use seasonLabel
    episodes: Array<{ label: string; url: string }>;
  }>;
}

// Metadata generation for SEO
export async function generateMetadata({ params, searchParams }: DownloadPageProps) {
  const { locale } = params;
  const { id, type, year } = searchParams;

  const tvData = await fetchMovieData(parseInt(id), type, year);
  const messages = (await getMessages({ locale })) as Record<string, any>;

  if (!tvData) {
    return {
      title: messages?.DownloadPage?.title || 'Download Unavailable - Delgor',
      description: messages?.DownloadPage?.description || 'Sorry, we couldn\'t find any download links.',
    };
  }

  const title = `${messages?.DownloadPage?.title?.replace('{title}', tvData.title) || `Download ${tvData.title}`} - Delgor`;
  const description = `${messages?.DownloadPage?.description?.replace('{title}', tvData.title) || `Download ${tvData.title} on Delgor. Multiple quality options available.`}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.delgor.com/${locale}/download-tv?id=${id}&type=${type}&year=${year}`,
      images: [
        {
          url: '/images/ogdelgor.png',
          width: 1200,
          height: 630,
          alt: `${tvData.title} Poster`,
        },
      ],
      type: 'website',
    },
  };
}

// Server-side rendered component
export default async function DownloadPage({ params, searchParams }: DownloadPageProps) {
  const { id, type, year } = searchParams;
  const locale = params.locale;

  // Fetch TV series data
  const tvData: TvSeriesData | null = await fetchMovieData(parseInt(id), type, year);
  const messages = (await getMessages({ locale })) as unknown as DownloadPageMessages;

  if (!tvData || !tvData.seasons || tvData.seasons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="text-6xl mb-4">
          <span role="img" aria-label="sad emoji">
            😢
          </span>
        </div>
        <p className="text-lg text-black dark:text-white mb-4">
          {messages?.noLinksFound || `Sorry, we couldn't find any valid download links for "${tvData?.title || "this item"}".`}
          <br />
          {messages?.description || 'Please report the issue, and we\'ll get it fixed within a few hours.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl text-black dark:text-white mb-6">
        {messages?.title?.replace('{title}', tvData.title) || `Download Links for "${tvData.title}"`}
      </h1>

      {/* Client-side download component to handle interactivity */}
      <DownloadClient
        tvData={tvData}
        reportViaEmail={messages.reportViaEmail}
        reportViaTelegram={messages.reportViaTelegram}
      />
    </div>
  );
}
