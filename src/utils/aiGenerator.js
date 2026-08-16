/**
 * Client-side AI Copywriting Engine for GramFlow
 * Generates viral hooks, full captions, CTAs, and contextual hashtags.
 */

const HOOKS = {
  engaging: [
    "Stop scrolling if you want to know the truth about {topic} 👀",
    "Nobody talks about this, but {topic} changed everything for us 👇",
    "Here's the #1 mistake people make with {topic} (and how to avoid it):",
    "Save this post before you start working on {topic}! 📌",
    "If you're struggling with {topic}, read this immediately ✨"
  ],
  promotional: [
    "🚨 Big news! Something exciting just dropped for everyone who loves {topic}!",
    "Ready to transform your {topic}? Our newest drop is officially LIVE 🎉",
    "Limited quantities available! Here's everything you need to know about {topic} 🛍️",
    "We spent 3 months perfecting this for {topic}. Link in bio to grab yours! 🚀"
  ],
  educational: [
    "5 actionable steps to master {topic} in under 10 minutes a day 💡",
    "A simple breakdown of how {topic} actually works (save for later!):",
    "Swipe through for our proven formula for {topic} 📊",
    "The beginner's guide to {topic} that you wish you had sooner 🧠"
  ],
  witty: [
    "Me pretending I don't obsess over {topic} 24/7 🙃",
    "There are two types of people when it comes to {topic}... which one are you? 😂",
    "Tell me you love {topic} without telling me you love {topic} ☕",
    "My bank account watching me invest in {topic} again 💸"
  ],
  aesthetic: [
    "Finding peace and inspiration in the simple moments of {topic} 🕊️",
    "A glimpse behind the scenes of our favorite {topic} rituals ✨",
    "Curated with intention: the art of {topic} 🌿",
    "Soft tones, slow mornings, and lots of {topic} 🕯️"
  ]
};

const BODY_PARAGRAPHS = {
  engaging: [
    "Building a brand in 2026 is all about authentic connection. When we first approached {topic}, we realized that consistency matters more than perfection.",
    "We asked our community what they needed most, and the answer was crystal clear. Here is how we are doing things differently."
  ],
  promotional: [
    "Crafted with premium materials and designed to elevate your everyday routine. Each piece is tested and loved by our community.",
    "Special launch perk: Tap the link in our bio for complimentary shipping on all orders this weekend only!"
  ],
  educational: [
    "1. Focus on quality over quantity every single time.\n2. Leverage automated workflows to save 10+ hours every week.\n3. Keep your community engaged with consistent drops.\n4. Analyze your peak metrics and iterate weekly.",
    "The secret lies in the small daily habits. When you dial in your systems, growth becomes predictable and fun."
  ],
  witty: [
    "Not to be dramatic, but this might just be the best decision of the month. Don't say we didn't warn you!",
    "Tag that one friend who needs to see this right now (you know who they are)."
  ],
  aesthetic: [
    "Embracing texture, light, and mindful design. Every detail is crafted to bring warmth into your space.",
    "Taking time to appreciate the craft and the journey."
  ]
};

const CTAS = {
  comment: "💬 Drop your thoughts below — we reply to every single comment!",
  bio: "🔗 Tap the link in our bio to shop the drop / learn more!",
  save: "📌 Tap save so you don't lose this when you need it!",
  share: "✈️ Share this with someone who needs this reminder today!",
  dm: "📩 Send us a DM with the word 'INFO' for exclusive early access!"
};

const TOPIC_HASHTAGS = {
  fashion: ["#sustainablefashion", "#ootd", "#styleinspo", "#slowfashion", "#capsulewardrobe"],
  coffee: ["#specialtycoffee", "#coffeeculture", "#baristalife", "#coffeetime", "#morningritual"],
  business: ["#smallbusinessowner", "#entrepreneurlife", "#growthstrategy", "#supportlocal", "#brandbuilder"],
  fitness: ["#wellnessjourney", "#fitnessmotivation", "#healthylifestyle", "#mindbody", "#dailyworkout"],
  beauty: ["#cleanbeauty", "#skincareroutine", "#glowup", "#selfcare", "#naturalbeauty"],
  general: ["#brandstrategy", "#explorepage", "#viralreels", "#visualcontent", "#creativelife"]
};

export function generateAICaption({
  topic = "our new drop",
  tone = "engaging",
  ctaType = "comment",
  includeEmoji = true
}) {
  const cleanTopic = topic.trim() || "our latest project";
  
  // Pick hook
  const hooksList = HOOKS[tone] || HOOKS.engaging;
  const hook = hooksList[Math.floor(Math.random() * hooksList.length)].replace("{topic}", cleanTopic);

  // Pick body
  const bodyList = BODY_PARAGRAPHS[tone] || BODY_PARAGRAPHS.engaging;
  const body = bodyList[Math.floor(Math.random() * bodyList.length)].replace(/\{topic\}/g, cleanTopic);

  // Pick CTA
  const cta = CTAS[ctaType] || CTAS.comment;

  // Pick matching hashtags
  let tags = TOPIC_HASHTAGS.general;
  for (const [key, list] of Object.entries(TOPIC_HASHTAGS)) {
    if (cleanTopic.toLowerCase().includes(key)) {
      tags = list;
      break;
    }
  }

  const caption = `${hook}\n\n${body}\n\n${cta}\n\n.\n.\n${tags.join(" ")}`;
  return caption;
}
