import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isAfter } from 'date-fns';
import { Users, CalendarDays, Zap, BarChart2, PenSquare, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { formatNumber } from '../utils/formatters';
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from 'recharts';
import { generateFollowerGrowth } from '../data/mockAnalytics';

const followerData = generateFollowerGrowth(30);

const imageColors = [
  'from-pink-400 to-purple-500',
  'from-orange-400 to-pink-500',
  'from-blue-400 to-indigo-500',
];

export default function Dashboard() {
  const { posts, quickRules, notifications, accountName } = useApp();
  const navigate = useNavigate();

  const now = new Date();

  const scheduledPosts = useMemo(
    () => posts
      .filter((p) => p.status === 'scheduled' && isAfter(new Date(p.scheduledAt), now))
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
      .slice(0, 4),
    [posts]
  );

  const publishedThisWeek = useMemo(() => {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return posts.filter(
      (p) => p.status === 'published' && new Date(p.scheduledAt) >= weekAgo
    ).length;
  }, [posts]);

  const activeRules = quickRules.filter((r) => r.enabled).length;
  const recentActivity = notifications.slice(0, 5);
  const currentFollowers = followerData[followerData.length - 1]?.followers ?? 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Banner */}
      <div className="ig-gradient rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -right-16 w-56 h-56 bg-white/5 rounded-full" />
        <div className="relative">
          <p className="text-white/80 text-sm font-medium mb-1">Good {getGreeting()} 👋</p>
          <h1 className="text-2xl font-bold">
            {accountName ? `@${accountName}` : 'Your GramFlow'}
          </h1>
          <p className="text-white/70 text-sm mt-1">{formatNumber(currentFollowers)} followers · {scheduledPosts.length} posts queued</p>
          <button
            onClick={() => navigate('/composer')}
            className="mt-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl backdrop-blur-sm"
          >
            <PenSquare className="w-4 h-4" /> Create New Post
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Followers"
          value={currentFollowers}
          change={6.2}
          icon={Users}
        />
        <StatCard
          label="Posts This Week"
          value={publishedThisWeek}
          change={publishedThisWeek > 3 ? 14.3 : -5.1}
          icon={CalendarDays}
        />
        <StatCard
          label="Active Automations"
          value={activeRules}
          change={0}
          icon={Zap}
        />
        <StatCard
          label="Scheduled Posts"
          value={scheduledPosts.length}
          change={scheduledPosts.length > 2 ? 8 : -3}
          icon={BarChart2}
        />
      </div>

      {/* Two column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Follower Growth Sparkline */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Follower Growth</h3>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs text-gram-500 hover:text-gram-700 flex items-center gap-1 font-medium"
            >
              Full Report <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={followerData}>
              <defs>
                <linearGradient id="gramGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#833AB4" />
                  <stop offset="50%"  stopColor="#E1306C" />
                  <stop offset="100%" stopColor="#F77737" />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  background: 'var(--tw-bg-opacity)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
                formatter={(v) => [formatNumber(v), 'Followers']}
                labelFormatter={(l) => l}
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="url(#gramGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#E1306C' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats sidebar */}
        <div className="card p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Stats</h3>
          {[
            { label: 'Avg. Engagement',  value: '3.8%',  color: 'bg-pink-100 dark:bg-pink-900/30',    dot: 'bg-pink-500'   },
            { label: 'Best Day to Post', value: 'Tue',   color: 'bg-blue-100 dark:bg-blue-900/30',    dot: 'bg-blue-500'   },
            { label: 'Best Time',        value: '7pm',   color: 'bg-green-100 dark:bg-green-900/30',  dot: 'bg-green-500'  },
            { label: 'Stories / week',   value: '5',     color: 'bg-orange-100 dark:bg-orange-900/30',dot: 'bg-orange-500' },
          ].map((s) => (
            <div key={s.label} className={`flex items-center justify-between rounded-xl px-3 py-2 ${s.color}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">{s.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Posts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming posts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Upcoming Posts</h3>
            <button
              onClick={() => navigate('/calendar')}
              className="text-xs text-gram-500 hover:text-gram-700 flex items-center gap-1 font-medium"
            >
              Calendar <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8">
              <PenSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No posts scheduled.</p>
              <button onClick={() => navigate('/composer')} className="btn-primary mt-3 text-xs">Create Post</button>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.imageColor} flex items-center justify-center text-base shrink-0`}>
                    {post.imageEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{post.caption.slice(0, 45)}…</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(post.scheduledAt), 'MMM d, h:mm a')} · {post.type}
                    </p>
                  </div>
                  <span className="badge-scheduled shrink-0">Scheduled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm shrink-0">
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
