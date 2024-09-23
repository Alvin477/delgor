import { getMessages } from 'next-intl/server';
import { fetchSearchResults, fetchTrendingItems } from '@/app/lib/fetchSearchData';
import SearchInput from '@/app/components/SearchInput';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';

// Define the type for the search parameters
interface SearchParams {
  query?: string;
}

// Define the type for params including locale
interface Params {
  locale: string;
}

// Server-side metadata generation for SEO
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const query = searchParams.query || '';
  const messages = await getMessages({ locale: params.locale });

  const pageTitle = query
    ? `Results for "${query}" - Delgor`
    : 'Search Movies & TV Shows - Delgor';

  const pageDescription = query
    ? `Find movies, TV shows, and more related to "${query}" on Delgor.`
    : 'Check out the trending movies and TV shows on Delgor, your ultimate platform for streaming content.';

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.delgor.com/${params.locale}/search?query=${query}`,
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Delgor Search',
        },
      ],
      type: 'website',
    },
  };
}

// Fetch search results or trending items server-side
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const locale = params.locale;
  const query = searchParams.query || '';
  const itemsToShow = 24; // Adjust number of items to show based on screen size

  let mediaItems = [];

  if (query) {
    mediaItems = await fetchSearchResults(query, itemsToShow);
  } else {
    mediaItems = await fetchTrendingItems(itemsToShow);
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black dark:text-white">
      {/* Client-side SearchInput component */}
      <SearchInput locale={locale} />

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {mediaItems.map((item) => {
          const title = item.title || item.name || 'Untitled';
          const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.id}`;
          const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';

          return (
            <div key={item.id} className="relative cursor-pointer">
              <Link href={`/${locale}/watch/${mediaType}/${slug}`}>
                <div
                  className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                  style={{
                    backgroundImage: item.poster_path
                      ? `url(https://image.tmdb.org/t/p/w500${item.poster_path})`
                      : "url('/images/fall-back.jpg')",
                    paddingBottom: '150%',
                  }}
                >
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-yellow-400 text-xs px-2 py-1 rounded flex items-center">
                    <FaStar className="mr-1" />
                    {item.vote_average.toFixed(1)}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
