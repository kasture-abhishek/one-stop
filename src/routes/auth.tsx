import React, { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/authContext";
import { authService } from "@/services/authService";
import type { AppRole } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lock,
  Mail,
  User,
  Phone,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { signInDemo } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AppRole>("customer");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await authService.signUp({
          email,
          password,
          fullName,
          phone,
          role,
        });
        toast.success("Account created successfully! Check your email to confirm if needed.");
      } else {
        await authService.signIn(email, password);
        toast.success("Signed in successfully!");
      }
      router.navigate({ to: "/" as any });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (targetRole: "customer" | "provider" | "admin") => {
    signInDemo(targetRole);
    if (targetRole === "provider") {
      router.navigate({ to: "/provider-dashboard" as any });
    } else if (targetRole === "admin") {
      router.navigate({ to: "/admin" as any });
    } else {
      router.navigate({ to: "/" as any });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md">
          O
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Welcome to ONE STOP
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          One Place. Every Need. — Hyperlocal Food & Tiffin Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* 1-Click SIH Demo Accounts Card */}
        <div className="p-5 rounded-2xl border border-orange-200 bg-orange-50/50 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-600" /> SIH Judge 1-Click Demo Logins
          </div>
          <p className="text-[11px] text-orange-800">
            For live presentation, switch personas instantaneously with full preloaded data:
          </p>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-card hover:bg-orange-100 text-foreground border-orange-200 text-xs flex flex-col h-auto py-2"
              onClick={() => handleDemoLogin("customer")}
            >
              <User className="w-4 h-4 text-orange-600 mb-1" />
              <span>Customer</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-card hover:bg-orange-100 text-foreground border-orange-200 text-xs flex flex-col h-auto py-2"
              onClick={() => handleDemoLogin("provider")}
            >
              <ChefHat className="w-4 h-4 text-emerald-600 mb-1" />
              <span>Provider</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-card hover:bg-orange-100 text-foreground border-orange-200 text-xs flex flex-col h-auto py-2"
              onClick={() => handleDemoLogin("admin")}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
              <span>Admin</span>
            </Button>
          </div>
        </div>

        {/* Real Supabase Form */}
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-3 pt-4 text-xs">
              {mode === "signup" && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="e.g. Aarav Sharma"
                        className="pl-9"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="tel"
                        placeholder="+91 98230 12345"
                        className="pl-9"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Registering As</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole("customer")}
                        className={`p-2 rounded-lg border font-semibold text-xs ${
                          role === "customer" ? "border-orange-500 bg-orange-50 text-orange-950" : "text-muted-foreground"
                        }`}
                      >
                        Customer (Order Food)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("provider")}
                        className={`p-2 rounded-lg border font-semibold text-xs ${
                          role === "provider" ? "border-orange-500 bg-orange-50 text-orange-950" : "text-muted-foreground"
                        }`}
                      >
                        Kitchen Provider
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 mt-3 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
