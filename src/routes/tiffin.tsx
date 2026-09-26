import React, { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { tiffinService } from "@/services/tiffinService";
import { providerService } from "@/services/providerService";
import { paymentService } from "@/services/paymentService";
import { useAuth } from "@/context/authContext";
import { DEMO_ADDRESSES, SEED_PROVIDERS } from "@/data/seedData";
import type { TiffinPlan, Provider } from "@/types/db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  MapPin,
  Utensils,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tiffin")({
  component: TiffinPage,
});

function TiffinPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [plans, setPlans] = useState<TiffinPlan[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedFreq, setSelectedFreq] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe Dialog State
  const [activePlan, setActivePlan] = useState<TiffinPlan | null>(null);
  const [mealPref, setMealPref] = useState<string>("veg");
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [addressId, setAddressId] = useState<string>(DEMO_ADDRESSES[0]?.id ?? "addr-1");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [planList, provList] = await Promise.all([
          tiffinService.listPlans(),
          providerService.listProviders(null),
        ]);
        setPlans(planList);
        setProviders(provList);
      } catch (err) {
        console.error("Failed to load tiffin plans", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSubscribe = async () => {
    if (!activePlan) return;

    setIsSubscribing(true);
    try {
      // 1. Simulated Payment
      await paymentService.charge({
        userId: user?.id ?? "demo-cust-0001",
        amount: Number(activePlan.price),
        method: "upi",
      });

      // 2. Create subscription in database
      await tiffinService.createSubscription({
        customerId: user?.id ?? "demo-cust-0001",
        providerId: activePlan.provider_id,
        planId: activePlan.id,
        startDate,
        mealPreference: mealPref,
        deliveryAddressId: addressId,
      });

      toast.success(`Successfully subscribed to ${activePlan.name}!`);
      setActivePlan(null);
      router.navigate({ to: "/orders" as any });
    } catch (err: any) {
      toast.error(err.message || "Failed to complete subscription.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const filteredPlans =
    selectedFreq === "all"
      ? plans
      : plans.filter((p) => p.frequency === selectedFreq);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Tiffin Header Section */}
      <section className="bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-background border-b py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold">
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Recurring Homestyle Meal Subscriptions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Authentic Daily Tiffin,{" "}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Zero Cooking Hassle.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Enjoy warm, wholesome homestyle meals delivered to your doorstep every day. Choose daily, weekly, or monthly flexible subscription plans with pause control.
          </p>

          {/* Frequency Tabs */}
          <div className="flex justify-center pt-4">
            <div className="inline-flex p-1 rounded-full bg-muted border border-border">
              {["all", "daily", "weekly", "monthly"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setSelectedFreq(freq)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                    selectedFreq === freq
                      ? "bg-orange-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {freq === "all" ? "All Plans" : `${freq} Plans`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border p-6 bg-card space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-10 bg-muted rounded w-1/2" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl bg-card">
            <CalendarCheck2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-base">No plans found in this frequency</h3>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setSelectedFreq("all")}
            >
              View All Plans
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const prov = providers.find((p) => p.id === plan.provider_id) ?? SEED_PROVIDERS[0];
              return (
                <div
                  key={plan.id}
                  className="flex flex-col justify-between p-6 rounded-2xl border bg-card hover:border-orange-300 hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  {/* Frequency Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-extrabold uppercase tracking-wider">
                      {plan.frequency}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-orange-600" />
                        {prov?.name ?? "Home Kitchen"}
                      </span>
                      <h3 className="text-xl font-extrabold text-foreground mt-1 group-hover:text-orange-600 transition-colors">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price & Meals per day */}
                    <div className="p-3 bg-muted/40 rounded-xl border flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-foreground">₹{Number(plan.price)}</span>
                        <span className="text-xs text-muted-foreground"> / {plan.frequency}</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                          {plan.meals_per_day} meal/day
                        </span>
                      </div>
                    </div>

                    {/* Delivery Area */}
                    {plan.delivery_area && (
                      <div className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">Coverage: {plan.delivery_area}</span>
                      </div>
                    )}

                    {/* Benefits Checklist */}
                    {plan.benefits && plan.benefits.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t">
                        <div className="text-[11px] font-bold uppercase text-muted-foreground">Plan Inclusions:</div>
                        {plan.benefits.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 shadow-sm"
                      onClick={() => setActivePlan(plan)}
                    >
                      Subscribe Now
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subscribe Stepper Dialog */}
      <Dialog open={!!activePlan} onOpenChange={(open) => !open && setActivePlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CalendarCheck2 className="w-5 h-5 text-orange-600" />
              Subscribe to {activePlan?.name}
            </DialogTitle>
            <DialogDescription>
              Configure your daily meal preferences and start date.
            </DialogDescription>
          </DialogHeader>

          {activePlan && (
            <div className="space-y-4 py-2 text-xs">
              {/* Meal Preference */}
              <div className="space-y-2">
                <label className="font-bold text-foreground block">Dietary Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "veg", label: "Pure Veg" },
                    { id: "jain", label: "Jain Satvik" },
                    { id: "non-veg", label: "Non-Veg" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setMealPref(p.id)}
                      className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                        mealPref === p.id
                          ? "border-orange-500 bg-orange-50 text-orange-900"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  Subscription Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full p-2.5 rounded-lg border bg-background font-medium"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  Delivery Address
                </label>
                <select
                  value={addressId}
                  onChange={(e) => setAddressId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-background font-medium"
                >
                  {DEMO_ADDRESSES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}: {a.address_line}, {a.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div className="p-3 bg-muted/40 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-[11px]">Total Subscription Fee</div>
                  <div className="text-lg font-black text-foreground">₹{Number(activePlan.price)}</div>
                </div>
                <div className="text-right text-[11px] text-emerald-700 font-semibold">
                  Includes daily packaging & delivery
                </div>
              </div>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 shadow-md"
                disabled={isSubscribing}
                onClick={handleSubscribe}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming Subscription...
                  </>
                ) : (
                  <>
                    Confirm & Start Subscription
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
