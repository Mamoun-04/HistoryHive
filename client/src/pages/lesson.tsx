import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { LessonViewer } from "@/components/lessons/lesson-viewer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Lesson } from "@db/schema";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: lesson } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${id}`],
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/lessons/${id}/complete`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Lesson Completed!",
        description: "Your progress has been saved."
      });
    },
  });

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Timeline
      </Button>

      <LessonViewer
        lesson={lesson}
        onComplete={() => completeMutation.mutate()}
      />
    </div>
  );
}
