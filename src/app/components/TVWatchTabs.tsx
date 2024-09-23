"use client";

import React, { useState } from 'react';
import EpisodesTab from '@/app/components/EpisodesTabs'; // Ensure the correct import path
import RelatedTVShows from '@/app/components/RelatedTVShows'; // Ensure the correct import path
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TVWatchTabsProps {
  tvShowId: number;
  seasons: Array<{ season_number: number }> | [];  // Ensure that seasons is either an array or empty
}

interface EpisodesTabProps {
  // ... existing properties ...
  selectedSeason: number;
  // ... other properties ...
}

export default function TVWatchTabs({ tvShowId, seasons }: TVWatchTabsProps) {
  const [activeTab, setActiveTab] = useState<'episodes' | 'related'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(seasons.length > 0 ? seasons[0].season_number : 1); // Manage selected season

  const t = useTranslations('TVWatchTabs'); // Translations

  // Handle season selection change
  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
  };

  return (
    <div className="my-8">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`text-lg font-bold transition-colors duration-300 ${
            activeTab === 'episodes'
              ? 'text-black dark:text-white border-b-2 border-red-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('episodes')}
        >
          {t('episodes')} {/* Translated Episodes */}
        </button>
        <button
          className={`text-lg font-bold transition-colors duration-300 ${
            activeTab === 'related'
              ? 'text-black dark:text-white border-b-2 border-red-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('related')}
        >
          {t('relatedTVShows')} {/* Translated Related TV Shows */}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'episodes' && (
          <motion.div
            key="episodes"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <EpisodesTab 
              tvShowId={tvShowId} 
              seasons={seasons ? seasons.map(s => s.season_number) : []} 
              selectedSeason={selectedSeason} 
              onSeasonChange={handleSeasonChange} 
            />
          </motion.div>
        )}
        {activeTab === 'related' && (
          <motion.div
            key="related"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <RelatedTVShows tvShowId={tvShowId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
