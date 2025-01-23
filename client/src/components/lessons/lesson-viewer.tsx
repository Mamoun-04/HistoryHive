import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import type { Lesson } from "@db/schema";

interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function LessonViewer({ lesson, onComplete }: LessonViewerProps) {
  const [progress, setProgress] = useState(0);
  const { speak, stop, speaking, supported } = useSpeech();

  const handleTextToSpeech = () => {
    if (speaking) {
      stop();
    } else {
      speak(lesson.content);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">{progress}% Complete</p>
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none">
          <h1>{lesson.title}</h1>
          <p className="lead">{lesson.description}</p>
          
          {supported && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTextToSpeech}
              className="mb-4"
            >
              {speaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {speaking ? "Stop Reading" : "Read Aloud"}
            </Button>
          )}

          <div className="content">
            {lesson.content}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={() => {
            setProgress(100);
            onComplete();
          }}>
            Mark as Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
