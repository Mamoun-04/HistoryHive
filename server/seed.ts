import { db } from "@db";
import { lessons, userProgress, feedPosts, achievements } from "@db/schema";

// Historical eras organization
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

// Initial detailed lessons
const seedLessons = [
  // Prehistoric Era (before 3000 BCE)
  {
    title: "The Dawn of Human Civilization",
    description: "Explore the earliest human societies and their development.",
    content: `
The story of human civilization begins with our earliest ancestors transitioning from nomadic hunter-gatherers to settled agricultural communities. This transformative period marked the birth of organized human society.

Key Developments:

1. Agricultural Revolution (c. 10,000 BCE)
- Development of farming techniques
- Domestication of plants and animals
- Creation of permanent settlements
- Rise of specialized labor

2. Tool Development
- Stone tools for hunting and gathering
- Development of pottery for storage
- Creation of weapons for defense
- Early architectural innovations

3. Social Organization
- Formation of tribal communities
- Development of leadership structures
- Creation of early religious practices
- Establishment of trade networks

4. Cultural Innovations
- Cave paintings and early art
- Development of primitive musical instruments
- Creation of burial rituals
- Early forms of communication

Impact on Future Civilizations:
These early innovations laid the groundwork for all future human development, establishing patterns of social organization, technological advancement, and cultural expression that would shape the course of history.
    `,
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
The ancient Egyptian civilization emerged around 3100 BCE with the political unification of Upper and Lower Egypt under the first pharaoh. This marked the beginning of one of the world's earliest and longest-lasting civilizations, spanning over 3,000 years.

Key Aspects of Ancient Egyptian Civilization:

1. Political Structure
- Divine kingship through the Pharaoh system
- Centralized bureaucracy
- Provincial governance through Nomes
- Complex diplomatic relations with neighboring powers

2. The Nile River's Influence
- Annual flooding cycle (Inundation)
- Agricultural calendar development
- Irrigation systems
- Transportation and trade routes

3. Monumental Architecture
- Pyramid construction techniques
- Temple complexes
- Administrative centers
- Urban planning and development

4. Religious Beliefs
- Polytheistic pantheon
- Afterlife concepts
- Mummification practices
- Temple worship and rituals

5. Scientific and Cultural Achievements
- Mathematical innovations
- Astronomical observations
- Medical knowledge
- Hieroglyphic writing system
- Literature and poetry

6. Economic Systems
- Agricultural production
- International trade networks
- Taxation systems
- Craft specialization

7. Social Organization
- Hierarchical class structure
- Role of scribes
- Position of women in society
- Slavery and labor organization

Legacy and Influence:
The Egyptian civilization's achievements in architecture, art, writing, and governance continue to influence modern culture and inspire new discoveries in archaeology and historical research.
    `,
    era: eras.ancient,
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
    isPremium: false,
    estimatedMinutes: 25,
    prerequisites: [],
  },
  {
    title: "Mesopotamia: Cradle of Civilization",
    description: "Discover the birthplace of writing and organized society.",
    content: `
Mesopotamia, the land between the Tigris and Euphrates rivers, witnessed the birth of many of humanity's most important innovations. This region saw the emergence of the world's first cities, the invention of writing, and the development of complex political systems.

Key Developments:

1. Writing and Record Keeping
- Invention of cuneiform script
- Development of administrative records
- Literary traditions (Epic of Gilgamesh)
- Mathematical notation

2. Urban Development
- First planned cities (Ur, Uruk, Babylon)
- Irrigation systems
- Defensive walls and fortifications
- Public buildings and temples

3. Political Innovations
- City-state system
- Written law codes (Hammurabi's Code)
- Bureaucratic organization
- Military organizations

4. Economic Advances
- Invention of currency
- Banking systems
- Long-distance trade networks
- Agricultural management

5. Scientific and Technical Achievements
- Mathematics and astronomy
- Architecture and engineering
- Metallurgy
- Medicine and healing practices

6. Religious and Cultural Life
- Polytheistic belief system
- Temple economy
- Art and sculpture
- Music and entertainment

Impact on World History:
Mesopotamian innovations in writing, law, urban planning, and governance formed the foundation for later civilizations and continue to influence modern society.
    `,
    era: eras.ancient,
    imageUrl: "https://images.unsplash.com/photo-1590341328520-63256eb32bc3",
    isPremium: false,
    estimatedMinutes: 20,
    prerequisites: [],
  },
];

const generateMoreLessons = () => {
  const topics = [
    "Art and Culture", "Military Campaigns", "Scientific Discoveries",
    "Religious Movements", "Economic Systems", "Political Revolutions",
    "Technological Innovations", "Social Movements", "Architectural Achievements",
    "Literary Masterpieces"
  ];

  const generateDetailedContent = (topic: string, era: string) => {
    const eraSpecificDetails = {
      prehistoric: {
        achievements: ["Cave paintings", "Stone tools", "Fire control", "Language development"],
        challenges: ["Survival in harsh environments", "Food scarcity", "Natural threats"],
        innovations: ["Basic tool creation", "Shelter building", "Hunting techniques"]
      },
      ancient: {
        achievements: ["Monumental architecture", "Writing systems", "Mathematics", "Astronomy"],
        challenges: ["Empire management", "Resource distribution", "Foreign invasions"],
        innovations: ["Irrigation", "Legal codes", "Military tactics"]
      },
      classical: {
        achievements: ["Philosophy", "Democracy", "Literature", "Art"],
        challenges: ["Political rivalries", "Social inequality", "Cultural conflicts"],
        innovations: ["Educational systems", "Engineering", "Naval technology"]
      },
      // Add similar details for other eras...
    };

    const details = eraSpecificDetails[era as keyof typeof eraSpecificDetails] || {
      achievements: ["Notable developments", "Cultural advancements", "Technological progress"],
      challenges: ["Societal obstacles", "Environmental factors", "Resource limitations"],
      innovations: ["New methods", "Improved systems", "Revolutionary ideas"]
    };

    return `
${topic} in the ${era.charAt(0).toUpperCase() + era.slice(1)} Era

Historical Context:
The ${era} period marked a significant phase in human development, particularly in ${topic.toLowerCase()}.

Key Developments:

1. Major Achievements:
${details.achievements.map(achievement => `- ${achievement}`).join('\n')}

2. Challenges and Obstacles:
${details.challenges.map(challenge => `- ${challenge}`).join('\n')}

3. Innovations and Solutions:
${details.innovations.map(innovation => `- ${innovation}`).join('\n')}

4. Impact on Society:
- Changes in daily life
- Evolution of social structures
- Cultural transformations
- Long-term implications

5. Legacy and Modern Relevance:
This period's developments continue to influence contemporary society through:
- Educational methods
- Cultural practices
- Technological foundations
- Social organizations

Further Reading:
- Primary historical sources
- Archaeological evidence
- Academic research
- Contemporary interpretations
`;
  };

  const additionalLessons = [];
  Object.values(eras).forEach(era => {
    topics.forEach((topic, index) => {
      additionalLessons.push({
        title: `${era.charAt(0).toUpperCase() + era.slice(1)} ${topic}`,
        description: `Explore the fascinating developments in ${topic.toLowerCase()} during the ${era} era.`,
        content: generateDetailedContent(topic, era),
        era: era,
        imageUrl: `https://images.unsplash.com/photo-${1500000000 + index}`,
        isPremium: index % 3 === 0,
        estimatedMinutes: 15 + (index % 3) * 5,
        prerequisites: [],
      });
    });
  });
  return additionalLessons;
};

const historicalEvents = [
  {
    event: "The Fall of Constantinople",
    details: `The capture of Constantinople in 1453 CE marked the end of the Byzantine Empire and the Roman imperial tradition that had lasted for nearly 1,500 years. The Ottoman conquest led by Sultan Mehmed II transformed the city into Istanbul, creating a powerful Islamic empire that would dominate southeastern Europe and the Middle East for centuries.

Key Impact Areas:
- End of the Eastern Roman Empire
- Rise of Ottoman power in Europe
- Shift in Mediterranean trade routes
- Migration of Greek scholars to Italy, contributing to the Renaissance
- Technological innovations in warfare, particularly artillery`,
    era: eras.medieval
  },
  {
    event: "The Discovery of King Tut's Tomb",
    details: `Howard Carter's 1922 discovery of Tutankhamun's nearly intact tomb revolutionized our understanding of ancient Egyptian civilization. The unprecedented preservation of artifacts provided invaluable insights into royal burial practices, art, and daily life in ancient Egypt.

Key Findings:
- Over 5,000 artifacts preserved
- Insights into mummification practices
- Evidence of ancient Egyptian artistry
- Information about royal succession
- Details of religious beliefs and practices`,
    era: eras.modern
  },
  {
    event: "The Industrial Revolution",
    details: `The transformation of manufacturing processes starting in the late 18th century fundamentally changed human society. This revolution began in Britain and spread across Europe and North America, creating the modern industrial world.

Major Changes:
- Steam power and mechanization
- Mass production techniques
- Urbanization and social reform
- New transportation systems
- Rise of the working class`,
    era: eras.industrial
  },
  // Add more detailed historical events...
];

const generateFeedPosts = () => {
  const feedTemplates = [
    {
      title: "On This Day in History: {event}",
      content: `
Historical Milestone: {event}

This pivotal moment in history fundamentally changed the course of human events.

Key Impacts:
1. Immediate Effects
- Political transformations
- Social changes
- Economic implications

2. Long-term Consequences
- Cultural shifts
- Technological advancements
- Global relationships

Modern Relevance:
Understanding this event helps us better comprehend current world dynamics and potential future developments.

Historical Context:
{details}

#HistoryMatters #OnThisDay #HistoricalPerspective
      `
    },
    {
      title: "Historical Mystery: {event}",
      content: `
Unsolved Historical Puzzle: {event}

This fascinating historical mystery continues to intrigue historians and researchers.

Current Understanding:
- Traditional interpretations
- Recent discoveries
- Competing theories
- New evidence

Significance:
{details}

Why It Matters Today:
- Historical research methods
- Understanding past societies
- Modern implications
- Ongoing investigations

#HistoricalMysteries #HistoricalResearch #Archaeology
      `
    },
    {
      title: "Archaeological Breakthrough: {event}",
      content: `
Major Discovery: {event}

Recent archaeological findings have revealed new insights about this historical event.

Discovery Details:
- Location and context
- Scientific analysis
- Historical significance
- Research implications

Historical Background:
{details}

Impact on Historical Understanding:
- Revision of previous theories
- New research directions
- Cultural implications
- Educational value

#Archaeology #HistoricalDiscovery #Research
      `
    }
  ];

  return historicalEvents.map((eventData, index) => ({
    title: feedTemplates[index % feedTemplates.length].title.replace("{event}", eventData.event),
    content: feedTemplates[index % feedTemplates.length].content
      .replace(/\{event\}/g, eventData.event)
      .replace("{details}", eventData.details),
    mediaUrl: `https://images.unsplash.com/photo-${1524338198850 + Math.floor(Math.random() * 1000)}`,
    authorId: 1,
    tags: ["history", eventData.era, "discovery"],
  }));
};

const allLessons = [...seedLessons, ...generateMoreLessons()];
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
    throw error;
  }
}

seed();