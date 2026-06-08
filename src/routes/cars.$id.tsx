import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Fuel, Gauge, MessageCircle, Phone, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { type Car, WHATSAPP_NUMBER, formatMileage, formatPrice, signImages } from "@/lib/cars";

export const Route = createFileRoute("/cars/$id")({
  component: CarDetails,
});

function CarDetails() {
  const { id } = Route.useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        const c = data as Car;
        setCar(c);
        signImages(c.images).then(setImgs);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-xl font-semibold">Car not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-primary underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl animate-pulse px-4 py-6">
          <div className="aspect-[4/3] rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  const title = `${car.brand} ${car.model}`;
  const rawPhone = (car.contact_phone || "").replace(/[^\d]/g, "");
  const waNumber = rawPhone || WHATSAPP_NUMBER;
  const waText = encodeURIComponent(`Përshëndetje, jam i interesuar për ${car.year} ${title} (${formatPrice(car.price)}).`);
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
  const telUrl = `tel:+${waNumber}`;

  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pt-3">
        <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="overflow-hidden rounded-2xl bg-muted" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative aspect-[4/3] w-full">
            {imgs[active] ? (
              <img src={imgs[active]} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {imgs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-2">
              {imgs.map((u, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === active ? "border-primary" : "border-transparent opacity-70"
                  }`}
                >
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="mt-5">
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          <p className="mt-1 text-3xl font-bold text-primary">{formatPrice(car.price)}</p>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Spec icon={<Calendar className="h-4 w-4" />} label="Year" value={String(car.year)} />
          <Spec icon={<Gauge className="h-4 w-4" />} label="Mileage" value={formatMileage(car.mileage)} />
          <Spec icon={<Fuel className="h-4 w-4" />} label="Fuel" value={car.fuel_type} />
          <Spec icon={<Settings2 className="h-4 w-4" />} label="Gearbox" value={car.transmission} />
        </section>

        {car.description && (
          <section className="mt-5 rounded-2xl bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{car.description}</p>
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2">
          <a
            href={telUrl}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition active:scale-[0.98]"
          >
            <Phone className="h-5 w-5" /> Call
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-base font-semibold text-primary-foreground transition active:scale-[0.98]"
            style={{ backgroundColor: "var(--whatsapp)" }}
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-3" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}