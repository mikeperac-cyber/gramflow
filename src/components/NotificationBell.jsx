import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationBell() {
  const { notifications, markAllRead, unreadCount } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeColors = {
    post:       'bg-blue-100 dark:bg-blue-900/40',
    automation: 'bg-purple-100 dark:bg-purple-900/40',
    analytics:  'bg-green-100 dark:bg-green-900/40',
    follower:   'bg-pink-100 dark:bg-pink-900/40',
    hashtag:    'bg-orange-100 dark:bg-orange-900/40',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 ig-gradient text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 card shadow-2xl animate-fade-in z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
            <span className="text-xs text-gram-500 font-medium cursor-pointer hover:text-gram-700" onClick={markAllRead}>
              Mark all read
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
            {notifications.slice(0, 15).map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  !n.read ? 'bg-gram-50 dark:bg-gram-900/10' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${typeColors[n.type] || 'bg-gray-100'}`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 ig-gradient rounded-full shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-center text-gray-400">Showing last {Math.min(notifications.length, 15)} notifications</p>
          </div>
        </div>
      )}
    </div>
  );
}
