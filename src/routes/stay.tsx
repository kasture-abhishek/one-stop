import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  MapPin,
  Star,
  Wifi,
  Utensils,
  Shield,
  ChevronRight,
  X,
  Check,
  Search,
  Filter,
  CalendarCheck2,
  Users,
  Zap,
  Wind,
  Tv,
  ArrowRight,
  BadgeCheck,
  ChefHat,
} from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "@/components/location/LocationMap";
import { useLocation } from "@/context/locationContext";
import { distanceKm } from "@/lib/geo";

export const Route = createFileRoute("/stay")({
  component: StayPage,
});

const SEED_PGS = [
  {
    id: "pg-1",
    name: "Sai Krupa Executive PG",
    area: "Kothrud",
    city: "Pune",
    nearbyCollege: "MIT College of Engineering",
    distanceFromCollege: "350m",
    type: "Boys",
    sharing: ["Single", "Double"],
    rent: { single: 9500, double: 6800 },
    rating: 4.7,
    reviewCount: 42,
    amenities: ["WiFi", "AC", "Meals", "Laundry", "CCTV"],
    tiffinKitchen: "Aai's Gharachi Rasoi",
    tiffinPricePerMonth: 2800,
    tiffinMeals: "Lunch + Dinner",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
    verified: true,
    description: "Fully furnished rooms with home-like atmosphere. Daily homestyle Maharashtrian food from a nearby certified kitchen included in combo plan.",
    availableRooms: 3,
    latitude: 18.5089,
    longitude: 73.8101,
  },
  {
    id: "pg-2",
    name: "Green Nest PG & Hostel",
    area: "Viman Nagar",
    city: "Pune",
    nearbyCollege: "Symbiosis International University",
    distanceFromCollege: "1.2km",
    type: "Girls",
    sharing: ["Single", "Double", "Triple"],
    rent: { single: 11000, double: 7500 },
    rating: 4.9,
    reviewCount: 87,
    amenities: ["WiFi", "AC", "Meals", "RO Water", "Gym", "CCTV"],
    tiffinKitchen: "Savita Tai's Kitchen",
    tiffinPricePerMonth: 2600,
    tiffinMeals: "Breakfast + Dinner",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&q=80",
    verified: true,
    description: "Premium girls-only PG with 24/7 security, in-house mess, and AC rooms. Study lounge available.",
    availableRooms: 5,
    latitude: 18.5686,
    longitude: 73.9162,
  },
  {
    id: "pg-3",
    name: "Shivam Boys Hostel",
    area: "Pimpri",
    city: "Pune",
    nearbyCollege: "Pimpri Chinchwad College of Engineering",
    distanceFromCollege: "800m",
    type: "Boys",
    sharing: ["Double", "Triple"],
    rent: { single: 0, double: 5200 },
    rating: 4.3,
    reviewCount: 31,
    amenities: ["WiFi", "Meals", "Laundry", "Parking"],
    tiffinKitchen: "Home Flavours Kitchen",
    tiffinPricePerMonth: 2200,
    tiffinMeals: "Lunch + Dinner",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
    verified: false,
    description: "Budget-friendly hostel for engineering students. Mess serves North Indian + South Indian food.",
    availableRooms: 8,
    latitude: 18.6264,
    longitude: 73.8009,
  },
  {
    id: "pg-4",
    name: "The Urban Nest Co-Living",
    area: "Baner",
    city: "Pune",
    nearbyCollege: "Pune IT Park",
    distanceFromCollege: "600m",
    type: "Co-ed",
    sharing: ["Single", "Double"],
    rent: { single: 14000, double: 9500 },
    rating: 4.8,
    reviewCount: 112,
    amenities: ["WiFi", "AC", "Meals", "Gym", "RO Water", "Laundry", "CCTV", "TV"],
    tiffinKitchen: "Chef Priya's Home Kitchen",
    tiffinPricePerMonth: 3200,
    tiffinMeals: "Breakfast + Lunch + Dinner",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    verified: true,
    description: "Premium co-living for working professionals. High-speed WiFi, ergonomic workspaces, and gourmet home food delivery.",
    availableRooms: 2,
    latitude: 18.5592,
    longitude: 73.7868,
  },
  {
    id: "pg-5",
    name: "Laxmi Niwas PG",
    area: "Deccan Gymkhana",
    city: "Pune",
    nearbyCollege: "Fergusson College",
    distanceFromCollege: "400m",
    type: "Girls",
    sharing: ["Single", "Double"],
    rent: { single: 8500, double: 6000 },
    rating: 4.5,
    reviewCount: 58,
    amenities: ["WiFi", "Meals", "RO Water", "CCTV"],
    tiffinKitchen: "Laxmi Bai's Swadisht Kitchen",
    tiffinPricePerMonth: 2400,
    tiffinMeals: "Lunch + Dinner",
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&q=80",
    verified: true,
    description: "Centrally located near Deccan bus stand and FC Road. Homely food, peaceful environment for students.",
    availableRooms: 4,
    latitude: 18.5236,
    longitude: 73.8421,
  },
  {
    id: "pg-6",
    name: "Sunrise Boys PG",
    area: "Hadapsar",
    city: "Pune",
    nearbyCollege: "Magarpatta IT Hub",
    distanceFromCollege: "1.0km",
    type: "Boys",
    sharing: ["Single", "Double", "Triple"],
    rent: { single: 8000, double: 5500 },
    rating: 4.2,
    reviewCount: 24,
    amenities: ["WiFi", "Meals", "Parking", "CCTV"],
    tiffinKitchen: "Rohan's Home Food",
    tiffinPricePerMonth: 2000,
    tiffinMeals: "Lunch + Dinner",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=80",
    verified: false,
    description: "Affordable PG near Magarpatta. Good connectivity to Hadapsar and Pune station via bus.",
    availableRooms: 10,
    latitude: 18.5081,
    longitude: 73.9262,
  },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  AC: <Wind className="w-3.5 h-3.5" />,
  Meals: <Utensils className="w-3.5 h-3.5" />,
  CCTV: <Shield className="w-3.5 h-3.5" />,
  Gym: <Zap className="w-3.5 h-3.5" />,
  TV: <Tv className="w-3.5 h-3.5" />,
};

const FILTERS = ["All", "Boys", "Girls", "Co-ed", "With Meals", "AC", "Verified Only", "Budget (< ₹7k)"];

export default function StayPage() {
  const { coords, selectCoords } = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPG, setSelectedPG] = useState<(typeof SEED_PGS)[0] | null>(null);
  const [selectedSharing, setSelectedSharing] = useState<"single" | "double">("double");
  const [tiffinAdded, setTiffinAdded] = useState(false);

  const nearbyPGs = SEED_PGS.filter((pg) => distanceKm(coords, { latitude: pg.latitude, longitude: pg.longitude }) <= 12);
  const filtered = nearbyPGs.filter((pg) => {
    const matchSearch =
      search.trim() === "" ||
      pg.name.toLowerCase().includes(search.toLowerCase()) ||
      pg.area.toLowerCase().includes(search.toLowerCase()) ||
      pg.nearbyCollege.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeFilter === "All") return true;
    if (activeFilter === "Boys") return pg.type === "Boys";
    if (activeFilter === "Girls") return pg.type === "Girls";
    if (activeFilter === "Co-ed") return pg.type === "Co-ed";
    if (activeFilter === "With Meals") return pg.amenities.includes("Meals");
    if (activeFilter === "AC") return pg.amenities.includes("AC");
    if (activeFilter === "Verified Only") return pg.verified;
    if (activeFilter === "Budget (< ₹7k)") return pg.rent.double < 7000;
    return true;
  });

  const handleExpressInterest = () => {
    toast.success(`Interest registered for ${selectedPG?.name}! The owner will contact you within 24 hours.`);
    setSelectedPG(null);
    setTiffinAdded(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
            <Home className="w-3.5 h-3.5" />
            Student Stay & Synced Food — Phase 2
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Find Your Perfect PG
            <span className="block text-purple-200">with Home Food Included</span>
          </h1>
          <p className="text-sm sm:text-base text-purple-100 max-w-xl">
            Discover verified PGs and hostels near your college or office — bundled with daily tiffin from trusted home kitchens.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: "PGs Listed", value: "200+" },
              { label: "Cities", value: "8" },
              { label: "Kitchens Linked", value: "45+" },
              { label: "Avg Rating", value: "4.6★" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] text-purple-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        <LocationMap
          center={coords}
          onLocationChange={(nextCoords) => selectCoords(nextCoords)}
          markers={nearbyPGs.map((pg) => ({
            id: pg.id,
            label: pg.name,
            latitude: pg.latitude,
            longitude: pg.longitude,
            kind: "stay" as const,
            detail: `${pg.area} · ₹${pg.rent.double.toLocaleString()}/mo shared`,
          }))}
          title="PGs near your selected location"
          description="Move the pin to see nearby student stays and hostels around a new area."
          className="mb-5"
        />

        {/* Search + Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by PG name, area, or college..."
              className="pl-10 h-11 rounded-xl border-border/80 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeFilter === f
                    ? "bg-purple-600 text-white border-purple-600 shadow"
                    : "bg-card text-muted-foreground border-border hover:border-purple-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span><span className="font-bold text-foreground">{filtered.length}</span> PGs found near you</span>
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Sorted by Rating</span>
          </div>
        </div>

        {/* PG Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Home className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold text-foreground">No PGs found</p>
            <p className="text-xs text-muted-foreground">Try a different search or filter</p>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setActiveFilter("All"); }}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pg) => (
              <div
                key={pg.id}
                onClick={() => { setSelectedPG(pg); setTiffinAdded(false); setSelectedSharing("double"); }}
                className="group cursor-pointer rounded-2xl border bg-card shadow-sm hover:shadow-md hover:border-purple-300 transition-all overflow-hidden"
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={pg.image} alt={pg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {pg.verified && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      pg.type === "Girls" ? "bg-rose-500 text-white" :
                      pg.type === "Boys" ? "bg-blue-600 text-white" :
                      "bg-purple-600 text-white"
                    }`}>{pg.type}</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {pg.rating}
                  </div>
                  {pg.availableRooms <= 3 && (
                    <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Only {pg.availableRooms} left!
                    </div>
                  )}
                </div>

                <div className="p-3.5 space-y-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1">{pg.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {pg.area}, {pg.city} · {pg.distanceFromCollege} from {pg.nearbyCollege.split(" ").slice(0, 2).join(" ")}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    {pg.rent.double > 0 && (
                      <span className="text-base font-black text-foreground">₹{pg.rent.double.toLocaleString()}<span className="text-[11px] font-normal text-muted-foreground">/mo shared</span></span>
                    )}
                    {pg.rent.single > 0 && (
                      <span className="text-xs text-muted-foreground">₹{pg.rent.single.toLocaleString()} single</span>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1">
                    {pg.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground font-medium">
                        {AMENITY_ICONS[a] ?? null} {a}
                      </span>
                    ))}
                    {pg.amenities.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">+{pg.amenities.length - 4}</span>
                    )}
                  </div>

                  {/* Tiffin badge */}
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-orange-50 border border-orange-100 text-xs">
                    <ChefHat className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="text-orange-900 font-medium">{pg.tiffinKitchen} · {pg.tiffinMeals}</span>
                    <span className="ml-auto font-bold text-orange-700">+₹{pg.tiffinPricePerMonth.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PG Detail Modal */}
      {selectedPG && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedPG(null)}>
          <div
            className="bg-background rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover */}
            <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
              <img src={selectedPG.image} alt={selectedPG.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setSelectedPG(null)} className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black">{selectedPG.name}</h2>
                  {selectedPG.verified && <BadgeCheck className="w-5 h-5 text-emerald-400" />}
                </div>
                <div className="text-sm text-white/80 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selectedPG.area}, {selectedPG.city}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-sm text-muted-foreground">{selectedPG.description}</p>

              {/* Room type selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Select Room Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPG.sharing.map((type) => {
                    const key = type.toLowerCase() as "single" | "double";
                    const price = selectedPG.rent[key];
                    if (!price) return null;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedSharing(key)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedSharing === key ? "border-purple-500 bg-purple-50" : "border-border hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-bold text-foreground">{type}</span>
                        </div>
                        <div className="text-base font-black text-purple-700 mt-1">₹{price.toLocaleString()}<span className="text-[11px] font-normal text-muted-foreground">/month</span></div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {selectedPG.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
                      {AMENITY_ICONS[a] ?? <Check className="w-3.5 h-3.5" />} {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tiffin Bundle */}
              <div className={`p-4 rounded-2xl border-2 transition-all ${tiffinAdded ? "border-orange-500 bg-orange-50" : "border-border"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <ChefHat className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-foreground">{selectedPG.tiffinKitchen}</div>
                        <div className="text-[11px] text-muted-foreground">{selectedPG.tiffinMeals} · Home-cooked daily</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-orange-700">₹{selectedPG.tiffinPricePerMonth.toLocaleString()}</div>
                        <div className="text-[11px] text-muted-foreground">/month</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setTiffinAdded(!tiffinAdded)}
                      className={`mt-3 w-full py-2 rounded-lg text-xs font-bold border transition-all ${
                        tiffinAdded
                          ? "bg-orange-600 text-white border-orange-600"
                          : "border-orange-300 text-orange-700 hover:bg-orange-50"
                      }`}
                    >
                      {tiffinAdded ? <><Check className="w-3.5 h-3.5 inline mr-1" /> Tiffin Added to Bundle</> : "Add Tiffin to Bundle"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Price summary */}
              <div className="p-4 rounded-xl bg-muted/50 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room Rent ({selectedSharing})</span>
                  <span className="font-bold">₹{(selectedPG.rent[selectedSharing] || 0).toLocaleString()}/mo</span>
                </div>
                {tiffinAdded && (
                  <div className="flex justify-between text-orange-700">
                    <span>Tiffin ({selectedPG.tiffinMeals})</span>
                    <span className="font-bold">₹{selectedPG.tiffinPricePerMonth.toLocaleString()}/mo</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-black text-foreground text-base">
                  <span>Total / Month</span>
                  <span>₹{((selectedPG.rent[selectedSharing] || 0) + (tiffinAdded ? selectedPG.tiffinPricePerMonth : 0)).toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-xl shadow-md"
                onClick={handleExpressInterest}
              >
                Express Interest — Owner Will Contact You
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
