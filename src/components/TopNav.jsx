import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, PenSquare, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationBell from './NotificationBell';

const pageMeta = {
  '/':            { title: 'Dashboard', subtitle: 'Real-time overview of your Instagram presence' },
  '/calendar':    { title: 'Content Calendar', subtitle: 'Plan, schedule and preview upcoming drops' },
  '/grid':        { title: '9-Grid Feed Planner', subtitle: 'Curate your 3x3 visual profile aesthetic & layout' },
  '/composer':    { title: 'Post Composer', subtitle: 'Craft feeds, reels & stories with AI assistance' },
  '/inbox':       { title: 'Inbox CRM & Comments', subtitle: 'Community management, DMs & auto-responses' },
  '/analytics':   { title: 'Analytics', subtitle: 'In-depth performance metrics & audience insights' },
  '/competitors': { title: 'Competitor Strategy', subtitle: 'Niche benchmarking, format breakdown & gap analysis' },
  '/automations': { title: 'Automations', subtitle: 'Smart workflows, auto-responders & schedulers' },
  '/hashtags':    { title: 'Hashtag Hub', subtitle: 'Discover high-engagement tags and saved sets' },
  '/settings':    { title: 'Settings', subtitle: 'Manage connected brand profile & data backups' },
};

export default function TopNav() {
  const { darkMode, toggleDark, accountName } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const currentMeta = pageMeta[pathname] || { title: 'GramFlow', subtitle: 'Instagram Command Center' };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#0e1422]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center px-4 md:px-7 justify-between shrink-0 sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h2 className="font-bold text-slate-900 dark:text-white text-base md:text-lg tracking-tight leading-tight">
          {currentMeta.title}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
          {currentMeta.subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick New Post CTA */}
        {pathname !== '/composer' && (
          <button
            onClick={() => navigate('/composer')}
            className="btn-primary text-xs !py-2 !px-3.5 hidden sm:flex shadow-sm"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleDark}
          className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode
            ? <Sun  className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-slate-600" />
          }
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Account Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="Account Settings"
        >
          <div className="w-9 h-9 ig-gradient rounded-xl flex items-center justify-center text-white text-xs font-extrabold shadow-sm group-hover:scale-105 transition-transform">
            {accountName ? accountName[0]?.toUpperCase() : 'G'}
          </div>
        </div>
      </div>
    </header>
  );
}
