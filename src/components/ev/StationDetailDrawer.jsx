import { X, MapPin, Phone, Clock, Wifi, Globe, Lock, Building2, Calendar, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChargerAvailability from "@/components/ev/ChargerAvailability";
import ConnectorBadges from "@/components/ev/ConnectorBadges";
import ReviewAnalysis from "@/components/ev/ReviewAnalysis";
import { formatDistance } from "@/lib/haversine";
function Row({ icon: Icon, label, children }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="flex items-start gap-2 py-1.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="w-28 shrink-0 font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words font-medium text-foreground">{children}</span>
    </div>
  );
}
export default function StationDetailDrawer({ station, onClose, onFavorite, isFavorite }) {
  if (!station) return null;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative h-full w-full max-w-md overflow-y-auto bg-background shadow-2xl animate-slide-in-right">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <h2 className="truncate font-bold">{station.station_name}</h2>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {station.city}, {station.state}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-5 p-4">
          {station.distanceMeters != null && (
            <div className="rounded-xl bg-primary/10 p-3 text-center">
              <p className="text-2xl font-extrabold text-primary">{formatDistance(station.distanceMeters)}</p>
              <p className="text-xs text-muted-foreground">from your location</p>
            </div>
          )}
          <div className="flex gap-2">
            <a href={directions} target="_blank" rel="noreferrer" className="flex-1">
              <Button className="w-full"><Navigation className="h-4 w-4" /> Directions</Button>
            </a>
            <Button variant={isFavorite ? "default" : "outline"} onClick={() => onFavorite(station)} className="flex-1">
              {isFavorite ? "♥ Saved" : "♡ Save"}
            </Button>
          </div>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Charger Availability</h3>
            <div className="rounded-xl border bg-card p-3">
              <ChargerAvailability station={station} />
            </div>
            <div className="mt-2"><ConnectorBadges types={station.ev_connector_types} /></div>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Station Information</h3>
            <div className="rounded-xl border bg-card p-3">
              <Row icon={Calendar} label="Hours">{station.access_days_time}</Row>
              <Row icon={Phone} label="Phone">{station.station_phone}</Row>
              <Row icon={Wifi} label="Network">{station.ev_network}</Row>
              <Row icon={Globe} label="Website">
                {station.ev_network_web && (
                  <a href={station.ev_network_web} target="_blank" rel="noreferrer" className="text-primary underline">
                    {station.ev_network_web}
                  </a>
                )}
              </Row>
              <Row icon={Lock} label="Access">{station.access_code}</Row>
              <Row icon={Building2} label="Access Detail">{station.access_detail_code}</Row>
            </div>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dataset Enrichment</h3>
            <div className="rounded-xl border bg-card p-3">
              <Row icon={MapPin} label="Street">{station.street_address}</Row>
              <Row icon={MapPin} label="ZIP">{station.zip}</Row>
              <Row icon={Building2} label="Pricing">{station.ev_pricing}</Row>
              <Row icon={Lock} label="Restricted">{station.restricted_access ? "Yes" : "No"}</Row>
              <Row icon={Building2} label="Workplace Chg">{station.ev_workplace_charging ? "Yes" : "No"}</Row>
              <Row icon={Building2} label="Max Vehicle">{station.maximum_vehicle_class}</Row>
              <Row icon={Calendar} label="Last Confirmed">{station.date_last_confirmed}</Row>
            </div>
          </section>
          <section>
            <ReviewAnalysis station={station} />
          </section>
        </div>
      </div>
    </div>
  );
}