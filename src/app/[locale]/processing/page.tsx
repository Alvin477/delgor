import { fetchMovieData } from '@/app/lib/fetchMovieData';
import ProcessingClient from './ProcessingClient';
import { getMessages } from 'next-intl/server';

interface ProcessingPageMessages {
  processing: string;
  pleaseWait: string;
  notFoundTitle: string;
  notFoundDescription: string;
}

interface SearchParams {
  id: string;
  type: 'movie' | 'tv';
  year: string;
}

interface ProcessingPageProps {
  params: { locale: string };
  searchParams: SearchParams;
}

// Fetch metadata for SEO
export async function generateMetadata({ params, searchParams }: ProcessingPageProps) {
  const { locale } = params;
  const { id, type, year } = searchParams;

  // Fetch the data based on type (movie or tv)
  const movieData = await fetchMovieData(parseInt(id), type, year);
  const messages = (await getMessages({ locale })) as Record<string, any>;

  if (!movieData) {
    return {
      title: messages?.ProcessingPage?.notFoundTitle || 'Content Not Found - Delgor',
      description: messages?.ProcessingPage?.notFoundDescription || 'We could not find the requested content.',
    };
  }

  const title = `${messages?.ProcessingPage?.processing?.replace('{title}', movieData.title) || `Processing ${movieData.title}`} - Delgor`;
  const description = `${messages?.ProcessingPage?.pleaseWait || 'Please wait while we prepare your download link.'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.delgor.com/${locale}/processing?id=${id}&type=${type}&year=${year}`,
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

// Server-side component to display the page
export default async function ProcessingPage({ params, searchParams }: ProcessingPageProps) {
  const { id, type, year } = searchParams;
  const locale = params.locale;

  // Fetch movie or TV data based on the ID and type
  const movieData = await fetchMovieData(parseInt(id), type, year);
  const messages = (await getMessages({ locale })) as Record<string, any>;

  // Handle case when data is not found
  if (!movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h1 className="text-2xl text-red-500">
          {messages?.ProcessingPage?.notFoundTitle || 'Sorry, we couldn\'t find the requested content.'}
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
          {messages?.ProcessingPage?.notFoundDescription || 'Please check the link or try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl text-black dark:text-white mb-4">
        {messages?.ProcessingPage?.processing?.replace('{title}', movieData.title) || `Processing ${movieData.title}...`}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        {messages?.ProcessingPage?.pleaseWait || 'Please wait while we prepare your download link.'}
      </p>
      <ProcessingClient
        id={id}
        type={type}
        releaseYear={year}
        proceedToDownload={messages?.ProcessingClient?.proceedToDownload}
        pleaseWait={messages?.ProcessingClient?.pleaseWait}
        seconds={messages?.ProcessingClient?.seconds}
        reportViaEmail={messages?.ProcessingClient?.reportViaEmail}
        reportViaTelegram={messages?.ProcessingClient?.reportViaTelegram}
      />
    </div>
  );
}
