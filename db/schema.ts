import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  isSubscribed: boolean("is_subscribed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  era: text("era").notNull(), // Ancient, Medieval, Modern etc.
  imageUrl: text("image_url"),
  isPremium: boolean("is_premium").default(false).notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  prerequisites: jsonb("prerequisites").$type<number[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  lastAttempted: timestamp("last_attempted").defaultNow().notNull()
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // streak, completion, etc.
  details: jsonb("details").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow().notNull()
});

// Relations
export const lessonsRelations = relations(lessons, ({ many }) => ({
  progress: many(userProgress)
}));

export const userRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(achievements)
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertLessonSchema = createInsertSchema(lessons);
export const selectLessonSchema = createSelectSchema(lessons);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
