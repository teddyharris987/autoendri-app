import { supabase } from "@/integrations/supabase/client";

export type Car = {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
};

const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 year

export async function signImage(path: string): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from("car-images").createSignedUrl(path, SIGNED_URL_TTL);
  return data?.signedUrl ?? "";
}

export async function signImages(paths: string[]): Promise<string[]> {
  return Promise.all(paths.map(signImage));
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function formatMileage(n: number) {
  return new Intl.NumberFormat("en-US").format(n) + " mi";
}

// WhatsApp number in international format, digits only
export const WHATSAPP_NUMBER = "355684349039";

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"] as const;
export const TRANSMISSIONS = ["Manual", "Automatic"] as const;