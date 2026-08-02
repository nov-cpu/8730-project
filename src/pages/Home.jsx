import { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import SearchBar from "@/components/ev/SearchBar";
import FilterPanel from "@/components/ev/FilterPanel";
import StationCard from "@/components/ev/StationCard";
import StationSkeleton from "@/components/ev/StationSkeleton";
import MapView from "@/components/ev/MapView";
import StationDetailDrawer from "@/components/ev/StationDetailDrawer";
import { boundingBox, haversineDistance } from "@/lib/haversine";
import { exportToCsv } from "@/lib/csv";
import { useStationCollections } from "@/lib/useStationCollections";
import { Download, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// Pulling data directly from your GitHub repo instead of Base44 servers
const CSV_DATA_URL = "https://raw.githubusercontent.com/nov-cpu/8730-project/b1efc13706771f9a3cf995482a8ac9a4ad2ae850/alt_fuel_stations_clean.csv";

export default function Home() {
  const [allStations, setAllStations] = useState([]);
  const [location, setLocation] = useState(null);
  const [searchLabel, setSearchLabel] = useState("");
  const [sort, setSort] = useState("distance");
  const [filters, setFilters] = useState({ connector: "", network: "", dcFastOnly: false, publicOnly: false });
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isFavorite, isComparing, addToRecent, toggleFavorite, toggleCompare } = useStationCollections();

  // Load CSV data once on startup
  useEffect(() => {
    Papa.parse(CSV_DATA_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const cleaned = results.data.map((row, id) => ({
          id: id + 1,
          station_name: row["Station Name"] || row["station_name"],
          street_address: row["Street Address"] || row["street_address"],
          city: row["City"] || row["city"],
          state: row["State"] || row["state"],
          zip: row["ZIP"] || row["zip"],
          latitude: parseFloat(row["Latitude"] || row["latitude"]),
          longitude: parseFloat(row["Longitude"] || row["longitude"]),
          ev_network: row["EV Network"] || row["ev_network"],
          ev_connector_types: row["EV Connector Types"] || row["ev_connector_types"],
          ev_level1_evse_num: parseInt(row["EV Level1 EVSE Num"] || row["ev_level1_evse_num"] || 0),
          ev_level2_evse_num: parseInt(row["EV Level2 EVSE Num"] || row["ev_level2_evse_num"] || 0),
          ev_dc_fast_count: parseInt(row["EV DC Fast Count"] || row["ev_dc_fast_count"] || 0),
          access_code: row["Access Code"] || row["access_code"] || "public",
          access_days_time: row["Access Days Time"] || row["access_days_time"],
          ev_pricing: row["EV Pricing"] || row["ev_pricing"],
          station_phone: row["Station Phone"] || row["station_phone"],
        })).filter(s => !isNaN(s.latitude) && !isNaN(s.longitude));

        setAllStations(cleaned);
        setIsLoading(false);
      }
    });
  }, []);

  // Filter stations by 5 km radius when user selects a location
  const nearbyStations = useMemo(() => {
    if (!location) return [];
    return allStations
      .map((s) => ({
        ...s,
        distanceMeters: haversineDistance(location.lat, location.lng, s.latitude, s.longitude),
      }))
      .filter((s) => s.distanceMeters <= 5000);
  }, [location, allStations]);

  const { networks, connectorTypes } = useMemo(() => {
    const n = new Set();
    const c = new Set();
    allStations.forEach((s) => {
      if (s.ev_network) n.add(s.ev_network);
      if (s.ev_connector_types) String(s.ev_connector_types).split(/\s+/).forEach((x) => x && c.add(x));
    });
    return { networks: [...n].sort(), connectorTypes: [...c].sort() };
  }, [allStations]);

  const filtered = useMemo(() => {
    let list = [...nearbyStations];
    if (filters.connector) list = list.filter((s) => String(s.ev_connector_types || "").includes(filters.connector));
    if (filters.network) list = list.filter((s) => s.ev_network === filters.network);
    if (filters.dcFastOnly) list = list.filter((s) => (s.ev_dc_fast_count || 0) > 0);
    if (filters.publicOnly) list = list.filter((s) => s.access_code === "public");
    list.sort((a, b) => {
      if (sort === "distance") return a.distanceMeters - b.distanceMeters;
      if (sort === "chargers") return ((b.ev_level2_evse_num || 0) + (b.ev_dc_fast_count || 0)) - ((a.ev_level2_evse_num || 0) + (a.ev_dc_fast_count || 0));
      if (sort === "dcfast") return (b.ev_dc_fast_count || 0) - (a.ev_dc_fast_count || 0);
      if (sort === "name") return a.station_name.localeCompare(b.station_name);
      return 0;
    });
    return list;
  }, [nearbyStations, filters, sort]);

  const handleSelect = useCallback((s) => {
    setSelected(s);
    addToRecent(s);
  }, [addToRecent]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
      <div className="animate-fade-in rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-6">
        <div className="mb-1 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-extrabold sm:text-2xl">Find EV Charging Stations Near You</h1>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Search by address or use your GPS to discover 15,500+ stations within a 5 km radius.
        </p>
        <SearchBar onLocationFound={(loc, label) => { setLocation(loc); setSearchLabel(label); }} loading={isLoading} />
      </div>
      {!location && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center animate-fade-in">
          <MapPin className="h-10 w-10 text-primary/40" />
          <p className="mt-3 font-medium">Enter a location or use GPS to start searching</p>
          <p className="text-sm text-muted-foreground">Results show stations within 5 km of your chosen point.</p>
        </div>
      )}
      {location && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Searching…" : `${filtered.length} station${filtered.length !== 1 ? "s" : ""} within 5 km`}
              {searchLabel && (
                <> near <span className="font-medium text-foreground">{searchLabel}</span></>
              )}
            </p>
            <Button variant="outline" size="sm" onClick={() => exportToCsv(filtered)} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <FilterPanel sort={sort} setSort={setSort} filters={filters} setFilters={setFilters} networks={networks} connectorTypes={connectorTypes} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="order-2 space-y-3 lg:order-1">
              {isLoading
                ? [...Array(5)].map((_, i) => <StationSkeleton key={i} />)
                : filtered.length === 0
                  ? (
                    <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
                      No stations match your filters.
                    </div>
                  )
                  : filtered.map((s) => (
                    <StationCard
                      key={s.id}
                      station={s}
                      onSelect={handleSelect}
                      onFavorite={toggleFavorite}
                      isFavorite={isFavorite(s)}
                      onCompare={toggleCompare}
                      isComparing={isComparing(s)}
                    />
                  ))}
            </div>
            <div className="order-1 h-[400px] overflow-hidden rounded-2xl border lg:sticky lg:top-20 lg:order-2 lg:h-[calc(100vh-7rem)]">
              <MapView stations={filtered} userLocation={location} selectedStation={selected} onSelectStation={handleSelect} />
            </div>
          </div>
        </>
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