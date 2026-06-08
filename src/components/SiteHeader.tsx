import { Link } from "@tanstack/react-router";
import { Car } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="grid h-8 w-8 place-items-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Car className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">AutoEndri</span>
        </Link>
        <Link
          to="/admin"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}