import { Link } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import ConnectorBadges from "@/components/ev/ConnectorBadges";
import { useStationCollections } from "@/lib/useStationCollections";
const fields = [
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "ev_network", label: "Network" },
  { key: "ev_connector_types", label: "Connectors", badge: true },
  { key: "ev_level1_evse_num", label: "Level 1" },
  { key: "ev_level2_evse_num", label: "Level 2" },
  { key: "ev_dc_fast_count", label: "DC Fast" },
  { key: "access_code", label: "Access" },
  { key: "access_days_time", label: "Hours" },
  { key: "ev_pricing", label: "Pricing" },
  { key: "restricted_access", label: "Restricted", bool: true },
  { key: "ev_workplace_charging", label: "Workplace", bool: true },
  { key: "date_last_confirmed", label: "Last Confirmed" },
];
export default function Compare() {
  const { compare, setCompare } = useStationCollections();
  if (compare.length === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-extrabold">Compare Stations</h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
          <GitCompare className="h-10 w-10 text-primary/40" />
          <p className="mt-3 font-medium">Nothing to compare yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Add up to 3 stations from search results to compare side by side.</p>
          <Link to="/" className="font-medium text-primary underline">Find stations</Link>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-extrabold">Compare Stations</h1>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{compare.length}/3</span>
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-muted-foreground">Attribute</th>
              {compare.map((s) => (
                <th key={s.id} className="min-w-[200px] p-3 text-left align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold leading-tight">{s.station_name}</p>
                      <p className="text-xs text-muted-foreground">{s.street_address}, {s.city}</p>
                    </div>
                    <button
                      onClick={() => setCompare((p) => p.filter((c) => c.id !== s.id))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.key}>
                <td className="border-t px-3 py-2 text-sm font-medium text-muted-foreground">{f.label}</td>
                {compare.map((s) => (
                  <td key={s.id} className="border-t px-3 py-2 text-sm">
                    {f.badge ? (
                      <ConnectorBadges types={s[f.key]} />
                    ) : f.bool ? (
                      (s[f.key] ? "Yes" : "No")
                    ) : (
                      (s[f.key] ?? "—")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}