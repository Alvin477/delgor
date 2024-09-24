import fs from 'fs';
import path from 'path';

// Fetch data from the correct JSON file based on year and type (movie/tv)
export async function fetchMovieData(id: number, type: 'movie' | 'tv', year: string) {
  const filePath = path.join(process.cwd(), 'public', 'json', year, `${type}.json`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    // Find the specific movie or TV series by ID
    const movieData = data.find((item: any) => item.id === id);

    // If it's a TV series, make sure we handle the seasonLabel properly
    if (movieData && type === 'tv') {
      movieData.seasons = movieData.seasons.map((season: any) => ({
        seasonLabel: season.seasonLabel || `Season ${season.season}`, // Use custom label or fallback to "Season X"
        episodes: season.episodes,
      }));
    }

    return movieData || null;
  } catch (error) {
    console.error(`Error reading ${type}.json for year ${year}:`, error);
    return null;
  }
}
