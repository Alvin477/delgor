// src/app/lib/fetchCompanyDetails.ts

export async function fetchCompanyDetails(companyId: string | number) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/company/${companyId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch company details');
      }
  
      const companyData = await response.json();
  
      // Fetch TV shows produced by this company
      const tvShowsResponse = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_companies=${companyId}`
      );
      const tvShowsData = await tvShowsResponse.json();
  
      return {
        ...companyData,
        tvShows: tvShowsData.results,
      };
    } catch (error) {
      console.error('Error fetching company details:', error);
      return null;
    }
  }
  