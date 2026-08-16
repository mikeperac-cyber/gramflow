import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, PenSquare, BarChart2,
  Zap, Hash, Settings, Camera, ChevronLeft, ChevronRight,
  Grid, MessageSquare, Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/calendar',    icon: CalendarDays,    label: 'Calendar'      },
  { to: '/grid',        icon: Grid,            label: 'Grid Planner'  },
  { to: '/composer',    icon: PenSquare,       label: 'Post Composer' },
  { to: '/inbox',       icon: MessageSquare,   label: 'Inbox CRM'     },
  { to: '/analytics',   icon: BarChart2,       label: 'Analytics'     },
  { to: '/competitors', icon: Target,          label: 'Competitors'   },
  { to: '/automations', icon: Zap,             label: 'Automations'   },
  { to: '/hashtags',    icon: Hash,            label: 'Hashtag Hub'   },
  { to: '/settings',    icon: Settings,        label: 'Settings'      },
];

export default function Sidebar() {
  const { accountName, posts, conversations } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const unreadMessagesCount = conversations.filter(c => c.unread).length;

  return (
    <aside
      className={`
        relative hidden md:flex flex-col shrink-0
        bg-white dark:bg-[#0e1422] border-r border-slate-200/80 dark:border-slate-800/80
        transition-all duration-300 z-30 select-none
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800/80 overflow-hidden`}>
        <div className="w-10 h-10 ig-gradient rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(225,48,108,0.4)] shrink-0">
          <Camera className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-extrabold text-lg ig-gradient-text tracking-tight whitespace-nowrap">GramFlow</h1>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Enterprise IG Suite</p>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold
              transition-all duration-150 group relative
              ${isActive
                ? 'ig-gradient text-white shadow-[0_4px_16px_-4px_rgba(225,48,108,0.4)]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <Icon className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" />
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="truncate">{label}</span>
                {label === 'Calendar' && scheduledCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                    {scheduledCount}
                  </span>
                )}
                {label === 'Inbox CRM' && unreadMessagesCount > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500 text-white animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Action / Account Pill */}
      {!collapsed && (
        <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-amber-500/5 border border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 ig-gradient rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {accountName ? accountName[0]?.toUpperCase() : 'G'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {accountName ? `@${accountName}` : 'My Brand'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all z-20"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          : <ChevronLeft  className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
        }
      </button>
    </aside>
  );
}
