import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import type { FeedPost } from "@db/schema";
import { Heart, Share2, Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Feed() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    dragFree: true,
  });

  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-background p-4 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load feed"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="h-screen w-full bg-background p-4 flex items-center justify-center">
        <Alert>
          <AlertDescription>
            No posts available. Check back later for new content!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={cn(
                "embla__slide relative h-full w-full flex items-center justify-center",
                currentIndex === index ? "opacity-100" : "opacity-50"
              )}
            >
              {post.mediaUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40"
                  style={{ backgroundImage: `url(${post.mediaUrl})` }}
                />
              )}
              <div className="relative z-10 max-w-lg mx-auto p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                <p className="text-lg mb-8">{post.content}</p>
                <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/50 hover:bg-black/70"
                    onClick={() => likeMutation.mutate(post.id)}
                    disabled={likeMutation.isPending}
                  >
                    <Heart
                      className={cn(
                        "h-6 w-6",
                        post.likes > 0 ? "fill-red-500 text-red-500" : "text-white",
                        likeMutation.isPending && "animate-pulse"
                      )}
                    />
                    <span className="sr-only">Like</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/50 hover:bg-black/70"
                    onClick={() => saveMutation.mutate(post.id)}
                    disabled={saveMutation.isPending}
                  >
                    <Bookmark 
                      className={cn(
                        "h-6 w-6 text-white",
                        saveMutation.isPending && "animate-pulse"
                      )}
                    />
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/50 hover:bg-black/70"
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
                    <Share2 className="h-6 w-6 text-white" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}