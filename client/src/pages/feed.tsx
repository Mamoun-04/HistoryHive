import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import type { FeedPost } from "@db/schema";
import { Heart, Share2, Bookmark, MessageCircle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Feed() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery<FeedPost[]>({
    queryKey: ["/api/feed"],
    retry: 1,
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/feed/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feed"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/feed/${postId}/save`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post saved!",
        description: "You can find this post in your profile.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load feed"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>
            No posts available. Check back later for new content!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Historical Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            {post.mediaUrl && (
              <div className="aspect-video relative">
                <img 
                  src={post.mediaUrl} 
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarClock className="mr-1 h-4 w-4" />
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{post.content}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => likeMutation.mutate(post.id)}
                  disabled={likeMutation.isPending}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      post.likes > 0 ? "fill-red-500 text-red-500" : "",
                      likeMutation.isPending && "animate-pulse"
                    )}
                  />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => saveMutation.mutate(post.id)}
                  disabled={saveMutation.isPending}
                >
                  <Bookmark 
                    className={cn(
                      "h-4 w-4",
                      saveMutation.isPending && "animate-pulse"
                    )}
                  />
                  <span>Save</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.content,
                      url: window.location.href,
                    }).catch((error) => {
                      console.error('Error sharing:', error);
                      toast({
                        title: "Error",
                        description: "Failed to share post",
                        variant: "destructive",
                      });
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}