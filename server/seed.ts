import { db } from "@db";
import { lessons, userProgress } from "@db/schema";

const seedLessons = [
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
    era: "ancient",
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368",
    isPremium: false,
    estimatedMinutes: 15,
    prerequisites: [],
  },
  {
    title: "Medieval Knights and Chivalry",
    description: "Discover the code of chivalry and the life of medieval knights.",
    content: `
Knights were the elite warriors of medieval Europe, bound by a code of chivalry that shaped their behavior both on and off the battlefield.

The Code of Chivalry included:

1. Military Excellence
- Combat training from childhood
- Mastery of weapons and horsemanship
- Loyalty to one's lord

2. Social Responsibilities
- Protecting the weak
- Upholding justice
- Showing mercy to enemies

3. Religious Devotion
- Defending the Church
- Following Christian virtues
- Participating in Crusades

The impact of knightly culture continues to influence our ideas about honor and nobility today.
    `,
    era: "medieval",
    imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375",
    isPremium: true,
    estimatedMinutes: 20,
    prerequisites: [],
  },
  {
    title: "The Renaissance: Art and Innovation",
    description: "Journey through the cultural rebirth that transformed Europe.",
    content: `
The Renaissance period (14th-17th centuries) marked a dramatic revival of art, culture, and learning in Europe, bridging the medieval and modern periods.

Key Developments:

1. Art Revolution
- Perspective and realism
- Famous artists like Leonardo da Vinci
- New techniques in painting and sculpture

2. Scientific Progress
- Empirical observation
- Astronomical discoveries
- Anatomical studies

3. Cultural Changes
- Humanism and individual achievement
- Revival of classical learning
- Printing press and knowledge spread

The Renaissance fundamentally changed how humans viewed themselves and their world.
    `,
    era: "renaissance",
    imageUrl: "https://images.unsplash.com/photo-1544333323-eb7a1926c002",
    isPremium: true,
    estimatedMinutes: 25,
    prerequisites: [],
  },
  {
    title: "World War II: A Global Conflict",
    description: "Understand the causes, major events, and impact of WWII.",
    content: `
World War II (1939-1945) was the largest and deadliest conflict in human history, involving most of the world's nations.

Major Aspects:

1. Causes and Beginning
- Rise of fascism
- German expansion
- Pearl Harbor attack

2. Key Battles
- Battle of Britain
- Stalingrad
- D-Day invasion

3. Home Front
- War production
- Women in workforce
- Rationing and sacrifice

The war's aftermath shaped the modern world order and international relations.
    `,
    era: "modern",
    imageUrl: "https://images.unsplash.com/photo-1519576724337-68b70e457b5f",
    isPremium: true,
    estimatedMinutes: 30,
    prerequisites: [],
  }
];

async function seed() {
  console.log("Seeding database...");

  try {
    // First, delete all user progress records to avoid foreign key conflicts
    await db.delete(userProgress);
    // Then clear existing lessons
    await db.delete(lessons);
    // Finally, insert new lessons
    await db.insert(lessons).values(seedLessons);
    console.log("Successfully seeded lessons");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();