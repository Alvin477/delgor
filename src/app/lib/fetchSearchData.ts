// src/app/lib/fetchSearchData.ts

interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average: number;
    media_type: "movie" | "tv";
  }
  
  export async function fetchSearchResults(query: string, itemsToShow: number): Promise<MediaItem[]> {
    let fetchedItems: MediaItem[] = [];
    let page = 1;
  
    try {
      while (fetchedItems.length < itemsToShow) {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&page=${page}`
        );
        const data = await response.json();
        const filteredData: MediaItem[] = data.results.filter(
          (item: MediaItem) => item.vote_average > 0
        );
  
        fetchedItems = [...fetchedItems, ...filteredData];
        page += 1;
  
        if (data.results.length === 0) break; // Stop if no more results
      }
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  
    return fetchedItems.slice(0, itemsToShow);
  }
  
  export async function fetchTrendingItems(itemsToShow: number): Promise<MediaItem[]> {
    let fetchedItems: MediaItem[] = [];
    let page = 1;
  
    try {
      while (fetchedItems.length < itemsToShow) {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
        );
        const data = await response.json();
        const filteredData: MediaItem[] = data.results.filter(
          (item: MediaItem) => item.vote_average > 0
        );
  
        fetchedItems = [...fetchedItems, ...filteredData];
        page += 1;
  
        if (data.results.length === 0) break; // Stop if no more results
      }
    } catch (error) {
      console.error('Failed to fetch trending items:', error);
    }
  
    return fetchedItems.slice(0, itemsToShow);
  }
  