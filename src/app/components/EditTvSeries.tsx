'use client';

import { useState, useEffect } from 'react';

interface EditTvSeriesProps {
  selectedYear: string;
}

const EditTvSeries: React.FC<EditTvSeriesProps> = ({ selectedYear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tvData, setTvData] = useState<any[]>([]);
  const [filteredTv, setFilteredTv] = useState<any[]>([]);
  const [activeTvId, setActiveTvId] = useState<number | null>(null); // Track which TV series is active (opened for edit)

  useEffect(() => {
    // Fetch TV series data from the selected year JSON file
    const fetchTv = async () => {
      try {
        const response = await fetch(`/json/${selectedYear}/tv.json`);
        if (!response.ok) {
          throw new Error(`TV JSON for ${selectedYear} not found.`);
        }
        const data = await response.json();
        setTvData(data);
        setFilteredTv(data); // Initially, show all TV series
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('An unknown error occurred');
        }
      }
    };

    fetchTv();
  }, [selectedYear]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const results = tvData.filter((tv) =>
      tv.title.toLowerCase().includes(term)
    );
    setFilteredTv(results);
  };

  const handleTvToggle = (tvId: number) => {
    if (activeTvId === tvId) {
      // Close the panel if clicked again
      setActiveTvId(null);
    } else {
      // Open the clicked TV series
      setActiveTvId(tvId);
    }
  };

  const handleSeasonLabelChange = (seasonIndex: number, value: string, tvId: number) => {
    const updatedTvData = [...tvData];
    const tv = updatedTvData.find((item) => item.id === tvId);
    if (tv) {
      tv.seasons[seasonIndex].seasonLabel = value;
      setTvData(updatedTvData);
    }
  };

  const handleEpisodeChange = (seasonIndex: number, episodeIndex: number, field: string, value: string, tvId: number) => {
    const updatedTvData = [...tvData];
    const tv = updatedTvData.find((item) => item.id === tvId);
    if (tv) {
      tv.seasons[seasonIndex].episodes[episodeIndex][field] = value;
      setTvData(updatedTvData);
    }
  };

  const handleAddEpisode = (seasonIndex: number, tvId: number) => {
    const updatedTvData = [...tvData];
    const tv = updatedTvData.find((item) => item.id === tvId);
    if (tv) {
      const newEpisode = { label: '', url: '' };
      tv.seasons[seasonIndex].episodes.push(newEpisode);
      setTvData(updatedTvData);
    }
  };

  const handleDeleteEpisode = (seasonIndex: number, episodeIndex: number, tvId: number) => {
    const updatedTvData = [...tvData];
    const tv = updatedTvData.find((item) => item.id === tvId);
    if (tv) {
      tv.seasons[seasonIndex].episodes = tv.seasons[seasonIndex].episodes.filter((_: any, i: number) => i !== episodeIndex);
      setTvData(updatedTvData);
    }
  };

  const handleAddSeason = (tvId: number) => {
    const updatedTvData = [...tvData];
    const tv = updatedTvData.find((item) => item.id === tvId);
    if (tv) {
      const newSeason = { seasonLabel: '', episodes: [{ label: '', url: '' }] };
      tv.seasons.push(newSeason);
      setTvData(updatedTvData);
    }
  };

  const handleDeleteSeason = (seasonIndex: number, tvId: number) => {
    const updatedTvData = [...tvData];
    const tv = updatedTvData.find((item) => item.id === tvId);
    if (tv) {
      tv.seasons = tv.seasons.filter((_: any, i: number) => i !== seasonIndex);
      setTvData(updatedTvData);
    }
  };

  const handleDeleteTvSeries = async (tvId: number) => {
    const confirmation = confirm('Are you sure you want to delete this TV series?');
    if (!confirmation) return;

    try {
      const response = await fetch('/api/delete-tvseries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: tvId,
          year: selectedYear,
        }),
      });

      const data = await response.json();
      if (data.message === 'TV series deleted successfully') {
        setTvData((prevData) => prevData.filter((tv) => tv.id !== tvId));
        alert('TV series deleted successfully');
        setActiveTvId(null); // Close the edit panel after deleting
      } else {
        alert('Failed to delete TV series');
      }
    } catch (error) {
      console.error('Error deleting TV series:', error);
      alert('An error occurred while deleting the TV series.');
    }
  };

  const handleSaveChanges = async (tvId: number) => {
    const tv = tvData.find((item) => item.id === tvId);
    if (!tv) return;

    try {
      const response = await fetch('/api/edit-tvseries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: tv.id,
          updatedTv: tv,
          year: selectedYear,
        }),
      });

      const data = await response.json();
      if (data.message === 'TV series updated successfully') {
        alert('TV series updated successfully');
        setActiveTvId(null); // Close the edit panel after saving
      } else {
        alert('Failed to update TV series');
      }
    } catch (error) {
      console.error('Error updating TV series:', error);
      alert('An error occurred while updating the TV series.');
    }
  };

  return (
    <div className="text-black dark:text-white w-full">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a TV series..."
        value={searchTerm}
        onChange={handleSearch}
        className="px-4 py-2 mb-4 w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
      />

      {/* TV Series List */}
      {filteredTv.map((tv) => (
        <div key={tv.id}>
          <div
            className={`mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer ${
              activeTvId === tv.id ? 'bg-blue-300' : ''
            }`}
            onClick={() => handleTvToggle(tv.id)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{tv.title}</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the toggle
                  handleDeleteTvSeries(tv.id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
              >
                DELETE TV SERIES
              </button>
            </div>
            <p>ID: {tv.id}</p>
          </div>

          {/* Edit TV Series Section */}
          {activeTvId === tv.id && (
            <div className="p-6 bg-gray-200 dark:bg-gray-900 rounded mb-6 shadow-lg border border-red-500 transition-opacity duration-500 ease-in-out">
              <h2 className="text-xl font-bold mb-2 text-red-500">{tv.title}</h2>
              <p>ID: {tv.id}</p>

              {/* Seasons */}
              {tv.seasons.map((season: any, seasonIndex: number) => (
                <div key={seasonIndex} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold">Season Label:</label>
                    <input
                      type="text"
                      value={season.seasonLabel}
                      onChange={(e) => handleSeasonLabelChange(seasonIndex, e.target.value, tv.id)}
                      className="w-3/4 px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded ml-2"
                    />
                    <button
                      onClick={() => handleDeleteSeason(seasonIndex, tv.id)}
                      className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
                    >
                      DELETE SEASON
                    </button>
                  </div>

                  {/* Episodes */}
                  {season.episodes.map((episode: any, episodeIndex: number) => (
                    <div key={episodeIndex} className="mb-4 flex items-center space-x-4">
                      <div className="w-1/3">
                        <label className="block text-sm font-bold mb-1">Episode Label:</label>
                        <input
                          type="text"
                          value={episode.label}
                          onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'label', e.target.value, tv.id)}
                          className="w-full px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded"
                        />
                      </div>
                      <div className="w-2/3">
                        <label className="block text-sm font-bold mb-1">Episode URL:</label>
                        <input
                          type="text"
                          value={episode.url}
                          onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'url', e.target.value, tv.id)}
                          className="w-full px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteEpisode(seasonIndex, episodeIndex, tv.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
                      >
                        DELETE
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddEpisode(seasonIndex, tv.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-blue-500/50"
                  >
                    ADD EPISODE
                  </button>
                </div>
              ))}

              <button
                onClick={() => handleAddSeason(tv.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-blue-500/50 mt-4"
              >
                ADD NEW SEASON
              </button>

              <button
                onClick={() => handleSaveChanges(tv.id)}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-green-500/50"
              >
                SAVE CHANGES
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditTvSeries;
