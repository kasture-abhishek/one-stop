import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  MapPin,
  ArrowRight,
  Check,
  Clock,
  Truck,
  Gift,
  CalendarDays,
  Weight,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
  Star,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/parcels")({
  component: ParcelsPage,
});

const CITIES = ["Pune", "Mumbai", "Nashik", "Kolhapur", "Nagpur", "Aurangabad", "Solapur", "Satara", "Sangli", "Latur", "Bengaluru", "Hyderabad", "Delhi", "Ahmedabad"];
const CONTENT_TYPES = [
  { value: "sweets", label: "Homemade Sweets & Mithai", emoji: "🍬", rate: 1.2 },
  { value: "farsan", label: "Farsan & Snacks", emoji: "🥜", rate: 1.1 },
  { value: "pickles", label: "Pickles & Chutneys", emoji: "🫙", rate: 1.0 },
  { value: "dry_fruits", label: "Dry Fruits & Nuts", emoji: "🌰", rate: 1.4 },
  { value: "thepla", label: "Thepla & Chakli", emoji: "🫓", rate: 1.0 },
  { value: "mixed", label: "Mixed Festive Hamper", emoji: "🎁", rate: 1.3 },
];
const TIME_SLOTS = ["9:00 AM – 11:00 AM", "11:00 AM – 1:00 PM", "2:00 PM – 4:00 PM", "4:00 PM – 6:00 PM", "6:00 PM – 8:00 PM"];

const CITY_DISTANCES: Record<string, number> = {
  "Pune-Mumbai": 150, "Pune-Nashik": 210, "Pune-Kolhapur": 230, "Pune-Nagpur": 730,
  "Pune-Bengaluru": 850, "Mumbai-Bengaluru": 980, "Nashik-Mumbai": 165, "Kolhapur-Mumbai": 378,
  "Nagpur-Mumbai": 840, "Pune-Hyderabad": 555, "Pune-Delhi": 1445, "Pune-Ahmedabad": 660,
};

function getDistance(from: string, to: string) {
  const key1 = `${from}-${to}`;
  const key2 = `${to}-${from}`;
  return CITY_DISTANCES[key1] || CITY_DISTANCES[key2] || Math.floor(Math.random() * 400 + 200);
}

function calcPrice(from: string, to: string, weight: number, contentType: string) {
  const dist = getDistance(from, to);
  const content = CONTENT_TYPES.find(c => c.value === contentType);
  const rate = content?.rate ?? 1.0;
  const base = 120;
  const perKmRate = 0.18;
  const perKgRate = 20;
  return Math.round((base + dist * perKmRate + weight * perKgRate) * rate);
}

const TRACKING_STAGES = [
  { id: "pickup", label: "Pickup Scheduled", icon: <Clock className="w-4 h-4" />, color: "text-blue-600" },
  { id: "collected", label: "Parcel Collected", icon: <Package className="w-4 h-4" />, color: "text-purple-600" },
  { id: "packed", label: "Safely Packed", icon: <BadgeCheck className="w-4 h-4" />, color: "text-indigo-600" },
  { id: "transit", label: "In Transit", icon: <Truck className="w-4 h-4" />, color: "text-orange-600" },
  { id: "delivered", label: "Delivered", icon: <Check className="w-4 h-4" />, color: "text-emerald-600" },
];

export default function ParcelsPage() {
  const [step, setStep] = useState(1);
  const [fromCity, setFromCity] = useState("Kolhapur");
  const [toCity, setToCity] = useState("Pune");
  const [contentType, setContentType] = useState("sweets");
  const [weight, setWeight] = useState(2);
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlot, setPickupSlot] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackingStage, setTrackingStage] = useState(0);

  const price = calcPrice(fromCity, toCity, weight, contentType);
  const dist = getDistance(fromCity, toCity);
  const estHours = Math.round(dist / 60 + 2);
  const selectedContent = CONTENT_TYPES.find(c => c.value === contentType);

  const handleConfirm = () => {
    const id = `OSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTrackingId(id);
    setTrackingStage(1);
    setStep(3);
    toast.success(`Parcel booked! Tracking ID: ${id}`);
  };

  const simulateNext = () => {
    if (trackingStage < TRACKING_STAGES.length - 1) {
      setTrackingStage(s => s + 1);
      toast.success(`Status updated: ${TRACKING_STAGES[trackingStage + 1]?.label}`);
    }
  };

  const canProceedStep1 = fromCity && toCity && fromCity !== toCity && contentType;
  const canProceedStep2 = senderName && senderPhone && receiverName && receiverPhone && pickupDate && pickupSlot;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 via-pink-700 to-rose-800 text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="max-w-3xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
            <Gift className="w-3.5 h-3.5" />
            Taste of Home — Intercity Festive Parcel Delivery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Send Mom's Cooking
            <span className="block text-rose-200">Anywhere in India</span>
          </h1>
          <p className="text-sm text-rose-100 max-w-xl">
            Doorstep pickup of homemade sweets, farsan & festive parcels. Temperature-controlled, tamper-evident packaging with live tracking.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Parcel Details", "Pickup & Delivery", "Track & Confirm"].map((label, i) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 ${i + 1 <= step ? "text-rose-600" : "text-muted-foreground"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                  i + 1 < step ? "bg-rose-600 border-rose-600 text-white" :
                  i + 1 === step ? "border-rose-600 text-rose-600" :
                  "border-border text-muted-foreground"
                }`}>
                  {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="hidden sm:inline text-xs font-semibold">{label}</span>
              </div>
              {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Parcel Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-foreground">Tell us about your parcel</h2>

            {/* Cities */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">From (Sender City)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm font-medium appearance-none"
                    value={fromCity}
                    onChange={e => setFromCity(e.target.value)}
                  >
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">To (Receiver City)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm font-medium appearance-none"
                    value={toCity}
                    onChange={e => setToCity(e.target.value)}
                  >
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {fromCity === toCity && (
              <p className="text-xs text-rose-600 font-semibold">⚠ Origin and destination cities must be different.</p>
            )}

            {/* Content Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">What are you sending?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setContentType(ct.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      contentType === ct.value ? "border-rose-500 bg-rose-50" : "border-border hover:border-rose-300"
                    }`}
                  >
                    <div className="text-xl">{ct.emoji}</div>
                    <div className="text-xs font-semibold text-foreground mt-1 leading-tight">{ct.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Weight className="w-3.5 h-3.5 text-rose-500" /> Weight
                </label>
                <span className="text-sm font-black text-rose-600">{weight} kg</span>
              </div>
              <input
                type="range" min={0.5} max={10} step={0.5}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0.5 kg</span><span>5 kg</span><span>10 kg</span>
              </div>
            </div>

            {/* Price preview */}
            {fromCity !== toCity && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wide">
                  <Truck className="w-4 h-4 text-rose-600" /> Delivery Estimate
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{fromCity} → {toCity} ({dist} km)</span>
                  <span className="font-black text-rose-700 text-base">₹{price}</span>
                </div>
                <div className="text-xs text-rose-800">
                  Estimated delivery: <strong>{estHours}–{estHours + 4} hours</strong> · Temperature-controlled packaging included
                </div>
              </div>
            )}

            <Button
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-5 rounded-xl shadow"
            >
              Continue — Add Pickup Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2: Pickup & Delivery Info */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground">Pickup & Delivery Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Sender Name", val: senderName, set: setSenderName, placeholder: "e.g. Sunita Patil" },
                { label: "Sender Phone", val: senderPhone, set: setSenderPhone, placeholder: "+91 98230 XXXXX" },
                { label: "Receiver Name", val: receiverName, set: setReceiverName, placeholder: "e.g. Rohan Patil" },
                { label: "Receiver Phone", val: receiverPhone, set: setReceiverPhone, placeholder: "+91 70302 XXXXX" },
              ].map(({ label, val, set, placeholder }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">{label}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input className="pl-9" placeholder={placeholder} value={val} onChange={e => set(e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-rose-500" /> Pickup Date
              </label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Pickup Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setPickupSlot(slot)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      pickupSlot === slot ? "border-rose-500 bg-rose-50 text-rose-900" : "border-border text-muted-foreground hover:border-rose-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="p-4 rounded-2xl bg-muted/50 space-y-2 text-sm">
              <div className="font-bold text-foreground text-base mb-2">Order Summary</div>
              <div className="flex justify-between text-muted-foreground"><span>Route</span><span className="font-semibold text-foreground">{fromCity} → {toCity}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Content</span><span className="font-semibold text-foreground">{selectedContent?.emoji} {selectedContent?.label}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Weight</span><span className="font-semibold text-foreground">{weight} kg</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Estimated Transit</span><span className="font-semibold text-foreground">{estHours}–{estHours + 4} hrs</span></div>
              <div className="border-t pt-2 flex justify-between font-black text-foreground text-base">
                <span>Total Charge</span>
                <span className="text-rose-600">₹{price}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-5 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                disabled={!canProceedStep2}
                onClick={handleConfirm}
                className="flex-[2] bg-rose-600 hover:bg-rose-700 text-white font-bold py-5 rounded-xl shadow"
              >
                Confirm & Book Parcel <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Tracking */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-foreground">Parcel Booked!</h2>
              <p className="text-sm text-muted-foreground">Your parcel will be picked up on {pickupDate} between {pickupSlot}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-800 text-sm font-bold">
                <Package className="w-4 h-4" /> Tracking ID: {trackingId}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-5 rounded-2xl border bg-card space-y-4">
              <div className="text-xs font-bold text-foreground uppercase tracking-wide">Live Parcel Status</div>
              {TRACKING_STAGES.map((stage, idx) => (
                <div key={stage.id} className={`flex items-center gap-3 transition-all ${idx < trackingStage ? "opacity-100" : idx === trackingStage ? "opacity-100" : "opacity-30"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    idx < trackingStage ? "bg-emerald-100 text-emerald-600" :
                    idx === trackingStage ? "bg-rose-100 text-rose-600 ring-2 ring-rose-400 ring-offset-1" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {idx < trackingStage ? <Check className="w-4 h-4" /> : stage.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${idx <= trackingStage ? "text-foreground" : "text-muted-foreground"}`}>{stage.label}</div>
                    {idx === trackingStage && <div className="text-[11px] text-muted-foreground animate-pulse">In progress...</div>}
                    {idx < trackingStage && <div className="text-[11px] text-emerald-600">Completed ✓</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={simulateNext}
                disabled={trackingStage >= TRACKING_STAGES.length - 1}
                className="py-5 rounded-xl text-xs font-semibold"
              >
                <Truck className="w-4 h-4 mr-1.5" /> Simulate Next Step
              </Button>
              <Button
                variant="outline"
                onClick={() => { setStep(1); setTrackingStage(0); setTrackingId(""); }}
                className="py-5 rounded-xl text-xs font-semibold"
              >
                Book Another Parcel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
