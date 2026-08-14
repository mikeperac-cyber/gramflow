import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationBell from './NotificationBell';

const pageTitles = {
  '/':            'Dashboard',
  '/calendar':    'Content Calendar',
  '/composer':    'Post Composer',
  '/analytics':   'Analytics',
  '/automations': 'Automations',
  '/hashtags':    'Hashtag Research',
  '/settings':    'Settings',
};

export default function TopNav() {
  const { darkMode, toggleDark, accountName } = useApp();
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'GramFlow';

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-6 gap-4 shrink-0">
      {/* Title */}
      <div className="flex-1">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{title}</h2>
      </div>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 w-48 lg:w-64">
        <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
        />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode
          ? <Sun  className="w-5 h-5 text-yellow-400" />
          : <Moon className="w-5 h-5 text-gray-500" />
        }
      </button>

      {/* Notifications */}
      <NotificationBell />

      {/* Avatar */}
      {accountName && (
        <div className="w-8 h-8 ig-gradient rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
          {accountName[0]?.toUpperCase()}
        </div>
      )}
    </header>
  );
}
