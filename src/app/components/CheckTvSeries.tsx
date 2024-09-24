'use client';

import { useState, useEffect } from 'react';

interface Episode {
  label: string;
  url: string;
}

interface Season {
  seasonLabel: string;
  episodes: Episode[];
}

interface TvSeriesData {
  id: number;
  title: string;
  type: string;
  seasons: Season[];
}

interface CheckTvSeriesProps {
  selectedYear: string;
}

const CheckTvSeries: React.FC<CheckTvSeriesProps> = ({ selectedYear }) => {
  const [data, setData] = useState<TvSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/json/${selectedYear}/tv.json`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  if (loading) {
    return <div>Loading TV series...</div>;
  }

  // Helper function to check if a season has any valid links
  const hasValidLinks = (seasons: Season[]) => {
    return seasons.some((season) =>
      season.episodes.some((episode) => episode.url !== '#' && episode.url.trim() !== '')
    );
  };

  // Divide TV series into two categories
  const tvWithValidLinks = data.filter((tv) => hasValidLinks(tv.seasons));

  const tvWithEmptyLinks = data.filter((tv) => !hasValidLinks(tv.seasons));

  return (
    <div className="text-black dark:text-white w-full">
      <div className="mb-6 text-center">
        <div className="mt-2 text-lg">
          <span className="bg-red-100 dark:bg-red-800 text-black dark:text-white px-4 py-1 rounded border border-red-300 dark:border-red-700">
            {tvWithValidLinks.length} TV Series Done
          </span>
          <span className="bg-green-100 dark:bg-green-800 text-black dark:text-white px-4 py-1 rounded ml-4 border border-green-300 dark:border-green-700">
            {tvWithEmptyLinks.length} Left to Go
          </span>
          <span className="bg-blue-100 dark:bg-blue-800 text-black dark:text-white px-4 py-1 rounded ml-4 border border-blue-300 dark:border-blue-700">
            {data.length} Total TV Series
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* TV series with valid links */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-center">TV Series with Valid Links</h2>
          <ul className="max-h-96 overflow-y-auto">
            {tvWithValidLinks.map((tv) => (
              <li key={tv.id} className="mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{tv.title}</span>
                  <span className="text-sm text-gray-500">
                    {tv.seasons.reduce((acc, season) => acc + season.episodes.length, 0)} Links In Total
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* TV series with no valid links */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-center">TV Series with No Valid Links</h2>
          <ul className="max-h-96 overflow-y-auto">
            {tvWithEmptyLinks.map((tv) => (
              <li key={tv.id} className="mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{tv.title}</span>
                  <span className="text-sm text-gray-500">(No Valid Episodes)</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckTvSeries;
