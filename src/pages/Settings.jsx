import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Moon, Sun, Bell, ShieldAlert, Trash2, CheckCircle2,
  Download, Upload, Camera, Sparkles, AlertCircle, X,
  Link as LinkIcon, User, Layers, FileText
} from 'lucide-react';

export default function Settings() {
  const {
    accountName, setAccountName,
    profileBio, setProfileBio,
    websiteUrl, setWebsiteUrl,
    profileAvatar, setProfileAvatar,
    followerBaseline, setFollowerBaseline,
    darkMode, toggleDark,
    resetAll, showToast, posts,
    quickRules, hashtagSets,
    conversations, competitors,
    addPost, setQuickRules, setHashtagSets,
    setConversations, setCompetitors
  } = useApp();

  const fileImportRef = useRef(null);

  const [nameInput, setNameInput] = useState(accountName || '');
  const [bioInput, setBioInput] = useState(profileBio || '');
  const [websiteInput, setWebsiteInput] = useState(websiteUrl || '');
  const [avatarInput, setAvatarInput] = useState(profileAvatar || '✨');
  const [followerInput, setFollowerInput] = useState(followerBaseline?.toString() || '0');

  const [saved, setSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSaveAll = (e) => {
    e.preventDefault();
    const handle = nameInput.trim().replace(/^@/, '');
    if (handle) setAccountName(handle);
    setProfileBio(bioInput);
    setWebsiteUrl(websiteInput);
    setProfileAvatar(avatarInput);
    setFollowerBaseline(followerInput);

    setSaved(true);
    showToast('Brand settings & profile updated! ✨');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      accountName,
      profileBio,
      websiteUrl,
      profileAvatar,
      followerBaseline,
      exportedAt: new Date().toISOString(),
      posts,
      quickRules,
      hashtagSets,
      conversations,
      competitors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gramflow-workspace-${formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace exported to JSON! 💾');
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.accountName) setAccountName(parsed.accountName);
        if (parsed.profileBio) setProfileBio(parsed.profileBio);
        if (parsed.websiteUrl) setWebsiteUrl(parsed.websiteUrl);
        if (parsed.followerBaseline !== undefined) setFollowerBaseline(parsed.followerBaseline);
        if (Array.isArray(parsed.posts)) parsed.posts.forEach(p => addPost(p));
        if (Array.isArray(parsed.quickRules)) setQuickRules(parsed.quickRules);
        if (Array.isArray(parsed.hashtagSets)) setHashtagSets(parsed.hashtagSets);
        if (Array.isArray(parsed.conversations)) setConversations(parsed.conversations);
        if (Array.isArray(parsed.competitors)) setCompetitors(parsed.competitors);

        showToast('Workspace JSON imported successfully! 🚀');
      } catch (err) {
        showToast('Invalid JSON backup file', 'error');
      }
    };
    reader.readAsText(file);
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
          Brand Profile & System Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your brand profile, baseline analytics, and data backup controls.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Profile Customization */}
        <div className="card shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl ig-gradient text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Brand Profile Customization
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Instagram Handle
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl px-3.5 py-2.5 text-xs text-slate-500 font-bold">
                  @
                </span>
                <input
                  type="text"
                  className="input rounded-l-none text-xs"
                  placeholder="your_handle"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Profile Avatar (Emoji or Symbol)
              </label>
              <input
                type="text"
                className="input text-xs"
                placeholder="✨ or ☕ or 🌿"
                value={avatarInput}
                onChange={(e) => setAvatarInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Brand Bio (renders in Grid Planner)
            </label>
            <textarea
              className="input text-xs resize-none leading-relaxed"
              rows={3}
              placeholder="Describe what your brand creates or sells..."
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Website / Bio Link
              </label>
              <input
                type="text"
                className="input text-xs"
                placeholder="linktr.ee/mybrand"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Baseline Follower Count
              </label>
              <input
                type="number"
                className="input text-xs"
                placeholder="1250"
                value={followerInput}
                onChange={(e) => setFollowerInput(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn-primary text-xs !py-2.5 !px-6 shadow-sm"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Preferences Section */}
      <div className="card shadow-sm p-6 space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
          Interface & Visual Mode
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              {darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Dark Theme Interface</p>
              <p className="text-xs text-slate-400">Toggle dark mode styling</p>
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
      </div>

      {/* Data Backup & Import/Export */}
      <div className="card shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Workspace Backup & Portability
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Export and import your entire workspace including scheduled calendar items, custom rules, inbox leads, and competitors.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="btn-secondary text-xs !py-2.5 !px-4 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Backup JSON
          </button>

          <input
            type="file"
            ref={fileImportRef}
            onChange={handleImportData}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileImportRef.current?.click()}
            className="btn-secondary text-xs !py-2.5 !px-4 shadow-sm"
          >
            <Upload className="w-4 h-4" /> Import Backup JSON
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card shadow-sm p-6 bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/50 dark:border-rose-900/40">
        <h2 className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
            Erase all local posts, drafts, custom automations, CRM conversations, and reset to clean state.
          </p>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="btn-secondary !text-rose-600 hover:!bg-rose-50 dark:hover:!bg-rose-950/50 border-rose-200 dark:border-rose-900/50 shrink-0 text-xs font-bold"
          >
            <Trash2 className="w-4 h-4" /> Reset All Data
          </button>
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
              This will clear your local storage and return the app to a clean, empty state.
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
