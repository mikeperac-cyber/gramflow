import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare, Send, CheckCheck, Clock, Tag, Search,
  Sparkles, Filter, CheckCircle2, ShieldCheck, CornerDownRight,
  Zap, Heart, Smile, AlertCircle, Plus, Trash2, X
} from 'lucide-react';

const SENTIMENT_STYLES = {
  lead:     { label: 'Hot Lead', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  question: { label: 'Inquiry',  bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
  praise:   { label: 'Praise',   bg: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800' },
  support:  { label: 'Support',  bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' }
};

export default function InboxCRM() {
  const {
    conversations, addConversation, deleteConversation,
    replyToConversation, toggleConversationRead,
    cannedResponses, setCannedResponses,
    showToast
  } = useApp();

  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [filter, setFilter] = useState('all'); // all | unread | dm | comment | lead
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');

  // New Message Simulation Modal
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simName, setSimName] = useState('');
  const [simHandle, setSimHandle] = useState('');
  const [simChannel, setSimChannel] = useState('dm');
  const [simSentiment, setSimSentiment] = useState('lead');
  const [simMessage, setSimMessage] = useState('');
  const [simTags, setSimTags] = useState('Product Inquiry, New Prospect');

  // Custom Canned Response Modal
  const [showAddCannedModal, setShowAddCannedModal] = useState(false);
  const [cannedTitle, setCannedTitle] = useState('');
  const [cannedBody, setCannedBody] = useState('');

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

  const handleCreateSimulation = (e) => {
    e.preventDefault();
    if (!simMessage.trim() || !simHandle.trim()) {
      showToast('Please provide a handle and message', 'error');
      return;
    }

    const cleanHandle = simHandle.trim().replace(/^@/, '');
    const newConv = {
      id: `conv-${Date.now()}`,
      user: {
        name: simName.trim() || cleanHandle,
        handle: cleanHandle,
        avatar: '💬',
        verified: false,
      },
      channel: simChannel,
      sentiment: simSentiment,
      unread: true,
      lastActivity: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'user',
          text: simMessage.trim(),
          time: 'Just now',
        }
      ],
      tags: simTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    addConversation(newConv);
    setActiveConvId(newConv.id);
    setShowSimulateModal(false);
    setSimMessage('');
    setSimHandle('');
    setSimName('');
    showToast(`Incoming ${simChannel.toUpperCase()} from @${cleanHandle} simulated! ✨`);
  };

  const handleAddCannedResponse = (e) => {
    e.preventDefault();
    if (!cannedTitle.trim() || !cannedBody.trim()) return;

    const newCanned = {
      id: `c-${Date.now()}`,
      title: cannedTitle.trim(),
      text: cannedBody.trim(),
    };

    setCannedResponses(prev => [...prev, newCanned]);
    setShowAddCannedModal(false);
    setCannedTitle('');
    setCannedBody('');
    showToast('Saved custom canned response! 📝');
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddCannedModal(true)}
            className="btn-secondary text-xs !py-2.5 !px-3.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+ Canned Reply</span>
          </button>
          <button
            onClick={() => setShowSimulateModal(true)}
            className="btn-primary text-xs !py-2.5 !px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Simulate Customer Message</span>
          </button>
        </div>
      </div>

      {/* Filter Badges */}
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

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversation List */}
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
              <div className="py-14 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Your Inbox is completely clean</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Click the button below to test custom incoming leads or customer comments.
                </p>
                <button
                  onClick={() => setShowSimulateModal(true)}
                  className="btn-primary text-xs !py-2 !px-3 mx-auto mt-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Test Customer Message
                </button>
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
                        @{conv.user.handle} · {conv.channel === 'dm' ? '💬 Direct Message' : `📌 Comment on "${conv.postTitle || 'Post'}"`}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1 leading-snug font-medium">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${sentimentInfo.bg}`}>
                          {sentimentInfo.label}
                        </span>
                        {conv.tags?.map(t => (
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

        {/* Right Column: Active Thread & Quick Replies */}
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
                <button
                  onClick={() => deleteConversation(activeConv.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                  title="Delete conversation"
                >
                  <Trash2 className="w-4 h-4" />
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
                  <Zap className="w-3 h-3 text-amber-500" /> 1-Click Canned Templates:
                </span>
                <button
                  onClick={() => setShowAddCannedModal(true)}
                  className="text-pink-600 hover:underline"
                >
                  + Add Custom Template
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cannedResponses.map((c) => (
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
          <div className="lg:col-span-7 card p-16 text-center text-slate-400 space-y-2">
            <p className="font-bold text-slate-700 dark:text-slate-300">No conversation selected</p>
            <p className="text-xs">Select a thread or simulate an incoming customer message to test responses.</p>
          </div>
        )}
      </div>

      {/* Modal: Simulate Customer Message / Lead */}
      {showSimulateModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowSimulateModal(false)}
        >
          <div
            className="card max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Simulate Incoming Message / Lead
              </h3>
              <button onClick={() => setShowSimulateModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSimulation} className="space-y-4 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Handle</label>
                  <input
                    className="input text-xs"
                    placeholder="e.g. prospect_brand"
                    value={simHandle}
                    onChange={(e) => setSimHandle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Customer Name</label>
                  <input
                    className="input text-xs"
                    placeholder="e.g. Alex Morgan"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Channel</label>
                  <select
                    className="input text-xs"
                    value={simChannel}
                    onChange={(e) => setSimChannel(e.target.value)}
                  >
                    <option value="dm">Direct Message (DM)</option>
                    <option value="comment">Public Post Comment</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Lead Tag</label>
                  <select
                    className="input text-xs"
                    value={simSentiment}
                    onChange={(e) => setSimSentiment(e.target.value)}
                  >
                    <option value="lead">⭐ Hot Lead</option>
                    <option value="question">Inquiry / Question</option>
                    <option value="praise">Praise & Love</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Incoming Message Text</label>
                <textarea
                  className="input text-xs resize-none"
                  rows={3}
                  placeholder="e.g. Hey! I saw your reel, do you have size Large in stock?"
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSimulateModal(false)} className="btn-secondary flex-1 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 text-xs">
                  Add to Inbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Canned Reply */}
      {showAddCannedModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddCannedModal(false)}
        >
          <div
            className="card max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Create Canned Quick Reply
              </h3>
              <button onClick={() => setShowAddCannedModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCannedResponse} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Button Title</label>
                <input
                  className="input text-xs"
                  placeholder="e.g. Return Policy"
                  value={cannedTitle}
                  onChange={(e) => setCannedTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Response Body</label>
                <textarea
                  className="input text-xs resize-none"
                  rows={3}
                  placeholder="e.g. We offer 30-day hassle-free returns on all unworn items! ✨"
                  value={cannedBody}
                  onChange={(e) => setCannedBody(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddCannedModal(false)} className="btn-secondary flex-1 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 text-xs">
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
