import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationBell() {
  const { notifications, markAllRead, clearNotifications, unreadCount } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) markAllRead();
        }}
        className="relative p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 ig-gradient text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-13 w-80 sm:w-96 card shadow-2xl animate-fade-in z-50 overflow-hidden border border-slate-200/90 dark:border-slate-700/80">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Activity Alerts</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold hover:underline"
              >
                Mark read
              </button>
              <button
                onClick={clearNotifications}
                className="text-[11px] text-slate-400 hover:text-rose-500 font-semibold"
                title="Clear all"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                <p className="font-bold text-slate-700 dark:text-slate-300">All caught up!</p>
                <p className="text-[11px] mt-0.5">No new alerts or scheduled notifications.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    !n.read ? 'bg-pink-50/30 dark:bg-pink-950/10' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shrink-0">
                    {n.icon || '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
