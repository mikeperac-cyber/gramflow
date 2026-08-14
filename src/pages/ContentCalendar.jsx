import React, { useState, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth,
  startOfWeek, endOfWeek, isToday, addMonths, subMonths, addWeeks, subWeeks,
  parseISO
} from 'date-fns';
import {
  ChevronLeft, ChevronRight, Plus, CalendarDays, List, Clock,
  Trash2, X, MapPin, Tag, ArrowRight, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const STATUS_BADGE = {
  published: 'bg-emerald-500 text-white',
  scheduled: 'bg-sky-500 text-white',
  draft:     'bg-slate-400 text-white',
};

export default function ContentCalendar() {
  const { posts, deletePost, showToast } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);

  // ── Month View Calculations ────────────────────────────────
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end   = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const postsByDay = useMemo(() => {
    const map = {};
    posts.forEach((p) => {
      if (!p.scheduledAt) return;
      try {
        const d = format(parseISO(p.scheduledAt), 'yyyy-MM-dd');
        if (!map[d]) map[d] = [];
        map[d].push(p);
      } catch (err) {
        console.error('Invalid date format:', p.scheduledAt);
      }
    });
    return map;
  }, [posts]);

  // ── Week View Calculations ─────────────────────────────────
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end   = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7am to 10pm

  // ── Agenda View ────────────────────────────────────────────
  const agendaPosts = useMemo(() =>
    [...posts].sort((a, b) => new Date(a.scheduledAt || 0) - new Date(b.scheduledAt || 0)),
    [posts]
  );

  function navigateDate(dir) {
    if (view === 'month')  setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    if (view === 'week')   setCurrentDate(dir > 0 ? addWeeks(currentDate, 1)  : subWeeks(currentDate, 1));
    if (view === 'agenda') setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  }

  const headerLabel = view === 'week'
    ? `${format(weekDays[0], 'MMM d')} – ${format(weekDays[6], 'MMM d, yyyy')}`
    : format(currentDate, 'MMMM yyyy');

  const handleDelete = (id) => {
    deletePost(id);
    setSelectedPost(null);
    showToast('Post removed from schedule', 'info');
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => navigateDate(-1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-pink-600 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateDate(1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {headerLabel}
          </h2>
        </div>

        {/* View Switcher & New Post */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 p-1 rounded-xl shadow-sm">
            {[
              { key: 'month',  icon: CalendarDays, label: 'Month'  },
              { key: 'week',   icon: Clock,        label: 'Week'   },
              { key: 'agenda', icon: List,         label: 'Agenda' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  view === key
                    ? 'ig-gradient text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/composer')}
            className="btn-primary text-xs !py-2 !px-4"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </button>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Published</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Draft</span>
          </div>
        </div>
        <p className="text-slate-400 font-medium">
          {posts.length} total item{posts.length === 1 ? '' : 's'} across calendar
        </p>
      </div>

      {/* ── 1. MONTH VIEW ── */}
      {view === 'month' && (
        <div className="card overflow-hidden shadow-sm">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
            {monthDays.map((day, idx) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayPosts = postsByDay[dateKey] || [];
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (dayPosts.length === 0) navigate('/composer');
                  }}
                  className={`min-h-[105px] p-2 transition-all flex flex-col justify-between group ${
                    inMonth ? 'bg-white dark:bg-[#111726]' : 'bg-slate-50/40 dark:bg-slate-950/40 opacity-40'
                  } hover:bg-pink-50/30 dark:hover:bg-slate-800/40 cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        today
                          ? 'ig-gradient text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayPosts.length === 0 && (
                      <span className="text-[10px] text-pink-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        + Add
                      </span>
                    )}
                  </div>

                  {/* Post Badges */}
                  <div className="space-y-1 overflow-hidden">
                    {dayPosts.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg truncate flex items-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02] ${
                          STATUS_BADGE[post.status] || 'bg-slate-500 text-white'
                        }`}
                      >
                        <span>{post.imageEmoji || '📸'}</span>
                        <span className="truncate">{post.caption || post.type}</span>
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <p className="text-[10px] font-bold text-pink-600 dark:text-pink-400 pl-1">
                        +{dayPosts.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. WEEK VIEW ── */}
      {view === 'week' && (
        <div className="card overflow-x-auto shadow-sm">
          <div className="min-w-[700px]">
            {/* Headers */}
            <div className="grid grid-cols-8 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="p-3 text-xs text-slate-400 text-center font-bold">Time</div>
              {weekDays.map((d) => (
                <div key={d.toString()} className={`p-3 text-center text-xs font-bold ${isToday(d) ? 'text-pink-600' : 'text-slate-700 dark:text-slate-300'}`}>
                  <div>{format(d, 'EEE')}</div>
                  <div className={`text-sm mt-0.5 ${isToday(d) ? 'font-extrabold ig-gradient-text' : ''}`}>
                    {format(d, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {hours.map((h) => (
                <div key={h} className="grid grid-cols-8 min-h-[48px]">
                  <div className="text-[11px] font-semibold text-slate-400 text-right pr-3 py-2">
                    {h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
                  </div>
                  {weekDays.map((d) => {
                    const cellPosts = posts.filter((p) => {
                      if (!p.scheduledAt) return false;
                      const parsed = parseISO(p.scheduledAt);
                      return isSameDay(parsed, d) && parsed.getHours() === h;
                    });

                    return (
                      <div
                        key={d.toString()}
                        className="border-l border-slate-100 dark:border-slate-800/60 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        {cellPosts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPost(p)}
                            className={`text-[10px] font-bold p-1 rounded-md mb-1 cursor-pointer truncate shadow-sm ${
                              STATUS_BADGE[p.status]
                            }`}
                          >
                            {p.imageEmoji} {p.type}
                          </div>
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

      {/* ── 3. AGENDA VIEW ── */}
      {view === 'agenda' && (
        <div className="card divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
          {agendaPosts.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarDays className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No scheduled content</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Your agenda is clean. Draft a post or set up a regular publishing cadence.
              </p>
              <button onClick={() => navigate('/composer')} className="btn-primary text-xs !py-2.5 mx-auto">
                <Plus className="w-3.5 h-3.5" /> Compose New Drop
              </button>
            </div>
          ) : (
            agendaPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.imageColor || 'from-purple-500 to-pink-500'} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                    {post.imageEmoji || '📸'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {post.caption || 'Untitled Post'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {post.scheduledAt ? format(parseISO(post.scheduledAt), 'EEEE, MMM d, yyyy · h:mm a') : 'Unscheduled'} · <span className="font-semibold text-slate-600 dark:text-slate-300">{post.type}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[post.status]}`}>
                    {post.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="card max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[selectedPost.status]}`}>
                {selectedPost.status}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`w-full h-44 rounded-2xl bg-gradient-to-br ${selectedPost.imageColor || 'from-purple-500 to-pink-500'} flex items-center justify-center text-5xl shadow-inner`}>
              {selectedPost.imageEmoji || '📸'}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-1">
                {selectedPost.type}
              </p>
              <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                {selectedPost.caption}
              </p>
            </div>

            {selectedPost.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-pink-500" />
                <span>{selectedPost.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {selectedPost.scheduledAt ? format(parseISO(selectedPost.scheduledAt), 'MMMM d, yyyy · h:mm a') : 'No date set'}
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => handleDelete(selectedPost.id)}
                className="btn-secondary !text-rose-500 hover:!bg-rose-50 dark:hover:!bg-rose-950/40 flex-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="btn-primary flex-1"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
