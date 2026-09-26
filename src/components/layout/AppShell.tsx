import React, { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useLocation } from "@/context/locationContext";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { LocationModal } from "@/components/location/LocationModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartConflictDialog } from "@/components/cart/CartConflictDialog";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import logoAsset from "../../logo/one-stop-logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  ShoppingBag,
  Store,
  User,
  Utensils,
  CalendarCheck2,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Compass,
  Sparkles,
  ChevronDown,
  Layers,
  ChefHat,
  Home,
  Gift,
  Truck,
  MoreHorizontal,
  LogIn,
  Moon,
  Sun,
} from "lucide-react";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cityName, setIsLocationModalOpen } = useLocation();
  const { role, profile, switchDemoRole, isDemoUser } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDarkMode = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDarkMode(shouldUseDarkMode);
    document.documentElement.classList.toggle("dark", shouldUseDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextIsDarkMode = !isDarkMode;
    setIsDarkMode(nextIsDarkMode);
    document.documentElement.classList.toggle("dark", nextIsDarkMode);
    window.localStorage.setItem("theme", nextIsDarkMode ? "dark" : "light");
  };

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const navLinkClass = (path: string, activeColor = "text-orange-700 bg-orange-50 font-semibold") =>
    `px-3 py-1.5 rounded-md transition-colors ${
      isActive(path) ? activeColor : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;

  // Role-specific navigation items
  const customerNav = (
    <>
      <Link to="/" className={navLinkClass("/")}>Discover</Link>
      <Link to="/tiffin" className={`${navLinkClass("/tiffin")} flex items-center gap-1.5`}>
        <CalendarCheck2 className="w-4 h-4 text-orange-600" /> Tiffin Plans
      </Link>
      <Link to="/orders" className={navLinkClass("/orders")}>My Orders</Link>
      <Link to="/register" className={`${navLinkClass("/register")} flex items-center gap-1.5`}>
        <Store className="w-4 h-4 text-orange-600" /> Register
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1 text-sm font-medium">
          <Layers className="w-4 h-4 text-purple-600" /> More <ChevronDown className="w-3 h-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 text-xs">
          <DropdownMenuItem asChild>
            <Link to="/stay" className="cursor-pointer flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-purple-600" /> Student Stay
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/parcels" className="cursor-pointer flex items-center gap-2">
              <Gift className="w-3.5 h-3.5 text-rose-600" /> Festive Parcels
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/logistics" className="cursor-pointer flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-blue-600" /> Return Logistics
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/roadmap" className="cursor-pointer flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Roadmap
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  const providerNav = (
    <>
      <Link to="/" className={navLinkClass("/")}>Discover</Link>
      <Link to="/provider-dashboard" className={`${navLinkClass("/provider-dashboard", "text-emerald-800 bg-emerald-50 font-semibold")} flex items-center gap-1`}>
        <ChefHat className="w-4 h-4 text-emerald-600" /> Kitchen Portal
      </Link>
      <Link to="/tiffin" className={`${navLinkClass("/tiffin")} flex items-center gap-1.5`}>
        <CalendarCheck2 className="w-4 h-4 text-orange-600" /> Tiffin Plans
      </Link>
      <Link to="/orders" className={navLinkClass("/orders")}>Orders</Link>
      <Link to="/register" className={`${navLinkClass("/register")} flex items-center gap-1.5`}>
        <Store className="w-4 h-4 text-orange-600" /> Register
      </Link>
    </>
  );

  const adminNav = (
    <>
      <Link to="/" className={navLinkClass("/")}>Discover</Link>
      <Link to="/admin" className={`${navLinkClass("/admin", "text-purple-800 bg-purple-50 font-semibold")} flex items-center gap-1`}>
        <ShieldAlert className="w-4 h-4 text-purple-600" /> Admin Portal
      </Link>
      <Link to="/orders" className={navLinkClass("/orders")}>All Orders</Link>
      <Link to="/roadmap" className={`${navLinkClass("/roadmap")} flex items-center gap-1 text-xs text-purple-700 bg-purple-50/70 border border-purple-200/60 font-semibold`}>
        <Sparkles className="w-3 h-3 text-purple-600" /> Roadmap
      </Link>
    </>
  );

  const driverNav = (
    <>
      <Link to="/" className={navLinkClass("/")}>Discover</Link>
      <Link to="/logistics" className={`${navLinkClass("/logistics", "text-blue-800 bg-blue-50 font-semibold")} flex items-center gap-1`}>
        <Truck className="w-4 h-4 text-blue-600" /> Logistics
      </Link>
      <Link to="/orders" className={navLinkClass("/orders")}>Orders</Link>
    </>
  );

  // Mobile bottom nav — role-aware
  const mobileNav = {
    customer: [
      { to: "/", icon: <Compass className="w-5 h-5" />, label: "Discover" },
      { to: "/tiffin", icon: <CalendarCheck2 className="w-5 h-5" />, label: "Tiffin" },
      { to: "/orders", icon: <Clock className="w-5 h-5" />, label: "Orders" },
      { to: "/stay", icon: <Home className="w-5 h-5" />, label: "Stay" },
    ],
    provider: [
      { to: "/", icon: <Compass className="w-5 h-5" />, label: "Discover" },
      { to: "/provider-dashboard", icon: <ChefHat className="w-5 h-5" />, label: "Kitchen" },
      { to: "/orders", icon: <Clock className="w-5 h-5" />, label: "Orders" },
      { to: "/tiffin", icon: <CalendarCheck2 className="w-5 h-5" />, label: "Tiffin" },
    ],
    admin: [
      { to: "/", icon: <Compass className="w-5 h-5" />, label: "Discover" },
      { to: "/admin", icon: <ShieldAlert className="w-5 h-5" />, label: "Admin" },
      { to: "/orders", icon: <Clock className="w-5 h-5" />, label: "Orders" },
      { to: "/roadmap", icon: <Layers className="w-5 h-5" />, label: "Roadmap" },
    ],
    driver: [
      { to: "/", icon: <Compass className="w-5 h-5" />, label: "Discover" },
      { to: "/logistics", icon: <Truck className="w-5 h-5" />, label: "Logistics" },
      { to: "/orders", icon: <Clock className="w-5 h-5" />, label: "Orders" },
    ],
  };

  const currentMobileNav = mobileNav[role] || mobileNav.customer;

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground selection:bg-orange-500/20 selection:text-orange-900 pb-16 md:pb-0">
      {/* Top Banner: SIH Demo Mode Indicator */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              SIH 2026 MVP
            </span>
            <span className="hidden sm:inline">
              Team Odyssey • Problem ID 26205: Hyperlocal Food & Tiffin Network
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="flex items-center bg-black/20 rounded-full px-2 py-0.5 text-[11px] gap-1">
              <span className="text-orange-200">Role:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="font-semibold underline flex items-center gap-1 hover:text-white capitalize">
                    {role} <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuLabel>Switch Demo Persona</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => switchDemoRole("customer")}>
                    <User className="w-3.5 h-3.5 mr-2 text-orange-600" />
                    Customer (Aarav)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchDemoRole("provider")}>
                    <ChefHat className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                    Provider (Aai's Rasoi)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchDemoRole("admin")}>
                    <ShieldAlert className="w-3.5 h-3.5 mr-2 text-purple-600" />
                    Admin (Team Odyssey)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex shrink-0 items-center gap-4">
            <Link
              to="/"
              aria-label="ONE STOP home"
              className="group flex h-12 w-24 shrink-0 items-center gap-1 rounded-xl px-2 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={logoAsset}
                alt="ONE STOP"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 object-contain transition-transform group-hover:scale-105"
              />
              <span className="w-10 text-[13px] font-black leading-[13px] tracking-tight text-orange-700 dark:text-orange-300">
                ONE STOP
              </span>
            </Link>

            {/* Location Selector Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-xs font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span className="max-w-[120px] truncate text-foreground font-semibold">{cityName}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          {/* Desktop Navigation — role-specific */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto text-sm font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex">
            {role === "customer" && customerNav}
            {role === "provider" && providerNav}
            {role === "admin" && adminNav}
            {role === "driver" && driverNav}
          </nav>

          {/* Right Action Icons */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Mobile Location trigger */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="sm:hidden p-2 rounded-lg border text-muted-foreground hover:text-orange-600"
              aria-label="Change location"
            >
              <MapPin className="w-4 h-4" />
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Cart Trigger — only for customer/provider */}
            {role !== "admin" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 border-orange-200 bg-orange-50/40 hover:bg-orange-100/60 text-orange-950 font-medium rounded-full px-3.5 h-9"
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span className="hidden sm:inline text-xs">Cart</span>
                {itemCount > 0 && (
                  <span className="bg-orange-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center -mr-1">
                    {itemCount}
                  </span>
                )}
              </Button>
            )}

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full border" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 text-xs">
                <DropdownMenuLabel>
                  <div className="font-semibold text-sm line-clamp-1">{profile?.full_name ?? "SIH Demo User"}</div>
                  <div className="text-[11px] text-muted-foreground font-normal">{profile?.email}</div>
                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    role === "admin" ? "bg-purple-100 text-purple-800" :
                    role === "provider" ? "bg-emerald-100 text-emerald-800" :
                    "bg-orange-100 text-orange-800"
                  }`}>
                    {role} View
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Role-specific quick links */}
                {role === "customer" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer">
                        <Clock className="w-3.5 h-3.5 mr-2" /> My Orders & Tiffin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/stay" className="cursor-pointer">
                        <Home className="w-3.5 h-3.5 mr-2 text-purple-600" /> Student Stay
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/parcels" className="cursor-pointer">
                        <Gift className="w-3.5 h-3.5 mr-2 text-rose-600" /> Festive Parcels
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {role === "provider" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/provider-dashboard" className="cursor-pointer">
                        <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Kitchen Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer">
                        <Clock className="w-3.5 h-3.5 mr-2" /> Order Queue
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/logistics" className="cursor-pointer">
                        <Truck className="w-3.5 h-3.5 mr-2 text-blue-600" /> Return Logistics
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <ShieldAlert className="w-3.5 h-3.5 mr-2 text-purple-600" /> Admin Portal
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/roadmap" className="cursor-pointer">
                        <Layers className="w-3.5 h-3.5 mr-2" /> Roadmap Modules
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="cursor-pointer">
                    <LogIn className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> Login / Switch Account
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-8 px-4 text-center text-xs text-muted-foreground hidden md:block">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-sm text-foreground">
            <span className="text-orange-600">ONE STOP</span> • One Place. Every Need.
          </div>
          <div className="flex items-center justify-center gap-4 text-[11px] flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Discover Kitchens</Link>
            <Link to="/tiffin" className="hover:text-foreground transition-colors">Tiffin Plans</Link>
            <Link to="/stay" className="hover:text-foreground transition-colors">Student Stay</Link>
            <Link to="/parcels" className="hover:text-foreground transition-colors">Festive Parcels</Link>
            <Link to="/logistics" className="hover:text-foreground transition-colors">Return Logistics</Link>
            <Link to="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
          </div>
          <p className="max-w-md mx-auto text-[11px]">
            A location-aware hyperlocal marketplace empowering home kitchens, local food vendors, and tiffin providers.
          </p>
          <div className="pt-2 text-[11px] text-muted-foreground/80">
            Smart India Hackathon 2026 • Problem Statement ID: 26205 (Transportation & Logistics) • Team Odyssey
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar — role-aware */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around py-2 px-1">
        {currentMobileNav.map((item) => (
          <Link
            key={item.to}
            to={item.to as any}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-md text-[10px] font-medium transition-colors ${
              isActive(item.to)
                ? role === "provider" ? "text-emerald-600 font-bold" :
                  role === "admin" ? "text-purple-600 font-bold" :
                  "text-orange-600 font-bold"
                : "text-muted-foreground"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Cart button — only for customer/provider */}
        {role !== "admin" && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-md text-[10px] font-medium text-muted-foreground relative"
          >
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-2 bg-orange-600 text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Global Modals */}
      <LocationModal />
      <CartDrawer />
      <CartConflictDialog />
      <CheckoutModal />
    </div>
  );
};
