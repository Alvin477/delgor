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
  type: 'movie';
  year: string;
}

interface DownloadPageProps {
  params: { locale: string };
  searchParams: SearchParams;
}

// Type definition for MovieData
interface MovieData {
  id: number;
  title: string;
  type: 'movie';
  downloads: Array<{ label: string; url: string }>;
}

// Metadata generation for SEO
export async function generateMetadata({ params, searchParams }: DownloadPageProps) {
  const { locale } = params;
  const { id, type, year } = searchParams;

  const movieData = await fetchMovieData(parseInt(id), type, year);
  const messages = (await getMessages({ locale })) as Record<string, any>;

  if (!movieData) {
    return {
      title: messages?.DownloadPage?.title || 'Download Unavailable - Delgor',
      description: messages?.DownloadPage?.description || 'Sorry, we couldn\'t find any download links.',
    };
  }

  const title = `${messages?.DownloadPage?.title?.replace('{title}', movieData.title) || `Download ${movieData.title}`} - Delgor`;
  const description = `${messages?.DownloadPage?.description?.replace('{title}', movieData.title) || `Download ${movieData.title} on Delgor. Multiple quality options available.`}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.delgor.com/${locale}/download-movie?id=${id}&type=${type}&year=${year}`,
      images: [
        {
          url: '/images/ogdelgor.png',
          width: 1200,
          height: 630,
          alt: `${movieData.title} Poster`,
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

  // Fetch movie data
  const movieData: MovieData | null = await fetchMovieData(parseInt(id), type, year);
  const messages = (await getMessages({ locale })) as unknown as DownloadPageMessages;

  if (!movieData || !movieData.downloads || movieData.downloads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="text-6xl mb-4">
          <span role="img" aria-label="sad emoji">
            😢
          </span>
        </div>
        <p className="text-lg text-black dark:text-white mb-4">
          {messages?.noLinksFound || `Sorry, we couldn't find any valid download links for "${movieData?.title || "this item"}".`}
          <br />
          {messages?.description || 'Please report the issue, and we\'ll get it fixed within a few hours.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-3xl text-black dark:text-white mb-6">
        {messages?.title?.replace('{title}', movieData.title) || `Download Links for "${movieData.title}"`}
      </h1>

      {/* Client-side download component to handle interactivity */}
      <DownloadClient
        movieData={movieData}
        reportViaEmail={messages.reportViaEmail}
        reportViaTelegram={messages.reportViaTelegram}
      />
    </div>
  );
}
