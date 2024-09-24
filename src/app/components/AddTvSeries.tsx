'use client';

import { useState } from 'react';

interface Episode {
  label: string;
  url: string;
}

interface Season {
  seasonLabel: string;
  episodes: Episode[];
}

interface AddTvSeriesProps {
  selectedYear: string;
}

const AddTvSeries: React.FC<AddTvSeriesProps> = ({ selectedYear }) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [seasons, setSeasons] = useState<Season[]>([{ seasonLabel: '', episodes: [{ label: '', url: '' }] }]);

  const handleAddSeason = () => {
    setSeasons([...seasons, { seasonLabel: '', episodes: [{ label: '', url: '' }] }]);
  };

  const handleAddEpisode = (seasonIndex: number) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes.push({ label: '', url: '' });
    setSeasons(updatedSeasons);
  };

  const handleSeasonChange = (seasonIndex: number, field: 'seasonLabel', value: string) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  const handleEpisodeChange = (seasonIndex: number, episodeIndex: number, field: 'label' | 'url', value: string) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes[episodeIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  const handleDeleteEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes = updatedSeasons[seasonIndex].episodes.filter((_, i) => i !== episodeIndex);
    setSeasons(updatedSeasons);
  };

  const handleDeleteSeason = (seasonIndex: number) => {
    const updatedSeasons = seasons.filter((_, i) => i !== seasonIndex);
    setSeasons(updatedSeasons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !id) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('/api/add-tvseries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          id: parseInt(id),
          type: 'tv',
          seasons,
          year: selectedYear,
        }),
      });

      const data = await response.json();
      if (data.message === 'TV series added successfully') {
        alert('TV series added successfully');
        setTitle('');
        setId('');
        setSeasons([{ seasonLabel: '', episodes: [{ label: '', url: '' }] }]);
      } else {
        alert('Failed to add TV series');
      }
    } catch (error) {
      console.error('Error adding TV series:', error);
      alert('An error occurred while adding the TV series.');
    }
  };

  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded text-black dark:text-white mb-8 border border-gray-300 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Add TV Series</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ID"
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          />
        </div>

        {seasons.map((season, seasonIndex) => (
          <div key={seasonIndex} className="mb-4 p-4 bg-gray-300 dark:bg-gray-700 rounded">
            <div className="flex justify-between items-center">
              <div className="w-3/4">
                <label className="block mb-1">Season Label:</label>
                <input
                  type="text"
                  value={season.seasonLabel}
                  onChange={(e) => handleSeasonChange(seasonIndex, 'seasonLabel', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSeason(seasonIndex)}
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
              >
                DELETE
              </button>
            </div>

            {season.episodes.map((episode, episodeIndex) => (
              <div key={episodeIndex} className="flex items-center space-x-4 mt-2">
                <div className="w-1/3">
                  <label className="block mb-1">Episode Label:</label>
                  <input
                    type="text"
                    value={episode.label}
                    onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'label', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded"
                  />
                </div>

                <div className="w-2/3">
                  <label className="block mb-1">Episode URL:</label>
                  <input
                    type="text"
                    value={episode.url}
                    onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'url', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteEpisode(seasonIndex, episodeIndex)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
                >
                  DELETE
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleAddEpisode(seasonIndex)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              ADD EPISODE
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center space-x-4">
          <button
            type="button"
            onClick={handleAddSeason}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            ADD NEW SEASON
          </button>

          <button type="submit" className="flex-1 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-green-500/50">
            SAVE TV SERIES
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTvSeries;
