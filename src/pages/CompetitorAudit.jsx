import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp, Users, BarChart2, Plus, Trash2, ShieldAlert,
  ArrowUpRight, Award, Zap, CheckCircle2, X, Target, Lightbulb
} from 'lucide-react';
import { benchmarkMetrics } from '../data/mockCompetitors';

export default function CompetitorAudit() {
  const { competitors, addCompetitor, removeCompetitor, accountName, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [handle, setHandle] = useState('');
  const [compName, setCompName] = useState('');
  const [category, setCategory] = useState('Lifestyle');
  const [followers, setFollowers] = useState('15000');

  const handleAddCompetitor = (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    const cleanHandle = handle.trim().replace(/^@/, '');
    const numFollowers = Number(followers) || 10000;

    const newComp = {
      id: `comp-${Date.now()}`,
      handle: cleanHandle,
      name: compName.trim() || cleanHandle,
      category,
      followers: numFollowers,
      followerGrowth: '+5.4%',
      engagementRate: 4.2,
      postsPerWeek: 3.5,
      topFormat: 'Reels (60%)',
      avatar: '🎯',
      color: 'from-pink-500 to-rose-600',
      strengths: ['High Video Retention', 'Consistent Posting Cadence'],
      weaknesses: ['Low Story Interactivity'],
      recentPosts: [
        { id: `rp-${Date.now()}`, title: 'Latest showcase drop', likes: 780, comments: 45, format: 'Reel' }
      ]
    };

    addCompetitor(newComp);
    showToast(`Added @${cleanHandle} to benchmark tracker! 🎯`);
    setShowAddModal(false);
    setHandle('');
    setCompName('');
    setFollowers('15000');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Target className="w-6 h-6 text-pink-500" />
            <span>Competitor Strategy & Benchmarking</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare follower velocity, posting cadence, and top-performing formats across your niche.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs !py-2.5 !px-4 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Track Competitor</span>
        </button>
      </div>

      {/* Benchmark Matrix Table */}
      <div className="card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Industry Benchmark Index
            </h3>
            <p className="text-xs text-slate-400">
              How @{accountName || 'your_brand'} compares to niche benchmarks
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
            📊 Strategic Insights
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Key Performance Metric</th>
                <th className="pb-3 text-pink-600 dark:text-pink-400 font-extrabold">Your Brand</th>
                <th className="pb-3 text-slate-500">Industry Median</th>
                <th className="pb-3 text-slate-500">Top 10% Leaders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {benchmarkMetrics.map((bm, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">{bm.metric}</td>
                  <td className="py-3.5 font-extrabold text-pink-600 dark:text-pink-400">{bm.yourBrand}</td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-400">{bm.industryAvg}</td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-400 font-semibold">{bm.leader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracked Competitor Profiles */}
      {competitors.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 flex items-center justify-center mx-auto shadow-sm">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            No competitors tracked yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Add competitor accounts in your niche to benchmark follower growth, posting rhythm, and top content formats.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs !py-2.5 mx-auto"
          >
            <Plus className="w-4 h-4" /> Add Your First Competitor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.map((comp) => (
            <div key={comp.id} className="card p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${comp.color} flex items-center justify-center text-2xl shadow-sm text-white`}>
                      {comp.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {comp.name}
                      </h4>
                      <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold">
                        @{comp.handle} · <span className="text-slate-400">{comp.category}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeCompetitor(comp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove from tracking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Metric Highlights */}
                <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Followers</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {comp.followers.toLocaleString()}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600">{comp.followerGrowth}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Eng. Rate</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {comp.engagementRate}%
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400">Per Drop</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cadence</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {comp.postsPerWeek}/wk
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400">Weekly</span>
                  </div>
                </div>

                {/* Strengths & Content Format */}
                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                      Top Reach Driver:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 bg-pink-50/50 dark:bg-pink-950/30 p-2 rounded-lg border border-pink-200/40 dark:border-pink-800/40">
                      🏆 {comp.topFormat}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1">
                      Strategic Advantages:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.strengths?.map((s, idx) => (
                        <span key={idx} className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strategic Insights & Growth Playbook */}
      <div className="card p-6 border-l-4 border-l-pink-500 shadow-sm space-y-3 bg-gradient-to-r from-pink-500/5 to-transparent">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            AI Content Gap Recommendations
          </h3>
        </div>
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-pink-500 font-bold">•</span>
            <span><strong>Double Down on Carousel Educational Posts:</strong> Niche leaders generate 54% of bookmarks through 5-slide carousels. Schedule 2 educational guides this week.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 font-bold">•</span>
            <span><strong>Exploit Fast Response Velocity:</strong> Use GramFlow's automated comment triggers to convert leads and answer shipping inquiries in under 5 minutes.</span>
          </li>
        </ul>
      </div>

      {/* Modal: Track New Competitor */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="card max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg ig-gradient text-white flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Track Instagram Competitor
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompetitor} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Competitor Handle
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl px-3 py-2.5 text-xs text-slate-500 font-bold">
                    @
                  </span>
                  <input
                    className="input rounded-l-none text-xs"
                    placeholder="e.g. competitor_brand"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Brand Name / Label
                </label>
                <input
                  className="input text-xs"
                  placeholder="e.g. Competitor Studio"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    className="input text-xs"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fashion">Fashion</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Food & Cafe">Cafe & Food</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Tech & B2B">Tech & B2B</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Follower Count
                  </label>
                  <input
                    type="number"
                    className="input text-xs"
                    placeholder="15000"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-xs"
                >
                  Track Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
