import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLocation } from "@/context/locationContext";
import { useCart } from "@/context/cartContext";
import { providerService, type DiscoverFilters } from "@/services/providerService";
import { menuService } from "@/services/menuService";
import type { ProviderWithDistance, MenuItem } from "@/types/db";
import { LocationMap } from "@/components/location/LocationMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Sparkles,
  ChefHat,
  CalendarCheck2,
  Home,
  Gift,
  Truck,
  ArrowRight,
  Filter,
  Plus,
  Flame,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: DiscoverPage,
});

function DiscoverPage() {
  const { coords, cityName, setIsLocationModalOpen } = useLocation();
  const { addItem } = useCart();

  const [providers, setProviders] = useState<ProviderWithDistance[]>([]);
  const [specials, setSpecials] = useState<MenuItem[]>([]);
  const [bestSellers, setBestSellers] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [providerType, setProviderType] = useState<any | null>(null);

  const cuisinesList = [
    "All",
    "Maharashtrian",
    "North Indian",
    "South Indian",
    "Gujarati",
    "Punjabi",
    "Healthy",
    "Comfort",
  ];

  const fetchDiscoverData = async () => {
    setIsLoading(true);
    try {
      const filters: DiscoverFilters = {
        search: searchQuery || undefined,
        cuisine: selectedCuisine && selectedCuisine !== "All" ? selectedCuisine : undefined,
        minRating: minRating || undefined,
        openOnly: openOnly || undefined,
        maxPrice: maxPrice || undefined,
        providerType: providerType || undefined,
      };

      const [provList, specialItems, bestItems] = await Promise.all([
        providerService.listProviders(coords, filters),
        menuService.listHighlights("todays_special", 6),
        menuService.listHighlights("best_seller", 6),
      ]);

      setProviders(provList);
      setSpecials(specialItems);
      setBestSellers(bestItems);
    } catch (e) {
      console.error("Failed to load discovery data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoverData();
  }, [coords, searchQuery, selectedCuisine, minRating, openOnly, maxPrice, providerType]);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-amber-50/30 to-background border-b pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Hyperlocal Home Kitchen & Tiffin Network</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Ghar Ka Khana & Fresh Tiffin,{" "}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Minutes Away.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                Connecting you with verified maternal home kitchens, local culinarians, and wholesome daily tiffin services in{" "}
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="font-semibold text-orange-700 underline underline-offset-2 hover:text-orange-800 inline-flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 inline" />
                  {cityName}
                </button>
                .
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mt-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search kitchens, puran poli, dal makhani, thali..."
                  className="pl-10 pr-24 py-5 bg-background shadow-sm border-orange-200/80 focus-visible:ring-orange-500 rounded-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Hero Banner Badge */}
            <div className="hidden lg:flex flex-col gap-3 p-5 rounded-2xl bg-card border border-orange-100 shadow-md max-w-xs text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">100% Home Cooked</div>
                  <div className="text-muted-foreground">Certified hygienic kitchens</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground pt-1 border-t">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero preservatives, pure authentic spices</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flexible lunch & dinner subscriptions</span>
              </div>
            </div>
          </div>

          {/* Quick Ecosystem Category Tabs (PRD Section 15) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
            <button
              onClick={() => {
                setProviderType(null);
                setSelectedCuisine(null);
              }}
              className="flex items-center gap-2.5 p-3 rounded-xl border bg-card/80 hover:border-orange-300 hover:bg-orange-50/50 text-left transition-all shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-foreground">Homestyle Food</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Available Now</div>
              </div>
            </button>

            <Link
              to="/tiffin"
              className="flex items-center gap-2.5 p-3 rounded-xl border bg-card/80 hover:border-orange-300 hover:bg-orange-50/50 text-left transition-all shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-foreground">Daily Tiffin</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Weekly / Monthly</div>
              </div>
            </Link>

            <Link
              to="/roadmap"
              className="flex items-center gap-2.5 p-3 rounded-xl border bg-muted/40 hover:bg-muted/70 text-left transition-all relative group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-foreground">Student Stay</div>
                <div className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-full inline-block">
                  Next Phase
                </div>
              </div>
            </Link>

            <Link
              to="/roadmap"
              className="flex items-center gap-2.5 p-3 rounded-xl border bg-muted/40 hover:bg-muted/70 text-left transition-all relative group"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-foreground">Taste of Home</div>
                <div className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full inline-block">
                  Festive Parcels
                </div>
              </div>
            </Link>

            <Link
              to="/roadmap"
              className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-xl border bg-muted/40 hover:bg-muted/70 text-left transition-all relative group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-foreground">Return Load</div>
                <div className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full inline-block">
                  Logistics Match
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <LocationMap
          center={coords}
          onLocationChange={() => setIsLocationModalOpen(true)}
          markers={providers
            .filter((provider) => provider.provider_type === "home_kitchen" && provider.latitude != null && provider.longitude != null)
            .map((provider) => ({
              id: provider.id,
              label: provider.name,
              latitude: provider.latitude!,
              longitude: provider.longitude!,
              kind: "kitchen" as const,
              detail: `${provider.rating.toFixed(1)} rating · ${provider.address}`,
            }))}
          title="Registered home kitchens near you"
          description="Tap a kitchen marker to preview it, or open the picker to move your search area."
        />
      </div>

      {/* Main Discovery Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Filters & Cuisine Chips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Regional Cuisines & Filters
            </span>
            {(selectedCuisine || minRating || openOnly || maxPrice) && (
              <button
                onClick={() => {
                  setSelectedCuisine(null);
                  setMinRating(null);
                  setOpenOnly(false);
                  setMaxPrice(null);
                  setSearchQuery("");
                }}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {cuisinesList.map((c) => {
              const isSelected = selectedCuisine === c || (c === "All" && !selectedCuisine);
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c === "All" ? null : c)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-orange-600 text-white shadow-xs font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}

            <div className="h-4 border-r mx-1" />

            <button
              onClick={() => setMinRating(minRating === 4.5 ? null : 4.5)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-all ${
                minRating === 4.5
                  ? "bg-amber-100 border-amber-300 text-amber-900 font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.5+ Rating</span>
            </button>

            <button
              onClick={() => setOpenOnly(!openOnly)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-all ${
                openOnly
                  ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Now</span>
            </button>
          </div>
        </div>

        {/* Section: Today's Specials Highlights */}
        {specials.length > 0 && !searchQuery && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-orange-100 text-orange-600">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Today's Homestyle Specials</h2>
              </div>
              <span className="text-xs text-muted-foreground">Freshly prepared today</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specials.map((item) => {
                const prov = providers.find((p) => p.id === item.provider_id) ?? providers[0];
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border bg-card hover:shadow-md transition-shadow group"
                  >
                    <img
                      src={item.image_url ?? "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=300&q=80"}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              (item as any).is_veg !== false ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                          <h3 className="font-bold text-sm text-foreground line-clamp-1">{item.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t">
                        <span className="font-extrabold text-sm text-foreground">₹{Number(item.price)}</span>
                        {prov && (
                          <Button
                            size="sm"
                            className="h-7 px-2.5 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => addItem(item, prov)}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section: Featured Nearby Home Kitchens & Vendors */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Nearby Kitchens & Tiffin Makers</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sorted by distance from {cityName}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {providers.length} Available
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-xl border p-4 space-y-3 animate-pulse bg-card">
                  <div className="h-44 bg-muted rounded-lg" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
              <ChefHat className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base text-foreground">No kitchens match your filter</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching for a different dish or reset your cuisine and rating filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCuisine(null);
                  setMinRating(null);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <Link
                  key={p.id}
                  to={`/provider/${p.id}` as any}
                  className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:border-orange-300 flex flex-col"
                >
                  {/* Provider Image & Badges */}
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <img
                      src={p.image_url ?? "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Verified & Type badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      {p.is_verified && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium capitalize">
                        {p.provider_type.replace("_", " ")}
                      </span>
                    </div>

                    {/* Distance & Rating pills */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                        <span>{p.distanceKm !== null ? `${p.distanceKm} km away` : "Nearby"}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-500 text-black px-2 py-0.5 rounded-md text-xs font-extrabold shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-black" />
                        <span>{p.rating}</span>
                        <span className="font-normal text-[10px] text-black/80">({p.review_count})</span>
                      </div>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-orange-600 transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-orange-700 font-medium mt-0.5 line-clamp-1">
                        {p.cuisine}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{p.price_range}</span>
                      <span className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Menu <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Dedicated Tiffin Banner CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
              Tiffin Subscriptions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Looking for a Regular Monthly Dabba Service?
            </h2>
            <p className="text-xs sm:text-sm text-amber-100">
              Subscribe to daily wholesome lunch and dinner from verified local home kitchens. Flexible pause options, zero security deposit, and pure homestyle nutrition.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild className="bg-white text-orange-700 hover:bg-amber-50 font-bold">
                <Link to="/tiffin">
                  Explore Tiffin Plans
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
