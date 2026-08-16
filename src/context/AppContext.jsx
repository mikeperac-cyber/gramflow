import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/localStorage';
import { defaultPosts, sampleStarterPosts } from '../data/mockPosts';
import { defaultQuickRules, defaultIftttFlows, defaultCronJobs } from '../data/mockAutomations';
import { defaultHashtagSets } from '../data/mockHashtags';
import { generateNotifications } from '../data/mockNotifications';
import { defaultConversations } from '../data/mockInbox';
import { defaultCompetitors } from '../data/mockCompetitors';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Account ───────────────────────────────────────────────
  const [accountName, setAccountNameState] = useState(() =>
    storage.get('gramflow:account', '')
  );
  const [showAccountModal, setShowAccountModal] = useState(() =>
    !storage.get('gramflow:account', '')
  );

  const setAccountName = useCallback((name) => {
    setAccountNameState(name);
    storage.set('gramflow:account', name);
    setShowAccountModal(false);
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
    setQuickRulesState(defaultQuickRules);
    setIftttFlowsState(defaultIftttFlows);
    setCronJobsState(defaultCronJobs);
    setHashtagSetsState(defaultHashtagSets);
    setConversationsState(defaultConversations);
    setCompetitorsState(defaultCompetitors);
    setNotifications(generateNotifications());
    setAccountNameState('');
    setShowAccountModal(true);
  }, []);

  const value = {
    // Account
    accountName, setAccountName,
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
    conversations, setConversations, replyToConversation, toggleConversationRead,
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
