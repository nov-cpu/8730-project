import { MapPin, Zap, Heart, GitCompare, Clock, Wifi } from "lucide-react";
import ChargerAvailability from "@/components/ev/ChargerAvailability";
import ConnectorBadges from "@/components/ev/ConnectorBadges";
import { formatDistance } from "@/lib/haversine";
export default function StationCard({ station, onSelect, onFavorite, isFavorite, onCompare, isComparing }) {
  return (
    <div
      onClick={() => onSelect(station)}
      className="group cursor-pointer rounded-2xl border bg-card p-4 shadow-sm transition hover:shadow-md hover:border-primary/40 animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Zap className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary">{station.station_name}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite(station); }}
                className={`rounded-lg p-1.5 transition ${isFavorite ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Favorite"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onCompare(station); }}
                className={`rounded-lg p-1.5 transition ${isComparing ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Compare"
              >
                <GitCompare className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{station.street_address}, {station.city}, {station.state}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {station.distanceMeters != null && (
              <span className="font-semibold text-primary">{formatDistance(station.distanceMeters)} away</span>
            )}
            {station.ev_network && (
              <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" />{station.ev_network}</span>
            )}
            {station.access_days_time && (
              <span className="inline-flex items-center gap-1 truncate">
                <Clock className="h-3 w-3 shrink-0" />{station.access_days_time.split(";")[0]}
              </span>
            )}
          </div>
          <div className="mt-2"><ConnectorBadges types={station.ev_connector_types} /></div>
          <div className="mt-2"><ChargerAvailability station={station} compact /></div>
        </div>
      </div>
    </div>
  );
}