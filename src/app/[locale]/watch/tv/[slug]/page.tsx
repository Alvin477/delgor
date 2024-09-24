import WatchHeroTv from '@/app/components/WatchHeroTv'; // Import WatchHeroTv
import TVWatchButtons from '@/app/components/TVWatchButtons'; // Import TVWatchButtons
import TvCastSlider from '@/app/components/TvCastSlider'; // Import TvCastSlider
import TVWatchTabs from '@/app/components/TVWatchTabs'; // Import TVWatchTabs
import { getMessages } from 'next-intl/server';
import { fetchTvShowDetails } from '@/app/lib/fetchTvShowDetails'; // A custom function to fetch TV show data

// Metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
  const { slug, locale } = params;

  // Fetch TV show details based on the slug
  const tvShow = await fetchTvShowDetails(slug);
  const messages = await getMessages({ locale });

  // Check if WatchPage exists in messages and if it contains title and description
  const watchPageMessages = messages?.WatchPage || {};
  const titleTemplate = typeof watchPageMessages === 'object' && 'title' in watchPageMessages
    ? watchPageMessages.title
    : 'Watch {name} - Default Title';

  const descriptionTemplate = typeof watchPageMessages === 'object' && 'description' in watchPageMessages
    ? watchPageMessages.description
    : 'Watch {name} on Delgor, the best platform for streaming.';

  // Replace {name} placeholder with the actual TV show's name dynamically
  const title = typeof titleTemplate === 'string' && tvShow?.name
    ? titleTemplate.replace('{name}', tvShow.name)
    : 'Default Title';

  const description = typeof descriptionTemplate === 'string' && tvShow?.name
    ? descriptionTemplate.replace('{name}', tvShow.name)
    : 'Default Description';

  // Set the Open Graph image (fallback if no TV show backdrop is available)
  const ogImage = tvShow?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
    : '/default-backdrop.jpg'; // Fallback image if no backdrop is available

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage, // Use the TV show's backdrop as the OG image
          width: 1200,
          height: 630,
          alt: tvShow?.name || 'TV Show Image',
        }
      ],
      type: 'website',
    },
  };
}

// WatchTvPage component
export default async function WatchTvPage({ params }: { params: { slug: string, locale: string } }) {
  const { slug: tvShowSlug, locale } = params; // Extract the slug and locale
  const tvShow = await fetchTvShowDetails(tvShowSlug); // Fetch TV show data based on the slug

  // Handle case when TV show is not found
  if (!tvShow) {
    return <div>TV show not found</div>;
  }

  // Ensure seasons are available, otherwise pass an empty array
  const seasons = tvShow?.seasons || [];

  return (
    <div>
      {/* Pass the TV show details to the WatchHeroTv component */}
      <WatchHeroTv tvShow={tvShow} />
      
      {/* Pass the necessary props, including locale, to the TVWatchButtons component */}
      <TVWatchButtons
        tvId={tvShow.id}
        trailerUrl={tvShow.trailerUrl || null} // Ensure trailerUrl is passed or null
        title={tvShow.name}
        releaseDate={tvShow.first_air_date} // Pass the release date
        locale={locale} // Pass the locale for translation
      />

      {/* TvCastSlider for the cast */}
      <TvCastSlider tvShowId={tvShow.id} />

      {/* TVWatchTabs for seasons, pass seasons data */}
      <TVWatchTabs tvShowId={tvShow.id} seasons={seasons} />
    </div>
  );
}
