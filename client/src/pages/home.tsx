import { TimelineNav } from "@/components/timeline/timeline-nav";
import { LessonCard } from "@/components/lessons/lesson-card";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import type { Lesson } from "@db/schema";

export default function Home() {
  const { user } = useUser();
  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">History Timeline</h1>
        <p className="text-muted-foreground">
          Explore the past through interactive lessons
        </p>
      </header>

      <TimelineNav />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons?.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isSubscribed={user?.isSubscribed ?? false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
