
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
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800', 
    caption: 'That time we couldn\'t stop laughing over nothing.' 
  },
  { 
    id: 2, 
    url: 'https://images.unsplash.com/photo-1522165078649-823cf4dbaf46?q=80&w=800', 
    caption: 'Best friend therapy sessions are the best.' 
  },
  { 
    id: 3, 
    url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=800', 
    caption: 'You make every moment feel like sunshine, Shreyaa.' 
  },
  { 
    id: 4, 
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800', 
    caption: 'To a thousand more inside jokes! 🥂' 
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=800',
    caption: 'Every coffee date with you is a core memory.'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800',
    caption: 'The support you give me is my biggest strength.'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800',
    caption: 'True friendship is rare, and I found it in you.'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=800',
    caption: 'Your happiness is my favorite thing to witness.'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800',
    caption: 'Thank you for staying through every high and low.'
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=800',
    caption: 'Soulmates come in the form of best friends too.'
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
  body: `I was sitting here thinking about how much brighter life has become since you stepped into it. You have this incredible gift for turning ordinary days into core memories with just a single laugh or a thoughtful text. 

Thank you for being the person who truly sees me—the one who knows my coffee order, my worst jokes, and my biggest dreams. You're the one I want to share every win with, and the first person I reach for when things get tough.

You deserve a year filled with as much kindness, joy, and peace as you give to everyone around you. I am so lucky to call you my best friend, my confidante, and my soulmate in the truest sense of the word. I'm so proud of you, and I'll always be your biggest cheerleader.`,
  signOff: "Always here for you,",
  sender: "Your Bestie ✨",
  coverImage: "https://images.unsplash.com/photo-1516589174184-c6858b1a274a?q=80&w=800",
  footer: "Est. Friendship Infinity"
};
