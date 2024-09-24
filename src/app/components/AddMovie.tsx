'use client';

import { useState } from 'react';

interface Download {
  label: string;
  url: string;
}

interface AddMovieProps {
  selectedYear: string;
}

const AddMovie: React.FC<AddMovieProps> = ({ selectedYear }) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [downloads, setDownloads] = useState<Download[]>([{ label: '', url: '' }]);

  const handleAddDownload = () => {
    setDownloads([...downloads, { label: '', url: '' }]);
  };

  const handleDownloadChange = (index: number, field: 'label' | 'url', value: string) => {
    const updatedDownloads = [...downloads];
    updatedDownloads[index][field] = value;
    setDownloads(updatedDownloads);
  };

  const handleDeleteDownload = (index: number) => {
    const updatedDownloads = downloads.filter((_, i) => i !== index);
    setDownloads(updatedDownloads);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !id) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('/api/add-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          id: parseInt(id),
          downloads,
          year: selectedYear,
        }),
      });

      const data = await response.json();
      if (data.message === 'Movie added successfully') {
        alert('Movie added successfully');
        setTitle('');
        setId('');
        setDownloads([{ label: '', url: '' }]);
      } else {
        alert('Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('An error occurred while adding the movie.');
    }
  };

  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded text-black dark:text-white mb-8 border border-gray-300 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Add Movie</h2>
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

        {downloads.map((download, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-1/3">
              <label className="block mb-1">Label:</label>
              <input
                type="text"
                value={download.label}
                onChange={(e) => handleDownloadChange(index, 'label', e.target.value)}
                className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
              />
            </div>

            <div className="w-2/3">
              <label className="block mb-1">URL:</label>
              <input
                type="text"
                value={download.url}
                onChange={(e) => handleDownloadChange(index, 'url', e.target.value)}
                className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
              />
            </div>

            <button
              type="button"
              onClick={() => handleDeleteDownload(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
            >
              DELETE
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-blue-500/50"
        >
          ADD NEW DOWNLOAD
        </button>

        <div className="flex justify-between items-center space-x-4">
          <button
            type="button"
            onClick={handleAddDownload}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            ADD NEW DOWNLOAD
          </button>

          <button type="submit" className="flex-1 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-green-500/50">
            SAVE MOVIE
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
