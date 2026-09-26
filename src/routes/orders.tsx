import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { orderService, type OrderWithDetails } from "@/services/orderService";
import { tiffinService, type SubscriptionWithPlan } from "@/services/tiffinService";
import { useAuth } from "@/context/authContext";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  CalendarCheck2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  ChevronRight,
  Bike,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  component: OrdersHubPage,
});

function OrdersHubPage() {
  const { user } = useAuth();
  const [foodOrders, setFoodOrders] = useState<OrderWithDetails[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const custId = user?.id ?? "demo-cust-0001";
        const [orders, subs] = await Promise.all([
          orderService.listCustomerOrders(custId),
          tiffinService.listCustomerSubscriptions(custId),
        ]);
        setFoodOrders(orders);
        setSubscriptions(subs);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const toggleSubscriptionStatus = async (sub: SubscriptionWithPlan) => {
    const nextStatus = sub.status === "active" ? "paused" : "active";
    await tiffinService.updateSubscriptionStatus(sub.id, nextStatus as any);
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: nextStatus as any } : s))
    );
    toast.success(
      nextStatus === "paused"
        ? "Tiffin subscription paused temporarily."
        : "Tiffin subscription resumed successfully!"
    );
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "picked_up":
      case "out_for_delivery":
        return "bg-orange-100 text-orange-900 border-orange-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            My Orders & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track active deliveries, reorder favourite meals, and manage recurring tiffins.
          </p>
        </div>

        <Tabs defaultValue="food" className="w-full">
          <TabsList className="grid w-full max-w-sm grid-cols-2 mb-6">
            <TabsTrigger value="food" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Food Orders ({foodOrders.length})
            </TabsTrigger>
            <TabsTrigger value="tiffin" className="flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4" />
              Tiffin ({subscriptions.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: FOOD ORDERS */}
          <TabsContent value="food" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-xl border bg-card animate-pulse" />
                ))}
              </div>
            ) : foodOrders.length === 0 ? (
              <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-bold text-base">No food orders placed yet</h3>
                <p className="text-xs text-muted-foreground">Order delicious homestyle meals from nearby kitchens.</p>
                <Button asChild className="bg-orange-600 text-white">
                  <Link to="/">Browse Nearby Kitchens</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {foodOrders.map((order) => {
                  const isDelivered = order.order_status === "delivered";
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-xl border bg-card hover:border-orange-200 transition-all shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                        <div>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            Order #{order.id.slice(0, 8)}
                          </span>
                          <h3 className="font-bold text-base text-foreground">
                            {order.provider_name ?? "Home Kitchen"}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border capitalize flex items-center gap-1.5 ${getStatusColor(
                              order.order_status
                            )}`}
                          >
                            {!isDelivered && <Bike className="w-3.5 h-3.5 animate-bounce" />}
                            {ORDER_STATUS_LABEL[order.order_status] ?? order.order_status}
                          </span>
                        </div>
                      </div>

                      {/* Item list */}
                      <div className="space-y-1 text-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-muted-foreground">
                            <span>
                              {item.quantity}x {item.item_name}
                            </span>
                            <span className="font-medium text-foreground">
                              ₹{Number(item.total_price || item.unit_price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Tracking Action */}
                      <div className="flex items-center justify-between pt-2 border-t text-xs">
                        <div className="font-bold text-sm text-foreground">
                          Total: <span className="text-orange-600">₹{order.total}</span>
                        </div>

                        <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs">
                          <Link to={`/order/${order.id}` as any}>
                            {isDelivered ? "View Details" : "Live Tracking"}
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: TIFFIN SUBSCRIPTIONS */}
          <TabsContent value="tiffin" className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-36 rounded-xl border bg-card animate-pulse" />
                ))}
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
                <CalendarCheck2 className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="font-bold text-base">No active tiffin subscriptions</h3>
                <p className="text-xs text-muted-foreground">Subscribe to daily homestyle dabba from home kitchens.</p>
                <Button asChild className="bg-orange-600 text-white">
                  <Link to="/tiffin">Browse Tiffin Plans</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => {
                  const isActive = sub.status === "active";
                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-xl border bg-card hover:border-amber-200 transition-all shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                        <div>
                          <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                            {sub.plan?.frequency ?? "Monthly"} Tiffin Plan
                          </span>
                          <h3 className="font-bold text-base text-foreground">
                            {sub.plan?.name ?? "Homestyle Dabba"}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            Provided by: {sub.provider_name ?? "Aai's Gharachi Rasoi"}
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border capitalize self-start sm:self-auto ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-muted/40 p-3 rounded-lg border">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Diet Preference</span>
                          <span className="font-semibold capitalize text-foreground">{sub.meal_preference}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Next Delivery</span>
                          <span className="font-semibold text-foreground">
                            {sub.next_delivery_date ?? "Tomorrow, 1:00 PM"}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-muted-foreground block text-[11px]">Started On</span>
                          <span className="font-semibold text-foreground">{sub.start_date}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t text-xs">
                        <span className="text-muted-foreground">
                          Total: <strong className="text-foreground">₹{Number(sub.plan?.price ?? 2800)}</strong>
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSubscriptionStatus(sub)}
                          className={`text-xs ${
                            isActive
                              ? "border-amber-300 text-amber-800 hover:bg-amber-50"
                              : "border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <PauseCircle className="w-3.5 h-3.5 mr-1" /> Pause Plan
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 mr-1" /> Resume Plan
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
