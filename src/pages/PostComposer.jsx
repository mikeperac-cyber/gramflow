import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import {
  Image, MapPin, Tag, Hash, Send, Save, Clock,
  Smartphone, Sparkles, Check, Copy, X, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const POST_TYPES = ['Feed Post', 'Reel', 'Story', 'Carousel'];
const MAX_CAPTION = 2200;

const suggestedHashtags = [
  '#smallbusiness', '#entrepreneur', '#explore', '#viral', '#trending',
  '#instagood', '#photooftheday', '#reels', '#instadaily', '#fyp',
  '#shoplocal', '#brandstrategy', '#creativelife', '#contentcreator',
];

const imageGradients = [
  'from-purple-600 via-pink-600 to-amber-500',
  'from-rose-500 via-pink-500 to-orange-400',
  'from-indigo-600 via-purple-600 to-pink-500',
  'from-sky-500 via-blue-600 to-indigo-700',
  'from-emerald-500 via-teal-600 to-cyan-700',
  'from-amber-500 via-orange-500 to-red-600',
  'from-slate-800 via-zinc-900 to-black',
];

const emojiIcons = ['🌸', '🚀', '✨', '📸', '🎨', '💡', '🔥', '🌿', '💎', '🎉', '💼', '☕'];

function PhoneMockup({ caption, type, emoji, gradient, accountName, location, aspectRatio }) {
  const isStory = type === 'Story' || aspectRatio === '9:16';

  return (
    <div className="flex flex-col items-center">
      {/* Device Bezel */}
      <div className="w-[280px] bg-slate-950 rounded-[3rem] p-3 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end pr-2">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>

        {/* Screen Content */}
        <div className="bg-white dark:bg-[#0b0f19] rounded-[2.3rem] overflow-hidden flex flex-col h-[520px] text-slate-900 dark:text-slate-100 relative">
          {/* IG Status Bar */}
          <div className="pt-6 px-4 pb-2 flex items-center justify-between text-[11px] font-bold border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 ig-gradient rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                {accountName ? accountName[0]?.toUpperCase() : 'G'}
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold truncate max-w-[120px]">
                  {accountName || 'your_brand'}
                </p>
                {location && (
                  <p className="text-[9px] text-slate-400 truncate max-w-[120px]">{location}</p>
                )}
              </div>
            </div>
            <span className="text-[10px] text-pink-600 font-bold uppercase">{type}</span>
          </div>

          {/* Media Viewport */}
          <div className={`w-full bg-gradient-to-br ${gradient} flex items-center justify-center text-6xl text-white relative shadow-inner ${
            isStory ? 'flex-1' : aspectRatio === '4:5' ? 'h-64' : 'h-52'
          }`}>
            <span className="animate-pulse">{emoji}</span>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-medium text-white/90">
              {type}
            </div>
          </div>

          {/* Feed Post Actions & Caption */}
          {!isStory && (
            <div className="p-3.5 flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-3">
                    <span>❤️</span>
                    <span>💬</span>
                    <span>📤</span>
                  </div>
                  <span>🔖</span>
                </div>

                <div className="text-[11px] leading-relaxed line-clamp-4">
                  <span className="font-bold mr-1.5">{accountName || 'your_brand'}</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {caption || 'Your caption and tags will render here live as you type… ✨'}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[9px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span>View all comments</span>
                <span>Just now</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 font-semibold flex items-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5" /> High-Fidelity IG Preview
      </p>
    </div>
  );
}

export default function PostComposer() {
  const { addPost, showToast, addNotification, accountName } = useApp();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [type, setType] = useState('Feed Post');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [imageEmoji, setImageEmoji] = useState('🌸');
  const [imageColor, setImageColor] = useState(imageGradients[0]);
  const [scheduleDate, setScheduleDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd'T'12:00")
  );

  const remaining = MAX_CAPTION - caption.length;

  const handleAddHashtag = (tag) => {
    setCaption((prev) => {
      const clean = prev.trim();
      return clean ? `${clean} ${tag}` : tag;
    });
  };

  const handleSchedule = () => {
    if (!caption.trim()) {
      showToast('Please add a caption or concept before scheduling.', 'error');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      caption,
      type,
      status: 'scheduled',
      scheduledAt: new Date(scheduleDate).toISOString(),
      imageColor,
      imageEmoji,
      location,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      metrics: null,
    };

    addPost(newPost);
    addNotification({
      type: 'post',
      message: `Post scheduled for ${format(new Date(scheduleDate), 'MMM d, h:mm a')} 📅`,
      icon: '📅',
    });
    showToast('Post queued in content calendar! 🚀');
    navigate('/calendar');
  };

  const handleSaveDraft = () => {
    if (!caption.trim()) {
      showToast('Add a caption to save as draft', 'error');
      return;
    }

    const draft = {
      id: `post-${Date.now()}`,
      caption,
      type,
      status: 'draft',
      scheduledAt: new Date(scheduleDate).toISOString(),
      imageColor,
      imageEmoji,
      location,
      tags: [],
      metrics: null,
    };

    addPost(draft);
    showToast('Saved to drafts! 📝', 'info');
  };

  const handleClear = () => {
    setCaption('');
    setLocation('');
    setTags('');
    showToast('Composer cleared', 'info');
  };

  return (
    <div className="pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Post Type & Format Picker */}
          <div className="card p-5 space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              1. Content Format & Aspect Ratio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    type === t
                      ? 'ig-gradient text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Aspect ratio */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Ratio:</span>
              {['1:1', '4:5', '9:16'].map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    aspectRatio === r
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Media Design (Gradient & Emoji) */}
          <div className="card p-5 space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              2. Visual Banner Styling
            </label>
            
            {/* Gradients */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Gradient Palette:</p>
              <div className="flex flex-wrap gap-2.5">
                {imageGradients.map((g) => (
                  <button
                    key={g}
                    onClick={() => setImageColor(g)}
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g} transition-transform hover:scale-110 shadow-sm ${
                      imageColor === g ? 'ring-3 ring-pink-500 ring-offset-2 dark:ring-offset-[#111726]' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Emojis */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Hero Emoji:</p>
              <div className="flex flex-wrap gap-2">
                {emojiIcons.map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setImageEmoji(emo)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                      imageEmoji === emo
                        ? 'bg-pink-100 dark:bg-pink-950 text-pink-600 ring-2 ring-pink-500'
                        : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Caption & Hashtag Editor */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                3. Caption & Storytelling
              </label>
              <span className={`text-xs font-bold ${remaining < 100 ? 'text-rose-500' : 'text-slate-400'}`}>
                {remaining} chars left
              </span>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
              rows={5}
              className="input resize-none text-sm leading-relaxed"
              placeholder="Write an engaging caption, drop value, ask a question to drive comments..."
            />

            {/* Quick Hashtag Insertion */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
                <Hash className="w-3.5 h-3.5 text-pink-500" /> Click to Insert High-Engagement Tags:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedHashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddHashtag(tag)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/50 px-2.5 py-1 rounded-lg transition-all font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata: Location & Tagging */}
          <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-500" /> Add Location
              </label>
              <input
                className="input"
                placeholder="e.g. New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-500" /> Tag Accounts
              </label>
              <input
                className="input"
                placeholder="@collaborator, @brand"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* Scheduling Date & Time */}
          <div className="card p-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Schedule Publishing Time
            </label>
            <input
              type="datetime-local"
              className="input font-medium"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleClear}
              className="btn-secondary"
              title="Clear all fields"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSaveDraft}
              className="btn-secondary flex-1"
            >
              <Save className="w-4 h-4" /> Save as Draft
            </button>
            <button
              onClick={handleSchedule}
              className="btn-primary flex-1 shadow-lg"
            >
              <Send className="w-4 h-4" /> Schedule Drop
            </button>
          </div>
        </div>

        {/* Right Column: Device Live Preview (5 cols) */}
        <div className="lg:col-span-5 flex justify-center sticky top-24">
          <PhoneMockup
            caption={caption}
            type={type}
            emoji={imageEmoji}
            gradient={imageColor}
            accountName={accountName}
            location={location}
            aspectRatio={aspectRatio}
          />
        </div>
      </div>
    </div>
  );
}
