import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isAfter, parseISO } from 'date-fns';
import {
  Users, CalendarDays, Zap, PenSquare, ArrowRight, Clock,
  Sparkles, PlusCircle, CheckCircle2, TrendingUp, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { formatNumber } from '../utils/formatters';
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { generateFollowerGrowth, calculateKPIs } from '../data/mockAnalytics';

export default function Dashboard() {
  const { posts, quickRules, notifications, accountName, followerBaseline, loadSampleData } = useApp();
  const navigate = useNavigate();

  const now = new Date();

  const scheduledPosts = useMemo(
    () => posts
      .filter((p) => p.status === 'scheduled' && isAfter(parseISO(p.scheduledAt), now))
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    [posts, now]
  );

  const drafts = useMemo(() => posts.filter((p) => p.status === 'draft'), [posts]);
  const published = useMemo(() => posts.filter((p) => p.status === 'published'), [posts]);
  const activeRulesCount = quickRules.filter((r) => r.enabled).length;

  const kpiData = useMemo(() => calculateKPIs(posts, followerBaseline), [posts, followerBaseline]);
  const followerData = useMemo(() => generateFollowerGrowth(14, posts.length, followerBaseline), [posts.length, followerBaseline]);

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl ig-gradient p-7 md:p-9 text-white shadow-[0_12px_32px_-8px_rgba(225,48,108,0.35)]">
        {/* Subtle decorative background elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-white/95">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instagram Growth Command</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back{accountName ? `, @${accountName}` : ''}! 👋
            </h1>
            <p className="text-white/85 text-sm md:text-base leading-relaxed">
              {posts.length === 0
                ? "Your workspace is ready. Schedule your upcoming posts, explore trending hashtags, and set up auto-responders."
                : `You currently have ${scheduledPosts.length} post${scheduledPosts.length === 1 ? '' : 's'} queued and ${activeRulesCount} active automation${activeRulesCount === 1 ? '' : 's'}.`
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/composer')}
              className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4 text-pink-600" />
              <span>Create New Post</span>
            </button>
            {posts.length === 0 && (
              <button
                onClick={loadSampleData}
                className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
                title="Populate 2 sample posts to test the dashboard"
              >
                <Layers className="w-4 h-4" />
                <span>Load Starter Posts</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Estimated Followers"
          value={kpiData.followers.value}
          change={kpiData.followers.change}
          icon={Users}
          iconBg="bg-gradient-to-br from-purple-500 to-indigo-600"
        />
        <StatCard
          label="Scheduled Queue"
          value={scheduledPosts.length}
          change={scheduledPosts.length > 0 ? +scheduledPosts.length : 0}
          icon={CalendarDays}
          iconBg="bg-gradient-to-br from-pink-500 to-rose-600"
        />
        <StatCard
          label="Active Automations"
          value={activeRulesCount}
          change={activeRulesCount > 0 ? +activeRulesCount : 0}
          icon={Zap}
          iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          label="Drafts Saved"
          value={drafts.length}
          change={0}
          icon={Layers}
          iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
      </div>

      {/* Main Analytics + Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Audience & Follower Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Projected trajectory based on publishing cadence</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followerData}>
                <defs>
                  <linearGradient id="dashboardLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#833AB4" />
                    <stop offset="50%" stopColor="#E1306C" />
                    <stop offset="100%" stopColor="#FCAF45" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickMargin={8}
                />
                <YAxis
                  hide
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                  formatter={(val) => [formatNumber(val), 'Followers']}
                />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="url(#dashboardLineGradient)"
                  strokeWidth={3.5}
                  dot={{ r: 3, fill: '#E1306C', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#833AB4', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Published</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{published.length}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Queue Velocity</span>
              <span className="text-sm font-extrabold text-pink-600 dark:text-pink-400">
                {scheduledPosts.length > 0 ? `${scheduledPosts.length} ready` : 'Idle'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">System Status</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Optimal
              </span>
            </div>
          </div>
        </div>

        {/* Quick Launch Checklist / Shortcuts */}
        <div className="card p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Growth Playbook</h3>
            <p className="text-xs text-slate-400">Recommended workflow steps for your brand</p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Schedule 3 weekly drops',
                done: scheduledPosts.length >= 3,
                to: '/composer',
                desc: `${scheduledPosts.length}/3 scheduled`,
              },
              {
                title: 'Enable comment auto-responder',
                done: activeRulesCount > 0,
                to: '/automations',
                desc: `${activeRulesCount} active rules`,
              },
              {
                title: 'Organize hashtag groups',
                done: true,
                to: '/hashtags',
                desc: 'Explore trending tags',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                onClick={() => navigate(step.to)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-pink-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.done ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-pink-600 transition-colors">
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{step.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/composer')}
            className="w-full btn-primary !py-2.5 text-xs font-bold"
          >
            <PenSquare className="w-3.5 h-3.5" /> Compose New Drop
          </button>
        </div>
      </div>

      {/* Upcoming Posts & Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Posts Feed */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-pink-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Next in Queue</h3>
            </div>
            <button
              onClick={() => navigate('/calendar')}
              className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Open Calendar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center mb-3">
                <CalendarDays className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No scheduled posts yet</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
                Plan ahead and schedule your next content drop with automated publishing.
              </p>
              <button onClick={() => navigate('/composer')} className="btn-primary text-xs !py-2">
                <PlusCircle className="w-3.5 h-3.5" /> Schedule a Post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.imageColor || 'from-purple-500 to-pink-500'} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                    {post.imageEmoji || '📸'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {post.caption || 'Scheduled Post'}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-pink-500" />
                        {format(parseISO(post.scheduledAt), 'MMM d, h:mm a')}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{post.type}</span>
                    </div>
                  </div>
                  <span className="badge-scheduled shrink-0">Scheduled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity / Notifications */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Activity Feed</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">{notifications.length} logs</span>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80"
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-sm shrink-0">
                  {n.icon || '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
