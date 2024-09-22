import WatchHero from '@/app/components/WatchHero'; // Import WatchHero
import { getMessages } from 'next-intl/server';
import { fetchMovieDetails } from '@/app/lib/fetchMovieDetails'; // A custom function to fetch movie data

export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
  const messages = await getMessages({ locale: params.locale });
  
  // Fetch the movie details using the slug
  const movieSlug = params.slug;
  const movie = await fetchMovieDetails(movieSlug);

  // Ensure the movie object has been fetched and has a title
  const title = movie?.title ? (messages.WatchPage as { title: string }).title.replace('{name}', movie.title) : 'Default Title';
  const description = movie?.overview || (messages.WatchPage as { description: string }).description.replace('{name}', movie?.title || '') || 'Default Description';

  // Set the Open Graph image (fallback if no movie backdrop is available)
  const ogImage = movie?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '/default-backdrop.jpg'; // Fallback image if no backdrop is available

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage, // Use the movie's backdrop as the OG image
          width: 1200,
          height: 630,
          alt: movie?.title || 'Movie Image',
        }
      ],
      type: 'website',
    },
  };
}

export default async function WatchPage({ params }: { params: { slug: string, locale: string } }) {
  const movieSlug = params.slug; // Extract the slug
  const movie = await fetchMovieDetails(movieSlug); // Fetch the movie data based on the slug

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      <WatchHero movie={movie} />
    </div>
  );
}
