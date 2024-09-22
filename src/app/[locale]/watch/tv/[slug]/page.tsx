import WatchHeroTv from '@/app/components/WatchHeroTv'; // Import WatchHeroTv
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

  return {
    title,
    description,
  };
}

export default async function WatchTvPage({ params }: { params: { slug: string, locale: string } }) {
  const tvShowSlug = params.slug; // Extract the slug
  const tvShow = await fetchTvShowDetails(tvShowSlug); // Fetch the TV show data based on the slug

  if (!tvShow) {
    return <div>TV show not found</div>; // Handle case when TV show is not found
  }

  return (
    <div>
      <WatchHeroTv tvShow={tvShow} /> {/* Pass the TV show details to the WatchHeroTv component */}
    </div>
  );
}
