import WatchHeroTv from '@/app/components/WatchHeroTv'; // Import WatchHeroTv
import TVWatchButtons from '@/app/components/TVWatchButtons'; // Import TVWatchButtons
import TvCastSlider from '@/app/components/TvCastSlider'; // Import TvCastSlider
import TVWatchTabs from '@/app/components/TVWatchTabs'; // Import RelatedTVShows
import { getMessages } from 'next-intl/server';
import { fetchTvShowDetails } from '@/app/lib/fetchTvShowDetails'; // A custom function to fetch TV show data

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

export default async function WatchTvPage({ params }: { params: { slug: string, locale: string } }) {
  const tvShowSlug = params.slug; // Extract the slug
  const tvShow = await fetchTvShowDetails(tvShowSlug); // Fetch the TV show data based on the slug

  if (!tvShow) {
    return <div>TV show not found</div>; // Handle case when TV show is not found
  }

  // Ensure seasons are available, otherwise pass an empty array
  const seasons = tvShow?.seasons || [];

  return (
    <div>
      <WatchHeroTv tvShow={tvShow} /> {/* Pass the TV show details to the WatchHeroTv component */}
      <TVWatchButtons
        tvId={tvShow.id}
        trailerUrl={tvShow.trailerUrl} // Adjust based on available trailer field
        title={tvShow.name}
        releaseDate={tvShow.first_air_date} // Pass the release date
      />
      <TvCastSlider tvShowId={tvShow.id} /> {/* Add the TvCastSlider for the cast */}
      <TVWatchTabs tvShowId={tvShow.id} seasons={seasons} /> {/* Pass seasons data to TVWatchTabs */}
    </div>
  );
}
