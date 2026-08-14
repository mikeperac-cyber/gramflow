import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Bell, ShieldAlert, Trash2, LogOut, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { accountName, setAccountName, darkMode, toggleDark, resetAll, showToast } = useApp();
  const [nameInput, setNameInput] = useState(accountName || '');
  const [saved, setSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSaveAccount = () => {
    const handle = nameInput.trim().replace(/^@/, '');
    if (handle) {
      setAccountName(handle);
      setSaved(true);
      showToast('Account name updated successfully!');
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    resetAll();
    setShowConfirmReset(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and app preferences.</p>
      </div>

      {/* Account Settings */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instagram Account</h2>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 max-w-md">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Connected Handle</label>
              <div className="flex items-center">
                <span className="bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl px-3 py-2.5 text-sm text-gray-500 font-medium">
                  @
                </span>
                <input
                  type="text"
                  className="input rounded-l-none"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleSaveAccount}
              disabled={nameInput === accountName || !nameInput.trim()}
              className="btn-primary py-2.5 px-6 flex items-center justify-center gap-2 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : 'Save'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">This is a mock app. Changing this handle only updates the UI display name.</p>
        </div>

        {/* Preferences */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                {darkMode ? <Moon className="w-5 h-5 text-gray-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'toggle-active' : 'toggle-inactive'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts for scheduled posts</p>
              </div>
            </div>
            <button className="w-11 h-6 rounded-full transition-colors relative toggle-active">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-5" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-5">
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> Danger Zone
          </h2>
          
          <div className="border border-red-100 dark:border-red-900/50 rounded-xl p-4 bg-red-50/50 dark:bg-red-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Reset Application Data</p>
              <p className="text-xs text-gray-500 mt-1">This will delete all your local posts, drafts, custom rules, and reset the account. This action cannot be undone.</p>
            </div>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="btn-secondary !bg-white dark:!bg-gray-900 !text-red-600 border border-red-200 dark:border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900/30 shrink-0 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              This will permanently delete all your mock data from your browser's local storage and return GramFlow to its default state.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmReset(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleReset} className="btn-primary !bg-red-600 !from-red-600 !to-red-700 flex-1">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { AlertCircle } from 'lucide-react'; // needed for modal
