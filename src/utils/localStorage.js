export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
  clear: () => {
    try {
      const keysToKeep = [];
      localStorage.clear();
    } catch {}
  },
};
