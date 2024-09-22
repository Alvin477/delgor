const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function fetchMovieDetails(slug: string) {
  const [id] = slug.split('-');
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  if (!res.ok) return null;
  return await res.json();
}
