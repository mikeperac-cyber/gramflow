export const defaultCompetitors = [
  {
    id: 'comp-1',
    handle: 'luma_studio',
    name: 'Luma Studio & Goods',
    category: 'Design & Goods',
    followers: 24800,
    followerGrowth: '+8.4%',
    engagementRate: 4.8,
    postsPerWeek: 4.5,
    topFormat: 'Reels (62% of reach)',
    avatar: '🌟',
    color: 'from-purple-500 to-indigo-600',
    strengths: ['High Reel Velocity', 'Strong Hook Usage', 'Frequent Story Polls'],
    weaknesses: ['Low Comment Reply Rate', 'Irregular Carousel Cadence'],
    recentPosts: [
      { id: 'cp1', title: 'Studio tour reel', likes: 1420, comments: 84, format: 'Reel' },
      { id: 'cp2', title: 'Material texture carousel', likes: 890, comments: 42, format: 'Carousel' },
    ]
  },
  {
    id: 'comp-2',
    handle: 'nordic_craft',
    name: 'Nordic Craft Co.',
    category: 'Minimal Living',
    followers: 18900,
    followerGrowth: '+5.2%',
    engagementRate: 3.9,
    postsPerWeek: 3.0,
    topFormat: 'Carousels (54% of saves)',
    avatar: '🌲',
    color: 'from-emerald-500 to-teal-700',
    strengths: ['High Bookmark / Save Rate', 'Aesthetic Grid Harmony'],
    weaknesses: ['Infrequent Video Drops', 'Low Story Engagement'],
    recentPosts: [
      { id: 'cp3', title: '5 Tips for mindful spaces', likes: 1120, comments: 67, format: 'Carousel' },
      { id: 'cp4', title: 'Morning ritual photo', likes: 640, comments: 31, format: 'Feed Post' },
    ]
  }
];

export const benchmarkMetrics = [
  { metric: 'Avg. Engagement Rate', yourBrand: '4.6%', industryAvg: '3.2%', leader: '4.8%' },
  { metric: 'Posting Frequency / Wk', yourBrand: '3.5 drops', industryAvg: '4.0 drops', leader: '5.2 drops' },
  { metric: 'Comment Response Time', yourBrand: '18 mins (Fast)', industryAvg: '4.2 hrs', leader: '15 mins' },
  { metric: 'Reel-to-Feed Ratio', yourBrand: '40% Reels', industryAvg: '55% Reels', leader: '65% Reels' }
];
