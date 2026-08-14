export const generateNotifications = () => [
  { id: 'n1',  type: 'post',       message: 'Post "Summer Collection" was published successfully.',   time: '2 min ago',  read: false, icon: '✅' },
  { id: 'n2',  type: 'automation', message: 'Auto-reply sent to 3 comments containing "price".',     time: '15 min ago', read: false, icon: '⚡' },
  { id: 'n3',  type: 'analytics',  message: 'Engagement rate jumped 12% this week! 🎉',              time: '1 hr ago',   read: false, icon: '📊' },
  { id: 'n4',  type: 'follower',   message: 'You gained 47 new followers today.',                    time: '2 hr ago',   read: true,  icon: '👥' },
  { id: 'n5',  type: 'post',       message: '"Weekend Mood" post is scheduled for tomorrow 10am.',   time: '3 hr ago',   read: true,  icon: '📅' },
  { id: 'n6',  type: 'automation', message: 'Welcome DM sent to @newuser_123.',                      time: '5 hr ago',   read: true,  icon: '👋' },
  { id: 'n7',  type: 'analytics',  message: 'Your top post this week reached 11,800 people.',        time: '1 day ago',  read: true,  icon: '🚀' },
  { id: 'n8',  type: 'hashtag',    message: '#summervibes2026 is trending — use it in your next post!', time: '1 day ago', read: true, icon: '🔥' },
  { id: 'n9',  type: 'post',       message: '"Morning Tips" carousel was saved 801 times.',          time: '2 days ago', read: true,  icon: '💾' },
  { id: 'n10', type: 'automation', message: 'Cron job "Daily Story Quote" ran successfully.',        time: '2 days ago', read: true,  icon: '⏰' },
];
