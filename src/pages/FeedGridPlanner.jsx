import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Plus, ArrowUpDown, Eye, Calendar, Sparkles,
  MoveLeft, MoveRight, Trash2, Camera, Layers, CheckCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const defaultBio = "✨ Mindful Lifestyle & Creative Studio\n🌿 Sustainable goods & daily design inspiration\n🛍️ Tap the link below for our latest drop!";

export default function FeedGridPlanner() {
  const { posts, reorderPosts, accountName, showToast } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all'); // all | scheduled | published
  const [selectedPost, setSelectedPost] = useState(null);

  const displayPosts = posts.filter(p => {
    if (filter === 'scheduled') return p.status === 'scheduled';
    if (filter === 'published') return p.status === 'published';
    return true;
  });

  const movePost = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= posts.length) return;

    const updated = [...posts];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    reorderPosts(updated);
    showToast('Grid layout updated! 📐');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Grid className="w-6 h-6 text-pink-500" />
            <span>Visual 9-Grid Planner</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curate your 3-column Instagram profile aesthetic, color harmony, and visual feed flow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 p-1 rounded-xl shadow-sm">
            {[
              { id: 'all', label: 'Full Grid' },
              { id: 'scheduled', label: 'Queued Only' },
              { id: 'published', label: 'Published' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f.id
                    ? 'ig-gradient text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/composer')}
            className="btn-primary text-xs !py-2.5 !px-3.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add to Grid</span>
          </button>
        </div>
      </div>

      {/* Main Grid Viewport Frame */}
      <div className="card p-6 sm:p-8 max-w-xl mx-auto shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-6">
        {/* Instagram Profile Header Simulation */}
        <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5 sm:gap-8">
            <div className="relative">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[3px] ig-gradient shadow-md">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-full ig-gradient flex items-center justify-center text-white text-xl sm:text-2xl font-black">
                    {accountName ? accountName[0]?.toUpperCase() : 'G'}
                  </div>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-pink-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900">
                +
              </span>
            </div>

            {/* Profile Counts */}
            <div className="flex-1 flex justify-around text-center">
              <div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">{posts.length}</p>
                <p className="text-[11px] text-slate-400 font-medium">Posts</p>
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">1,250</p>
                <p className="text-[11px] text-slate-400 font-medium">Followers</p>
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">340</p>
                <p className="text-[11px] text-slate-400 font-medium">Following</p>
              </div>
            </div>
          </div>

          {/* Bio & Handle */}
          <div className="space-y-1 text-xs">
            <p className="font-extrabold text-slate-900 dark:text-white text-sm">
              @{accountName || 'your_brand'}
            </p>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {defaultBio}
            </p>
            <p className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
              🔗 linktr.ee/{accountName || 'your_brand'}
            </p>
          </div>

          {/* Story Highlights Bar */}
          <div className="flex gap-4 overflow-x-auto pt-2 pb-1">
            {[
              { label: 'Drops ✨', emoji: '🛍️' },
              { label: 'BTS 📸', emoji: '🎨' },
              { label: 'Reviews ⭐', emoji: '💌' },
              { label: 'About Us', emoji: '🌱' },
            ].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                <div className="w-13 h-13 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg hover:scale-105 transition-transform">
                  {h.emoji}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[56px]">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3x3 Tile Grid */}
        {displayPosts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-500 flex items-center justify-center mx-auto shadow-sm">
              <Grid className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No posts in your grid yet
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Compose scheduled posts or load starter templates to start visualizing your Instagram feed pattern.
            </p>
            <button
              onClick={() => navigate('/composer')}
              className="btn-primary text-xs !py-2.5 mx-auto"
            >
              <Plus className="w-4 h-4" /> Create First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {displayPosts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`group aspect-square rounded-xl bg-gradient-to-br ${
                  post.imageColor || 'from-purple-500 to-pink-500'
                } relative overflow-hidden flex items-center justify-center text-3xl sm:text-4xl text-white cursor-pointer shadow-sm transition-all hover:scale-[1.02]`}
              >
                {/* Custom Image or Emoji */}
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt="Tile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{post.imageEmoji || '📸'}</span>
                )}

                {/* Status indicator badge */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[9px] font-bold text-white/90">
                  {post.status === 'scheduled' ? '🗓️' : post.status === 'draft' ? '📝' : '✅'}
                </div>

                {/* Type icon top right */}
                <div className="absolute top-1.5 right-1.5 text-xs text-white/80 drop-shadow">
                  {post.type === 'Reel' ? '🎬' : post.type === 'Carousel' ? '📑' : '📷'}
                </div>

                {/* Hover Quick Shift Controls */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-2 text-white">
                  <p className="text-[10px] font-bold line-clamp-2 text-center">
                    {post.caption ? post.caption.slice(0, 35) + '…' : post.type}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePost(index, -1);
                      }}
                      disabled={index === 0}
                      className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                      title="Move Left / Earlier"
                    >
                      <MoveLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePost(index, 1);
                      }}
                      disabled={index === displayPosts.length - 1}
                      className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                      title="Move Right / Later"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal Inspection */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="card max-w-sm w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-full h-44 rounded-2xl bg-gradient-to-br ${selectedPost.imageColor || 'from-purple-500 to-pink-500'} flex items-center justify-center text-5xl shadow-inner`}>
              {selectedPost.imageEmoji || '📸'}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                  {selectedPost.type} · {selectedPost.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedPost.scheduledAt ? format(parseISO(selectedPost.scheduledAt), 'MMM d, h:mm a') : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedPost.caption}
              </p>
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="btn-primary w-full text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
