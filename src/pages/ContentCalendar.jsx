import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth,
         startOfWeek, endOfWeek, isToday, addMonths, subMonths, addWeeks, subWeeks,
         parseISO, isAfter } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, CalendarDays, List, AlignLeft, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  published: 'bg-green-500',
  scheduled: 'bg-blue-500',
  draft:     'bg-gray-400',
};

export default function ContentCalendar() {
  const { posts } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 15));
  const [selectedPost, setSelectedPost] = useState(null);

  // ── Month View ─────────────────────────────────────────────
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end   = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const postsByDay = useMemo(() => {
    const map = {};
    posts.forEach((p) => {
      const d = format(parseISO(p.scheduledAt), 'yyyy-MM-dd');
      if (!map[d]) map[d] = [];
      map[d].push(p);
    });
    return map;
  }, [posts]);

  // ── Week View ──────────────────────────────────────────────
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end   = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6am–11pm

  // ── Agenda View ────────────────────────────────────────────
  const agendaPosts = useMemo(() =>
    [...posts].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    [posts]
  );

  function navigate_date(dir) {
    if (view === 'month')  setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    if (view === 'week')   setCurrentDate(dir > 0 ? addWeeks(currentDate, 1)  : subWeeks(currentDate, 1));
    if (view === 'agenda') setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  }

  const headerLabel = view === 'week'
    ? `${format(weekDays[0], 'MMM d')} – ${format(weekDays[6], 'MMM d, yyyy')}`
    : format(currentDate, 'MMMM yyyy');

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => navigate_date(-1)} className="btn-ghost p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white min-w-[180px] text-center">
            {headerLabel}
          </h2>
          <button onClick={() => navigate_date(1)} className="btn-ghost p-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-start sm:self-auto">
          {[
            { key: 'month',  icon: CalendarDays, label: 'Month'  },
            { key: 'week',   icon: Clock,        label: 'Week'   },
            { key: 'agenda', icon: List,         label: 'Agenda' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                view === key
                  ? 'bg-white dark:bg-gray-900 text-gram-600 dark:text-gram-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/composer')}
          className="btn-primary flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-gray-500 dark:text-gray-400 capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* ── MONTH VIEW ── */}
      {view === 'month' && (
        <div className="card overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7">
            {monthDays.map((day, i) => {
              const key  = format(day, 'yyyy-MM-dd');
              const dayPosts = postsByDay[key] || [];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-1.5 border-b border-r border-gray-100 dark:border-gray-800 last:border-r-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    !isCurrentMonth ? 'opacity-30' : ''
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    today ? 'ig-gradient text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 2).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPost(p)}
                        className={`w-full text-left text-[10px] font-medium text-white px-1 py-0.5 rounded truncate ${STATUS_COLORS[p.status]}`}
                      >
                        {p.imageEmoji} {p.type}
                      </button>
                    ))}
                    {dayPosts.length > 2 && (
                      <p className="text-[10px] text-gray-400 pl-1">+{dayPosts.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── WEEK VIEW ── */}
      {view === 'week' && (
        <div className="card overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-800">
              <div className="py-2 px-2 text-xs text-gray-400" />
              {weekDays.map((d) => (
                <div key={d} className={`py-2 text-center text-xs font-medium ${isToday(d) ? 'text-gram-600 dark:text-gram-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                  <div>{format(d, 'EEE')}</div>
                  <div className={`text-sm font-bold ${isToday(d) ? 'text-gram-600' : 'text-gray-800 dark:text-gray-100'}`}>
                    {format(d, 'd')}
                  </div>
                </div>
              ))}
            </div>
            {/* Time rows */}
            <div className="max-h-96 overflow-y-auto">
              {hours.map((h) => (
                <div key={h} className="grid grid-cols-8 border-b border-gray-50 dark:border-gray-800/50">
                  <div className="py-3 px-2 text-[10px] text-gray-400 text-right pr-3">
                    {h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h-12}pm`}
                  </div>
                  {weekDays.map((d) => {
                    const dayPosts = posts.filter((p) => {
                      const pd = parseISO(p.scheduledAt);
                      return isSameDay(pd, d) && pd.getHours() === h;
                    });
                    return (
                      <div key={d} className="py-1 px-0.5 min-h-[36px] border-l border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        {dayPosts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPost(p)}
                            className={`w-full text-[9px] text-white font-medium px-1 py-0.5 rounded ${STATUS_COLORS[p.status]} truncate mb-0.5`}
                          >
                            {p.imageEmoji} {p.type}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AGENDA VIEW ── */}
      {view === 'agenda' && (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {agendaPosts.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No posts found.</p>
            </div>
          )}
          {agendaPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.imageColor} flex items-center justify-center text-base shrink-0`}>
                {post.imageEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {post.caption.slice(0, 60)}…
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(parseISO(post.scheduledAt), 'EEE, MMM d · h:mm a')} · {post.type}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 text-white ${STATUS_COLORS[post.status]}`}>
                {post.status}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Post detail modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="card max-w-sm w-full p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-full h-48 rounded-xl bg-gradient-to-br ${selectedPost.imageColor} flex items-center justify-center text-5xl mb-4`}>
              {selectedPost.imageEmoji}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${STATUS_COLORS[selectedPost.status]}`}>
                {selectedPost.status}
              </span>
              <span className="text-xs text-gray-400">{selectedPost.type}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{selectedPost.caption}</p>
            <p className="text-xs text-gray-400 mt-2">{selectedPost.hashtags}</p>
            <p className="text-xs font-medium text-gram-500 mt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(parseISO(selectedPost.scheduledAt), 'EEEE, MMMM d, yyyy · h:mm a')}
            </p>
            {selectedPost.metrics && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { l: 'Likes',    v: selectedPost.metrics.likes    },
                  { l: 'Comments', v: selectedPost.metrics.comments },
                  { l: 'Reach',    v: selectedPost.metrics.reach    },
                ].map(({ l, v }) => (
                  <div key={l} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{v.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">{l}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setSelectedPost(null)} className="btn-secondary w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
