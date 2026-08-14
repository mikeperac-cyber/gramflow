import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Image, MapPin, Tag, Hash, Send, Save, Clock, Smartphone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const POST_TYPES = ['Feed Post', 'Reel', 'Story', 'Carousel'];
const MAX_CAPTION = 2200;

const suggestedHashtags = [
  '#smallbusiness', '#entrepreneur', '#explore', '#viral', '#trending',
  '#instagood', '#photooftheday', '#reels', '#instadaily', '#fyp',
  '#shoplocal', '#supportsmallbusiness', '#contentstrategy', '#socialmedia',
];

function IgPhonePreview({ caption, type, imageEmoji, imageColor }) {
  return (
    <div className="flex flex-col items-center">
      {/* Phone frame */}
      <div className="w-56 bg-white dark:bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-800 dark:border-gray-600 shadow-2xl overflow-hidden">
        {/* Status bar */}
        <div className="bg-gray-800 dark:bg-gray-600 h-5 flex items-center justify-center">
          <div className="w-16 h-2 bg-gray-700 rounded-full" />
        </div>
        {/* IG header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="w-6 h-6 ig-gradient rounded-full" />
          <span className="text-[10px] font-bold text-gray-800 dark:text-gray-100">youraccount</span>
          <span className="ml-auto text-[9px] text-blue-500 font-medium">Follow</span>
        </div>
        {/* Image area */}
        <div className={`w-full h-48 bg-gradient-to-br ${imageColor} flex items-center justify-center text-4xl`}>
          {imageEmoji || '📸'}
        </div>
        {/* Actions */}
        <div className="px-3 py-2">
          <div className="flex gap-3 mb-2">
            <span className="text-sm">❤️</span>
            <span className="text-sm">💬</span>
            <span className="text-sm">📤</span>
            <span className="text-sm ml-auto">🔖</span>
          </div>
          <p className="text-[9px] font-bold text-gray-800 dark:text-gray-100">247 likes</p>
          <div className="text-[9px] text-gray-600 dark:text-gray-300 mt-1 leading-relaxed line-clamp-3">
            <span className="font-bold">youraccount</span>{' '}
            {caption || 'Your caption will appear here…'}
          </div>
          <p className="text-[8px] text-gray-400 mt-1 uppercase tracking-wide">{type} · just now</p>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2">Live Preview</p>
    </div>
  );
}

export default function PostComposer() {
  const { addPost, showToast, addNotification } = useApp();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [type, setType] = useState('Feed Post');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [imageEmoji, setImageEmoji] = useState('📸');
  const [imageColor, setImageColor] = useState('from-pink-400 to-purple-500');
  const [scheduleDate, setScheduleDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
  const [saved, setSaved] = useState(false);

  const imageColors = [
    'from-pink-400 to-purple-500',
    'from-orange-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-teal-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-green-400 to-teal-500',
    'from-purple-400 to-pink-500',
    'from-rose-400 to-red-500',
  ];

  const emojis = ['📸', '🌸', '🚀', '☀️', '🎉', '💡', '✨', '🎨', '🌿', '🏆', '🛍️', '💼'];

  const fullCaption = caption + (hashtags ? '\n\n' + hashtags : '');
  const remaining = MAX_CAPTION - fullCaption.length;

  const handleAddHashtag = (tag) => {
    setHashtags((prev) => {
      const existing = prev.trim();
      return existing ? existing + ' ' + tag : tag;
    });
  };

  const handleSchedule = () => {
    if (!caption.trim()) {
      showToast('Please add a caption before scheduling.', 'error');
      return;
    }
    const id = `post-${Date.now()}`;
    addPost({
      id,
      caption:     fullCaption,
      hashtags,
      type,
      status:      'scheduled',
      scheduledAt: new Date(scheduleDate).toISOString(),
      imageColor,
      imageEmoji,
      location,
      tags:        tags.split(',').map((t) => t.trim()).filter(Boolean),
      metrics:     null,
    });
    addNotification({
      type:    'post',
      message: `Post scheduled for ${format(new Date(scheduleDate), 'MMM d, h:mm a')} 📅`,
      icon:    '📅',
    });
    showToast('Post scheduled successfully! ✅');
    navigate('/calendar');
  };

  const handleSaveDraft = () => {
    if (!caption.trim()) {
      showToast('Nothing to save — add a caption first.', 'error');
      return;
    }
    addPost({
      id:          `post-${Date.now()}`,
      caption:     fullCaption,
      hashtags,
      type,
      status:      'draft',
      scheduledAt: new Date(scheduleDate).toISOString(),
      imageColor,
      imageEmoji,
      location,
      tags:        [],
      metrics:     null,
    });
    showToast('Draft saved! ✏️', 'info');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-20 md:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Post type */}
          <div className="card p-5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 block">Post Type</label>
            <div className="flex gap-2 flex-wrap">
              {POST_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    type === t
                      ? 'ig-gradient text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Media mock */}
          <div className="card p-5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 block">Media</label>
            {/* Color picker */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-2">Background gradient</p>
              <div className="flex gap-2 flex-wrap">
                {imageColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setImageColor(c)}
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c} transition-transform hover:scale-110 ${imageColor === c ? 'ring-2 ring-gram-500 ring-offset-2' : ''}`}
                  />
                ))}
              </div>
            </div>
            {/* Emoji picker */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Post icon</p>
              <div className="flex gap-2 flex-wrap">
                {emojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setImageEmoji(e)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all hover:scale-110 ${
                      imageEmoji === e
                        ? 'bg-gram-100 dark:bg-gram-900/40 ring-2 ring-gram-500 ring-offset-1'
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Caption</label>
              <span className={`text-xs font-medium ${remaining < 100 ? 'text-red-500' : 'text-gray-400'}`}>
                {remaining} remaining
              </span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
              rows={5}
              className="input resize-none"
              placeholder="Write your caption here… 🌟"
            />
          </div>

          {/* Hashtags */}
          <div className="card p-5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              <Hash className="w-3.5 h-3.5 inline mr-1" /> Hashtags
            </label>
            <textarea
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              rows={2}
              className="input resize-none mb-3"
              placeholder="#hashtag1 #hashtag2 …"
            />
            <p className="text-xs text-gray-400 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedHashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddHashtag(tag)}
                  className="text-xs bg-gram-50 dark:bg-gram-900/30 text-gram-600 dark:text-gram-400 hover:bg-gram-100 dark:hover:bg-gram-900/50 px-2 py-1 rounded-lg transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Tags */}
          <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                <MapPin className="w-3.5 h-3.5 inline mr-1" /> Location
              </label>
              <input className="input" placeholder="New York, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                <Tag className="w-3.5 h-3.5 inline mr-1" /> Tag People
              </label>
              <input className="input" placeholder="@username1, @username2" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>

          {/* Schedule */}
          <div className="card p-5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              <Clock className="w-3.5 h-3.5 inline mr-1" /> Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              className="input"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSaveDraft} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Draft'}
            </button>
            <button onClick={handleSchedule} className="btn-primary flex items-center gap-2 flex-1 justify-center">
              <Send className="w-4 h-4" /> Schedule Post
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex justify-center lg:sticky lg:top-4">
          <IgPhonePreview
            caption={fullCaption}
            type={type}
            imageEmoji={imageEmoji}
            imageColor={imageColor}
          />
        </div>
      </div>
    </div>
  );
}
