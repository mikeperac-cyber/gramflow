import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare, Send, CheckCheck, Clock, Tag, Search,
  Sparkles, Filter, CheckCircle2, ShieldCheck, CornerDownRight,
  Zap, Heart, Smile, AlertCircle
} from 'lucide-react';
import { quickCannedResponses } from '../data/mockInbox';

const SENTIMENT_STYLES = {
  lead:     { label: 'Hot Lead', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  question: { label: 'Inquiry',  bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  praise:   { label: 'Praise',   bg: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800' },
  support:  { label: 'Support',  bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
};

export default function InboxCRM() {
  const { conversations, replyToConversation, toggleConversationRead, showToast } = useApp();
  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [filter, setFilter] = useState('all'); // all | unread | dm | comment | lead
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter(c => {
    if (filter === 'unread' && !c.unread) return false;
    if (filter === 'dm' && c.channel !== 'dm') return false;
    if (filter === 'comment' && c.channel !== 'comment') return false;
    if (filter === 'lead' && c.sentiment !== 'lead') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.user.name.toLowerCase().includes(q) ||
        c.user.handle.toLowerCase().includes(q) ||
        c.messages.some(m => m.text.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    replyToConversation(activeConv.id, replyText.trim());
    setReplyText('');
    showToast(`Replied to @${activeConv.user.handle}! 💬`);
  };

  const handleInsertCanned = (text) => {
    setReplyText(text);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-pink-500" />
            <span>Community & Inbox CRM</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Convert comments and DMs into customers with fast canned replies and lead tagging.
          </p>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Inboxes' },
            { id: 'unread', label: 'Unread' },
            { id: 'dm', label: 'DMs Only' },
            { id: 'comment', label: 'Comments' },
            { id: 'lead', label: '⭐ Hot Leads' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.id
                  ? 'ig-gradient text-white shadow-sm'
                  : 'bg-white dark:bg-[#111726] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main CRM Grid (2 Columns: List on Left, Active Chat on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversation List (5 cols) */}
        <div className="lg:col-span-5 card p-4 space-y-4 shadow-sm">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search conversations, tags, handles..."
              className="bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[580px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const sentimentInfo = SENTIMENT_STYLES[conv.sentiment] || SENTIMENT_STYLES.question;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 my-1 ${
                      isSelected
                        ? 'bg-pink-50/60 dark:bg-slate-800/80 border border-pink-500/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-sm">
                        {conv.user.avatar}
                      </div>
                      {conv.unread && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {conv.user.name}
                          </p>
                          {conv.user.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{conv.lastActivity}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        @{conv.user.handle} · {conv.channel === 'dm' ? '💬 Direct Message' : `📌 Comment on "${conv.postTitle}"`}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1 leading-snug font-medium">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${sentimentInfo.bg}`}>
                          {sentimentInfo.label}
                        </span>
                        {conv.tags.map(t => (
                          <span key={t} className="text-[9px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Thread & Quick Replies (7 cols) */}
        {activeConv ? (
          <div className="lg:col-span-7 card p-6 flex flex-col justify-between h-[640px] shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm">
                  {activeConv.user.avatar}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{activeConv.user.name}</span>
                    <span className="text-xs text-slate-400 font-normal">(@{activeConv.user.handle})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Channel: <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">{activeConv.channel}</span>
                    {activeConv.postTitle && ` · Post: "${activeConv.postTitle}"`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleConversationRead(activeConv.id)}
                  className="btn-ghost text-xs !py-1.5 !px-3 border border-slate-200 dark:border-slate-700"
                >
                  {activeConv.unread ? 'Mark as Read' : 'Mark Unread'}
                </button>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {activeConv.messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'ig-gradient text-white font-medium shadow-md rounded-br-xs'
                          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Canned Quick Replies */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Fast 1-Click Canned Replies:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickCannedResponses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleInsertCanned(c.text)}
                    className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/60 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg transition-all font-medium text-left"
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Input */}
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                className="input text-xs !py-3 flex-1"
                placeholder={`Reply to @${activeConv.user.handle}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="btn-primary !px-5 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 card p-12 text-center text-slate-400">
            Select a conversation to reply
          </div>
        )}
      </div>
    </div>
  );
}
