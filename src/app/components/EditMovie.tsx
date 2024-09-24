'use client';

import { useState, useEffect } from 'react';

interface EditMovieProps {
  selectedYear: string;
}

const EditMovie: React.FC<EditMovieProps> = ({ selectedYear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieData, setMovieData] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [editedMovie, setEditedMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState<string | null>(null); // Add an error state

  useEffect(() => {
    // Fetch movie data from the selected year JSON file
    const fetchMovies = async () => {
      setLoading(true);
      setError(null); // Reset error on each fetch
      try {
        const response = await fetch(`/json/${selectedYear}/movie.json`);
        if (!response.ok) {
          throw new Error(`JSON file for year ${selectedYear} not found or cannot be fetched`);
        }
        const data = await response.json();
        setMovieData(data);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(`Failed to load movies for year ${selectedYear}. Please check if the file exists.`);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedYear]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const results = movieData.filter((movie) =>
      movie.title.toLowerCase().includes(term)
    );
    setFilteredMovies(results);
  };

  const handleMovieSelect = (movie: any) => {
    if (editedMovie && editedMovie.id === movie.id) {
      // Toggle edit mode if the same movie is clicked again
      setEditedMovie(null);
    } else {
      setEditedMovie(movie); // Initialize the movie to be edited
    }
  };

  const handleSaveChanges = async () => {
    if (!editedMovie) return;

    try {
      const response = await fetch('/api/edit-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editedMovie.id,
          updatedMovie: editedMovie,
          year: selectedYear,
        }),
      });

      const data = await response.json();
      if (data.message === 'Movie updated successfully') {
        alert('Movie updated successfully');
        setEditedMovie(null); // Close the edit panel after saving
      } else {
        alert('Failed to update movie');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('An error occurred while updating the movie.');
    }
  };

  const handleDeleteMovie = async (id: number) => {
    try {
      const response = await fetch('/api/delete-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, year: selectedYear }),
      });

      const data = await response.json();
      if (data.message === 'Movie deleted successfully') {
        setFilteredMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
        alert('Movie deleted successfully');
        setEditedMovie(null); // Close the edit panel after deleting
      } else {
        alert('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('An error occurred while deleting the movie.');
    }
  };

  const handleDownloadChange = (index: number, field: string, value: string) => {
    if (!editedMovie) return;

    const updatedDownloads = [...editedMovie.downloads];
    updatedDownloads[index][field] = value;

    setEditedMovie({
      ...editedMovie,
      downloads: updatedDownloads,
    });
  };

  const handleDeleteDownload = (index: number) => {
    if (!editedMovie) return;

    const updatedDownloads = editedMovie.downloads.filter((_: any, i: number) => i !== index);

    setEditedMovie({
      ...editedMovie,
      downloads: updatedDownloads,
    });
  };

  const handleAddNewDownload = () => {
    if (!editedMovie) return;

    const newDownload = { label: '', url: '' };
    setEditedMovie({
      ...editedMovie,
      downloads: [...editedMovie.downloads, newDownload],
    });
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading movie data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="text-black dark:text-white w-full">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={handleSearch}
        className="px-4 py-2 mb-4 w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded"
      />

      {/* Movie List */}
      {filteredMovies.map((movie) => (
        <div key={movie.id}>
          <div
            className={`mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer ${editedMovie?.id === movie.id ? 'bg-blue-300' : ''}`}
            onClick={() => handleMovieSelect(movie)} // Select a movie to edit
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{movie.title}</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onClick
                  handleDeleteMovie(movie.id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
              >
                DELETE MOVIE
              </button>
            </div>
            <p>ID: {movie.id}</p>
          </div>

          {/* Movie Edit Section */}
          {editedMovie?.id === movie.id && (
            <div className="p-6 bg-gray-200 dark:bg-gray-900 rounded mb-6 shadow-lg border border-red-500">
              <h2 className="text-xl font-bold mb-2 text-red-500">{editedMovie.title}</h2>
              <p>ID: {editedMovie.id}</p>

              {/* Downloads Section */}
              {editedMovie.downloads.map((download: any, index: number) => (
                <div key={index} className="mb-2 flex items-center space-x-4">
                  <div className="w-1/3">
                    <label className="block mb-1">Label:</label>
                    <input
                      type="text"
                      value={editedMovie.downloads[index]?.label}
                      onChange={(e) =>
                        handleDownloadChange(index, 'label', e.target.value)
                      }
                      className="w-full px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded"
                    />
                  </div>

                  <div className="w-2/3">
                    <label className="block mb-1">URL:</label>
                    <input
                      type="text"
                      value={editedMovie.downloads[index]?.url}
                      onChange={(e) =>
                        handleDownloadChange(index, 'url', e.target.value)
                      }
                      className="w-full px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteDownload(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
                  >
                    DELETE
                  </button>
                </div>
              ))}

              {/* Add New Download Button */}
              <button
                onClick={handleAddNewDownload}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/50"
              >
                ADD NEW DOWNLOAD
              </button>

              {/* Save Changes Button */}
              <button
                onClick={handleSaveChanges}
                className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-green-500/50"
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

export default EditMovie;
