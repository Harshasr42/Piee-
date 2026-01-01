
import { Bubble, Memory, Voucher, DreamCategory } from './types';

/**
 * 🌸 SHREYAA'S SPECIAL CONSTANTS
 */

export const CLOUD_WORRIES: Bubble[] = [
  { 
    id: '1', 
    label: 'Exam stress you never talk about', 
    icon: '📝', 
    color: '#FFD1D1' 
  },
  { 
    id: '2', 
    label: 'Late nights with a tired smile', 
    icon: '🌙', 
    color: '#FFE8D6' 
  },
  { 
    id: '3', 
    label: 'Moments when you doubt yourself', 
    icon: '✨', 
    color: '#D4F1F4' 
  },
  { 
    id: '4', 
    label: 'Grumpy moods that don’t last long', 
    icon: '☁️', 
    color: '#E2F0CB' 
  },
  { 
    id: '5', 
    label: 'Being tired but still showing up', 
    icon: '☕', 
    color: '#FCE1E4' 
  },
  { 
    id: '6', 
    label: 'Those quiet bad days', 
    icon: '🌧️', 
    color: '#BEE7E8' 
  },
  {
    id: '7',
    label: 'Carrying more than you let on',
    icon: '🫂',
    color: '#E6D9FF'
  }
];


export const MEMORIES: Memory[] = [
  {
    id: 1,
    url: '/scrapbook/memories/standing-with-you.png',
    caption: 'Standing next to you felt natural — like that’s where I belong.'
  },
  {
    id: 2,
    url: '/scrapbook/memories/quiet-strength.png',
    caption: 'Even in silence, you give me strength without trying.'
  },
  {
    id: 3,
    url: '/scrapbook/memories/comfortable-silence.png',
    caption: 'Some moments don’t need words. This was one of them.'
  },
  {
    id: 4,
    url: '/scrapbook/memories/same-step.png',
    caption: 'Walking at the same pace, without forcing anything.'
  },
  {
    id: 5,
    url: '/scrapbook/memories/you-smiled-first.png',
    caption: 'You smiled first — and my whole day quietly changed.'
  },
  {
    id: 6,
    url: '/scrapbook/memories/safe-with-you.png',
    caption: 'With you, I feel safe being exactly who I am.'
  },
  {
    id: 7,
    url: '/scrapbook/memories/your-smile-fixed-my-day.png',
    caption: 'That smile fixed more than you’ll ever know.'
  },
  {
    id: 8,
    url: '/scrapbook/memories/you-were-happy.png',
    caption: 'Seeing you happy is still my favorite sight.'
  },
  {
    id: 9,
    url: '/scrapbook/memories/standing-close.png',
    caption: 'Not too close. Not too far. Just right.'
  }
];


export const REASONS_WHY = [
  "The way you listen without judgment, like my feelings are always safe with you.",
  "Your laugh that somehow sneaks into my bad days and fixes them quietly.",
  "How you always know exactly what to say, even when I don’t know what I’m feeling.",
  "That soft little hug you give when something goes wrong, like saying “why did you even notice my mistake?” 🤭",
  "The way you find my sadness in a split second, even in the middle of a crowd.",
  "How you never hesitate to do anything for me, just because I asked.",
  "Because you are simply, purely yourself — and that’s more than enough for me."
];


export const FUTURE_DREAMS_CATEGORIES: DreamCategory[] = [
  {
    id: 'travelling-together-root',
    title: 'Travelling Together',
    icon: '✈️',
    subCategories: [
      {
        id: 'india-explorer',
        title: 'India Explorer',
        icon: '🇮🇳',
        items: [
          {
            id: '1',
            label: 'Varanasi at Dusk',
            description: 'Lanterns glowing on the Ganga, reimagined in soft Ghibli aesthetics.',
            image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800'
          },
          {
            id: '2',
            label: 'Munnar Tea Hills',
            description: 'Endless rolling greens like a scene from My Neighbor Totoro.',
            image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800'
          }
        ]
      },
      {
        id: 'global-wanderlust',
        title: 'Global Wanderlust',
        icon: '🌍',
        items: [
          {
            id: 'intl-1',
            label: 'Japan Cherry Blossoms',
            description: 'Walking through a pink blizzard in Tokyo.',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800'
          }
        ]
      }
    ]
  },
  {
    id: 'living-next-door',
    title: 'Life Next Door',
    icon: '🏠',
    items: [
      {
        id: '3',
        label: 'Golgappa Quest',
        description: 'Finding the spiciest Pani Puri in the world together.',
        image: 'https://images.unsplash.com/photo-1626132646529-5aa212dd143b?q=80&w=800'
      },
      {
        id: '4',
        label: 'Kapoor’s Cafe Feast',
        description: 'Rajasthani Thali, sitting Japanese style, sheer foodie happiness.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800'
      }
    ]
  },
  {
    id: 'growing-together',
    title: 'Growing Together',
    icon: '🎓',
    items: [
      {
        id: '5',
        label: 'The Spark remains',
        description: 'Even as we grow older, our laughter stays as loud as day one.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800'
      }
    ]
  },
  {
    id: 'old-sassy-besties',
    title: 'Old & Sassy',
    icon: '👵',
    items: [
      {
        id: '6',
        label: 'The Porch Life',
        description: 'Gossiping about everything and nothing at 80 years old.',
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800'
      }
    ]
  }
];

export const BESTIE_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    title: 'Anytime You Need to Talk',
    cost: 'Only if you feel like it 🤍'
  },
  {
    id: 'v2',
    title: 'Unlimited “You Were Right” Stamps',
    cost: 'Always free'
  },
  {
    id: 'v3',
    title: 'A Movie or a Walk, Someday Maybe',
    cost: 'Whenever it feels comfortable'
  },
  {
    id: 'v4',
    title: 'Unlimited Playful Hit Pass',
    cost: 'Only the cute, non-serious kind 😄'
  },
  {
    id: 'v5',
    title: 'Go Anywhere You Choose',
    cost: 'When you want company, I’m there'
  },
  {
    id: 'v6',
    title: 'Study & Career Support Buddy',
    cost: 'Whenever you need help or motivation'
  },
  {
    id: 'v7',
    title: 'Everything for That Little Smile',
    cost: 'Because your care already means everything to me'
  }
];


export const LOVE_LETTER_CONTENT = {
  recipient: "Hey Shreyaa,",
  title: "My Favorite Human",
  body: `I don’t think I ever properly told you this, but life genuinely feels lighter since you became a part of it. Not louder, not dramatic — just calmer, safer, and more real. Somehow, even ordinary days feel easier to get through when I know you exist in them.

You have this quiet way of noticing things — especially me. You catch my silence before I explain it, my sadness before I admit it, and my mood even when I try to hide it behind jokes. That itself means more to me than you probably realize. There are moments when just you asking “what happened?” fixes something inside me that I didn’t know was hurting.

Thank you for the care you give so naturally — the kind that doesn’t make noise, but stays. Thank you for the hugs that say more than words, for standing by me in ways that feel effortless to you but unforgettable to me. You don’t try to fix everything, and that’s what makes you special — you simply stay, and that is enough.

I hope you always know this: you never have to be strong all the time, and you never have to explain yourself to be understood. I’ll always wish for your happiness, your peace, and the gentle smile you carry without realizing how powerful it is.

Just be with me always, don’t leave me 😖. You mean a lot to me in my life — more than anyone ever has 🥺.`,
  signOff: "Always here ❤️,",
  sender: "Your Heegu Unte 🤭",
  coverImage: "https://images.unsplash.com/photo-1516589174184-c6858b1a274a?q=80&w=800",
  footer: "Est. Friendship Infinity"
};

