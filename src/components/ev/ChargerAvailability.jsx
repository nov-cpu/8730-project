export default function ChargerAvailability({ station, compact }) {
  const l1 = station.ev_level1_evse_num || 0;
  const l2 = station.ev_level2_evse_num || 0;
  const dc = station.ev_dc_fast_count || 0;
  if (l1 + l2 + dc === 0) {
    return <p className="text-xs text-muted-foreground">No charger count available</p>;
  }
  const items = [
    { icon: "⚡", label: "Level 1", count: l1, color: "text-slate-600 dark:text-slate-300" },
    { icon: "⚡⚡", label: "Level 2", count: l2, color: "text-blue-600 dark:text-blue-300" },
    { icon: "🚀", label: "DC Fast", count: dc, color: "text-green-600 dark:text-green-300" },
  ];
  return (
    <div className={`flex flex-wrap gap-3 ${compact ? "text-xs" : "text-sm"}`}>
      {items.filter((i) => i.count > 0).map((i) => (
        <div key={i.label} className={`flex items-center gap-1.5 font-medium ${i.color}`}>
          <span>{i.icon}</span>
          <span>{i.label}: <span className="font-bold">{i.count}</span></span>
        </div>
      ))}
    </div>
  );
}