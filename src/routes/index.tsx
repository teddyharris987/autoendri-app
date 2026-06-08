import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import type { Car } from "@/lib/cars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoEndri — Browse Cars for Sale" },
      { name: "description", content: "Browse the latest cars for sale on AutoEndri. Mobile-first car listings with photos and details." },
      { property: "og:title", content: "AutoEndri — Browse Cars for Sale" },
      { property: "og:description", content: "Browse the latest cars for sale on AutoEndri." },
    ],
  }),
  component: Home,
});

function Home() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setCars((data ?? []) as Car[]));
  }, []);

  const filtered = useMemo(() => {
    if (!cars) return null;
    const s = q.trim().toLowerCase();
    if (!s) return cars;
    return cars.filter(
      (c) => c.brand.toLowerCase().includes(s) || c.model.toLowerCase().includes(s),
    );
  }, [cars, q]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-5">
        <section className="mb-5">
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Find your next ride
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse the latest cars for sale.
          </p>
        </section>

        <div className="sticky top-14 z-30 -mx-4 mb-4 bg-background/90 px-4 py-2 backdrop-blur">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by brand or model…"
              className="h-12 rounded-full border-border bg-card pl-10 text-base shadow-sm"
            />
          </div>
        </div>

        {filtered === null ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {cars && cars.length === 0
                ? "No cars listed yet. Sign in as admin to add some."
                : "No cars match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
