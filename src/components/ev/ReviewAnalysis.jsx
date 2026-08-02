import { Sparkles } from "lucide-react";
export default function ReviewAnalysis({ station }) {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">User Reviews</p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Live review sentiment analysis is currently running in offline mode. Check back later for AI-generated insights for {station.station_name}!
      </p>
    </div>
  );
}