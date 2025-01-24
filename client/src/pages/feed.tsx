import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import type { FeedPost, User } from "@db/schema";
import { Heart, Share2, Bookmark, MessageCircle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface FeedPostWithAuthor extends FeedPost {
  author: User;
}

export default function Feed() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery<FeedPostWithAuthor[]>({
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
      <div className="container max-w-2xl mx-auto py-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="mb-4 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
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
      <div className="container max-w-2xl mx-auto p-4">
        <Alert>
          <AlertDescription>
            No posts available. Check back later for new content!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-4">
        <h1 className="text-2xl font-bold px-4 mb-6">Your Historical Feed</h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="border-0 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4 mb-3">
                  <Avatar className="h-12 w-12">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
                      {post.author.username[0].toUpperCase()}
                    </div>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{post.author.username}</p>
                      <span className="text-sm text-muted-foreground">·</span>
                      <time className="text-sm text-muted-foreground">
                        {format(new Date(post.createdAt), 'MMM d')}
                      </time>
                    </div>
                    <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                    <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                    {post.mediaUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        <img 
                          src={post.mediaUrl} 
                          alt={post.title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="text-sm text-primary hover:underline cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:text-red-500"
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
                    <span>{post.likes || ''}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
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
                </div>
              </CardContent>
              <Separator />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}