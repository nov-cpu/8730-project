import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/lib/useLocalStorage";
// Shared collections (favorites, recently viewed, compare) used by Home, Favorites, Compare
export function useStationCollections() {
  const [favorites, setFavorites] = useLocalStorage("ev-favorites", []);
  const [recent, setRecent] = useLocalStorage("ev-recent", []);
  const [compare, setCompare] = useLocalStorage("ev-compare", []);
  const { toast } = useToast();
  const isFavorite = (s) => favorites.some((f) => f.id === s.id);
  const isComparing = (s) => compare.some((c) => c.id === s.id);
  const addToRecent = (s) =>
    setRecent((prev) => [s, ...prev.filter((p) => p.id !== s.id)].slice(0, 12));
  const toggleFavorite = (s) =>
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === s.id);
      toast({ title: exists ? "Removed from favorites" : "Added to favorites", description: s.station_name });
      return exists ? prev.filter((f) => f.id !== s.id) : [...prev, s];
    });
  const toggleCompare = (s) =>
    setCompare((prev) => {
      const exists = prev.some((c) => c.id === s.id);
      if (exists) return prev.filter((c) => c.id !== s.id);
      if (prev.length >= 3) {
        toast({ title: "Compare full", description: "Max 3 stations. Remove one first.", variant: "destructive" });
        return prev;
      }
      toast({ title: "Added to compare", description: s.station_name });
      return [...prev, s];
    });
  return {
    favorites, setFavorites,
    recent, setRecent,
    compare, setCompare,
    isFavorite, isComparing,
    addToRecent, toggleFavorite, toggleCompare,
  };
}