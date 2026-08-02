import { ArrowUpDown, Zap, Globe } from "lucide-react";
export default function FilterPanel({ sort, setSort, filters, setFilters, networks, connectorTypes }) {
  const sortOptions = [
    { value: "distance", label: "Distance" },
    { value: "chargers", label: "Most chargers" },
    { value: "dcfast", label: "DC Fast count" },
    { value: "name", label: "Name (A-Z)" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <select
        value={filters.connector}
        onChange={(e) => setFilters({ ...filters, connector: e.target.value })}
        className="rounded-lg border bg-background px-2.5 py-1.5 text-sm"
      >
        <option value="">All connectors</option>
        {connectorTypes.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <select
          value={filters.network}
          onChange={(e) => setFilters({ ...filters, network: e.target.value })}
          className="rounded-lg border bg-background px-2.5 py-1.5 text-sm"
        >
          <option value="">All networks</option>
          {networks.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-sm cursor-pointer">
        <input type="checkbox" checked={filters.dcFastOnly} onChange={(e) => setFilters({ ...filters, dcFastOnly: e.target.checked })} className="accent-primary" />
        <Zap className="h-3.5 w-3.5 text-green-600" /> DC Fast only
      </label>
      <label className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-sm cursor-pointer">
        <input type="checkbox" checked={filters.publicOnly} onChange={(e) => setFilters({ ...filters, publicOnly: e.target.checked })} className="accent-primary" />
        Public only
      </label>
    </div>
  );
}