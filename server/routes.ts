import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { lessons, userProgress, users, feedPosts, feedLikes, userSavedPosts } from "@db/schema";
import { eq, desc, and, sql, not } from "drizzle-orm";
import { setupAuth } from "./auth";
import { setupStripe } from "./stripe";

export function registerRoutes(app: Express): Server {
  setupAuth(app);
  setupStripe(app);

  // Create a new lesson (admin only)
  app.post("/api/lessons", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    // For now, anyone can create lessons. In production, add admin check.
    try {
      const newLesson = await db.insert(lessons).values(req.body).returning();
      res.json(newLesson[0]);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  // Get all lessons
  app.get("/api/lessons", async (req, res) => {
    const allLessons = await db.query.lessons.findMany({
      orderBy: desc(lessons.createdAt)
    });
    res.json(allLessons);
  });

  // Get recommended lessons
  app.get("/api/lessons/recommended", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    try {
      // Get user's completed lessons
      const completedProgress = await db.query.userProgress.findMany({
        where: and(
          eq(userProgress.userId, req.user.id),
          eq(userProgress.completed, true)
        ),
        with: {
          lesson: true
        }
      });

      const completedLessonIds = completedProgress.map(p => p.lessonId);
      const completedEras = new Set(completedProgress.map(p => p.lesson.era));
      const averageCompletionTime = completedProgress.length;

      // Build recommendation query based on multiple factors
      const recommendations = await db.query.lessons.findMany({
        where: and(
          // Exclude completed lessons
          not(sql`${lessons.id} = ANY(${completedLessonIds})`),
          // Include lessons from preferred eras
          sql`${lessons.era} = ANY(${Array.from(completedEras)})`,
          // Filter by appropriate difficulty (based on completion history)
          sql`${lessons.estimatedMinutes} BETWEEN ${
            Math.max(5, averageCompletionTime - 10)
          } AND ${
            averageCompletionTime + 10
          }`
        ),
        limit: 5,
        orderBy: [
          // Prioritize lessons with completed prerequisites
          desc(sql`
            CASE WHEN ${lessons.prerequisites} && ${JSON.stringify(completedLessonIds)}
            THEN 1 ELSE 0 END
          `),
          desc(lessons.createdAt)
        ]
      });

      res.json(recommendations);
    } catch (error: any) {
      console.error("Error getting recommendations:", error);
      res.status(500).send("Error generating recommendations");
    }
  });

  // Get specific lesson
  app.get("/api/lessons/:id", async (req, res) => {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, parseInt(req.params.id))
    });

    if (!lesson) {
      return res.status(404).send("Lesson not found");
    }

    // Check if lesson is premium and user is not subscribed
    if (lesson.isPremium && (!req.user || !req.user.isSubscribed)) {
      return res.status(403).send("Premium subscription required");
    }

    res.json(lesson);
  });

  // Complete a lesson
  app.post("/api/lessons/:id/complete", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const lessonId = parseInt(req.params.id);

    const existing = await db.query.userProgress.findFirst({
      where: and(
        eq(userProgress.lessonId, lessonId),
        eq(userProgress.userId, req.user.id)
      )
    });

    if (existing) {
      await db
        .update(userProgress)
        .set({ completed: true, lastAttempted: new Date() })
        .where(eq(userProgress.id, existing.id));
    } else {
      await db.insert(userProgress).values({
        userId: req.user.id,
        lessonId,
        completed: true,
      });
    }

    res.json({ success: true });
  });

  // Feed routes
  app.get("/api/feed", async (req, res) => {
    try {
      const posts = await db.query.feedPosts.findMany({
        orderBy: desc(feedPosts.createdAt),
        with: {
          author: true,
        },
      });
      res.json(posts);
    } catch (error: any) {
      console.error("Error fetching feed:", error);
      res.status(500).send("Error fetching feed");
    }
  });

  app.post("/api/feed/:id/like", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const postId = parseInt(req.params.id);

    try {
      const existing = await db.query.feedLikes.findFirst({
        where: and(
          eq(feedLikes.postId, postId),
          eq(feedLikes.userId, req.user.id)
        ),
      });

      if (existing) {
        // Unlike
        await db.delete(feedLikes).where(eq(feedLikes.id, existing.id));
        await db
          .update(feedPosts)
          .set({ likes: sql`${feedPosts.likes} - 1` })
          .where(eq(feedPosts.id, postId));
      } else {
        // Like
        await db.insert(feedLikes).values({
          userId: req.user.id,
          postId,
        });
        await db
          .update(feedPosts)
          .set({ likes: sql`${feedPosts.likes} + 1` })
          .where(eq(feedPosts.id, postId));
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error liking post:", error);
      res.status(500).send("Error liking post");
    }
  });

  app.post("/api/feed/:id/save", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    const postId = parseInt(req.params.id);

    try {
      const existing = await db.query.userSavedPosts.findFirst({
        where: and(
          eq(userSavedPosts.postId, postId),
          eq(userSavedPosts.userId, req.user.id)
        ),
      });

      if (!existing) {
        await db.insert(userSavedPosts).values({
          userId: req.user.id,
          postId,
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error saving post:", error);
      res.status(500).send("Error saving post");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}