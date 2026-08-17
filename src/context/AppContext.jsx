import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/localStorage';
import { defaultPosts, sampleStarterPosts } from '../data/mockPosts';
import { defaultQuickRules, defaultIftttFlows, defaultCronJobs } from '../data/mockAutomations';
import { defaultHashtagSets } from '../data/mockHashtags';
import { generateNotifications } from '../data/mockNotifications';
import { defaultConversations, defaultCannedResponses } from '../data/mockInbox';
import { defaultCompetitors } from '../data/mockCompetitors';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Account & Brand Customizations ────────────────────────
  const [accountName, setAccountNameState] = useState(() =>
    storage.get('gramflow:account', '')
  );
  const [showAccountModal, setShowAccountModal] = useState(() =>
    !storage.get('gramflow:account', '')
  );

  const [profileBio, setProfileBioState] = useState(() =>
    storage.get('gramflow:bio', '✨ Welcome to our official Instagram page!\n🌿 Share your thoughts & explore our latest drops below.\n🛍️ Tap the link for updates!')
  );

  const [websiteUrl, setWebsiteUrlState] = useState(() =>
    storage.get('gramflow:website', 'linktr.ee/mybrand')
  );

  const [profileAvatar, setProfileAvatarState] = useState(() =>
    storage.get('gramflow:avatar', '✨')
  );

  const [followerBaseline, setFollowerBaselineState] = useState(() =>
    storage.get('gramflow:followers', 1250)
  );

  const [profileHighlights, setProfileHighlightsState] = useState(() =>
    storage.get('gramflow:highlights', [
      { id: 'h1', label: 'Drops ✨', emoji: '🛍️' },
      { id: 'h2', label: 'BTS 📸', emoji: '🎨' },
      { id: 'h3', label: 'Reviews ⭐', emoji: '💌' },
      { id: 'h4', label: 'About Us', emoji: '🌱' },
    ])
  );

  const setAccountName = useCallback((name) => {
    setAccountNameState(name);
    storage.set('gramflow:account', name);
    setShowAccountModal(false);
  }, []);

  const setProfileBio = useCallback((bio) => {
    setProfileBioState(bio);
    storage.set('gramflow:bio', bio);
  }, []);

  const setWebsiteUrl = useCallback((url) => {
    setWebsiteUrlState(url);
    storage.set('gramflow:website', url);
  }, []);

  const setProfileAvatar = useCallback((av) => {
    setProfileAvatarState(av);
    storage.set('gramflow:avatar', av);
  }, []);

  const setFollowerBaseline = useCallback((count) => {
    const num = Number(count) || 0;
    setFollowerBaselineState(num);
    storage.set('gramflow:followers', num);
  }, []);

  const setProfileHighlights = useCallback((updater) => {
    setProfileHighlightsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:highlights', next);
      return next;
    });
  }, []);

  // ── Theme ─────────────────────────────────────────────────
  const [darkMode, setDarkModeState] = useState(() =>
    storage.get('gramflow:darkMode', false)
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDark = useCallback(() => {
    setDarkModeState((d) => {
      const next = !d;
      storage.set('gramflow:darkMode', next);
      return next;
    });
  }, []);

  // ── Posts (Clean empty state by default) ───────────────────
  const [posts, setPostsState] = useState(() =>
    storage.get('gramflow:posts', defaultPosts)
  );

  const setPosts = useCallback((updater) => {
    setPostsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:posts', next);
      return next;
    });
  }, []);

  const addPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev]);
  }, [setPosts]);

  const updatePost = useCallback((id, updates) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, [setPosts]);

  const deletePost = useCallback((id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, [setPosts]);

  const reorderPosts = useCallback((newOrderedPosts) => {
    setPosts(newOrderedPosts);
  }, [setPosts]);

  const loadSampleData = useCallback(() => {
    setPosts(sampleStarterPosts);
  }, [setPosts]);

  // ── Automations ───────────────────────────────────────────
  const [quickRules, setQuickRulesState] = useState(() =>
    storage.get('gramflow:quickRules', defaultQuickRules)
  );
  const setQuickRules = useCallback((updater) => {
    setQuickRulesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:quickRules', next);
      return next;
    });
  }, []);

  const [iftttFlows, setIftttFlowsState] = useState(() =>
    storage.get('gramflow:iftttFlows', defaultIftttFlows)
  );
  const setIftttFlows = useCallback((updater) => {
    setIftttFlowsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:iftttFlows', next);
      return next;
    });
  }, []);

  const [cronJobs, setCronJobsState] = useState(() =>
    storage.get('gramflow:cronJobs', defaultCronJobs)
  );
  const setCronJobs = useCallback((updater) => {
    setCronJobsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:cronJobs', next);
      return next;
    });
  }, []);

  // ── Hashtag Sets ──────────────────────────────────────────
  const [hashtagSets, setHashtagSetsState] = useState(() =>
    storage.get('gramflow:hashtagSets', defaultHashtagSets)
  );
  const setHashtagSets = useCallback((updater) => {
    setHashtagSetsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:hashtagSets', next);
      return next;
    });
  }, []);

  // ── Inbox & Comments CRM ──────────────────────────────────
  const [conversations, setConversationsState] = useState(() =>
    storage.get('gramflow:conversations', defaultConversations)
  );

  const setConversations = useCallback((updater) => {
    setConversationsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:conversations', next);
      return next;
    });
  }, []);

  const addConversation = useCallback((conv) => {
    setConversations((prev) => [conv, ...prev]);
  }, [setConversations]);

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter(c => c.id !== id));
  }, [setConversations]);

  const replyToConversation = useCallback((convId, messageText) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const newMsg = {
            id: `m-${Date.now()}`,
            sender: 'me',
            text: messageText,
            time: 'Just now',
          };
          return {
            ...c,
            unread: false,
            lastActivity: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  }, [setConversations]);

  const toggleConversationRead = useCallback((convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread: !c.unread } : c))
    );
  }, [setConversations]);

  // Canned Responses
  const [cannedResponses, setCannedResponsesState] = useState(() =>
    storage.get('gramflow:canned', defaultCannedResponses)
  );

  const setCannedResponses = useCallback((updater) => {
    setCannedResponsesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:canned', next);
      return next;
    });
  }, []);

  // ── Competitors Intelligence ──────────────────────────────
  const [competitors, setCompetitorsState] = useState(() =>
    storage.get('gramflow:competitors', defaultCompetitors)
  );

  const setCompetitors = useCallback((updater) => {
    setCompetitorsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set('gramflow:competitors', next);
      return next;
    });
  }, []);

  const addCompetitor = useCallback((comp) => {
    setCompetitors((prev) => [comp, ...prev]);
  }, [setCompetitors]);

  const removeCompetitor = useCallback((id) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  }, [setCompetitors]);

  // ── Notifications ─────────────────────────────────────────
  const [notifications, setNotifications] = useState(() =>
    storage.get('gramflow:notifications', generateNotifications())
  );

  const addNotification = useCallback((notif) => {
    const n = {
      id: `n-${Date.now()}`,
      read: false,
      time: 'Just now',
      ...notif,
    };
    setNotifications((prev) => {
      const next = [n, ...prev].slice(0, 50);
      storage.set('gramflow:notifications', next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      storage.set('gramflow:notifications', next);
      return next;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    storage.set('gramflow:notifications', []);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Toast ─────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // ── Complete Reset (Erases all user data) ────────────────
  const resetAll = useCallback(() => {
    storage.clear();
    setPostsState([]);
    setQuickRulesState([]);
    setIftttFlowsState([]);
    setCronJobsState([]);
    setHashtagSetsState([]);
    setConversationsState([]);
    setCompetitorsState([]);
    setNotifications([]);
    setAccountNameState('');
    setProfileBioState('✨ Welcome to our official Instagram page!\n🌿 Share your thoughts & explore our latest drops below.\n🛍️ Tap the link for updates!');
    setWebsiteUrlState('linktr.ee/mybrand');
    setProfileAvatarState('✨');
    setFollowerBaselineState(0);
    setShowAccountModal(true);
  }, []);

  const value = {
    // Brand & Profile Customization
    accountName, setAccountName,
    profileBio, setProfileBio,
    websiteUrl, setWebsiteUrl,
    profileAvatar, setProfileAvatar,
    followerBaseline, setFollowerBaseline,
    profileHighlights, setProfileHighlights,
    showAccountModal, setShowAccountModal,
    // Theme
    darkMode, toggleDark,
    // Posts & Feed Grid
    posts, addPost, updatePost, deletePost, reorderPosts, loadSampleData,
    // Automations
    quickRules, setQuickRules,
    iftttFlows, setIftttFlows,
    cronJobs, setCronJobs,
    // Hashtags
    hashtagSets, setHashtagSets,
    // Inbox CRM
    conversations, setConversations, addConversation, deleteConversation,
    replyToConversation, toggleConversationRead,
    cannedResponses, setCannedResponses,
    // Competitors
    competitors, addCompetitor, removeCompetitor,
    // Notifications
    notifications, addNotification, markAllRead, clearNotifications, unreadCount,
    // Toast
    toasts, showToast,
    // Reset
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
