import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AccountSetupModal() {
  const { showAccountModal, setAccountName } = useApp();
  const [name, setName] = useState('');

  if (!showAccountModal) return null;

  const handle = name.trim().replace(/^@/, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 ig-gradient rounded-2xl flex items-center justify-center shadow-lg">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Welcome to <span className="ig-gradient-text">GramFlow</span>
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-8">
          Your Instagram management command center. Let's get started!
        </p>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Instagram handle
        </label>
        <div className="flex items-center gap-0">
          <span className="bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl px-3 py-2.5 text-sm text-gray-500 font-medium">
            @
          </span>
          <input
            className="input rounded-l-none flex-1"
            placeholder="yourhandle"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handle && setAccountName(handle)}
            autoFocus
          />
        </div>

        <button
          onClick={() => handle && setAccountName(handle)}
          disabled={!handle}
          className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all ${
            handle ? 'ig-gradient hover:opacity-90 active:scale-95' : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400'
          }`}
        >
          Get Started →
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          This is a demo tool — no real Instagram data is connected.
        </p>
      </div>
    </div>
  );
}
