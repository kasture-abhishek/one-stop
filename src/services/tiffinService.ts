import { supabase } from "@/integrations/supabase/client";
import type { TiffinPlan, TiffinSubscription, SubscriptionStatus } from "@/types/db";
import { SEED_TIFFIN_PLANS, SEED_PROVIDERS } from "@/data/seedData";

export type SubscriptionWithPlan = TiffinSubscription & {
  plan?: TiffinPlan | null | undefined;
  provider_name?: string | null | undefined;
  provider_image?: string | null | undefined;
};

const LOCAL_SUBS_KEY = "onestop_demo_tiffin_subscriptions";

const DEMO_INITIAL_SUBS: SubscriptionWithPlan[] = [
  {
    id: "sub-demo-1",
    customer_id: "demo-cust-0001",
    provider_id: "11111111-1111-1111-1111-111111111111",
    plan_id: "e0000001-0000-0000-0000-000000000001",
    start_date: new Date().toISOString().slice(0, 10),
    meal_preference: "veg",
    delivery_address_id: "addr-1",
    status: "active",
    next_delivery_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    plan: SEED_TIFFIN_PLANS[0] ?? null,
    provider_name: "Aai's Gharachi Rasoi",
    provider_image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  }
];

function getLocalSubs(): SubscriptionWithPlan[] {
  if (typeof window === "undefined") return DEMO_INITIAL_SUBS;
  try {
    const data = localStorage.getItem(LOCAL_SUBS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify(DEMO_INITIAL_SUBS));
      return DEMO_INITIAL_SUBS;
    }
    return JSON.parse(data);
  } catch {
    return DEMO_INITIAL_SUBS;
  }
}

function saveLocalSubs(subs: SubscriptionWithPlan[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify(subs));
    } catch (e) {
      console.warn("Failed to save local subscriptions", e);
    }
  }
}

export const tiffinService = {
  async listPlans(providerId?: string): Promise<TiffinPlan[]> {
    try {
      let query = supabase.from("tiffin_plans").select("*").eq("is_active", true);
      if (providerId) query = query.eq("provider_id", providerId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
      // fallback
    }

    if (providerId) {
      return SEED_TIFFIN_PLANS.filter((p) => p.provider_id === providerId);
    }
    return SEED_TIFFIN_PLANS;
  },

  async getPlan(planId: string): Promise<TiffinPlan | null> {
    try {
      const { data, error } = await supabase.from("tiffin_plans").select("*").eq("id", planId).maybeSingle();
      if (!error && data) return data;
    } catch {
      // fallback
    }

    return SEED_TIFFIN_PLANS.find((p) => p.id === planId) ?? null;
  },

  async createSubscription(params: {
    customerId: string;
    providerId: string;
    planId: string;
    startDate: string;
    mealPreference: string;
    deliveryAddressId: string;
  }): Promise<SubscriptionWithPlan> {
    const plan = SEED_TIFFIN_PLANS.find((p) => p.id === params.planId) ?? null;
    const provider = SEED_PROVIDERS.find((p) => p.id === params.providerId);
    const nextDelivery = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    try {
      const validUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const safeCustomerId = validUuidRegex.test(params.customerId)
        ? params.customerId
        : "00000000-0000-0000-0000-000000000099";
      const safeAddressId = validUuidRegex.test(params.deliveryAddressId)
        ? params.deliveryAddressId
        : null;

      const { data, error } = await supabase
        .from("tiffin_subscriptions")
        .insert({
          customer_id: safeCustomerId,
          provider_id: params.providerId,
          plan_id: params.planId,
          start_date: params.startDate,
          meal_preference: params.mealPreference,
          delivery_address_id: safeAddressId,
          status: "active",
          next_delivery_date: nextDelivery,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          ...data,
          plan,
          provider_name: provider?.name ?? null,
          provider_image: provider?.image_url ?? null,
        };
      }
    } catch {
      // fallback
    }

    const newSub: SubscriptionWithPlan = {
      id: `sub-${Date.now().toString(36)}`,
      customer_id: params.customerId,
      provider_id: params.providerId,
      plan_id: params.planId,
      start_date: params.startDate,
      meal_preference: params.mealPreference,
      delivery_address_id: params.deliveryAddressId,
      status: "active",
      next_delivery_date: nextDelivery,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plan: plan ?? null,
      provider_name: provider?.name ?? "Aai's Gharachi Rasoi",
      provider_image: provider?.image_url ?? "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    };

    const current = getLocalSubs();
    saveLocalSubs([newSub, ...current]);
    return newSub;
  },

  async listCustomerSubscriptions(customerId: string): Promise<SubscriptionWithPlan[]> {
    try {
      const validUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const safeCustId = validUuidRegex.test(customerId)
        ? customerId
        : "00000000-0000-0000-0000-000000000099";

      const { data, error } = await supabase
        .from("tiffin_subscriptions")
        .select(`
          *,
          tiffin_plans (*),
          providers (name, image_url)
        `)
        .eq("customer_id", safeCustId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          ...d,
          plan: d.tiffin_plans ?? null,
          provider_name: d.providers?.name ?? null,
          provider_image: d.providers?.image_url ?? null,
        }));
      }
    } catch {
      // fallback
    }

    return getLocalSubs();
  },

  async listProviderSubscriptions(providerId: string): Promise<SubscriptionWithPlan[]> {
    try {
      const { data, error } = await supabase
        .from("tiffin_subscriptions")
        .select(`
          *,
          tiffin_plans (*)
        `)
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          ...d,
          plan: d.tiffin_plans ?? null,
        }));
      }
    } catch {
      // fallback
    }

    const current = getLocalSubs();
    return current.filter((s) => s.provider_id === providerId || s.provider_id === "11111111-1111-1111-1111-111111111111");
  },

  async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<void> {
    try {
      await supabase.from("tiffin_subscriptions").update({ status }).eq("id", id);
    } catch {
      // fallback
    }

    const current = getLocalSubs();
    const item = current.find((s) => s.id === id);
    if (item) {
      item.status = status;
      saveLocalSubs([...current]);
    }
  },
};
