// /src/app/lib/fetchTvShowDetails.ts
export async function fetchTvShowDetails(slug: string) {
    const id = slug.split('-').pop(); // Extract the TV show ID from the slug
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    );
    const tvShow = await res.json();
    return tvShow;
  }
  