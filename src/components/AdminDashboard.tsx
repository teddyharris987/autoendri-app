import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, LogOut, Pencil, Trash2 } from "lucide-react";
import { type Car, formatPrice } from "@/lib/cars";
import { CarForm } from "@/components/CarForm";

export function AdminDashboard() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const [editing, setEditing] = useState<Car | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const { data } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
    setCars((data ?? []) as Car[]);
  }

  useEffect(() => { load(); }, []);

  async function remove(c: Car) {
    if (!confirm(`Delete ${c.brand} ${c.model}?`)) return;
    // best-effort: remove storage objects
    if (c.images.length) {
      await supabase.storage.from("car-images").remove(c.images);
    }
    const { error } = await supabase.from("cars").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  if (creating || editing) {
    return (
      <CarForm
        car={editing ?? undefined}
        onDone={() => {
          setCreating(false);
          setEditing(null);
          load();
        }}
        onCancel={() => {
          setCreating(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={async () => { await supabase.auth.signOut(); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      <Button onClick={() => setCreating(true)} className="mt-4 h-12 w-full text-base">
        <Plus className="mr-1 h-4 w-4" /> Add new car
      </Button>

      <div className="mt-5 space-y-2">
        {cars === null ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : cars.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No cars yet.</p>
        ) : (
          cars.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-card p-3"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="min-w-0">
                <div className="truncate font-semibold">{c.brand} {c.model}</div>
                <div className="text-xs text-muted-foreground">{c.year} · {formatPrice(c.price)}</div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing(c)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(c)} aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}