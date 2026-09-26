import { supabase } from "@/integrations/supabase/client";
import { distanceKm, type Coords } from "@/lib/geo";
import type { Provider, ProviderWithDistance, Review } from "@/types/db";
import { SEED_PROVIDERS } from "@/data/seedData";

export type DiscoverFilters = {
  search?: string | null | undefined;
  cuisine?: string | null | undefined;
  maxPrice?: number | null | undefined;
  minRating?: number | null | undefined;
  openOnly?: boolean | null | undefined;
  providerType?: Provider["provider_type"] | null | undefined;
};

function withDistance(rows: Provider[], origin: Coords | null): ProviderWithDistance[] {
  const mapped = rows.map((p) => ({
    ...p,
    distanceKm:
      origin && p.latitude != null && p.longitude != null
        ? Number(distanceKm(origin, { latitude: p.latitude, longitude: p.longitude }).toFixed(1))
        : null,
  }));
  return mapped.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
}

const priceRangeToNumber = (range: string | null) => {
  if (!range) return null;
  const nums = range.match(/\d+/g);
  if (!nums?.length) return null;
  return Number(nums[0]);
};

export const providerService = {
  async listProviders(origin: Coords | null, filters: DiscoverFilters = {}): Promise<ProviderWithDistance[]> {
    let rows: Provider[] = [];

    try {
      let query = supabase.from("providers").select("*");
      if (filters.search) query = query.ilike("name", `%${filters.search}%`);
      if (filters.cuisine) query = query.ilike("cuisine", `%${filters.cuisine}%`);
      if (filters.providerType) query = query.eq("provider_type", filters.providerType);
      if (filters.minRating) query = query.gte("rating", filters.minRating);
      if (filters.openOnly) query = query.eq("is_open", true);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        rows = data;
      }
    } catch {
      // Fallback
    }

    if (rows.length === 0) {
      rows = [...SEED_PROVIDERS];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.cuisine?.toLowerCase().includes(q));
      }
      if (filters.cuisine) {
        const c = filters.cuisine.toLowerCase();
        rows = rows.filter((p) => p.cuisine?.toLowerCase().includes(c));
      }
      if (filters.providerType) {
        rows = rows.filter((p) => p.provider_type === filters.providerType);
      }
      if (filters.minRating) {
        rows = rows.filter((p) => p.rating >= filters.minRating!);
      }
      if (filters.openOnly) {
        rows = rows.filter((p) => p.is_open);
      }
    }

    if (filters.maxPrice) {
      rows = rows.filter((p) => {
        const low = priceRangeToNumber(p.price_range);
        return low === null || low <= filters.maxPrice!;
      });
    }

    return withDistance(rows, origin);
  },

  async getProvider(id: string): Promise<Provider | null> {
    try {
      const { data, error } = await supabase.from("providers").select("*").eq("id", id).maybeSingle();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    return SEED_PROVIDERS.find((p) => p.id === id) ?? null;
  },

  async getProviderByOwner(ownerId: string): Promise<Provider | null> {
    try {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("owner_id", ownerId)
        .maybeSingle();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    return (SEED_PROVIDERS[0] as Provider) ?? null;
  },

  async upsertProvider(input: Partial<Provider> & { name: string; owner_id: string }) {
    const { data, error } = await supabase
      .from("providers")
      .upsert(input as never, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProvider(id: string, patch: Partial<Provider>) {
    try {
      const { data, error } = await supabase
        .from("providers")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    const p = SEED_PROVIDERS.find((item) => item.id === id);
    if (p) Object.assign(p, patch);
    return p;
  },

  async listReviews(providerId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from("ratings_reviews")
        .select("*")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (!error && data && data.length > 0) return data;
    } catch {
      // fallback
    }

    return [
      {
        id: "rev-1",
        provider_id: providerId,
        customer_id: "demo-cust-0001",
        customer_name: "Pooja Kulkarni",
        rating: 5,
        review: "Tastes just like mother's cooking! The puran poli and katachi amti was absolutely divine.",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        order_id: null,
      },
      {
        id: "rev-2",
        provider_id: providerId,
        customer_id: "demo-cust-0002",
        customer_name: "Vikram Mehta",
        rating: 5,
        review: "Warm packaging and punctual delivery. Great portion sizes and genuine spices.",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        order_id: null,
      }
    ];
  },

  async addReview(reviewData: {
    providerId: string;
    customerId?: string;
    customerName?: string;
    rating: number;
    review: string;
    orderId?: string;
  }): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from("ratings_reviews")
        .insert({
          provider_id: reviewData.providerId,
          customer_id: reviewData.customerId ?? "00000000-0000-0000-0000-000000000099",
          customer_name: reviewData.customerName ?? "Aarav Sharma",
          rating: reviewData.rating,
          review: reviewData.review,
          order_id: reviewData.orderId ?? null,
        })
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    return {
      id: `rev-${Date.now()}`,
      provider_id: reviewData.providerId,
      customer_id: reviewData.customerId ?? "00000000-0000-0000-0000-000000000099",
      customer_name: reviewData.customerName ?? "Aarav Sharma",
      rating: reviewData.rating,
      review: reviewData.review,
      created_at: new Date().toISOString(),
      order_id: reviewData.orderId ?? null,
    };
  },

  async listCuisines(): Promise<string[]> {
    try {
      const { data } = await supabase.from("providers").select("cuisine");
      if (data && data.length > 0) {
        const set = new Set<string>();
        data.forEach((r) => {
          (r.cuisine ?? "")
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
            .forEach((c) => set.add(c));
        });
        if (set.size > 0) return [...set].sort();
      }
    } catch {
      // fallback
    }

    return ["Maharashtrian", "North Indian", "South Indian", "Gujarati", "Punjabi", "Healthy", "Comfort", "Bakery"];
  },
};
