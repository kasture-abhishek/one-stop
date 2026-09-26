import React, { createContext, useContext, useEffect, useState } from "react";
import type { AppRole, Profile } from "@/types/db";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_USERS } from "@/data/seedData";
import { toast } from "sonner";

export type AuthContextType = {
  user: any | null;
  profile: Profile | null;
  role: AppRole;
  isDemoUser: boolean;
  isLoading: boolean;
  switchDemoRole: (role: "customer" | "provider" | "admin") => void;
  signInDemo: (role: "customer" | "provider" | "admin") => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole>("customer");
  const [isDemoUser, setIsDemoUser] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize with demo customer by default for seamless judge walkthrough
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("onestop_active_role") as AppRole | null;
      const initialRole = savedRole && ["customer", "provider", "admin"].includes(savedRole) ? savedRole : "customer";
      applyDemoUser(initialRole as any);
    } catch {
      applyDemoUser("customer");
    } finally {
      setIsLoading(false);
    }

    // Check if live Supabase auth session exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemoUser(false);
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setProfile(data);
              setRole(data.role);
            }
          });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemoUser(false);
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        if (data) {
          setProfile(data);
          setRole(data.role);
        }
      } else if (!isDemoUser) {
        // Logged out
        applyDemoUser("customer");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const applyDemoUser = (targetRole: "customer" | "provider" | "admin") => {
    const demo = DEMO_USERS[targetRole];
    setUser({ id: demo.id, email: demo.email });
    setProfile({
      id: demo.id,
      full_name: demo.full_name,
      email: demo.email,
      phone: demo.phone,
      role: demo.role,
      city: demo.city,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${demo.full_name}`,
      latitude: 18.5085,
      longitude: 73.8090,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setRole(demo.role);
    setIsDemoUser(true);
    localStorage.setItem("onestop_active_role", targetRole);
  };

  const switchDemoRole = (targetRole: "customer" | "provider" | "admin") => {
    applyDemoUser(targetRole);
    toast.success(`Switched role to ${targetRole.toUpperCase()}: ${DEMO_USERS[targetRole].full_name}`);
  };

  const signInDemo = (targetRole: "customer" | "provider" | "admin") => {
    switchDemoRole(targetRole);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    applyDemoUser("customer");
    toast.info("Logged out. Reset to Demo Customer view.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isDemoUser,
        isLoading,
        switchDemoRole,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
