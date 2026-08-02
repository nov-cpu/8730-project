// Export an array of station objects to CSV and trigger download
export function exportToCsv(stations, filename = "ev_stations.csv") {
  if (!stations || stations.length === 0) return;
  const headers = [
    "Station Name", "Address", "City", "State", "ZIP", "Distance (km)",
    "Network", "Connector Types", "Level 1", "Level 2", "DC Fast",
    "Access", "Pricing", "Phone", "Latitude", "Longitude",
  ];
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const rows = stations.map((s) => [
    s.station_name,
    s.street_address,
    s.city,
    s.state,
    s.zip,
    s.distanceMeters ? (s.distanceMeters / 1000).toFixed(2) : "",
    s.ev_network,
    s.ev_connector_types,
    s.ev_level1_evse_num ?? "",
    s.ev_level2_evse_num ?? "",
    s.ev_dc_fast_count ?? "",
    s.access_code,
    s.ev_pricing,
    s.station_phone,
    s.latitude,
    s.longitude,
  ].map(escape).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}