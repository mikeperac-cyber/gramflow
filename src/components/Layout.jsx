import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import {
  LayoutDashboard, CalendarDays, PenSquare, BarChart2,
  Zap, Hash, Settings,
} from 'lucide-react';

const mobileNav = [
  { to: '/',           icon: LayoutDashboard, label: 'Home'      },
  { to: '/calendar',   icon: CalendarDays,    label: 'Calendar'  },
  { to: '/composer',   icon: PenSquare,       label: 'Compose'   },
  { to: '/analytics',  icon: BarChart2,       label: 'Analytics' },
  { to: '/automations',icon: Zap,             label: 'Automate'  },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-2 py-2 z-40">
        {mobileNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors
              ${isActive ? 'text-gram-600 dark:text-gram-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}
            `}
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
