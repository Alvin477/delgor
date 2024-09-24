'use client';

import { useState, useEffect } from 'react';

interface MovieData {
  id: number;
  title: string;
  type: string;
  downloads: Array<{ label: string; url: string }>;
}

interface CheckMovieProps {
  selectedYear: string;
}

const CheckMovie: React.FC<CheckMovieProps> = ({ selectedYear }) => {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/json/${selectedYear}/movie.json`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  if (loading) {
    return <div>Loading movies...</div>;
  }

  // Divide movies into two categories
  const moviesWithValidLinks = data.filter((movie) =>
    movie.downloads.some((download) => download.url !== '#' && download.url.trim() !== '')
  );

  const moviesWithEmptyLinks = data.filter(
    (movie) => !movie.downloads.some((download) => download.url !== '#' && download.url.trim() !== '')
  );

  return (
    <div className="text-black dark:text-white w-full">
      <div className="mb-6 text-center">
        <div className="mt-2 text-lg">
          <span className="bg-red-100 dark:bg-red-800 text-black dark:text-white px-4 py-1 rounded border border-red-300 dark:border-red-700">
            {moviesWithValidLinks.length} Movies Done
          </span>
          <span className="bg-green-100 dark:bg-green-800 text-black dark:text-white px-4 py-1 rounded ml-4 border border-green-300 dark:border-green-700">
            {moviesWithEmptyLinks.length} Left to Go
          </span>
          <span className="bg-blue-100 dark:bg-blue-800 text-black dark:text-white px-4 py-1 rounded ml-4 border border-blue-300 dark:border-blue-700">
            {data.length} Total Movies
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Movies with valid links */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-center">Movies with Valid Links</h2>
          <ul className="max-h-96 overflow-y-auto">
            {moviesWithValidLinks.map((movie) => (
              <li key={movie.id} className="mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{movie.title}</span>
                  <span className="text-sm text-gray-500">({movie.downloads.length} Links)</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Movies with no valid links */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-center">Movies with No Valid Links</h2>
          <ul className="max-h-96 overflow-y-auto">
            {moviesWithEmptyLinks.map((movie) => (
              <li key={movie.id} className="mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{movie.title}</span>
                  <span className="text-sm text-gray-500">(No Links)</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckMovie;
