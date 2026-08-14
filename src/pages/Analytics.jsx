import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Users, Eye, BarChart2, MousePointerClick, Calendar, ArrowUpRight,
  TrendingUp, Sparkles, Plus
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../utils/formatters';
import {
  generateFollowerGrowth, generateEngagementData, generateHeatmapData,
  calculateKPIs, generateTopPosts
} from '../data/mockAnalytics';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const { posts } = useApp();
  const navigate = useNavigate();
  const [range, setRange] = useState(30);

  const kpis = useMemo(() => calculateKPIs(posts), [posts]);
  const followerData = useMemo(() => generateFollowerGrowth(range, posts.length), [range, posts.length]);
  const engagementData = useMemo(() => generateEngagementData(posts), [posts]);
  const heatmapData = useMemo(() => generateHeatmapData(), []);
  const topPosts = useMemo(() => generateTopPosts(posts), [posts]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-white text-xs space-y-1">
          <p className="font-bold text-slate-300 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics and engagement metrics from your published content.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 p-1 rounded-xl shadow-sm self-start sm:self-auto">
          {[
            { label: 'Last 7 Days',  value: 7  },
            { label: 'Last 30 Days', value: 30 },
            { label: 'Last 90 Days', value: 90 },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                range === r.value
                  ? 'ig-gradient text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={kpis.followers.label}
          value={kpis.followers.value}
          change={kpis.followers.change}
          icon={Users}
          iconBg="bg-gradient-to-br from-purple-500 to-indigo-600"
        />
        <StatCard
          label={kpis.reach.label}
          value={kpis.reach.value}
          change={kpis.reach.change}
          icon={Eye}
          iconBg="bg-gradient-to-br from-pink-500 to-rose-600"
        />
        <StatCard
          label={kpis.scheduledCount.label}
          value={`${kpis.scheduledCount.value} in queue`}
          change={kpis.scheduledCount.change}
          icon={BarChart2}
          iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          label={kpis.engagementRate.label}
          value={kpis.engagementRate.value}
          change={kpis.engagementRate.change}
          suffix="%"
          icon={MousePointerClick}
          iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Trajectory */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Audience Growth</h3>
              <p className="text-xs text-slate-400">Total follower trend over selected duration</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              +4.8% pace
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickMargin={10} minTickGap={25} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => formatNumber(val)} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="followers"
                  name="Followers"
                  stroke="#E1306C"
                  strokeWidth={3.5}
                  dot={false}
                  activeDot={{ r: 6, fill: '#833AB4', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement by Post */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Content Engagement Rate</h3>
              <p className="text-xs text-slate-400">Average interactions per drop</p>
            </div>
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950 px-2.5 py-1 rounded-full">
              4.6% Avg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="engagement" name="Engagement Rate %" radius={[6, 6, 0, 0]}>
                  {engagementData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? '#E1306C' : '#833AB4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap & Ranked Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="card p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Best Time to Post</h3>
              <Calendar className="w-4 h-4 text-pink-500" />
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Target peak interaction windows (12 PM & 7-9 PM) for maximum reach.
            </p>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-8 gap-1 pt-2">
            <div className="text-[10px] text-slate-400"></div>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-400 text-center py-0.5">{d}</div>
            ))}

            {Array.from({ length: 8 }).map((_, r) => {
              const h = r * 3; // Every 3 hours
              return (
                <React.Fragment key={r}>
                  <div className="text-[10px] font-semibold text-slate-400 text-right pr-1 flex items-center justify-end">
                    {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
                  </div>
                  {Array.from({ length: 7 }).map((_, c) => {
                    const cell = heatmapData.find(d => d.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][c] && d.hour === h);
                    const val = cell?.value || 20;
                    const opacity = Math.max(0.12, val / 100);

                    return (
                      <div
                        key={`${r}-${c}`}
                        className="aspect-square rounded bg-pink-600 transition-all hover:scale-125 cursor-pointer"
                        style={{ opacity }}
                        title={`${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][c]} at ${h}:00 - Score: ${val}`}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Low Activity</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded bg-pink-600 opacity-20" />
              <span className="w-3 h-3 rounded bg-pink-600 opacity-50" />
              <span className="w-3 h-3 rounded bg-pink-600 opacity-90" />
            </div>
            <span>Peak Activity</span>
          </div>
        </div>

        {/* Top Performing Posts Table */}
        <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Top Performing Content</h3>
            <span className="text-xs text-slate-400 font-semibold">{topPosts.length} ranked</span>
          </div>

          {topPosts.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                <BarChart2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No published performance data</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
                Rankings and individual post breakdown will appear here once your scheduled posts go live.
              </p>
              <button onClick={() => navigate('/composer')} className="btn-primary text-xs !py-2">
                <Plus className="w-3.5 h-3.5" /> Create a Post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Post Caption</th>
                    <th className="pb-3 text-right">Likes</th>
                    <th className="pb-3 text-right">Comments</th>
                    <th className="pb-3 text-right">Reach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${post.imageColor} flex items-center justify-center text-base shrink-0 shadow-sm`}>
                            {post.emoji}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-xs">
                            {post.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-xs font-bold text-slate-900 dark:text-white text-right">
                        {formatNumber(post.likes)}
                      </td>
                      <td className="py-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right">
                        {formatNumber(post.comments)}
                      </td>
                      <td className="py-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300 text-right">
                        {formatNumber(post.reach)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
