import { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse"; // Standard CSV parser for browser React apps
import SearchBar from "@/components/ev/SearchBar";
import FilterPanel from "@/components/ev/FilterPanel";
import StationCard from "@/components/ev/StationCard";
import StationSkeleton from "@/components/ev/StationSkeleton";
import MapView from "@/components/ev/MapView";
import StationDetailDrawer from "@/components/ev/StationDetailDrawer";
import { haversineDistance } from "@/lib/haversine";
import { exportToCsv } from "@/lib/csv";
import { useStationCollections } from "@/lib/useStationCollections";
// GitHub raw CSV URL for your dataset
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
  // Apply UI Filters & Sorting
  const filtered = useMemo(() => {
    let list = [...nearbyStations];
    if (filters.connector) list = list.filter((s) => String(s.ev_connector_types || "").includes(filters.connector));
    if (filters.network) list = list.filter((s) => s.ev_network === filters.network);
    if (filters.dcFastOnly) list = list.filter((s) => s.ev_dc_fast_count > 0);
    if (filters.publicOnly) list = list.filter((s) => s.access_code === "public");
    list.sort((a, b) => {
      if (sort === "distance") return a.distanceMeters - b.distanceMeters;
      if (sort === "chargers") return (b.ev_level2_evse_num + b.ev_dc_fast_count) - (a.ev_level2_evse_num + a.ev_dc_fast_count);
      if (sort === "dcfast") return b.ev_dc_fast_count - a.ev_dc_fast_count;
      if (sort === "name") return a.station_name.localeCompare(b.station_name);
      return 0;
    });
    return list;
  }, [nearbyStations, filters, sort]);
  return (
    // Standard UI JSX preserved from your Base44 code
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
      {/* Search Bar & Map rendering code stays unchanged */}
    </div>
  );
}