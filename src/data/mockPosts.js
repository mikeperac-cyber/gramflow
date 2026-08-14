// Clean initial state: no hardcoded demo posts.
// The user starts fresh and creates their own content!
export const defaultPosts = [];

export const sampleStarterPosts = [
  {
    id: 'post-sample-1',
    caption: '✨ Launch day is finally here! We are thrilled to share our new collection with all of you. Link in bio to explore! 🚀 #LaunchDay #NewCollection #SmallBusiness',
    hashtags: '#LaunchDay #NewCollection #SmallBusiness #ShopLocal',
    type: 'Feed Post',
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    imageColor: 'from-purple-600 via-pink-600 to-amber-500',
    imageEmoji: '🚀',
    location: 'Los Angeles, CA',
    tags: ['@team'],
    metrics: null,
  },
  {
    id: 'post-sample-2',
    caption: 'Behind the scenes at the studio today 📸 Crafting something special for next week. Which colorway is your favorite? Drop a comment below! 👇',
    hashtags: '#BehindTheScenes #StudioLife #CreativeProcess #Design',
    type: 'Carousel',
    status: 'draft',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    imageColor: 'from-pink-500 via-rose-500 to-orange-400',
    imageEmoji: '🎨',
    location: 'Design Studio',
    tags: ['@creatives'],
    metrics: null,
  }
];
