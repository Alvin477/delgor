// /src/app/lib/fetchMovieDetails.ts
export async function fetchMovieDetails(slug: string) {
    const id = slug.split('-').pop(); // Extract the movie ID from the slug
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    );
    const movie = await res.json();
    return movie;
  }
  