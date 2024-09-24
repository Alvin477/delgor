import { fetchMovieData } from '@/app/lib/fetchMovieData';
import ProceedClient from './ProceedClient';
import { getMessages } from 'next-intl/server';

interface ProceedPageMessages {
  processing: string;
  pleaseWait: string;
  notFoundTitle: string;
  notFoundDescription: string;
  description: string;
}

interface SearchParams {
  id: string;
  type: 'movie' | 'tv';
  year: string;
}

interface ProceedPageProps {
  params: { locale: string };
  searchParams: SearchParams;
}

// Server-side data fetching and metadata generation
export async function generateMetadata({ params, searchParams }: ProceedPageProps) {
  const { locale } = params;
  const { id, type, year } = searchParams;

  const movieData = await fetchMovieData(parseInt(id), type, year);

  // Fetch messages and provide a fallback for ProceedPage to avoid undefined errors
  const messages = (await getMessages({ locale })) as Record<string, any>;

  if (!movieData) {
    return {
      title: messages?.ProceedPage?.notFoundTitle || 'Movie Not Found - Delgor',
      description: messages?.ProceedPage?.notFoundDescription || 'We could not find the requested movie or TV series.',
    };
  }

  const title = `${messages?.ProceedPage?.processing?.replace('{title}', movieData.title) || `Processing ${movieData.title}`} - Delgor`;
  const description = `${messages?.ProceedPage?.description || 'The download link for'} ${movieData.title} ${messages?.ProceedPage?.pleaseWait || 'is being prepared.'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.delgor.com/${locale}/proceed?id=${id}&type=${type}&year=${year}`,
      images: [
        {
          url: '/images/og-image.jpg',
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
export default async function ProceedPage({ params, searchParams }: ProceedPageProps) {
  const { id, type, year } = searchParams;
  const locale = params.locale;

  // Fetch movie or TV data
  const movieData = await fetchMovieData(parseInt(id), type, year);

  // Fetch messages and provide a fallback for ProceedPage to avoid undefined errors
  const messages = (await getMessages({ locale })) as Record<string, any>;

  // Handle case when data is not found
  if (!movieData) {
    console.error('Movie data not found:', { id, type, year });
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h1 className="text-2xl text-red-500">
          {messages?.ProceedPage?.notFoundTitle || 'Sorry, we couldn\'t find the requested movie or TV show.'}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
          {messages?.ProceedPage?.notFoundDescription || 'Please check the link or try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl text-black dark:text-white mb-4">
        {messages?.ProceedPage?.processing?.replace('{title}', movieData.title) || `Processing ${movieData.title}...`}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        {messages?.ProceedPage?.pleaseWait || 'Please wait while we prepare your download link.'}
      </p>
      {/* Pass the necessary translations to the ProceedClient */}
      <ProceedClient
        id={id}
        type={type}
        releaseYear={year}
        proceedToDownload={messages?.ProceedClient?.proceedToDownload}
        pleaseWait={messages?.ProceedClient?.pleaseWait}
        seconds={messages?.ProceedClient?.seconds}
        reportViaEmail={messages?.ProceedClient?.reportViaEmail}
        reportViaTelegram={messages?.ProceedClient?.reportViaTelegram}
      />
    </div>
  );
}
