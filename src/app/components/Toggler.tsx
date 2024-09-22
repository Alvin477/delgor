"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function Toggler() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center justify-between w-20 h-10 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-all duration-500 ease-in-out shadow-lg border-2 border-red-500"
    >
      {/* Toggle Knob */}
      <div
        className={`absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${
          theme === 'dark' ? 'translate-x-10' : 'translate-x-0'
        }`}
      />

      {/* Sun Icon */}
      <div className={`z-10 absolute transition-all duration-500 ease-in-out ${
        theme === 'dark' ? 'left-2' : 'left-[6px]'
      }`}>
        <FaSun
          className={`transition-all duration-300 ${
            theme === 'light' ? 'text-red-500 opacity-100 scale-110' : 'text-gray-400 opacity-50 scale-90'
          }`}
          size={18}
        />
      </div>

      {/* Moon Icon */}
      <div className={`z-10 absolute transition-all duration-500 ease-in-out ${
        theme === 'dark' ? 'right-[6px]' : 'right-2'
      }`}>
        <FaMoon
          className={`transition-all duration-300 ${
            theme === 'dark' ? 'text-red-500 opacity-100 scale-110' : 'text-gray-400 opacity-50 scale-90'
          }`}
          size={18}
        />
      </div>
    </button>
  );
}
