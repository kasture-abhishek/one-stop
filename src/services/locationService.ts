import { supabase } from "@/integrations/supabase/client";
import type { Address } from "@/types/db";
import type { Coords } from "@/lib/geo";

export const locationService = {
  async detectBrowserLocation(): Promise<Coords> {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      throw new Error("Location is not available on this device");
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => reject(new Error("Location permission denied")),
        { timeout: 8000 },
      );
    });
  },

  async listAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async createAddress(input: {
    user_id: string;
    label: string;
    address_line: string;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    is_default?: boolean;
  }) {
    const { data, error } = await supabase.from("addresses").insert(input).select().single();
    if (error) throw error;
    return data;
  },

  async deleteAddress(id: string) {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) throw error;
  },

  async setDefault(userId: string, id: string) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    if (error) throw error;
  },
};
