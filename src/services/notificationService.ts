import { supabase } from "@/integrations/supabase/client";
import type { Notification } from "@/types/db";

export const notificationService = {
  async list(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return data ?? [];
  },

  async create(input: { user_id: string; title: string; message?: string; type?: string }) {
    const { error } = await supabase.from("notifications").insert(input);
    if (error) throw error;
  },

  async markRead(id: string) {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (error) throw error;
  },
};
