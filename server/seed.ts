import { db } from "@db";
import { lessons } from "@db/schema";

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
    isPremium: true,
    estimatedMinutes: 20,
    prerequisites: [],
  }
];

async function seed() {
  console.log("Seeding database...");
  
  try {
    await db.insert(lessons).values(seedLessons);
    console.log("Successfully seeded lessons");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
