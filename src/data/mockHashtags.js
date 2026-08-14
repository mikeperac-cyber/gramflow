export const hashtagCategories = {
  Business: {
    color: 'from-purple-500 to-indigo-600',
    emoji: '💼',
    tags: [
      { tag: '#smallbusiness', posts: '78M', competition: 'medium', avgEngagement: 3.8 },
      { tag: '#entrepreneur', posts: '91M', competition: 'high', avgEngagement: 3.4 },
      { tag: '#supportsmallbusiness', posts: '45M', competition: 'medium', avgEngagement: 4.1 },
      { tag: '#startup', posts: '44M', competition: 'medium', avgEngagement: 3.2 },
      { tag: '#marketingtips', posts: '19M', competition: 'low', avgEngagement: 4.9 },
      { tag: '#growthmindset', posts: '22M', competition: 'low', avgEngagement: 5.1 },
      { tag: '#shoplocal', posts: '36M', competition: 'medium', avgEngagement: 3.9 },
      { tag: '#businessowner', posts: '35M', competition: 'medium', avgEngagement: 4.0 },
    ],
  },
  Lifestyle: {
    color: 'from-pink-500 to-rose-500',
    emoji: '✨',
    tags: [
      { tag: '#lifestyle', posts: '350M', competition: 'high', avgEngagement: 2.1 },
      { tag: '#aesthetic', posts: '190M', competition: 'high', avgEngagement: 2.8 },
      { tag: '#inspiration', posts: '240M', competition: 'high', avgEngagement: 2.2 },
      { tag: '#slowliving', posts: '14M', competition: 'low', avgEngagement: 5.6 },
      { tag: '#mindfulliving', posts: '9.2M', competition: 'low', avgEngagement: 5.2 },
      { tag: '#dailyinspo', posts: '28M', competition: 'medium', avgEngagement: 3.7 },
      { tag: '#contentcreator', posts: '49M', competition: 'medium', avgEngagement: 4.3 },
    ],
  },
  Food: {
    color: 'from-amber-500 to-orange-500',
    emoji: '🍔',
    tags: [
      { tag: '#foodie', posts: '420M', competition: 'high', avgEngagement: 2.1 },
      { tag: '#foodphotography', posts: '89M', competition: 'medium', avgEngagement: 3.5 },
      { tag: '#homecooking', posts: '35M', competition: 'low', avgEngagement: 4.6 },
      { tag: '#instafood', posts: '210M', competition: 'high', avgEngagement: 2.3 },
      { tag: '#healthyrecipes', posts: '24M', competition: 'low', avgEngagement: 5.0 },
    ],
  },
  Fitness: {
    color: 'from-emerald-500 to-teal-600',
    emoji: '💪',
    tags: [
      { tag: '#fitnessmotivation', posts: '79M', competition: 'medium', avgEngagement: 3.4 },
      { tag: '#workoutroutine', posts: '18M', competition: 'low', avgEngagement: 4.8 },
      { tag: '#homeworkout', posts: '26M', competition: 'low', avgEngagement: 4.9 },
      { tag: '#fitfam', posts: '55M', competition: 'medium', avgEngagement: 3.1 },
    ],
  },
  Travel: {
    color: 'from-sky-500 to-blue-600',
    emoji: '✈️',
    tags: [
      { tag: '#wanderlust', posts: '158M', competition: 'high', avgEngagement: 2.5 },
      { tag: '#travelphotography', posts: '180M', competition: 'high', avgEngagement: 2.8 },
      { tag: '#hiddengems', posts: '13M', competition: 'low', avgEngagement: 5.4 },
      { tag: '#solotravel', posts: '19M', competition: 'low', avgEngagement: 4.7 },
    ],
  },
};

export const trendingHashtags = [
  { tag: '#smallbizgrowth', posts: '1.4M', competition: 'low', growth: '+210%', emoji: '🚀' },
  { tag: '#reelstips', posts: '3.1M', competition: 'low', growth: '+175%', emoji: '🎬' },
  { tag: '#aestheticfeed', posts: '8.4M', competition: 'medium', growth: '+95%', emoji: '✨' },
  { tag: '#contentstrategy', posts: '4.6M', competition: 'low', growth: '+130%', emoji: '💡' },
  { tag: '#sustainablebrand', posts: '2.8M', competition: 'low', growth: '+85%', emoji: '🌱' },
  { tag: '#visualstorytelling', posts: '3.9M', competition: 'low', growth: '+115%', emoji: '📸' },
];

export const defaultHashtagSets = [
  {
    id: 'set-1',
    name: 'Brand & Growth Essentials',
    tags: ['#smallbusiness', '#entrepreneur', '#shoplocal', '#marketingtips', '#contentcreator', '#brandstrategy'],
  },
  {
    id: 'set-2',
    name: 'Engagement & Discoverability',
    tags: ['#explorepage', '#viral', '#trending', '#instadaily', '#visualstorytelling', '#creativelife'],
  },
];
