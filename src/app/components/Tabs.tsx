'use client';
import { useState } from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center space-x-4 mb-4 w-full">
      <div
        onClick={() => setActiveTab('movie')}
        className={`px-16 py-2 w-2/5 rounded-lg cursor-pointer backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border text-center ${activeTab === 'movie' ? 'bg-red-400/20 border-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-gray-300/30 dark:bg-gray-700/30 text-black dark:text-white'}`}
      >
        Movie
      </div>
      <div
        onClick={() => setActiveTab('tv')}
        className={`px-16 py-2 w-2/5 rounded-lg cursor-pointer backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border text-center ${activeTab === 'tv' ? 'bg-red-400/20 border-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-gray-300/30 dark:bg-gray-700/30 text-black dark:text-white'}`}
      >
        TV Series
      </div>
    </div>
  );
};

export default Tabs;
