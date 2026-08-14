export const defaultQuickRules = [
  {
    id: 'qr-1',
    title: 'Auto-reply to Pricing Questions',
    description: 'When a comment mentions "price", "how much", or "cost" → Auto-reply with direct link in bio.',
    enabled: true,
    trigger: 'comment',
    keywords: ['price', 'cost', 'how much', 'rates'],
    action: 'reply',
    actionValue: 'Hey there! 👋 You can view our full pricing menu at the link in our bio!',
    icon: '💬',
  },
  {
    id: 'qr-2',
    title: 'Welcome DM to New Followers',
    description: 'When a user follows your profile → Send an automated friendly welcome direct message.',
    enabled: false,
    trigger: 'new_follower',
    keywords: [],
    action: 'send_dm',
    actionValue: 'Thanks for following! ✨ We share tips & new drops weekly. Let us know if you need anything!',
    icon: '👋',
  },
  {
    id: 'qr-3',
    title: 'Story Mention Thank You',
    description: 'When someone tags your account in an Instagram Story → Send a direct message thank you.',
    enabled: true,
    trigger: 'story_mention',
    keywords: [],
    action: 'send_dm',
    actionValue: 'Thank you so much for the shoutout! 🙌 Tag us anytime!',
    icon: '📲',
  },
];

export const defaultIftttFlows = [
  {
    id: 'flow-1',
    name: 'Post Launch Engagement Booster',
    trigger: { type: 'new_post_published', label: 'When a new post is published' },
    actions: [
      { type: 'add_first_comment', label: 'Post 1st comment with curated hashtags', value: '#smallbusiness #explore #viral' },
      { type: 'notify_team', label: 'Send notification alert', value: 'New post published! Time to engage 🚀' },
    ],
    enabled: true,
    color: 'from-purple-500 via-pink-500 to-rose-500',
  },
  {
    id: 'flow-2',
    name: 'Lead Capture from Comments',
    trigger: { type: 'comment_keyword', label: 'Comment contains "DM me" or "interested"' },
    actions: [
      { type: 'send_dm', label: 'Send direct message link', value: 'Hey! Here is the link you requested:' },
      { type: 'add_tag', label: 'Tag profile as Hot Lead', value: 'hot-lead' },
    ],
    enabled: false,
    color: 'from-amber-500 via-orange-500 to-rose-500',
  },
];

export const defaultCronJobs = [
  {
    id: 'cron-1',
    action: 'Morning scheduled post queue verification',
    frequency: 'Daily',
    time: '08:00',
    enabled: true,
    lastRun: new Date().toISOString(),
  },
  {
    id: 'cron-2',
    action: 'Weekly performance analytics summary',
    frequency: 'Weekly',
    time: '09:00',
    day: 'Monday',
    enabled: true,
    lastRun: new Date().toISOString(),
  }
];
