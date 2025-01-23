import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { lessons, userProgress } from "@db/schema";
import { eq } from "drizzle-orm";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Get all lessons
  app.get("/api/lessons", async (req, res) => {
    const allLessons = await db.query.lessons.findMany();
    res.json(allLessons);
  });

  // Get specific lesson
  app.get("/api/lessons/:id", async (req, res) => {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, parseInt(req.params.id))
    });

    if (!lesson) {
      return res.status(404).send("Lesson not found");
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