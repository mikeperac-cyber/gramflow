import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, PenSquare, BarChart2,
  Zap, Hash, Settings, Camera, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/calendar',  icon: CalendarDays,    label: 'Calendar'     },
  { to: '/composer',  icon: PenSquare,       label: 'Compose'      },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics'    },
  { to: '/automations',icon: Zap,            label: 'Automations'  },
  { to: '/hashtags',  icon: Hash,            label: 'Hashtags'     },
  { to: '/settings',  icon: Settings,        label: 'Settings'     },
];

export default function Sidebar() {
  const { accountName } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative hidden md:flex flex-col shrink-0
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-800 overflow-hidden`}>
        <div className="w-8 h-8 ig-gradient rounded-xl flex items-center justify-center shrink-0">
          <Camera className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg ig-gradient-text whitespace-nowrap">GramFlow</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium
              transition-colors duration-150 group overflow-hidden
              ${isActive
                ? 'ig-gradient text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Account tag */}
      {!collapsed && accountName && (
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 ig-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
              {accountName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">@{accountName}</p>
              <p className="text-[10px] text-gray-400">Business Account</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-gray-500" />
          : <ChevronLeft  className="w-3 h-3 text-gray-500" />
        }
      </button>
    </aside>
  );
}
