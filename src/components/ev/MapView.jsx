import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? 13, { duration: 0.8 });
  }, [center?.[0], center?.[1]]);
  return null;
}
function markerColor(s) {
  if (s.ev_dc_fast_count > 0) return "#16a34a";
  if (s.ev_level2_evse_num > 0) return "#eab308";
  return "#dc2626";
}
function makeIcon(s, selected) {
  const color = markerColor(s);
  const size = selected ? 38 : 30;
  const label = s.ev_dc_fast_count || s.ev_level2_evse_num || s.ev_level1_evse_num || "•";
  return L.divIcon({
    className: "ev-marker-icon",
    html: `<div class="ev-marker" style="background:${color};width:${size}px;height:${size}px;"><span>${label}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}
const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 0 0 5px rgba(37,99,235,0.25)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
export default function MapView({ stations, userLocation, selectedStation, onSelectStation }) {
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [39.5, -98.35];
  return (
    <MapContainer center={center} zoom={userLocation ? 13 : 4} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={5000}
            pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.06, weight: 1.5, dashArray: "6 6" }}
          />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        </>
      )}
      <FlyTo center={userLocation ? [userLocation.lat, userLocation.lng] : null} zoom={13} />
      {stations.map((s) => (
        <Marker
          key={s.id}
          position={[s.latitude, s.longitude]}
          icon={makeIcon(s, selectedStation?.id === s.id)}
          eventHandlers={{ click: () => onSelectStation(s) }}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-sm">{s.station_name}</p>
              <p className="text-xs text-muted-foreground">{s.street_address}, {s.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}