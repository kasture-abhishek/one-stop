import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  MapPin,
  Package,
  Check,
  ArrowRight,
  TrendingDown,
  Leaf,
  Zap,
  Clock,
  Star,
  Phone,
  User,
  Weight,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { LocationMap } from "@/components/location/LocationMap";
import { useLocation } from "@/context/locationContext";

export const Route = createFileRoute("/logistics")({
  component: LogisticsPage,
});

const CITIES = ["Pune", "Mumbai", "Nashik", "Kolhapur", "Nagpur", "Aurangabad", "Bengaluru", "Hyderabad", "Delhi", "Ahmedabad", "Solapur", "Satara"];
const VEHICLE_TYPES = ["Tata Ace (Mini Truck)", "Pickup Van", "14-ft Truck", "20-ft Container", "Tempo Traveller Cargo"];
const GOODS_TYPES = ["Spices & Grains (Bulk)", "Vegetables & Produce", "Packaged Food Items", "Kitchen Equipment", "Dry Goods & Provisions", "Festival Raw Materials"];

const SEED_TRIPS = [
  { id: "t1", driver: "Rajesh Bhosale", phone: "+91 9823012345", from: "Pune", to: "Mumbai", vehicle: "14-ft Truck", capacity: 1800, available: 1200, date: "2026-09-20", departure: "6:00 AM", rating: 4.8, trips: 124, verified: true, pricePerKg: 2.8 },
  { id: "t2", driver: "Sunil Shinde", phone: "+91 9741023456", from: "Nashik", to: "Mumbai", vehicle: "Tata Ace (Mini Truck)", capacity: 750, available: 450, date: "2026-09-19", departure: "7:30 AM", rating: 4.5, trips: 67, verified: true, pricePerKg: 3.2 },
  { id: "t3", driver: "Manoj Shinde", phone: "+91 8765432101", from: "Kolhapur", to: "Pune", vehicle: "Pickup Van", capacity: 500, available: 300, date: "2026-09-21", departure: "5:00 AM", rating: 4.6, trips: 89, verified: false, pricePerKg: 2.5 },
  { id: "t4", driver: "Vikram Yadav", phone: "+91 7654321098", from: "Pune", to: "Bengaluru", vehicle: "20-ft Container", capacity: 5000, available: 3200, date: "2026-09-22", departure: "9:00 PM", rating: 4.9, trips: 203, verified: true, pricePerKg: 1.9 },
  { id: "t5", driver: "Arun Patil", phone: "+91 9012345678", from: "Nagpur", to: "Mumbai", vehicle: "14-ft Truck", capacity: 2000, available: 800, date: "2026-09-20", departure: "8:00 AM", rating: 4.7, trips: 156, verified: true, pricePerKg: 2.1 },
];

const SEED_SHIPMENTS = [
  { id: "s1", business: "Aai's Gharachi Rasoi", goods: "Spices & Grains (Bulk)", from: "Nashik", to: "Pune", weight: 350, date: "2026-09-20", urgency: "Standard", budget: 1200, verified: true },
  { id: "s2", business: "Home Flavours Kitchen", goods: "Vegetables & Produce", from: "Kolhapur", to: "Mumbai", weight: 180, date: "2026-09-19", urgency: "Express", budget: 650, verified: true },
  { id: "s3", business: "Savita Tai's Kitchen", goods: "Dry Goods & Provisions", from: "Pune", to: "Bengaluru", weight: 800, date: "2026-09-22", urgency: "Standard", budget: 2000, verified: false },
  { id: "s4", business: "Chef Priya's Home Kitchen", goods: "Festival Raw Materials", from: "Nagpur", to: "Pune", weight: 600, date: "2026-09-21", urgency: "Standard", budget: 1500, verified: true },
];

export default function LogisticsPage() {
  const { coords, selectCoords } = useLocation();
  const [activeTab, setActiveTab] = useState("driver");

  // Driver trip registration form
  const [driverFrom, setDriverFrom] = useState("Pune");
  const [driverTo, setDriverTo] = useState("Mumbai");
  const [driverDate, setDriverDate] = useState("");
  const [driverVehicle, setDriverVehicle] = useState(VEHICLE_TYPES[0]);
  const [driverCapacity, setDriverCapacity] = useState(500);
  const [acceptedTrips, setAcceptedTrips] = useState<string[]>([]);
  const [registeredTrip, setRegisteredTrip] = useState(false);

  // Shipper form
  const [shipFrom, setShipFrom] = useState("Nashik");
  const [shipTo, setShipTo] = useState("Pune");
  const [shipGoods, setShipGoods] = useState(GOODS_TYPES[0]);
  const [shipWeight, setShipWeight] = useState(200);
  const [acceptedShipments, setAcceptedShipments] = useState<string[]>([]);

  const filteredTrips = SEED_TRIPS.filter(t =>
    (shipFrom === "Any" || t.from === shipFrom || t.to === shipTo || t.from === shipTo || t.to === shipFrom)
    && t.available >= shipWeight * 0.5
  );

  const filteredShipments = SEED_SHIPMENTS.filter(s =>
    (driverFrom === s.from || driverTo === s.to)
  );

  const handleAcceptLoad = (shipId: string, business: string) => {
    setAcceptedShipments(prev => [...prev, shipId]);
    toast.success(`Load from ${business} accepted! They'll confirm within 2 hours.`);
  };

  const handleAcceptTrip = (tripId: string, driver: string) => {
    setAcceptedTrips(prev => [...prev, tripId]);
    toast.success(`Booking confirmed with ${driver}! You'll receive a call soon.`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(45deg, white 1px, transparent 1px), linear-gradient(-45deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            Return Load / Backhaul Optimization — SIH Problem ID 26205
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Zero Deadhead Miles
            <span className="block text-blue-200">Smarter Backhaul Matching</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl">
            Match empty return trucks with wholesale kitchen cargo. Drivers earn extra income. Kitchens get 30–40% cheaper logistics. Everyone wins.
          </p>

          {/* Impact stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { icon: <TrendingDown className="w-5 h-5" />, value: "34%", label: "Avg Cost Savings", color: "text-emerald-300" },
              { icon: <Leaf className="w-5 h-5" />, value: "2.1T", label: "CO₂ Saved / Month", color: "text-green-300" },
              { icon: <Zap className="w-5 h-5" />, value: "127", label: "Matches Made", color: "text-yellow-300" },
              { icon: <Truck className="w-5 h-5" />, value: "89", label: "Active Drivers", color: "text-blue-200" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 p-2 rounded-xl bg-white/10">
                <div className={s.color}>{s.icon}</div>
                <div>
                  <div className="text-lg font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-blue-200">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <LocationMap
          center={coords}
          onLocationChange={(nextCoords) => selectCoords(nextCoords)}
          title="Drop a pickup or delivery pin"
          description="Set the exact logistics area first, then choose the nearest city route below."
          className="mb-6"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="driver" className="text-sm font-bold gap-2">
              <Truck className="w-4 h-4" /> I'm a Driver — Find Loads
            </TabsTrigger>
            <TabsTrigger value="shipper" className="text-sm font-bold gap-2">
              <Package className="w-4 h-4" /> I Need Shipping — Find Trucks
            </TabsTrigger>
          </TabsList>

          {/* DRIVER TAB */}
          <TabsContent value="driver" className="space-y-6">
            <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-4">
              <h3 className="font-black text-foreground text-lg">Register Your Return Trip</h3>
              <p className="text-xs text-muted-foreground">Tell us your return route and we'll match you with kitchen supply cargo that needs delivery along the same path.</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Origin City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm appearance-none" value={driverFrom} onChange={e => setDriverFrom(e.target.value)}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Destination City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm appearance-none" value={driverTo} onChange={e => setDriverTo(e.target.value)}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Travel Date</label>
                  <Input type="date" min={new Date().toISOString().split("T")[0]} value={driverDate} onChange={e => setDriverDate(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1"><Weight className="w-3 h-3" /> Available Capacity (kg)</label>
                  <div className="space-y-1">
                    <input type="range" min={100} max={5000} step={100} value={driverCapacity} onChange={e => setDriverCapacity(Number(e.target.value))} className="w-full accent-blue-600" />
                    <div className="text-xs font-bold text-blue-700 text-center">{driverCapacity} kg</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Vehicle Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VEHICLE_TYPES.slice(0, 4).map(v => (
                    <button
                      key={v}
                      onClick={() => setDriverVehicle(v)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all ${driverVehicle === v ? "border-blue-500 bg-blue-50 text-blue-900" : "border-border text-muted-foreground hover:border-blue-300"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setRegisteredTrip(true)}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-5 rounded-xl shadow"
              >
                {registeredTrip ? <><Check className="w-4 h-4 mr-2" /> Trip Registered — Showing Matches</> : <>Register Trip & Find Loads <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </div>

            {/* Matched Shipments */}
            {registeredTrip && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-foreground">Matched Loads for Your Route</h3>
                  <span className="text-xs text-muted-foreground">{filteredShipments.length} matches</span>
                </div>
                {filteredShipments.length === 0 ? (
                  <div className="text-center py-10 text-sm text-muted-foreground">No loads found for this route yet. Try again later.</div>
                ) : (
                  filteredShipments.map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{s.business}</span>
                          {s.verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {s.from} → {s.to} · {s.weight} kg · {s.goods}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-blue-700 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> {s.date}</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold ${s.urgency === "Express" ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>{s.urgency}</span>
                          <span className="font-black text-emerald-700">Budget: ₹{s.budget}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={acceptedShipments.includes(s.id)}
                        onClick={() => handleAcceptLoad(s.id, s.business)}
                        className={`shrink-0 font-bold rounded-xl ${acceptedShipments.includes(s.id) ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-blue-700 hover:bg-blue-800 text-white"}`}
                        variant={acceptedShipments.includes(s.id) ? "outline" : "default"}
                      >
                        {acceptedShipments.includes(s.id) ? <><Check className="w-3.5 h-3.5 mr-1" /> Accepted</> : <>Accept Load <ChevronRight className="w-3.5 h-3.5 ml-1" /></>}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          {/* SHIPPER TAB */}
          <TabsContent value="shipper" className="space-y-6">
            <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-4">
              <h3 className="font-black text-foreground text-lg">Find Available Return Trucks</h3>
              <p className="text-xs text-muted-foreground">Enter your shipment details and we'll show you trucks returning through your route — at 30–40% lower cost.</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Pickup City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm appearance-none" value={shipFrom} onChange={e => setShipFrom(e.target.value)}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Delivery City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm appearance-none" value={shipTo} onChange={e => setShipTo(e.target.value)}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Type of Goods</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm appearance-none" value={shipGoods} onChange={e => setShipGoods(e.target.value)}>
                    {GOODS_TYPES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1"><Weight className="w-3 h-3" /> Weight (kg)</label>
                  <div className="space-y-1">
                    <input type="range" min={50} max={3000} step={50} value={shipWeight} onChange={e => setShipWeight(Number(e.target.value))} className="w-full accent-blue-600" />
                    <div className="text-xs font-bold text-blue-700 text-center">{shipWeight} kg</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Trucks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-foreground">Available Return Trucks</h3>
                <span className="text-xs text-muted-foreground">{filteredTrips.length} trucks found</span>
              </div>
              {filteredTrips.map((trip) => {
                const estPrice = Math.round(trip.pricePerKg * shipWeight);
                const marketPrice = Math.round(estPrice * 1.45);
                const savings = marketPrice - estPrice;
                return (
                  <div key={trip.id} className="p-4 rounded-2xl border bg-card shadow-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <Truck className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground">{trip.driver}</span>
                          {trip.verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {trip.rating} · {trip.trips} trips
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {trip.from} → {trip.to} · {trip.vehicle}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3" /> {trip.date} · {trip.departure}
                          <span className="text-blue-700 font-semibold">{trip.available} kg available</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div>
                        <div className="text-xs text-muted-foreground line-through">Market Rate: ₹{marketPrice.toLocaleString()}</div>
                        <div className="text-lg font-black text-foreground">₹{estPrice.toLocaleString()}</div>
                        <div className="text-[11px] text-emerald-700 font-bold">Save ₹{savings.toLocaleString()} ({Math.round((savings / marketPrice) * 100)}% off)</div>
                      </div>
                      <Button
                        size="sm"
                        disabled={acceptedTrips.includes(trip.id)}
                        onClick={() => handleAcceptTrip(trip.id, trip.driver)}
                        className={`font-bold rounded-xl ${acceptedTrips.includes(trip.id) ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-blue-700 hover:bg-blue-800 text-white"}`}
                        variant={acceptedTrips.includes(trip.id) ? "outline" : "default"}
                      >
                        {acceptedTrips.includes(trip.id) ? <><Check className="w-3.5 h-3.5 mr-1" /> Booked</> : <>Book Truck <ArrowRight className="w-3.5 h-3.5 ml-1" /></>}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredTrips.length === 0 && (
                <div className="text-center py-12 space-y-2">
                  <Truck className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">No matching trucks for this route right now.</p>
                  <p className="text-xs text-muted-foreground">Try a broader origin/destination or check back later.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
