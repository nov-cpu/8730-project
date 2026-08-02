const styles = {
  J1772: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  CCS: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  CHADEMO: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  TESLA: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  NACS: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  NEMA: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  TYPE1: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
  TYPE2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
};
export default function ConnectorBadges({ types }) {
  if (!types) return null;
  const list = String(types).trim().split(/\s+/).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((t) => {
        const key = t.toUpperCase().replace(/[^A-Z0-9]/g, "");
        const cls = styles[key] || "bg-muted text-muted-foreground";
        return (
          <span key={t} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{t}</span>
        );
      })}
    </div>
  );
}