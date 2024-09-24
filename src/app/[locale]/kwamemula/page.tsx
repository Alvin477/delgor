'use client';

import { useState, useEffect } from 'react';
import Tabs from '@/app/components/Tabs';
import ActionTabs from '@/app/components/ActionTabs';
import EditMovie from '@/app/components/EditMovie';
import EditTvSeries from '@/app/components/EditTvSeries';
import AddMovie from '@/app/components/AddMovie'; 
import AddTvSeries from '@/app/components/AddTvSeries'; 
import CheckMovie from '@/app/components/CheckMovie'; 
import CheckTvSeries from '@/app/components/CheckTvSeries'; 
import PasskeyForm from '@/app/components/PasskeyForm'; // Import the PasskeyForm component

const KwamemulaPage = () => {
  const [activeTab, setActiveTab] = useState('movie'); // Default to Movie tab
  const [activeAction, setActiveAction] = useState('edit'); // Default to Edit action
  const [selectedYear, setSelectedYear] = useState('2024'); // Default to 2024
  const [isPasskeyValid, setIsPasskeyValid] = useState(false); // State to track if passkey is validated
  const [loading, setLoading] = useState(false); // Loading state for passkey validation
  const [error, setError] = useState<string | null>(null); // Track validation errors

  // Check localStorage for the passkey validity on component mount
  useEffect(() => {
    const passkeyValid = localStorage.getItem('passkeyValid');
    if (passkeyValid === 'true') {
      setIsPasskeyValid(true); // If passkey is valid, set the state to skip validation
    }
  }, []);

  // Handle passkey submission
  const handlePasskeySubmit = async (passkey: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/validate-passkey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passkey }),
      });

      const data = await response.json();
      if (data.isValid) {
        setIsPasskeyValid(true); // Mark passkey as valid
        localStorage.setItem('passkeyValid', 'true'); // Store the validation in localStorage
      } else {
        setError('Invalid passkey, please try again.');
      }
    } catch (error) {
      setError('An error occurred while validating the passkey.');
      console.error('Passkey validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render PasskeyForm if passkey isn't validated yet
  if (!isPasskeyValid) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col items-center justify-center">
        <PasskeyForm onSubmit={handlePasskeySubmit} loading={loading} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  // Main content of the page (shown only if passkey is valid)
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-300 py-8">
      <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-8">
        Welcome Alvin, Hard Work Pays Keep It Up
      </h1>

      {/* Tabs and Year Selection Side by Side */}
      <div className="flex justify-center mb-4">
        <div className="flex w-3/4 items-center justify-between space-x-4">
          <div className="flex-grow">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="flex-shrink-0">
            <select
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded border border-gray-300 dark:border-gray-600"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              {/* Add more years as needed */}
            </select>
          </div>
        </div>
      </div>

      {/* Action Tabs for Edit, Add, and Check */}
      <div className="flex justify-center mb-8">
        <ActionTabs activeAction={activeAction} setActiveAction={setActiveAction} />
      </div>

      {/* Conditional Rendering Based on Active Tab and Action */}
      <div className="px-6">
        {activeTab === 'movie' && (
          <>
            {activeAction === 'edit' && <EditMovie selectedYear={selectedYear} />}
            {activeAction === 'add' && <AddMovie selectedYear={selectedYear} />} 
            {activeAction === 'check' && <CheckMovie selectedYear={selectedYear} />}
          </>
        )}

        {activeTab === 'tv' && (
          <>
            {activeAction === 'edit' && <EditTvSeries selectedYear={selectedYear} />}
            {activeAction === 'add' && <AddTvSeries selectedYear={selectedYear} />} 
            {activeAction === 'check' && <CheckTvSeries selectedYear={selectedYear} />}
          </>
        )}
      </div>
    </div>
  );
};

export default KwamemulaPage;
