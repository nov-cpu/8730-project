import { Link, useLocation, Outlet } from "react-router-dom";
import { Zap, MapPin, Heart, GitCompare } from "lucide-react";

const navItems = [
  { to: "/", label: "Find Stations", icon: MapPin },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/compare", label: "Compare", icon: GitCompare },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">EV Charge Navigator</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}