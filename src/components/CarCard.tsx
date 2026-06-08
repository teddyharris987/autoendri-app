import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gauge, Calendar, Fuel } from "lucide-react";
import { type Car, formatPrice, signImage } from "@/lib/cars";

export function CarCard({ car }: { car: Car }) {
  const [img, setImg] = useState<string>("");

  useEffect(() => {
    if (car.images[0]) signImage(car.images[0]).then(setImg);
  }, [car.images]);

  return (
    <Link
      to="/cars/$id"
      params={{ id: car.id }}
      className="group block overflow-hidden rounded-2xl bg-card transition-all active:scale-[0.98]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {img ? (
          <img
            src={img}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded-full bg-background/95 px-3 py-1 text-sm font-bold text-foreground backdrop-blur">
          {formatPrice(car.price)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-base font-semibold leading-tight">
          {car.brand} {car.model}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
          <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{(car.mileage / 1000).toFixed(0)}k</span>
          <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel_type}</span>
        </div>
      </div>
    </Link>
  );
}