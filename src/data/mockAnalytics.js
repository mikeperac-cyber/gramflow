// Generate 90 days of follower growth
export const generateFollowerGrowth = (days = 90) => {
  const data = [];
  let followers = 8230;
  const now = new Date(2026, 7, 15);
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dailyGain = Math.floor(Math.random() * 80) - 10 + (Math.random() < 0.1 ? 120 : 0);
    followers = Math.max(0, followers + dailyGain);
    data.push({
      date: date.toISOString().split('T')[0],
      followers,
    });
  }
  return data;
};

// Engagement rate per post (last 10 published)
export const generateEngagementData = () => {
  const posts = [
    'Summer Drop', 'BTS Shoot', 'Customer Love', 'Big Announcement',
    'Sustainability', 'Good Vibes', 'Back in Stock', 'Weekend',
    'Morning Tips', 'New Arrivals',
  ];
  return posts.map((name, i) => ({
    name,
    engagement: +(Math.random() * 6 + 1.5).toFixed(2),
    likes:    Math.floor(Math.random() * 2000 + 200),
    comments: Math.floor(Math.random() * 150 + 10),
    reach:    Math.floor(Math.random() * 10000 + 1000),
  }));
};

// Best time to post heatmap (7 days × 24 hours)
export const generateHeatmapData = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data = [];
  // Peak hours: 12-2pm and 7-9pm, weekdays
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let base = Math.random() * 20;
      // Boost lunch and evening
      if (h >= 11 && h <= 14) base += 40 + Math.random() * 30;
      if (h >= 18 && h <= 21) base += 50 + Math.random() * 40;
      // Boost weekdays slightly
      if (d >= 1 && d <= 5) base += 15;
      // Early morning / late night penalty
      if (h < 6 || h > 22) base = Math.max(base - 30, 2);
      data.push({
        day:   days[d],
        hour:  h,
        label: `${h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}`,
        value: Math.round(Math.min(base, 100)),
      });
    }
  }
  return data;
};

// KPI summary cards
export const generateKPIs = (range = 30) => {
  return {
    followers:     { value: 10842, change: +6.2,  label: 'Followers' },
    reach:         { value: 84300, change: +12.1, label: 'Reach' },
    impressions:   { value: 212000, change: +8.7, label: 'Impressions' },
    engagementRate:{ value: 3.8,   change: +0.4,  label: 'Engagement Rate', suffix: '%' },
  };
};

// Top performing posts
export const generateTopPosts = () => [
  { id: 1, title: 'Back in Stock Announcement',    likes: 2340, comments: 167, reach: 11800, saves: 543, imageColor: 'from-orange-400 to-pink-500',    emoji: '🎉' },
  { id: 2, title: 'Behind the Scenes — New Shoot', likes: 1870, comments: 203, reach: 9400,  saves: 412, imageColor: 'from-purple-400 to-pink-500',  emoji: '📸' },
  { id: 3, title: 'Customer Appreciation Post',    likes: 1640, comments: 98,  reach: 8200,  saves: 287, imageColor: 'from-teal-400 to-blue-500',    emoji: '🥰' },
  { id: 4, title: '5 Morning Routine Tips',         likes: 1410, comments: 76,  reach: 7900,  saves: 801, imageColor: 'from-yellow-400 to-orange-500', emoji: '☕' },
  { id: 5, title: 'Summer Collection Drop',         likes: 1280, comments: 55,  reach: 6700,  saves: 234, imageColor: 'from-pink-400 to-purple-500',  emoji: '☀️' },
];
