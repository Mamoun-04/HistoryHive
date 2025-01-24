import { db } from "@db";
import { lessons, userProgress, feedPosts, achievements } from "@db/schema";

// Historical eras for organization
const eras = {
  prehistoric: "prehistoric",
  ancient: "ancient",
  classical: "classical",
  medieval: "medieval",
  renaissance: "renaissance",
  enlightenment: "enlightenment",
  industrial: "industrial",
  modern: "modern",
  contemporary: "contemporary"
};

const seedLessons = [
  // Prehistoric Era (before 3000 BCE)
  {
    title: "The Dawn of Human Civilization",
    description: "Explore the earliest human societies and their development.",
    content: `The story of human civilization begins with our earliest ancestors...`,
    era: eras.prehistoric,
    imageUrl: "https://images.unsplash.com/photo-1590341328520-63256eb32bc3",
    isPremium: false,
    estimatedMinutes: 15,
    prerequisites: [],
  },
  // Ancient Era (3000 BCE - 500 BCE)
  {
    title: "The Rise of Ancient Egypt",
    description: "Explore the fascinating civilization of Ancient Egypt and its contributions to human history.",
    content: `
The ancient Egyptian civilization emerged around 3100 BCE with the political unification of Upper and Lower Egypt under the first pharaoh. This marked the beginning of one of the world's earliest and longest-lasting civilizations.

Key aspects of Ancient Egyptian civilization:

1. The Nile River
- Annual flooding provided fertile soil
- Enabled agricultural prosperity
- Shaped Egyptian culture and religion

2. Pyramids and Architecture
- Built as tombs for pharaohs
- Demonstrated advanced engineering skills
- Reflected beliefs about afterlife

3. Writing and Knowledge
- Hieroglyphic script development
- Administrative records
- Religious texts and literature

This advanced civilization laid the groundwork for many aspects of human society we still see today.
    `,
    era: eras.ancient,
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
    isPremium: false,
    estimatedMinutes: 15,
    prerequisites: [],
  },
  {
    title: "Mesopotamia: Cradle of Civilization",
    description: "Discover the birthplace of writing and organized society.",
    content: `The region between the Tigris and Euphrates rivers saw the birth of many firsts...`,
    era: eras.ancient,
    imageUrl: "https://images.unsplash.com/photo-1590341328520-63256eb32bc3",
    isPremium: false,
    estimatedMinutes: 20,
    prerequisites: [],
  },
  // Classical Era (500 BCE - 500 CE)
  {
    title: "The Golden Age of Athens",
    description: "Experience the birth of democracy and classical philosophy.",
    content: `Athens in the 5th century BCE represented the peak of classical Greek achievement...`,
    era: eras.classical,
    imageUrl: "https://images.unsplash.com/photo-1589730823931-78c9a7e8e2cd",
    isPremium: true,
    estimatedMinutes: 25,
    prerequisites: [],
  },
  // Medieval Era (500 CE - 1500 CE)
  {
    title: "The Viking Age",
    description: "Explore the Norse civilization and their impact on Europe.",
    content: `The Vikings were more than just raiders...`,
    era: eras.medieval,
    imageUrl: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3",
    isPremium: true,
    estimatedMinutes: 30,
    prerequisites: [],
  },
  // Contemporary Special Addition to reach 100 lessons
  {
    title: "The Digital Revolution and Modern Computing",
    description: "Explore how computers and the internet transformed our world.",
    content: `The rise of personal computers and the internet has fundamentally changed how we live, work, and communicate...`,
    era: eras.contemporary,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    isPremium: true,
    estimatedMinutes: 35,
    prerequisites: [],
  }
  // Continue with many more lessons...
];

// Generate 100 lessons programmatically
const generateMoreLessons = () => {
  const topics = [
    "Art and Culture", "Military Campaigns", "Scientific Discoveries",
    "Religious Movements", "Economic Systems", "Political Revolutions",
    "Technological Innovations", "Social Movements", "Architectural Achievements",
    "Literary Masterpieces"
  ];

  const additionalLessons = [];
  Object.values(eras).forEach(era => {
    topics.forEach((topic, index) => {
      additionalLessons.push({
        title: `${era.charAt(0).toUpperCase() + era.slice(1)} ${topic}`,
        description: `Explore the ${topic.toLowerCase()} of the ${era} era.`,
        content: `Detailed content about ${topic.toLowerCase()} during the ${era} period...`,
        era: era,
        imageUrl: `https://images.unsplash.com/photo-${1500000000 + index}`,
        isPremium: index % 3 === 0, // Make every third lesson premium
        estimatedMinutes: 15 + (index % 3) * 5,
        prerequisites: [],
      });
    });
  });
  return additionalLessons;
};

const allLessons = [...seedLessons, ...generateMoreLessons()];

// Generate feed posts for different historical topics
const generateFeedPosts = () => {
  const feedTemplates = [
    {
      title: "On This Day in History: {event}",
      content: "Fascinating details about {event} that shaped our world...",
    },
    {
      title: "Historical Mystery: {topic}",
      content: "Uncover the secrets behind {topic} that still puzzle historians...",
    },
    {
      title: "Archaeological Discovery: {finding}",
      content: "Recent excavations have revealed {finding}, changing our understanding...",
    },
    {
      title: "Did You Know? {event}",
      content: "Surprising facts about {event} that changed the course of history...",
    },
    {
      title: "Historical Figure Spotlight: {event}",
      content: "The remarkable story of {event} and their impact on history...",
    }
  ];

  const historicalEvents = [
    "The Fall of Constantinople", "The Discovery of King Tut's Tomb",
    "The Building of the Great Wall", "The Signing of the Magna Carta",
    "The French Revolution", "The Industrial Revolution",
    "The American Civil War", "The Wright Brothers' First Flight",
    "The Moon Landing", "The Fall of the Berlin Wall",
    "The Renaissance", "The Age of Exploration",
    "The Scientific Revolution", "The Rise of Democracy",
    "The Digital Revolution", "The Agricultural Revolution",
    "The Reformation", "The Cold War",
    "The Age of Enlightenment", "The Information Age"
  ];

  return historicalEvents.map((event, index) => ({
    title: feedTemplates[index % feedTemplates.length].title.replace("{event}", event),
    content: feedTemplates[index % feedTemplates.length].content.replace("{event}", event),
    mediaUrl: `https://images.unsplash.com/photo-${1524338198850 + index}`,
    authorId: 1,
    tags: ["history", eras[Object.keys(eras)[index % Object.keys(eras).length]], "discovery"],
  }));
};

const seedFeedPosts = generateFeedPosts();

async function seed() {
  console.log("Seeding database...");

  try {
    // First, delete existing records (only in development)
    if (process.env.NODE_ENV === 'development') {
      await db.delete(userProgress);
      await db.delete(lessons);
      await db.delete(feedPosts);
    }

    // Insert lessons in batches to prevent memory issues
    const batchSize = 20;
    for (let i = 0; i < allLessons.length; i += batchSize) {
      const batch = allLessons.slice(i, i + batchSize);
      await db.insert(lessons).values(batch);
      console.log(`Seeded lessons batch ${i/batchSize + 1}`);
    }

    // Insert feed posts
    await db.insert(feedPosts).values(seedFeedPosts);
    console.log("Successfully seeded feed posts");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error; // Re-throw to ensure the error is visible
  }
}

seed();