'use client';

import { useState } from 'react';

interface PasskeyFormProps {
  onSubmit: (passkey: string) => void;
  loading: boolean;
}

const PasskeyForm: React.FC<PasskeyFormProps> = ({ onSubmit, loading }) => {
  const [enteredPasskey, setEnteredPasskey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasskey) {
      onSubmit(enteredPasskey); // Send the entered passkey to the parent component
    } else {
      alert('Please enter a passkey.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl text-black dark:text-white mb-4">Enter Passkey</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="password"
          value={enteredPasskey}
          onChange={(e) => setEnteredPasskey(e.target.value)}
          placeholder="Passkey"
          aria-label="Passkey"
          className="px-4 py-2 border rounded"
          disabled={loading}
        />
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={loading}>
          {loading ? 'Validating...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default PasskeyForm;
