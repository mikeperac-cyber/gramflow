import React, { useState, useRef } from 'react';
import { format, addDays } from 'date-fns';
import {
  Image as ImageIcon, MapPin, Tag, Hash, Send, Save, Clock,
  Smartphone, Sparkles, Check, Copy, X, RefreshCw, Upload,
  Wand2, Link as LinkIcon, MessageCircle, HelpCircle, BarChart2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { generateAICaption } from '../utils/aiGenerator';

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

function PhoneMockup({
  caption, type, emoji, gradient, customImage,
  accountName, location, aspectRatio, stickerType, stickerText, linkUrl
}) {
  const isStory = type === 'Story' || aspectRatio === '9:16';

  return (
    <div className="flex flex-col items-center">
      {/* Device Bezel */}
      <div className="w-[290px] bg-slate-950 rounded-[3rem] p-3 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30 flex items-center justify-end pr-2">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>

        {/* Screen Content */}
        <div className="bg-white dark:bg-[#0b0f19] rounded-[2.3rem] overflow-hidden flex flex-col h-[530px] text-slate-900 dark:text-slate-100 relative">
          {/* IG Status Bar */}
          <div className="pt-6 px-4 pb-2 flex items-center justify-between text-[11px] font-bold border-b border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 ig-gradient rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-xs">
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
            <span className="text-[10px] text-pink-600 font-extrabold uppercase">{type}</span>
          </div>

          {/* Media Viewport */}
          <div className={`w-full bg-gradient-to-br ${gradient} flex items-center justify-center text-6xl text-white relative shadow-inner overflow-hidden ${
            isStory ? 'flex-1' : aspectRatio === '4:5' ? 'h-64' : 'h-52'
          }`}>
            {customImage ? (
              <img
                src={customImage}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="animate-pulse drop-shadow">{emoji}</span>
            )}

            {/* Story / Reel Interactive Sticker Overlay */}
            {isStory && stickerType === 'poll' && (
              <div className="absolute top-1/3 w-44 bg-white/95 text-slate-900 p-2.5 rounded-2xl shadow-xl text-center z-20">
                <p className="text-[11px] font-extrabold leading-tight mb-2">
                  {stickerText || 'Your Opinion?'}
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                  <div className="py-1 rounded-lg bg-slate-100 border border-slate-200">Yes ✨</div>
                  <div className="py-1 rounded-lg bg-slate-100 border border-slate-200">No 🙅</div>
                </div>
              </div>
            )}

            {isStory && stickerType === 'link' && (
              <div className="absolute bottom-16 bg-white/95 text-slate-900 px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 text-[11px] font-extrabold z-20">
                <LinkIcon className="w-3 h-3 text-sky-500" />
                <span className="truncate max-w-[120px]">{linkUrl || 'linktr.ee/brand'}</span>
              </div>
            )}

            {isStory && stickerType === 'question' && (
              <div className="absolute top-1/4 w-44 bg-white/95 text-slate-900 p-3 rounded-2xl shadow-xl text-center z-20 space-y-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold py-1 px-2 rounded-xl">
                  Ask me a question
                </div>
                <div className="py-1.5 bg-slate-100 text-[10px] text-slate-400 rounded-lg">
                  Type something...
                </div>
              </div>
            )}

            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-semibold text-white/90">
              {type}
            </div>
          </div>

          {/* Feed Post Actions & Caption */}
          {!isStory && (
            <div className="p-3.5 flex-1 flex flex-col justify-between overflow-y-auto bg-white dark:bg-[#0b0f19]">
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
  const fileInputRef = useRef(null);

  const [caption, setCaption] = useState('');
  const [type, setType] = useState('Feed Post');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [imageEmoji, setImageEmoji] = useState('🌸');
  const [imageColor, setImageColor] = useState(imageGradients[0]);
  const [customImage, setCustomImage] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd'T'12:00")
  );

  // Story / Reel Sticker simulator
  const [stickerType, setStickerType] = useState('none'); // none | poll | link | question
  const [stickerText, setStickerText] = useState('Are you excited for the drop?');
  const [linkUrl, setLinkUrl] = useState('linktr.ee/brand');

  // AI Assistant Drawer
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('engaging');
  const [aiCta, setAiCta] = useState('comment');

  const remaining = MAX_CAPTION - caption.length;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target.result);
      showToast('Custom image loaded into mockup! 📸');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAI = (e) => {
    e.preventDefault();
    const generated = generateAICaption({
      topic: aiTopic || 'our new release',
      tone: aiTone,
      ctaType: aiCta
    });

    setCaption(generated);
    setShowAiModal(false);
    showToast('AI Caption applied to composer! ✨');
  };

  const handleAddHashtag = (tag) => {
    setCaption((prev) => {
      const clean = prev.trim();
      return clean ? `${clean} ${tag}` : tag;
    });
  };

  const handleSchedule = () => {
    if (!caption.trim() && !customImage) {
      showToast('Please add a caption or graphic before scheduling.', 'error');
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
      imageUrl: customImage,
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
      imageUrl: customImage,
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
    setCustomImage(null);
    setStickerType('none');
    showToast('Composer reset', 'info');
  };

  return (
    <div className="pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Post Type & Format Picker */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                1. Content Type & Ratio
              </label>
              <button
                onClick={() => setShowAiModal(true)}
                className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border border-pink-200/60 dark:border-pink-800/40 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Copy Assistant</span>
              </button>
            </div>

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

          {/* Media Design (Upload Real Image OR Gradient/Emoji) */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                2. Visual Media & Uploads
              </label>

              {customImage && (
                <button
                  onClick={() => setCustomImage(null)}
                  className="text-[11px] text-rose-500 hover:underline font-semibold"
                >
                  Remove Custom Image
                </button>
              )}
            </div>

            {/* Custom File Upload Button */}
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-pink-500 bg-pink-50/40 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 text-xs font-bold hover:bg-pink-100/60 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Custom Photo / Graphic</span>
              </button>
              <span className="text-[11px] text-slate-400">or use stylized color preset below:</span>
            </div>

            {/* Gradients */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Gradient Presets:</p>
              <div className="flex flex-wrap gap-2.5">
                {imageGradients.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setImageColor(g);
                      setCustomImage(null);
                    }}
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g} transition-transform hover:scale-110 shadow-sm ${
                      imageColor === g && !customImage ? 'ring-3 ring-pink-500 ring-offset-2 dark:ring-offset-[#111726]' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Emojis */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Post Icon:</p>
              <div className="flex flex-wrap gap-2">
                {emojiIcons.map((emo) => (
                  <button
                    key={emo}
                    onClick={() => {
                      setImageEmoji(emo);
                      setCustomImage(null);
                    }}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                      imageEmoji === emo && !customImage
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

          {/* Story / Reel Interactive Stickers (If Story format) */}
          {(type === 'Story' || type === 'Reel') && (
            <div className="card p-5 space-y-3 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-pink-500/30">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                ⭐ Interactive Story Stickers
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'poll', label: '📊 Poll' },
                  { id: 'link', label: '🔗 Link' },
                  { id: 'question', label: '💬 Question' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStickerType(s.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      stickerType === s.id
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {stickerType === 'poll' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Poll Question</label>
                  <input
                    className="input text-xs"
                    value={stickerText}
                    onChange={(e) => setStickerText(e.target.value)}
                  />
                </div>
              )}

              {stickerType === 'link' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Link URL Text</label>
                  <input
                    className="input text-xs"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Caption & Hashtag Editor */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
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
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-500" /> Add Location
              </label>
              <input
                className="input text-xs"
                placeholder="e.g. New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-500" /> Tag Accounts
              </label>
              <input
                className="input text-xs"
                placeholder="@collaborator, @brand"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* Scheduling Date & Time */}
          <div className="card p-5">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Schedule Publishing Time
            </label>
            <input
              type="datetime-local"
              className="input font-medium text-xs"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleClear}
              className="btn-secondary text-xs"
              title="Reset all fields"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSaveDraft}
              className="btn-secondary flex-1 text-xs"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              onClick={handleSchedule}
              className="btn-primary flex-1 shadow-lg text-xs"
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
            customImage={customImage}
            accountName={accountName}
            location={location}
            aspectRatio={aspectRatio}
            stickerType={stickerType}
            stickerText={stickerText}
            linkUrl={linkUrl}
          />
        </div>
      </div>

      {/* AI Copywriting Assistant Modal */}
      {showAiModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAiModal(false)}
        >
          <div
            className="card max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl ig-gradient text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    AI Copywriting Assistant
                  </h3>
                  <p className="text-[11px] text-slate-400">Generate viral hooks & high-converting captions in seconds</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAI} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Post Topic / Product Angle
                </label>
                <input
                  className="input text-xs"
                  placeholder="e.g. organic summer iced matcha drop, sustainable linen dress launch..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Tone & Persona
                  </label>
                  <select
                    className="input text-xs"
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                  >
                    <option value="engaging">Engaging & Community</option>
                    <option value="promotional">Promotional & Sales</option>
                    <option value="educational">Educational & Tips</option>
                    <option value="witty">Witty & Playful</option>
                    <option value="aesthetic">Minimalist & Aesthetic</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Call To Action
                  </label>
                  <select
                    className="input text-xs"
                    value={aiCta}
                    onChange={(e) => setAiCta(e.target.value)}
                  >
                    <option value="comment">Drive Comments & Replies</option>
                    <option value="bio">Direct to Link in Bio</option>
                    <option value="dm">Send DM for Info</option>
                    <option value="save">Save for Later</option>
                    <option value="share">Share with a Friend</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="btn-secondary flex-1 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 text-xs"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate & Apply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
