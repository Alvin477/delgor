// src/app/movies/page.tsx

import { getMessages } from "next-intl/server";
import { fetchMovies, fetchMovieGenres } from "@/app/lib/fetchMovies";
import MoviesComponent from "@/app/components/MoviesComponent";

// Server-side metadata generation for SEO
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const messages = await getMessages({ locale: params.locale });

  // Get translated messages for the movie page from the locale-specific message file
  const moviePageMessages = messages?.MoviesPage || {};
  const title = (moviePageMessages as any).pageTitle || "Delgor - Explore Movies";
  const description = (moviePageMessages as any).metaDescription || "Browse and discover the latest movies on Delgor.";

  return {
    title,  // The page title dynamically changes based on the locale
    description,
    keywords: "movies, streaming, Delgor, latest movies",
    openGraph: {
      title,  // Dynamic title
      description,  // Dynamic description
      url: "https://www.delgor.com/movies",
      images: [
        {
          url: "https://www.delgor.com/images/ogdelgor.png",
          width: 1200,
          height: 630,
          alt: "Movies on Delgor",
        },
      ],
      type: "website",
    },
  };
}

export default async function MoviesPage({ params, searchParams }: { params: { locale: string }, searchParams: { genre?: string, year?: string, page?: string } }) {
  const locale = params.locale || "en";
  const genre = searchParams.genre ? parseInt(searchParams.genre) : undefined;
  const year = searchParams.year || undefined;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // Fetch genres and movies based on the locale, genre, year, and page
  const genres = await fetchMovieGenres(locale);
  const movieData = await fetchMovies(locale, genre, year, page);

  return (
    <MoviesComponent 
      genres={genres}
      initialMovies={movieData.results}
      totalPages={movieData.total_pages}
      locale={locale}
    />
  );
}
