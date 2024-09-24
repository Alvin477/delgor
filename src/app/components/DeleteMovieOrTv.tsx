// src/components/DeleteMovieOrTv.tsx
'use client';

interface DeleteMovieOrTvProps {
  title: string;
  onDelete: () => void;
}

const DeleteMovieOrTv: React.FC<DeleteMovieOrTvProps> = ({ title, onDelete }) => {
  return (
    <div>
      <h2 className="text-xl">Delete {title}</h2>
      <button onClick={onDelete} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Confirm Delete
      </button>
    </div>
  );
};

export default DeleteMovieOrTv;
