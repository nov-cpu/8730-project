import { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import SearchBar from "@/components/ev/SearchBar";
import FilterPanel from "@/components/ev/FilterPanel";
import StationCard from "@/components/ev/StationCard";
import StationSkeleton from "@/components/ev/StationSkeleton";
import MapView from "@/components/ev/MapView";
import StationDetailDrawer from "@/components/ev/StationDetailDrawer";
import { haversineDistance } from "@/lib/haversine";
import { exportToCsv } from "@/lib/csv";
import { useStationCollections } from "@/lib/useStationCollections";
import { Download, MapPin, Zap, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

// Pointing to your raw enriched dataset
const CSV_DATA_URL = "https://raw.githubusercontent.com/nov-cpu/8730-project/refs/heads/Data/final_merged_dashboard_data.csv";

export default function Home() {
  const [allStations, setAllStations] = useState([]);
  const [location, setLocation] = useState(null);
  const [searchLabel, setSearchLabel] = useState("");
  const [sort, setSort] = useState("distance");
  const [filters, setFilters] = useState({ connector: "", network: "", dcFastOnly: false, publicOnly: false });
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isFavorite, isComparing, addToRecent, toggleFavorite, toggleCompare } = useStationCollections();

useEffect(() => {
    Papa.parse(CSV_DATA_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const cleaned = results.data.map((row, id) => ({
          id: id + 1,
          // Account for both the old flat CSV format and the new SQL-merged column headers
          station_name: row["Station_name"] || row["Station Name"] || row["station_name"] || "EV Station",
          street_address: row["Street_Address"] || row["Street Address"] || row["street_address"] || "",
          city: row["City"] || row["City "] || row["city"] || "",
          state: row["State"] || row["state"] || "",
          zip: row["ZIP"] || row["zip"] || "",
          latitude: parseFloat(row["Latitude"] || row["latitude"]),
          longitude: parseFloat(row["Longitude"] || row["longitude"]),
          
          // Network & Connectors
          ev_network: row["EV_Network"] || row["EV Network"] || row["ev_network"] || "Non-Networked",
          ev_connector_types: row["EV_Connector_Types"] || row["EV Connector Types"] || row["ev_connector_types"] || "J1772",
          
          // Charger Counts (Crucial for the badges)
          ev_level1_evse_num: parseInt(row["EV_Level1_EVSE_Num"] || row["EV Level1 EVSE Num"] || row["ev_level1_evse_num"] || 0),
          ev_level2_evse_num: parseInt(row["EV_Level2_EVSE_num"] || row["EV Level2 EVSE Num"] || row["ev_level2_evse_num"] || 0),
          ev_dc_fast_count: parseInt(row["EV_DC_Fast_Count"] || row["EV DC Fast Count"] || row["ev_dc_fast_count"] || 0),
          
          // Access & Hours
          access_code: row["Access_code"] || row["Access Code"] || row["access_code"] || "public",
          access_detail_code: row["Access_Detail_code"] || row["Access Detail Code"] || "",
          access_days_time: row["Access_Day_time"] || row["Access Days Time"] || row["access_days_time"] || "24 Hours Daily",
          
          // Pricing & Vehicles
          ev_pricing: row["EV_Pricing"] || row["EV Pricing"] || row["ev_pricing"] || "Free / Unknown",
          maximum_vehicle_class: row["Maximum_Vehicle_Class"] || "Light Duty",
          
          // Booleans
          restricted_access: row["Restricted_access"] == 1 || String(row["Restricted_access"]).toLowerCase() === 'true',
          ev_workplace_charging: row["Ev_Workplace_charging "] == 1 || String(row["Ev_Workplace_charging "]).toLowerCase() === 'true',
          
          // Google Data (from SerpAPI if available)
          rating: row["google_rating"] || "N/A",
          reviews_count: row["google_reviews_count"] || 0,
        })).filter(s => !isNaN(s.latitude) && !isNaN(s.longitude));

        setAllStations(cleaned);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Failed to load CSV:", error);
        alert("Error loading data! Please check the CSV link in your code.");
        setIsLoading(false);
      }
    });
  }, []);

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
          <h1 className="text-xl font-extrabold sm:text-2xl">EV Infrastructure & Accessibility Navigator</h1>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Multi-attribute descriptive analytics combining NREL spatial data, fleet accessibility metrics, and Google Maps sentiment analysis within 5 km.
        </p>
        <SearchBar onLocationFound={(loc, label) => { setLocation(loc); setSearchLabel(label); }} loading={isLoading} />
      </div>

      {!location && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center animate-fade-in">
          <MapPin className="h-10 w-10 text-primary/40" />
          <p className="mt-3 font-medium">Enter a Canadian location or use GPS to analyze nearby stations</p>
          <p className="text-sm text-muted-foreground">Displays custom infrastructure attributes, vehicle suitability, and ratings within 5 km.</p>
        </div>
      )}

      {location && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Analyzing…" : `${filtered.length} station${filtered.length !== 1 ? "s" : ""} found within 5 km`}
              {searchLabel && (<> near <span className="font-medium text-foreground">{searchLabel}</span></>)}
            </p>
            <Button variant="outline" size="sm" onClick={() => exportToCsv(filtered)} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /> Export Analytics CSV
            </Button>
          </div>

          <FilterPanel sort={sort} setSort={setSort} filters={filters} setFilters={setFilters} networks={networks} connectorTypes={connectorTypes} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="order-2 space-y-3 lg:order-1">
              {isLoading ? (
                [...Array(4)].map((_, i) => <StationSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
                  No charging stations match your current criteria.
                </div>
              ) : (
                filtered.map((s) => (
                  <StationCard
                    key={s.id}
                    station={s}
                    onSelect={handleSelect}
                    onFavorite={toggleFavorite}
                    isFavorite={isFavorite(s)}
                    onCompare={toggleCompare}
                    isComparing={isComparing(s)}
                  />
                ))
              )}
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