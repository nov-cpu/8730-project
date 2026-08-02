import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { geocodeAddress } from "@/lib/geocode";
import { useToast } from "@/components/ui/use-toast";
export default function SearchBar({ onLocationFound, loading }) {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const { toast } = useToast();
  const blurTimer = useRef(null);
  useEffect(() => {
    if (address.trim().length < 3) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        /* ignore */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [address]);
  const useGps = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onLocationFound({ lat: pos.coords.latitude, lng: pos.coords.longitude }, "Current location");
      },
      () => {
        setLocating(false);
        toast({ title: "Location error", description: "Could not get your location. Check browser permissions.", variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  const pick = (s) => {
    setSuggestions([]);
    setAddress(s.display_name);
    onLocationFound({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) }, s.display_name);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setSearching(true);
    try {
      const r = await geocodeAddress(address);
      onLocationFound({ lat: r.lat, lng: r.lng }, r.displayName);
    } catch {
      toast({ title: "Not found", description: "Couldn't find that address. Try being more specific.", variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };
  return (
    <div className="relative">
      <form onSubmit={submit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => { blurTimer.current = setTimeout(() => setSuggestions([]), 150); }}
            onFocus={() => clearTimeout(blurTimer.current)}
            placeholder="Enter address, city, or ZIP…"
            className="w-full rounded-xl border bg-background pl-10 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          {address && (
            <button type="button" onClick={() => { setAddress(""); setSuggestions([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="button" onClick={useGps} disabled={locating || loading} className="shrink-0">
          <Navigation className="h-4 w-4" /><span className="hidden sm:inline">{locating ? "Locating…" : "Use GPS"}</span>
        </Button>
      </form>
      {suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-lg animate-slide-up">
          {suggestions.map((s) => (
            <button key={s.place_id} type="button" onMouseDown={() => pick(s)} className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-accent">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-2">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
      {searching && <p className="absolute mt-1 text-xs text-muted-foreground">Searching…</p>}
    </div>
  );
}