import WatchHero from '@/app/components/WatchHero'; // Import WatchHero
import WatchButtons from '@/app/components/WatchButtons'; // Import WatchButtons
import MovieCastSlider from '@/app/components/MovieCastSlider';
import RelatedMovies from '@/app/components/RelatedMovies';
import { getMessages } from 'next-intl/server';
import { fetchMovieDetails } from '@/app/lib/fetchMovieDetails'; // A custom function to fetch movie data

// Metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
  const messages = await getMessages({ locale: params.locale });

  // Fetch movie details using the slug
  const movieSlug = params.slug;
  const movie = await fetchMovieDetails(movieSlug);

  // Ensure the movie object has been fetched and has a title
  const title = movie?.title
    ? (messages.WatchPage as { title: string }).title.replace('{name}', movie.title)
    : 'Default Title';
  const description = movie?.overview
    ? movie.overview
    : (messages.WatchPage as { description: string }).description.replace('{name}', movie?.title || 'Movie');

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
        },
      ],
      type: 'website',
    },
  };
}

// WatchPage component
export default async function WatchPage({ params }: { params: { slug: string, locale: string } }) {
  const { slug: movieSlug, locale } = params; // Extract the slug and locale
  const movie = await fetchMovieDetails(movieSlug); // Fetch movie data

  // Handle the case where the movie is not found
  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      {/* WatchHero component to display movie details */}
      <WatchHero movie={movie} />

      {/* WatchButtons component with necessary props */}
      <WatchButtons 
        movieId={movie.id} 
        trailerUrl={movie.trailerUrl || null}  // Ensure trailerUrl is passed or null
        title={movie.title} 
        locale={locale} // Pass the locale to WatchButtons
      />

      {/* MovieCastSlider component to display cast */}
      <MovieCastSlider movieId={movie.id} />

      {/* RelatedMovies component to display related movies */}
      <RelatedMovies movieId={movie.id} />
    </div>
  );
}
