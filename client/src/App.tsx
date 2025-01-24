import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-user";
import { Loader2, BookOpen, Play, Compass } from "lucide-react";

import Home from "@/pages/home";
import Lesson from "@/pages/lesson";
import Feed from "@/pages/feed";
import Explore from "@/pages/explore";
import AuthPage from "@/components/auth/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useUser();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <a href="/" className={`flex items-center gap-2 p-2 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              <BookOpen className="h-5 w-5" />
              <span>Learn</span>
            </a>
            <a href="/explore" className={`flex items-center gap-2 p-2 ${location === '/explore' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Compass className="h-5 w-5" />
              <span>Explore</span>
            </a>
            <a href="/feed" className={`flex items-center gap-2 p-2 ${location === '/feed' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Play className="h-5 w-5" />
              <span>Feed</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="pb-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/explore" component={Explore} />
          <Route path="/lesson/:id" component={Lesson} />
          <Route path="/feed" component={Feed} />
          <Route path="/era/:id" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;