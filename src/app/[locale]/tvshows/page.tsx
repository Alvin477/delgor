import { fetchTvShows, fetchTvGenres } from '@/app/lib/fetchTvShows';
import TVSeriesComponent from '@/app/components/TVSeriesComponent';
import { getMessages } from 'next-intl/server';

// Server-side metadata generation for SEO
export async function generateMetadata({ params }: { params: { locale: string } }) {
  // Fetching the messages for the specific locale
  const messages = await getMessages({ locale: params.locale });

  // Get translated messages for the TV page from the locale-specific message file
  const tvPageMessages = (messages?.TVPage || {}) as Record<string, string>;
  const title = tvPageMessages.pageTitle || 'Delgor - Explore TV Shows';  // Fallback to default title
  const description = tvPageMessages.metaDescription || 'Explore the latest trending TV shows on Delgor.';  // Fallback to default description

  return {
    title,  // The page title dynamically changes based on the locale
    description,
    keywords: 'tv shows, trending tv, streaming, latest tv shows, Delgor',
    openGraph: {
      title,  // Dynamic title
      description,  // Dynamic description
      url: 'https://www.delgor.com/tv-shows',
      images: [
        {
          url: 'https://www.delgor.com/images/tv-shows-og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TV Shows on Delgor',
        }
      ],
      type: 'website',
    },
  };
}

export default async function TVSeriesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { genre?: string; year?: string; page?: string };
}) {
  const locale = params.locale || 'en';
  const genre = searchParams.genre ? parseInt(searchParams.genre) : undefined;
  const year = searchParams.year || undefined;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // Fetch TV genres and shows from the server based on locale and filters
  const genres = await fetchTvGenres(locale);
  const tvData = await fetchTvShows(locale, genre, year, page);

  return (
    <TVSeriesComponent
      genres={genres}
      tvShows={tvData.results}
      totalPages={tvData.total_pages}
      locale={locale}
    />
  );
}
