import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, Medal } from "lucide-react";
import type { Lesson } from "@db/schema";

export default function ExplorePage() {
  const [era, setEra] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const filteredLessons = lessons?.filter(lesson => {
    const matchesEra = era === "all" || lesson.era === era;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Explore History</h1>
      
      <div className="flex gap-4 mb-8">
        <Input 
          placeholder="Search lessons..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        
        <Select value={era} onValueChange={setEra}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select era" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Eras</SelectItem>
            <SelectItem value="ancient">Ancient History</SelectItem>
            <SelectItem value="medieval">Medieval Period</SelectItem>
            <SelectItem value="modern">Modern Era</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          filteredLessons?.map((lesson) => (
            <Card 
              key={lesson.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lesson.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.estimatedMinutes} mins</span>
                </div>
                {lesson.isPremium && (
                  <div className="flex items-center gap-1">
                    <Medal className="h-4 w-4 text-yellow-500" />
                    <span>Premium</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
