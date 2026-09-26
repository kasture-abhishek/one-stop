import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Home,
  Gift,
  Truck,
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers,
  ChefHat,
  TrendingDown,
  Leaf,
  Zap,
  Package,
} from "lucide-react";

export const Route = createFileRoute("/roadmap")({
  component: RoadmapModulesPage,
});

function StitchedImageSet({
  images,
  accentClass,
}: {
  images: string[];
  accentClass: string;
}) {
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-background via-muted/60 to-background p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className={`absolute inset-x-6 bottom-4 h-12 rounded-full blur-2xl ${accentClass} opacity-50`} />
      {images.map((image, index) => (
        <div
          key={image + index}
          className={[
            "absolute overflow-hidden rounded-[22px] border border-white/70 bg-cover bg-center shadow-lg",
            index === 0 && "left-3 top-4 h-[120px] w-[44%] rotate-[-6deg]",
            index === 1 && "right-3 top-5 h-[120px] w-[46%] rotate-[7deg]",
            index === 2 && "left-8 bottom-3 h-[94px] w-[42%] rotate-[3deg]",
            index === 3 && "right-8 bottom-2 h-[100px] w-[45%] rotate-[-4deg]",
          ].join(" ")}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_32%,rgba(255,255,255,0.08))]" />
    </div>
  );
}

function RoadmapModulesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-purple-50/70 via-indigo-50/30 to-background border-b py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart India Hackathon 2026 — Team Odyssey Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            ONE STOP Ecosystem Roadmap
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Beyond hyperlocal food & tiffin, ONE STOP bridges accommodations, festive parcels, and transportation logistics. Explore all live modules below.
          </p>

          {/* Quick jump chips */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {[
              { label: "Food & Tiffin", href: "/" as any, icon: <ChefHat className="w-3.5 h-3.5" />, color: "bg-orange-100 text-orange-800 border-orange-200" },
              { label: "Student Stay", href: "/stay" as any, icon: <Home className="w-3.5 h-3.5" />, color: "bg-purple-100 text-purple-800 border-purple-200" },
              { label: "Festive Parcels", href: "/parcels" as any, icon: <Gift className="w-3.5 h-3.5" />, color: "bg-rose-100 text-rose-800 border-rose-200" },
              { label: "Return Logistics", href: "/logistics" as any, icon: <Truck className="w-3.5 h-3.5" />, color: "bg-blue-100 text-blue-800 border-blue-200" },
            ].map((chip) => (
              <Link
                key={chip.label}
                to={chip.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${chip.color}`}
              >
                {chip.icon} {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">

        {/* MODULE 0: FOOD & TIFFIN (Already Live) */}
        <div id="food" className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-500/5 to-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                  ✅ Phase 1 — Live Now
                </span>
                <h2 className="text-2xl font-black text-foreground mt-0.5">Hyperlocal Food & Tiffin Network</h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold self-start sm:self-auto">
              Fully Operational
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {[
                "Live provider discovery with ratings & FSSAI verification",
                "Interactive menu with dietary filters (veg/non-veg/jain/vegan)",
                "Real-time order placement & live delivery tracking",
                "Daily tiffin subscription builder with custom schedules",
                "Kitchen Partner Ops Dashboard with kanban order queue",
                "Admin verification & platform monitoring portal",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> <span>{f}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <StitchedImageSet
                accentClass="bg-orange-400"
                images={[
                  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1604908556850-3e74d1d7f6a5?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
                ]}
              />
              <div className="space-y-2">
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl py-5 shadow">
                  <Link to="/">
                    <Compass className="w-4 h-4 mr-2" /> Explore Kitchens
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-xl py-5 font-semibold">
                  <Link to="/tiffin">
                    <Sparkles className="w-4 h-4 mr-2 text-orange-500" /> Tiffin Plans
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 1: STUDENT STAY */}
        <div id="stay" className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-500/5 to-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                  ✅ Phase 2 — Live Now
                </span>
                <h2 className="text-2xl font-black text-foreground mt-0.5">Student Stay & Synced Food</h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold self-start sm:self-auto">
              Now Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Students and young working professionals relocating to tier 1/2 cities struggle to find trusted PG accommodations and healthy homestyle food simultaneously.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  "Verified PG & hostel discovery near academic & IT hubs",
                  "Bundled monthly tiffin subscription from nearby mothers' kitchens",
                  "Regional cuisine matching (e.g. Marathi student getting Maharashtrian food in Bangalore)",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" /> <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <StitchedImageSet
                accentClass="bg-purple-400"
                images={[
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
                ]}
              />
              <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
                <div className="text-[11px] font-bold uppercase text-purple-700 tracking-wider">Integrated Accommodation Concept</div>
                <div className="font-bold text-sm text-foreground">Sai Krupa Executive PG & Tiffin Combo</div>
                <p className="text-xs text-muted-foreground">Kothrud, Pune • 350m from MIT College • Single & Double Sharing</p>
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Room Rent + 2 Meals Tiffin:</span>
                    <span>₹9,500 / month</span>
                  </div>
                  <div className="text-[11px] text-purple-800">Food provided by certified kitchen: Aai's Gharachi Rasoi</div>
                </div>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl">
                  <Link to="/stay">
                    <Home className="w-4 h-4 mr-2" /> Find Student Stay <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 2: TASTE OF HOME */}
        <div id="taste-of-home" className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-500/5 to-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                  ✅ Phase 3 — Live Now
                </span>
                <h2 className="text-2xl font-black text-foreground mt-0.5">Taste of Home (Festive Parcels)</h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold self-start sm:self-auto">
              Now Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Parents living in native hometowns frequently send homemade Diwali faral, winter pinni, thepla, laddoos, and pickles to children studying or working in other cities.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  "Doorstep pickup of homemade edible parcels from native towns",
                  "Tamper-evident temperature-controlled packaging",
                  "Intercity express delivery with live parcel tracking",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" /> <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <StitchedImageSet
                accentClass="bg-rose-400"
                images={[
                  "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
                ]}
              />
              <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
                <div className="text-[11px] font-bold uppercase text-rose-700 tracking-wider">Parcel Booking Flow</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <span>Origin: Kolhapur (Native)</span><span>➔</span><span>Dest: Pune (Hostel)</span>
                  </div>
                  <div className="p-2 rounded bg-muted">Content: Homemade Festive Sweets (3.5 kg)</div>
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-rose-900 font-semibold text-xs">
                    Estimated Transit: 12–18 Hours · ₹197
                  </div>
                </div>
                <Button asChild className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl">
                  <Link to="/parcels">
                    <Package className="w-4 h-4 mr-2" /> Book a Parcel <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 3: RETURN LOAD LOGISTICS */}
        <div id="return-load" className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-500/5 to-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                  ✅ Phase 4 — Live Now (SIH Core)
                </span>
                <h2 className="text-2xl font-black text-foreground mt-0.5">Return Load (Backhaul Optimization)</h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold self-start sm:self-auto">
              Now Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Over 40% of intercity delivery commercial vehicles return empty ("deadheading"), wasting fuel and causing severe carbon emissions. ONE STOP's database architecture already includes tables (<code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">drivers</code>, <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">vehicles</code>, <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">trips</code>, <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">shipments</code>, <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">backhaul_matches</code>) to match empty return trips with wholesale kitchen supply cargo.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <TrendingDown className="w-5 h-5 text-emerald-600" />, value: "34%", label: "Avg Cost Savings", bg: "bg-emerald-50" },
                  { icon: <Leaf className="w-5 h-5 text-green-600" />, value: "2.1T", label: "CO₂ Saved/Month", bg: "bg-green-50" },
                  { icon: <Zap className="w-5 h-5 text-yellow-600" />, value: "127", label: "Matches Made", bg: "bg-yellow-50" },
                  { icon: <Truck className="w-5 h-5 text-blue-600" />, value: "89", label: "Active Drivers", bg: "bg-blue-50" },
                ].map((stat) => (
                  <div key={stat.label} className={`p-3 rounded-xl border text-center space-y-1 ${stat.bg}`}>
                    <div className="flex justify-center">{stat.icon}</div>
                    <div className="text-xl font-black text-foreground">{stat.value}</div>
                    <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl py-5 shadow">
                <Link to="/logistics">
                  <Truck className="w-4 h-4 mr-2" /> Open Return Load Matching <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </Button>
            </div>

            <StitchedImageSet
              accentClass="bg-blue-400"
              images={[
                "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80",
              ]}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
