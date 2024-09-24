'use client';
import { motion } from 'framer-motion';

interface ActionTabsProps {
  activeAction: string;
  setActiveAction: (action: string) => void;
}

const ActionTabs: React.FC<ActionTabsProps> = ({ activeAction, setActiveAction }) => {
  return (
    <div className="flex justify-center space-x-4 mb-4 w-full px-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveAction('edit')}
        className={`px-16 py-2 w-2/5 rounded-lg cursor-pointer backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border text-center ${activeAction === 'edit' ? 'bg-red-400/20 border-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-gray-300/30 dark:bg-gray-700/30 text-black dark:text-white'}`}
      >
        Edit
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveAction('add')}
        className={`px-16 py-2 w-2/5 rounded-lg cursor-pointer backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border text-center ${activeAction === 'add' ? 'bg-red-400/20 border-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-gray-300/30 dark:bg-gray-700/30 text-black dark:text-white'}`}
      >
        Add
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveAction('check')}
        className={`px-16 py-2 w-2/5 rounded-lg cursor-pointer backdrop-filter backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 border text-center ${activeAction === 'check' ? 'bg-red-400/20 border-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-gray-300/30 dark:bg-gray-700/30 text-black dark:text-white'}`}
      >
        Check
      </motion.div>
    </div>
  );
};

export default ActionTabs;
