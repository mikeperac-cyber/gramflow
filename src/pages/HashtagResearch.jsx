import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Hash, Copy, TrendingUp, ChevronRight, Plus, Check } from 'lucide-react';
import { hashtagCategories, trendingHashtags } from '../data/mockHashtags';

export default function HashtagResearch() {
  const { hashtagSets, setHashtagSets, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Food');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Hashtags copied to clipboard! 📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCompColor = (comp) => {
    if (comp === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (comp === 'medium') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hashtag Research</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover trending tags and manage your collections.</p>
      </div>

      {/* Search */}
      <div className="card p-2 max-w-2xl flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="flex-1 bg-transparent text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
          placeholder="Search for a hashtag (e.g. #marketing)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-primary">Analyze</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Trending */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gram-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Trending Now</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trendingHashtags.map(t => (
                <div key={t.tag} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-gram-600 transition-colors">{t.tag}</span>
                    <span className="text-lg">{t.emoji}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{t.posts} posts</span>
                    <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">{t.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Browse by Category</h3>
            </div>
            <div className="flex flex-col sm:flex-row">
              {/* Category list */}
              <div className="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                {Object.keys(hashtagCategories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-white dark:bg-gray-900 text-gram-600 dark:text-gram-400 border-l-2 border-gram-500'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{hashtagCategories[cat].emoji}</span>
                      {cat}
                    </div>
                    {activeCategory === cat && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              {/* Tags table */}
              <div className="flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="py-2 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Hashtag</th>
                      <th className="py-2 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Posts</th>
                      <th className="py-2 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Competition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {hashtagCategories[activeCategory].tags.map(t => (
                      <tr key={t.tag} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                        <td className="py-2 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{t.tag}</td>
                        <td className="py-2 px-4 text-xs text-gray-500">{t.posts}</td>
                        <td className="py-2 px-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getCompColor(t.competition)}`}>
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

        {/* Right side: Saved Sets */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-gram-500" /> Your Sets
              </h3>
              <button className="text-gram-500 hover:text-gram-700 bg-gram-50 dark:bg-gram-900/30 p-1 rounded-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {hashtagSets.map(set => (
                <div key={set.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{set.name}</span>
                    <button
                      onClick={() => handleCopy(set.tags.join(' '), set.id)}
                      className="text-gray-400 hover:text-gram-500 transition-colors p-1"
                      title="Copy to clipboard"
                    >
                      {copiedId === set.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {set.tags.join(' ')}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 mt-2 uppercase tracking-wide">
                    {set.tags.length} tags
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
