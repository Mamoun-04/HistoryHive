import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Clock } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Lesson } from "@db/schema";
import { Link } from "wouter";

interface LessonCardProps {
  lesson: Lesson;
  isSubscribed: boolean;
}

export function LessonCard({ lesson, isSubscribed }: LessonCardProps) {
  const isLocked = lesson.isPremium && !isSubscribed;

  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader className="relative">
        {lesson.imageUrl && (
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: `url(${lesson.imageUrl})`, opacity: 0.2 }} />
        )}
        <CardTitle className="relative">
          {lesson.title}
          {isLocked && <Lock className="h-4 w-4 ml-2 inline-block" />}
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{lesson.era}</Badge>
          {lesson.isPremium && <Badge variant="default">Premium</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(lesson.estimatedMinutes)}
          </div>
          <Button asChild variant={isLocked ? "secondary" : "default"}>
            <Link href={`/lesson/${lesson.id}`}>
              {isLocked ? "Upgrade to Access" : "Start Learning"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
