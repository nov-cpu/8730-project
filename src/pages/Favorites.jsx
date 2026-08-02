import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import StationCard from "@/components/ev/StationCard";
import StationDetailDrawer from "@/components/ev/StationDetailDrawer";
import { useStationCollections } from "@/lib/useStationCollections";
export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite, isComparing, toggleCompare, addToRecent } = useStationCollections();
  const [selected, setSelected] = useState(null);
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-extrabold">Favorite Stations</h1>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{favorites.length}</span>
      </div>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
          <Heart className="h-10 w-10 text-primary/40" />
          <p className="mt-3 font-medium">No favorites yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Tap the heart on any station to save it here.</p>
          <Link to="/" className="font-medium text-primary underline">Find stations</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {favorites.map((s) => (
            <StationCard
              key={s.id}
              station={s}
              onSelect={(st) => { setSelected(st); addToRecent(st); }}
              onFavorite={toggleFavorite}
              isFavorite={isFavorite(s)}
              onCompare={toggleCompare}
              isComparing={isComparing(s)}
            />
          ))}
        </div>
      )}
      <StationDetailDrawer
        station={selected}
        onClose={() => setSelected(null)}
        onFavorite={toggleFavorite}
        isFavorite={selected && isFavorite(selected)}
      />
    </div>
  );
}