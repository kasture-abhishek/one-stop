import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { providerService } from "@/services/providerService";
import { menuService } from "@/services/menuService";
import { orderService, type OrderWithDetails } from "@/services/orderService";
import { tiffinService, type SubscriptionWithPlan } from "@/services/tiffinService";
import { useAuth } from "@/context/authContext";
import { SEED_PROVIDERS } from "@/data/seedData";
import type { Provider, MenuItem, OrderStatus } from "@/types/db";
import { ORDER_STATUS_LABEL } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChefHat,
  ShoppingBag,
  CalendarCheck2,
  TrendingUp,
  Clock,
  Plus,
  Check,
  AlertCircle,
  Eye,
  CheckCircle2,
  Trash2,
  Flame,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/provider-dashboard")({
  component: ProviderDashboardPage,
});

function ProviderDashboardPage() {
  const { user, role, switchDemoRole } = useAuth();
  const [provider, setProvider] = useState<Provider>(SEED_PROVIDERS[0] as Provider);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPlan[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  // Route guard
  if (role !== "provider") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">Kitchen Partner Portal</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            This dashboard is only accessible to registered kitchen partners. Switch to the Provider demo to explore.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => switchDemoRole("provider")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-5 rounded-xl shadow"
          >
            <ChefHat className="w-4 h-4 mr-2" /> Switch to Provider Demo
          </Button>
          <Button variant="outline" asChild className="px-6 py-5 rounded-xl">
            <Link to="/">Back to Discovery</Link>
          </Button>
        </div>
      </div>
    );
  }

  // New Item Dialog
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishDesc, setDishDesc] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [isVeg, setIsVeg] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const pId = provider.id;
      const [orderList, itemList, subList] = await Promise.all([
        orderService.listProviderOrders(pId),
        menuService.listItems(pId),
        tiffinService.listProviderSubscriptions(pId),
      ]);
      setOrders(orderList);
      setMenuItems(itemList);
      setSubscriptions(subList);
      setIsOpen(provider.is_open);
    } catch (e) {
      console.error("Failed to load provider data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [provider.id]);

  const toggleKitchenOpen = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    await providerService.updateProvider(provider.id, { is_open: nextState });
    toast.success(`Kitchen status updated: ${nextState ? "OPEN for orders" : "CLOSED"}`);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o))
    );
    toast.success(`Order #${orderId.slice(0, 6)} updated to ${ORDER_STATUS_LABEL[status]}`);
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    const nextVal = !item.is_available;
    await menuService.updateItem(item.id, { is_available: nextVal });
    setMenuItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: nextVal } : i))
    );
    toast.success(`"${item.name}" marked as ${nextVal ? "In Stock" : "Out of Stock"}`);
  };

  const toggleItemBadge = async (item: MenuItem, field: "is_best_seller" | "is_todays_special") => {
    const nextVal = !item[field];
    await menuService.updateItem(item.id, { [field]: nextVal });
    setMenuItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, [field]: nextVal } : i))
    );
    toast.success(`Updated badge for "${item.name}"`);
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !dishPrice) return;

    await menuService.createItem({
      provider_id: provider.id,
      name: dishName,
      description: dishDesc,
      price: parseFloat(dishPrice),
      image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80",
      is_available: true,
      is_best_seller: false,
      is_todays_special: false,
      category_id: null,
      is_veg: isVeg,
    });

    toast.success(`Dish "${dishName}" added to menu!`);
    setIsAddDishOpen(false);
    setDishName("");
    setDishDesc("");
    setDishPrice("");
    loadData();
  };

  // Metrics
  const activeOrdersCount = orders.filter((o) => o.order_status !== "delivered" && o.order_status !== "cancelled").length;
  const totalEarnings = orders
    .filter((o) => o.order_status === "delivered")
    .reduce((sum, o) => sum + Number(o.subtotal || o.total), 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar */}
      <div className="border-b bg-card py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{provider.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  Verified Kitchen
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{provider.address}, {provider.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={provider.id}
              onChange={(e) => {
                const sel = SEED_PROVIDERS.find((p) => p.id === e.target.value);
                if (sel) setProvider(sel as Provider);
              }}
              className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 font-semibold text-foreground shadow-2xs focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              {SEED_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  Switch: {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-muted/60 p-2 rounded-xl border">
              <span className="text-xs font-semibold">Kitchen Status:</span>
              <span className={`text-xs font-bold ${isOpen ? "text-emerald-700" : "text-red-700"}`}>
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
              <Switch checked={isOpen} onCheckedChange={toggleKitchenOpen} />
            </div>

            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link to={`/provider/${provider.id}` as any}>
                <Eye className="w-3.5 h-3.5 mr-1" /> View Customer Menu
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPI Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-orange-600" /> Active Orders
            </div>
            <div className="text-2xl font-extrabold text-foreground">{activeOrdersCount}</div>
            <div className="text-[11px] text-muted-foreground">Kitchen queue right now</div>
          </div>

          <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" /> Active Subscribers
            </div>
            <div className="text-2xl font-extrabold text-foreground">{subscriptions.length}</div>
            <div className="text-[11px] text-muted-foreground">Monthly & weekly tiffins</div>
          </div>

          <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Completed Revenue
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">₹{totalEarnings + 480}</div>
            <div className="text-[11px] text-muted-foreground">Net order earnings</div>
          </div>

          <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-purple-600" /> Active Dishes
            </div>
            <div className="text-2xl font-extrabold text-foreground">{menuItems.length}</div>
            <div className="text-[11px] text-muted-foreground">Available on storefront</div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="menu">Menu ({menuItems.length})</TabsTrigger>
            <TabsTrigger value="tiffin">Subscribers ({subscriptions.length})</TabsTrigger>
          </TabsList>

          {/* TAB 1: ORDERS */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Kitchen Incoming Orders</h3>
              <span className="text-xs text-muted-foreground">Click action buttons to update customer tracking</span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center border rounded-xl bg-card">
                <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-bold text-sm">No incoming orders yet</h4>
                <p className="text-xs text-muted-foreground">Orders placed by customers will show up here in real time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => {
                  return (
                    <div
                      key={o.id}
                      className="p-4 rounded-xl border bg-card shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            Order #{o.id.slice(0, 8)}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold uppercase">
                            {ORDER_STATUS_LABEL[o.order_status] ?? o.order_status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {o.items?.map((i) => `${i.quantity}x ${i.item_name}`).join(", ")}
                        </div>
                        <div className="text-xs font-semibold text-foreground">Total: ₹{o.total}</div>
                      </div>

                      {/* Status progression buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {o.order_status === "confirmed" && (
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
                            onClick={() => handleUpdateOrderStatus(o.id, "preparing")}
                          >
                            Accept & Start Cooking
                          </Button>
                        )}
                        {o.order_status === "preparing" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                            onClick={() => handleUpdateOrderStatus(o.id, "picked_up")}
                          >
                            Mark Ready & Hand to Rider
                          </Button>
                        )}
                        {o.order_status === "picked_up" && (
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-8"
                            onClick={() => handleUpdateOrderStatus(o.id, "out_for_delivery")}
                          >
                            Mark Out for Delivery
                          </Button>
                        )}
                        {o.order_status === "out_for_delivery" && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                            onClick={() => handleUpdateOrderStatus(o.id, "delivered")}
                          >
                            Confirm Delivered
                          </Button>
                        )}
                        {o.order_status === "delivered" && (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Completed
                          </span>
                        )}

                        <Button asChild variant="outline" size="sm" className="text-xs h-8">
                          <Link to={`/order/${o.id}` as any}>Track Order</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: MENU MANAGEMENT */}
          <TabsContent value="menu" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Menu Items & Availability</h3>
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-8"
                onClick={() => setIsAddDishOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add New Dish
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border bg-card flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url ?? "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80"}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-foreground">{item.name}</div>
                      <div className="text-xs font-semibold text-orange-600">₹{Number(item.price)}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => toggleItemBadge(item, "is_best_seller")}
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold transition-all ${
                            item.is_best_seller
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          Best Seller
                        </button>
                        <button
                          onClick={() => toggleItemBadge(item, "is_todays_special")}
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold transition-all ${
                            item.is_todays_special
                              ? "bg-orange-100 text-orange-900 border border-orange-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          Today's Special
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] font-bold ${item.is_available ? "text-emerald-700" : "text-muted-foreground"}`}>
                      {item.is_available ? "In Stock" : "Unavailable"}
                    </span>
                    <Switch
                      checked={item.is_available}
                      onCheckedChange={() => toggleItemAvailability(item)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: TIFFIN SUBSCRIBERS */}
          <TabsContent value="tiffin" className="space-y-4">
            <h3 className="font-bold text-base text-foreground">Active Tiffin Subscribers</h3>
            <div className="space-y-3">
              {subscriptions.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border bg-card shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-foreground">Customer #{s.customer_id.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground">{s.plan?.name ?? "Monthly Homestyle Dabba"}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t">
                    <span>Preference: <strong className="text-foreground capitalize">{s.meal_preference}</strong></span>
                    <span>Next Delivery: <strong className="text-foreground">{s.next_delivery_date ?? "Tomorrow"}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add New Dish Dialog */}
      <Dialog open={isAddDishOpen} onOpenChange={setIsAddDishOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Dish</DialogTitle>
            <DialogDescription>Add a new homestyle dish to your kitchen menu.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Dish Name</label>
              <Input
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Masala Bhath with Boondi Raita"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Price (₹)</label>
              <Input
                type="number"
                value={dishPrice}
                onChange={(e) => setDishPrice(e.target.value)}
                placeholder="120"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Description & Ingredients</label>
              <Textarea
                value={dishDesc}
                onChange={(e) => setDishDesc(e.target.value)}
                placeholder="Homestyle preparation with authentic spices, ghee, fresh vegetables..."
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Switch checked={isVeg} onCheckedChange={setIsVeg} />
              <label className="font-semibold">{isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}</label>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 mt-2">
              Save & Publish Dish
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
