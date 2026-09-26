import { supabase } from "@/integrations/supabase/client";
import type { AppRole, Profile } from "@/types/db";

export const authService = {
  async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: AppRole;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        emailRedirectTo: `${window.location.origin}/discover`,
        data: {
          full_name: params.fullName,
          phone: params.phone ?? null,
          role: params.role,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getRoles(userId: string): Promise<AppRole[]> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r) => r.role);
  },

  async updateProfile(userId: string, patch: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
