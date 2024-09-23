export async function fetchNetworkDetails(networkId: string | number) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/network/${networkId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch network details');
      }
  
      const networkData = await response.json();
  
      // Fetch TV shows produced by this network
      const tvShowsResponse = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_networks=${networkId}&page=1`
      );
      const tvShowsData = await tvShowsResponse.json();
  
      return {
        ...networkData,
        tvShows: tvShowsData.results,
        total_pages: tvShowsData.total_pages,
      };
    } catch (error) {
      console.error('Error fetching network details:', error);
      return null;
    }
  }
  