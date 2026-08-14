import React, { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AccountSetupModal() {
  const { showAccountModal, setAccountName } = useApp();
  const [name, setName] = useState('');

  if (!showAccountModal) return null;

  const handle = name.trim().replace(/^@/, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="card max-w-md w-full p-8 shadow-2xl space-y-6 relative overflow-hidden border border-slate-700/50">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 ig-gradient rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome to <span className="ig-gradient-text">GramFlow</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your Instagram handle to configure your personalized command center.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Instagram Brand Handle
          </label>
          <div className="flex items-center">
            <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl px-3.5 py-3 text-sm text-slate-500 font-bold">
              @
            </span>
            <input
              className="input rounded-l-none !py-3"
              placeholder="e.g. coffee_studio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handle && setAccountName(handle)}
              autoFocus
            />
          </div>
        </div>

        <button
          onClick={() => handle && setAccountName(handle)}
          disabled={!handle}
          className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
            handle
              ? 'btn-primary !py-3'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700/40'
          }`}
        >
          Launch Command Center →
        </button>

        <p className="text-[11px] text-center text-slate-400">
          Starts clean with zero demo data. All state is securely saved locally.
        </p>
      </div>
    </div>
  );
}
