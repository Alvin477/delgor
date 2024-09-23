export async function fetchTvShows(locale: string, genre?: number, year?: string, page: number = 1) {
    let url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&language=${locale}&sort_by=first_air_date.desc&vote_count.gte=1`;
  
    if (genre) {
      url += `&with_genres=${genre}`;
    }
    if (year) {
      url += `&first_air_date_year=${year}`;
    }
  
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
  
  export async function fetchTvGenres(locale: string) {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${locale}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.genres;
  }
  