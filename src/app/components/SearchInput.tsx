// src/app/components/SearchInput.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SearchInput: React.FC<{ locale: string }> = ({ locale }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Debounce effect to delay search trigger
  useEffect(() => {
    const handleSearch = async () => {
      if (query.length >= 3) {
        router.push(`/${locale}/search?query=${encodeURIComponent(query.trim())}`);
      }
    };

    const debounce = setTimeout(() => {
      handleSearch();
    }, 300); // Delay of 300ms

    return () => clearTimeout(debounce); // Clear timeout on cleanup
  }, [query, locale, router]);

  return (
    <div className="mb-6 flex justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies or TV series..."
        className="w-[90%] lg:w-[70%] px-4 py-2 rounded-lg border-2 border-red-600 focus:outline-none text-black dark:text-white dark:bg-gray-800"
      />
    </div>
  );
};

export default SearchInput;
