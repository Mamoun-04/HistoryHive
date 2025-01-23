import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { historicalEras } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export function TimelineNav() {
  const [location] = useLocation();
  
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
      <div className="flex w-max space-x-4 p-4">
        {historicalEras.map((era) => (
          <Link key={era.id} href={`/era/${era.id}`}>
            <Card
              className={cn(
                "w-[250px] cursor-pointer transition-all hover:scale-105",
                location === `/era/${era.id}` && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-0">
                <div
                  className="aspect-video w-full rounded-t-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${era.image})` }}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{era.name}</h3>
                  <p className="text-sm text-muted-foreground">{era.period}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
