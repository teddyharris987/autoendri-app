import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, X, ImagePlus } from "lucide-react";
import { type Car, FUEL_TYPES, TRANSMISSIONS, signImage } from "@/lib/cars";

type Props = { car?: Car; onDone: () => void; onCancel: () => void };

export function CarForm({ car, onDone, onCancel }: Props) {
  const [brand, setBrand] = useState(car?.brand ?? "");
  const [model, setModel] = useState(car?.model ?? "");
  const [price, setPrice] = useState<string>(car?.price?.toString() ?? "");
  const [year, setYear] = useState<string>(car?.year?.toString() ?? new Date().getFullYear().toString());
  const [mileage, setMileage] = useState<string>(car?.mileage?.toString() ?? "0");
  const [fuelType, setFuelType] = useState(car?.fuel_type ?? FUEL_TYPES[0]);
  const [transmission, setTransmission] = useState(car?.transmission ?? TRANSMISSIONS[0]);
  const [description, setDescription] = useState(car?.description ?? "");
  const [images, setImages] = useState<string[]>(car?.images ?? []);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    images.forEach(async (p) => {
      if (!previews[p]) {
        const url = await signImage(p);
        setPreviews((prev) => ({ ...prev, [p]: url }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("car-images").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
      });
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }
      uploaded.push(path);
    }
    setImages((curr) => [...curr, ...uploaded]);
    setUploading(false);
  }

  async function removeImage(path: string) {
    setImages((curr) => curr.filter((p) => p !== path));
    await supabase.storage.from("car-images").remove([path]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !price || !year) {
      toast.error("Brand, model, price and year are required");
      return;
    }
    setSaving(true);
    const payload = {
      brand: brand.trim(),
      model: model.trim(),
      price: Number(price),
      year: Number(year),
      mileage: Number(mileage || 0),
      fuel_type: fuelType,
      transmission,
      description: description.trim() || null,
      images,
    };
    const res = car
      ? await supabase.from("cars").update(payload).eq("id", car.id)
      : await supabase.from("cars").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(car ? "Car updated" : "Car added");
    onDone();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-5">
      <button onClick={onCancel} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-xl font-bold">{car ? "Edit car" : "Add new car"}</h1>

      <form onSubmit={save} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand"><Input value={brand} onChange={(e) => setBrand(e.target.value)} required maxLength={50} /></Field>
          <Field label="Model"><Input value={model} onChange={(e) => setModel(e.target.value)} required maxLength={50} /></Field>
          <Field label="Price (USD)"><Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required /></Field>
          <Field label="Year"><Input type="number" min={1900} max={2100} value={year} onChange={(e) => setYear(e.target.value)} required /></Field>
          <Field label="Mileage"><Input type="number" min={0} value={mileage} onChange={(e) => setMileage(e.target.value)} /></Field>
          <Field label="Fuel type">
            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Transmission">
            <Select value={transmission} onValueChange={setTransmission}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={4000} />
        </Field>

        <div>
          <Label className="mb-2 block">Images</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((p) => (
              <div key={p} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {previews[p] && <img src={previews[p]} alt="" className="h-full w-full object-cover" />}
                <button
                  type="button"
                  onClick={() => removeImage(p)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-foreground shadow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary">
              <ImagePlus className="h-5 w-5" />
              {uploading ? "Uploading…" : "Add"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="h-12 flex-1">Cancel</Button>
          <Button type="submit" disabled={saving} className="h-12 flex-1">{saving ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}