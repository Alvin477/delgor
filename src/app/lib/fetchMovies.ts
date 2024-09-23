// src/app/lib/fetchMovies.ts

export async function fetchMovies(locale: string, genre?: number, year?: string, page: number = 1) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&language=${locale}&sort_by=release_date.desc&vote_count.gte=1`;
  
    if (genre) {
        url += `&with_genres=${genre}`;
    }
    if (year) {
        url += `&primary_release_year=${year}`;
    }
  
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function fetchMovieGenres(locale: string) {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${locale}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.genres;
}
