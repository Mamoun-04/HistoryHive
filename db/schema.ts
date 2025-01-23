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

export const feedPosts = pgTable("feed_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  likes: integer("likes").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const feedLikes = pgTable("feed_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => feedPosts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userSavedPosts = pgTable("user_saved_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => feedPosts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  era: text("era").notNull(),
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
  type: text("type").notNull(),
  details: jsonb("details").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow().notNull()
});

export const lessonsRelations = relations(lessons, ({ many }) => ({
  progress: many(userProgress)
}));

export const userRelations = relations(users, ({ many }) => ({
  feedPosts: many(feedPosts),
  likes: many(feedLikes),
  savedPosts: many(userSavedPosts),
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

export const feedPostsRelations = relations(feedPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [feedPosts.authorId],
    references: [users.id],
  }),
  likes: many(feedLikes),
  saves: many(userSavedPosts)
}));


export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertLessonSchema = createInsertSchema(lessons);
export const selectLessonSchema = createSelectSchema(lessons);
export const insertFeedPostSchema = createInsertSchema(feedPosts);
export const selectFeedPostSchema = createSelectSchema(feedPosts);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type FeedPost = typeof feedPosts.$inferSelect;
export type NewFeedPost = typeof feedPosts.$inferInsert;
export type FeedLike = typeof feedLikes.$inferSelect;
export type UserSavedPost = typeof userSavedPosts.$inferSelect;