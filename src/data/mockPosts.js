import { subDays, addDays, addHours, format } from 'date-fns';

const captions = [
  "☀️ Starting the week fresh! Our new summer collection just dropped — tap the link in bio to shop now. 🛍️ #NewCollection #SummerVibes #ShopNow",
  "Behind the scenes of our latest shoot 📸 So much love went into creating this. What do you think? Drop your thoughts below! 💬",
  "Happy customers make our day! 🥰 Thank you @user123 for this amazing review. Your support means the world to us! #CustomerLove",
  "Big news coming this Friday… 👀 Make sure to follow so you don't miss it! Hit the notification bell 🔔 #ComingSoon #BigNews",
  "Did you know? 💡 We source all our materials sustainably. Because we care about the planet as much as we care about you. 🌱 #Sustainable #EcoFriendly",
  "It's a vibe ✨ Tag a friend who needs to see this! #GoodVibes #TagAFriend #Inspiration",
  "Our best-seller is BACK in stock! 🎉 Limited quantities — grab yours before it sells out again. Link in bio! #BackInStock #LimitedEdition",
  "Weekend mood loading... 🥂 How are you spending yours? Tell us in the comments! #Weekend #GoodTimes",
  "5 tips for a better morning routine ☕ Save this post for later! 1. Wake up early 2. Hydrate first 3. Move your body 4. Eat a good breakfast 5. Plan your day",
  "New arrivals are here! 🚀 Which one is your favorite? A or B? Let us know in the comments! #NewArrival #YouChoose",
  "Gratitude post 🙏 We hit 10K followers last week and we are SO grateful for each and every one of you. Here's to 10K more! 🎊 #Milestone #ThankYou",
  "Collab alert 🤝 We teamed up with @partnerbrand to bring you something special. Stay tuned! #Collab #Partnership",
];

const hashtags = [
  "#branding #smallbusiness #entrepreneur",
  "#lifestyle #aesthetic #inspo",
  "#photography #behindthescenes #creative",
  "#sale #shoplocal #deals",
  "#motivation #mindset #success",
  "#productlaunch #newproduct #launch",
];

const imageColors = [
  'from-pink-400 to-purple-500',
  'from-orange-400 to-pink-500',
  'from-blue-400 to-indigo-500',
  'from-teal-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-purple-400 to-pink-500',
  'from-indigo-400 to-purple-500',
  'from-green-400 to-teal-500',
];

const postTypes = ['Feed Post', 'Reel', 'Story', 'Carousel'];
const statuses = ['published', 'scheduled', 'draft'];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BASE_DATE = new Date(2026, 7, 15); // August 15, 2026

export const generateMockPosts = () => {
  const posts = [];
  for (let i = 0; i < 42; i++) {
    const daysOffset = i < 25 ? -rand(1, 25) : rand(1, 20);
    const date = addHours(addDays(BASE_DATE, daysOffset), rand(8, 20));
    const isPast = daysOffset < 0;
    const status = isPast
      ? 'published'
      : daysOffset === 0
      ? 'scheduled'
      : i % 7 === 0
      ? 'draft'
      : 'scheduled';

    posts.push({
      id: `post-${i + 1}`,
      caption: captions[i % captions.length],
      hashtags: hashtags[i % hashtags.length],
      type: postTypes[i % postTypes.length],
      status,
      scheduledAt: date.toISOString(),
      imageColor: imageColors[i % imageColors.length],
      imageEmoji: ['🌸', '🚀', '☀️', '🎉', '💡', '✨', '🎨', '🌿'][i % 8],
      metrics: isPast
        ? {
            likes:    rand(120, 2400),
            comments: rand(8, 180),
            reach:    rand(800, 12000),
            saves:    rand(20, 600),
            shares:   rand(5, 150),
          }
        : null,
      location: i % 5 === 0 ? 'New York, NY' : '',
      tags:     i % 4 === 0 ? ['@partner', '@brand'] : [],
    });
  }
  return posts.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
};

export const defaultPosts = generateMockPosts();
