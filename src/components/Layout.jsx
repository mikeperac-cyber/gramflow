import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import {
  LayoutDashboard, CalendarDays, PenSquare, Grid, MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const mobileNav = [
  { to: '/',           icon: LayoutDashboard, label: 'Home'     },
  { to: '/calendar',   icon: CalendarDays,    label: 'Calendar' },
  { to: '/grid',       icon: Grid,            label: 'Grid'     },
  { to: '/composer',   icon: PenSquare,       label: 'Compose'  },
  { to: '/inbox',      icon: MessageSquare,   label: 'Inbox'    },
];

export default function Layout() {
  const { conversations } = useApp();
  const unreadCount = conversations.filter(c => c.unread).length;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0b0f19]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-7">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0e1422]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-around px-2 py-2 z-40">
        {mobileNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all
              ${isActive ? 'text-pink-600 dark:text-pink-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {label === 'Inbox' && unreadCount > 0 && (
              <span className="absolute top-0 right-3 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
