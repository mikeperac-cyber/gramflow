import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Moon, Sun, Bell, ShieldAlert, Trash2, CheckCircle2,
  Download, Upload, Camera, Sparkles, AlertCircle, X
} from 'lucide-react';

export default function Settings() {
  const {
    accountName, setAccountName,
    darkMode, toggleDark,
    resetAll, showToast, posts,
    quickRules, hashtagSets
  } = useApp();

  const [nameInput, setNameInput] = useState(accountName || '');
  const [saved, setSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSaveAccount = () => {
    const handle = nameInput.trim().replace(/^@/, '');
    if (handle) {
      setAccountName(handle);
      setSaved(true);
      showToast('Brand handle updated successfully! ✨');
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleExportData = () => {
    const data = {
      accountName,
      exportedAt: new Date().toISOString(),
      posts,
      quickRules,
      hashtagSets,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gramflow-backup-${formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported to JSON file! 💾');
  };

  function formatDate(d) {
    return d.toISOString().split('T')[0];
  }

  const handleReset = () => {
    resetAll();
    setShowConfirmReset(false);
    showToast('All application data cleared cleanly', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Brand Profile & Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure your connected Instagram profile, UI preferences, and local data.
        </p>
      </div>

      {/* Account Settings */}
      <div className="card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl ig-gradient text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Connected Instagram Handle
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 max-w-md">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Active Brand Handle
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl px-3.5 py-2.5 text-sm text-slate-500 font-bold">
                  @
                </span>
                <input
                  type="text"
                  className="input rounded-l-none"
                  placeholder="your_handle"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSaveAccount}
              disabled={nameInput === accountName || !nameInput.trim()}
              className="btn-primary !py-2.5 !px-5 min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : 'Save Handle'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Updating this handle updates your preview frames and mock analytics.
          </p>
        </div>

        {/* Preferences Section */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Appearance & Experience
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                {darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Dark Theme</p>
                <p className="text-xs text-slate-400">Toggle dark mode visual interface</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className={`w-12 h-6 rounded-full transition-all relative p-0.5 ${
                darkMode ? 'toggle-active' : 'toggle-inactive'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-pink-50 dark:bg-pink-950/60 rounded-xl flex items-center justify-center text-pink-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">In-App Alerts</p>
                <p className="text-xs text-slate-400">Show notification bell badges for scheduled post events</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              Enabled
            </span>
          </div>
        </div>

        {/* Data Backup & Export */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Data Management & Backup
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Download a complete JSON snapshot of all your scheduled posts, automations, and custom hashtag groups.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="btn-secondary text-xs !py-2.5 !px-4 shrink-0 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Workspace JSON
          </button>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-rose-50/30 dark:bg-rose-950/10">
          <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Danger Zone
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
              Reset and erase all local posts, drafts, custom automations, and account cache.
            </p>

            <button
              onClick={() => setShowConfirmReset(true)}
              className="btn-secondary !text-rose-600 hover:!bg-rose-50 dark:hover:!bg-rose-950/50 border-rose-200 dark:border-rose-900/50 shrink-0 text-xs font-bold"
            >
              <Trash2 className="w-4 h-4" /> Reset All Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white">
              Erase all application data?
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
              This will clear your localStorage and return the app to a clean, empty state.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="btn-secondary flex-1 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="btn-primary !from-rose-600 !to-red-700 flex-1 text-xs"
              >
                Yes, Erase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
