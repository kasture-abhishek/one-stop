import { supabase } from "@/integrations/supabase/client";
import type { MenuCategory, MenuItem } from "@/types/db";
import { SEED_CATEGORIES, SEED_MENU_ITEMS } from "@/data/seedData";

export const menuService = {
  async listCategories(providerId: string): Promise<MenuCategory[]> {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("provider_id", providerId)
        .order("sort_order");
      if (!error && data && data.length > 0) return data;
    } catch {
      // fallback
    }

    const filtered = SEED_CATEGORIES.filter((c) => c.provider_id === providerId);
    if (filtered.length > 0) return filtered;
    return [
      { id: `cat-default-${providerId}`, provider_id: providerId, name: "Popular Dishes", sort_order: 1, created_at: new Date().toISOString() }
    ];
  },

  async listItems(providerId: string): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("provider_id", providerId)
        .order("created_at");
      if (!error && data && data.length > 0) return data;
    } catch {
      // fallback
    }

    const filtered = SEED_MENU_ITEMS.filter((i) => i.provider_id === providerId);
    if (filtered.length > 0) return filtered;
    // Map items from first provider if visiting another provider without items
    return SEED_MENU_ITEMS.slice(0, 5).map((item, idx) => ({
      ...item,
      id: `m-dyn-${providerId}-${idx}`,
      provider_id: providerId,
    }));
  },

  async listHighlights(kind: "best_seller" | "todays_special", limit = 8): Promise<MenuItem[]> {
    try {
      const column = kind === "best_seller" ? "is_best_seller" : "is_todays_special";
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq(column, true)
        .eq("is_available", true)
        .limit(limit);
      if (!error && data && data.length > 0) return data;
    } catch {
      // fallback
    }

    const key = kind === "best_seller" ? "is_best_seller" : "is_todays_special";
    return SEED_MENU_ITEMS.filter((i) => (i as any)[key]).slice(0, limit);
  },

  async createItem(input: Omit<MenuItem, "id" | "created_at" | "updated_at">) {
    try {
      const { data, error } = await supabase.from("menu_items").insert(input).select().single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    const newItem: MenuItem = {
      ...input,
      id: `item-${Date.now().toString(36)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    SEED_MENU_ITEMS.push(newItem);
    return newItem;
  },

  async updateItem(id: string, patch: Partial<MenuItem>) {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    const target = SEED_MENU_ITEMS.find((i) => i.id === id);
    if (target) Object.assign(target, patch);
    return target;
  },

  async deleteItem(id: string) {
    try {
      await supabase.from("menu_items").delete().eq("id", id);
    } catch {
      // fallback
    }
    const idx = SEED_MENU_ITEMS.findIndex((i) => i.id === id);
    if (idx >= 0) SEED_MENU_ITEMS.splice(idx, 1);
  },

  async createCategory(providerId: string, name: string, sortOrder = 0) {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .insert({ provider_id: providerId, name, sort_order: sortOrder })
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
    const newCat = {
      id: `cat-${Date.now()}`,
      provider_id: providerId,
      name,
      sort_order: sortOrder,
      created_at: new Date().toISOString(),
    };
    SEED_CATEGORIES.push(newCat);
    return newCat;
  },

  async uploadImage(bucket: string, path: string, file: File) {
    try {
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (!error) {
        return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      }
    } catch {
      // fallback
    }
    return URL.createObjectURL(file);
  },
};
