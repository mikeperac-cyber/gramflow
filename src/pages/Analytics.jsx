import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { Users, Eye, BarChart2, MousePointerClick, Calendar, ArrowUpRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useApp } from '../context/AppContext';
import { formatNumber, formatPercent } from '../utils/formatters';
import {
  generateFollowerGrowth, generateEngagementData, generateHeatmapData,
  generateKPIs, generateTopPosts
} from '../data/mockAnalytics';

export default function Analytics() {
  const [range, setRange] = useState(30);

  // Re-generate mock data when range changes just to simulate loading/updating
  const followerData   = useMemo(() => generateFollowerGrowth(range), [range]);
  const engagementData = useMemo(() => generateEngagementData(), [range]);
  const heatmapData    = useMemo(() => generateHeatmapData(), [range]);
  const kpis           = useMemo(() => generateKPIs(range), [range]);
  const topPosts       = useMemo(() => generateTopPosts(), [range]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs text-gray-600 dark:text-gray-300">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your account performance and growth.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-start sm:self-auto">
          {[
            { label: '7D', value: 7 },
            { label: '30D', value: 30 },
            { label: '90D', value: 90 },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                range === r.value
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={kpis.followers.label}     value={kpis.followers.value}     change={kpis.followers.change}     icon={Users} />
        <StatCard label={kpis.reach.label}         value={kpis.reach.value}         change={kpis.reach.change}         icon={Eye} />
        <StatCard label={kpis.impressions.label}   value={kpis.impressions.value}   change={kpis.impressions.change}   icon={BarChart2} />
        <StatCard label={kpis.engagementRate.label}value={kpis.engagementRate.value}change={kpis.engagementRate.change}icon={MousePointerClick} suffix="%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Follower Growth */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Follower Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerData}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1306C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E1306C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickMargin={10} minTickGap={30} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(val) => formatNumber(val)} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="followers" name="Followers" stroke="#E1306C" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#833AB4', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Engagement Rate by Post</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickMargin={10} minTickGap={30} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(val) => `${val}%`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="engagement" name="Engagement Rate" radius={[4, 4, 0, 0]}>
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#405DE6' : '#833AB4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap & Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Heatmap */}
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Best Time to Post</h3>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Based on historical engagement data. Darker purple indicates higher average engagement.
          </p>
          <div className="grid grid-cols-8 gap-1">
            {/* Headers */}
            <div className="text-[9px] font-medium text-gray-400 text-center py-1"></div>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
               <div key={d} className="text-[9px] font-medium text-gray-400 text-center py-1">{d}</div>
            ))}
            {/* Grid */}
            {Array.from({ length: 12 }).map((_, r) => {
              const h = r * 2; // Show every 2 hours
              return (
                <React.Fragment key={r}>
                  <div className="text-[9px] font-medium text-gray-400 text-right pr-1 flex items-center justify-end">
                    {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h-12}p`}
                  </div>
                  {Array.from({ length: 7 }).map((_, c) => {
                    // Aggregate 2 hours
                    const v1 = heatmapData.find((d) => d.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][c] && d.hour === h)?.value || 0;
                    const v2 = heatmapData.find((d) => d.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][c] && d.hour === h + 1)?.value || 0;
                    const val = (v1 + v2) / 2;
                    // Map 0-100 to opacity
                    const opacity = Math.max(0.05, val / 100);
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="aspect-square rounded-sm bg-purple-600 transition-opacity hover:opacity-100"
                        style={{ opacity }}
                        title={`${val.toFixed(0)} avg engagement`}
                      />
                    );
                  })}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Top Posts */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Top Performing Posts</h3>
            <button className="text-xs font-medium text-gram-500 hover:text-gram-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Post</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Likes</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Comments</th>
                  <th className="pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Reach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {topPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.imageColor} flex items-center justify-center text-lg shrink-0`}>
                          {post.emoji}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">{formatNumber(post.likes)}</td>
                    <td className="py-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">{formatNumber(post.comments)}</td>
                    <td className="py-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">{formatNumber(post.reach)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
