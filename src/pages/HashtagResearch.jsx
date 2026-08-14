import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, Hash, Copy, TrendingUp, ChevronRight, Plus, Check,
  Trash2, X, Sparkles, FolderPlus
} from 'lucide-react';
import { hashtagCategories, trendingHashtags } from '../data/mockHashtags';

export default function HashtagResearch() {
  const { hashtagSets, setHashtagSets, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Business');
  const [copiedId, setCopiedId] = useState(null);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetTags, setNewSetTags] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Hashtags copied to clipboard! 📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSet = (e) => {
    e.preventDefault();
    if (!newSetName.trim() || !newSetTags.trim()) {
      showToast('Please provide a set name and tags', 'error');
      return;
    }

    const tagsArray = newSetTags
      .split(/[\s,]+/)
      .map(t => t.startsWith('#') ? t : `#${t}`)
      .filter(t => t.length > 1);

    const newSet = {
      id: `set-${Date.now()}`,
      name: newSetName.trim(),
      tags: tagsArray,
    };

    setHashtagSets(prev => [newSet, ...prev]);
    showToast(`Saved "${newSet.name}" collection! 🏷️`);
    setShowAddSetModal(false);
    setNewSetName('');
    setNewSetTags('');
  };

  const handleDeleteSet = (id) => {
    setHashtagSets(prev => prev.filter(s => s.id !== id));
    showToast('Hashtag group removed', 'info');
  };

  const filteredTrending = useMemo(() => {
    if (!search.trim()) return trendingHashtags;
    return trendingHashtags.filter(t =>
      t.tag.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const getCompBadge = (comp) => {
    if (comp === 'high') return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    if (comp === 'medium') return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hashtag Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Research high-reach niche hashtags and bundle them into 1-click clipboard sets.
          </p>
        </div>

        <button
          onClick={() => setShowAddSetModal(true)}
          className="btn-primary text-xs !py-2.5 !px-4 shadow-sm self-start sm:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Hashtag Group</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-2 flex items-center gap-2 max-w-2xl shadow-sm">
        <div className="w-10 h-10 flex items-center justify-center shrink-0 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
          placeholder="Filter trending topics or search keywords (e.g. #marketing, #creator)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Trending & Category Browser (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trending Now */}
          <div className="card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Trending Momentum Tags
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                High Velocity
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredTrending.map((t) => (
                <div
                  key={t.tag}
                  onClick={() => handleCopy(t.tag, t.tag)}
                  className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 hover:border-pink-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-pink-600 truncate">
                      {t.tag}
                    </span>
                    <span className="text-base">{t.emoji}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">{t.posts}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {copiedId === t.tag ? 'Copied!' : t.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Directory */}
          <div className="card overflow-hidden shadow-sm">
            <div className="border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Niche Taxonomy Directory
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row">
              {/* Category tabs */}
              <div className="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                {Object.keys(hashtagCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-all ${
                      activeCategory === cat
                        ? 'bg-white dark:bg-[#111726] text-pink-600 dark:text-pink-400 border-l-3 border-pink-500 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{hashtagCategories[cat].emoji}</span>
                      <span>{cat}</span>
                    </span>
                    {activeCategory === cat && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* Tag Details */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Hashtag</th>
                      <th className="py-2.5 px-4">Volume</th>
                      <th className="py-2.5 px-4">Competition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {hashtagCategories[activeCategory].tags.map((t) => (
                      <tr
                        key={t.tag}
                        onClick={() => handleCopy(t.tag, t.tag)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t.tag}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-slate-500 font-medium">
                          {t.posts}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCompBadge(t.competition)}`}>
                            {t.competition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Saved Groups (1 col) */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Hash className="w-4 h-4 text-pink-500" />
                <span>Saved Groups</span>
              </h3>
              <button
                onClick={() => setShowAddSetModal(true)}
                className="p-1.5 rounded-lg text-pink-600 bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 transition-colors"
                title="Add group"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {hashtagSets.map((set) => (
                <div
                  key={set.id}
                  className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {set.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(set.tags.join(' '), set.id)}
                        className="p-1.5 text-slate-400 hover:text-pink-600 transition-colors"
                        title="Copy all tags"
                      >
                        {copiedId === set.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteSet(set.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {set.tags.join(' ')}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{set.tags.length} tags bundled</span>
                    <button
                      onClick={() => handleCopy(set.tags.join(' '), set.id)}
                      className="text-pink-600 dark:text-pink-400 hover:underline"
                    >
                      Copy All
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Hashtag Group */}
      {showAddSetModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddSetModal(false)}
        >
          <div
            className="card max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg ig-gradient text-white flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  New Hashtag Bundle
                </h3>
              </div>
              <button
                onClick={() => setShowAddSetModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSet} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Group Name
                </label>
                <input
                  className="input"
                  placeholder="e.g. Summer Promo Set"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Hashtags (separated by space or commas)
                </label>
                <textarea
                  className="input resize-none"
                  rows={4}
                  placeholder="#summer #sale #smallbiz #deals #shoplocal"
                  value={newSetTags}
                  onChange={(e) => setNewSetTags(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSetModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
