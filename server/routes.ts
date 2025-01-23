import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { lessons, userProgress, users } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { setupAuth } from "./auth";
import { setupStripe } from "./stripe";

export function registerRoutes(app: Express): Server {
  setupAuth(app);
  setupStripe(app);

  // Get all lessons
  app.get("/api/lessons", async (req, res) => {
    const allLessons = await db.query.lessons.findMany();
    res.json(allLessons);
  });

  // Get recommended lessons
  app.get("/api/lessons/recommended", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Not authenticated");
    }

    // Get user's completed lessons
    const completedLessons = await db.query.userProgress.findMany({
      where: and(
        eq(userProgress.userId, req.user.id),
        eq(userProgress.completed, true)
      ),
      with: {
        lesson: true
      }
    });

    // Get user's preferred eras based on completed lessons
    const completedEras = new Set(completedLessons.map(p => p.lesson.era));

    // Get lessons from similar eras that user hasn't completed
    const recommendations = await db.query.lessons.findMany({
      where: sql`${lessons.era} = ANY(ARRAY[${Array.from(completedEras).map(era => sql`${era}`)}])
        AND ${lessons.id} NOT IN (
          SELECT "lesson_id" FROM user_progress
          WHERE "user_id" = ${req.user.id}
        )`,
      limit: 5,
      orderBy: desc(lessons.createdAt)
    });

    res.json(recommendations);
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
    if (lesson.isPremium && req.user && !req.user.isSubscribed) {
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
      where: (userProgress) => 
        eq(userProgress.lessonId, lessonId) && 
        eq(userProgress.userId, req.user!.id)
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

  const httpServer = createServer(app);
  return httpServer;
}