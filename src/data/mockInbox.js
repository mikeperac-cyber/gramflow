export const defaultConversations = [
  {
    id: 'conv-1',
    user: {
      name: 'Elena Rostova',
      handle: 'elena_design',
      avatar: '🎨',
      verified: false,
    },
    channel: 'dm',
    sentiment: 'lead', // lead | question | praise | support
    unread: true,
    lastActivity: '10m ago',
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi there! Loved your latest reel. Do you ship to Canada, and what are the delivery times?', time: '10:14 AM' },
    ],
    tags: ['Shipping Inquiry', 'High Intent'],
  },
  {
    id: 'conv-2',
    user: {
      name: 'Marcus Vance',
      handle: 'marcus_v',
      avatar: '☕',
      verified: true,
    },
    channel: 'comment',
    postTitle: 'Summer Drop Announcement',
    sentiment: 'praise',
    unread: false,
    lastActivity: '45m ago',
    messages: [
      { id: 'm2', sender: 'user', text: 'The color grading on this is pure perfection! 🔥 Need this in my studio ASAP.', time: '09:30 AM' },
      { id: 'm3', sender: 'me', text: 'Thank you Marcus! So glad you love the palette. Appreciate the support! 🙌', time: '09:35 AM' }
    ],
    tags: ['Influencer', 'VIP'],
  },
  {
    id: 'conv-3',
    user: {
      name: 'Studio Nova',
      handle: 'studionova_la',
      avatar: '🌿',
      verified: false,
    },
    channel: 'dm',
    sentiment: 'question',
    unread: true,
    lastActivity: '2h ago',
    messages: [
      { id: 'm4', sender: 'user', text: 'Hey team! Looking to collaborate on a bundle for our upcoming pop-up event in NYC. Who should we email?', time: '08:15 AM' },
    ],
    tags: ['Partnership', 'B2B'],
  },
  {
    id: 'conv-4',
    user: {
      name: 'Sarah Jenkins',
      handle: 'sarah_j_style',
      avatar: '👗',
      verified: false,
    },
    channel: 'comment',
    postTitle: 'Sustainable Craftsmanship BTS',
    sentiment: 'lead',
    unread: false,
    lastActivity: '5h ago',
    messages: [
      { id: 'm5', sender: 'user', text: 'Where can I find the link to order size Medium? It was sold out on the story link.', time: '05:40 AM' },
      { id: 'm6', sender: 'me', text: 'Restocked! Just sent you a direct message with the direct priority link 🛍️', time: '06:00 AM' }
    ],
    tags: ['Restock', 'Converted'],
  }
];

export const quickCannedResponses = [
  { id: 'c1', title: 'Send Bio Link', text: 'Hey there! 👋 You can explore all details and shop directly via the link in our bio!' },
  { id: 'c2', title: 'Shipping & Delivery', text: 'We ship worldwide! Standard domestic delivery takes 2-4 business days, and international is 5-8 business days 📦' },
  { id: 'c3', title: 'Collaboration / PR', text: 'Thank you for reaching out! Please send your media kit & pitch to partnerships@ourbrand.com 🤝' },
  { id: 'c4', title: 'Gratitude & Love', text: 'Thank you so much for the love and kind words! Your support means the world to our small team ✨' }
];
