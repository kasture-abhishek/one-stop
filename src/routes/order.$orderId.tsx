import React, { useState, useEffect } from "react";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { orderService, type OrderWithDetails } from "@/services/orderService";
import { ORDER_FLOW, ORDER_STATUS_LABEL, type OrderStatus } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  PackageCheck,
  MapPin,
  Phone,
  ShieldCheck,
  FastForward,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/order/$orderId")({
  component: LiveOrderTrackingPage,
});

function LiveOrderTrackingPage() {
  const { orderId } = useParams({ from: "/order/$orderId" });
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 5s for realtime updates
    const timer = setInterval(fetchOrder, 5000);
    return () => clearInterval(timer);
  }, [orderId]);

  const advanceDemoStatus = async () => {
    if (!order) return;
    const currentIdx = ORDER_FLOW.indexOf(order.order_status);
    if (currentIdx < ORDER_FLOW.length - 1) {
      const nextStatus = ORDER_FLOW[currentIdx + 1];
      if (nextStatus) {
        await orderService.updateOrderStatus(order.id, nextStatus);
        setOrder((prev) => (prev ? { ...prev, order_status: nextStatus } : null));
        toast.success(`Advanced status to: ${ORDER_STATUS_LABEL[nextStatus]}`);
      }
    } else {
      toast.info("Order is already marked as Delivered.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-4">
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-6 border rounded-2xl bg-card">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-xs text-muted-foreground">The order could not be located in the database.</p>
        <Button asChild className="bg-orange-600 text-white">
          <Link to="/orders">Go to Orders</Link>
        </Button>
      </div>
    );
  }

  const currentStepIndex = ORDER_FLOW.indexOf(order.order_status);

  const timelineSteps = [
    { key: "confirmed", title: "Order Confirmed", desc: "Kitchen accepted", icon: CheckCircle2 },
    { key: "preparing", title: "Preparing Food", desc: "Cooking fresh on stove", icon: ChefHat },
    { key: "picked_up", title: "Order Picked Up", desc: "Handed to rider", icon: PackageCheck },
    { key: "out_for_delivery", title: "Out for Delivery", desc: "Rider is nearby", icon: Bike },
    { key: "delivered", title: "Delivered", desc: "Enjoy your homestyle meal!", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Breadcrumb & SIH Demo Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="rounded-full h-8 px-2.5">
              <Link to="/orders">
                <ArrowLeft className="w-4 h-4 mr-1" /> Orders
              </Link>
            </Button>
            <div>
              <span className="text-[11px] text-muted-foreground font-mono">ID: #{order.id.slice(0, 8)}</span>
              <h1 className="text-lg font-bold text-foreground">Live Delivery Tracking</h1>
            </div>
          </div>

          {/* SIH Judge Demo Shortcut */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={advanceDemoStatus}
              className="border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-semibold h-8"
              disabled={order.order_status === "delivered"}
            >
              <FastForward className="w-3.5 h-3.5 mr-1 text-orange-600" />
              Simulate Next Status (Judge Demo)
            </Button>
          </div>
        </div>

        {/* Status Card & ETA */}
        <div className="p-6 rounded-2xl border bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-card space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                {order.order_status === "delivered" ? "Delivered at your door" : "Estimated Arrival"}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                {order.order_status === "delivered" ? "Order Completed" : "20 - 30 Minutes"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ordering from <span className="font-bold text-foreground">{order.provider_name ?? "Home Kitchen"}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border shadow-xs self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <span className="text-muted-foreground block text-[10px]">Delivery OTP</span>
                <span className="font-mono font-black text-foreground tracking-widest text-sm">4829</span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pt-2">
            <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-muted z-0">
              <div
                className="h-full bg-orange-600 transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIndex) / (timelineSteps.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isPassed
                          ? "bg-orange-600 text-white shadow-sm"
                          : "bg-muted text-muted-foreground border"
                      } ${isCurrent ? "ring-4 ring-orange-100 ring-offset-1" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="text-left sm:text-center">
                      <div className={`text-xs font-bold ${isPassed ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Partner Details Simulation */}
        <div className="p-4 rounded-xl border bg-card flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Hyperlocal Fleet Partner
              </div>
              <div className="font-bold text-sm text-foreground">Ramesh Shinde (Eco EV Fleet)</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>⭐ 4.9 Rating</span>
                <span>•</span>
                <span>Electric Two-Wheeler</span>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
            <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Call
          </Button>
        </div>

        {/* Order Details & Items Card */}
        <div className="p-5 rounded-xl border bg-card space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Items</div>

          <div className="space-y-2 text-xs divide-y divide-border/40">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between pt-2 first:pt-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{item.quantity}x</span>
                  <span className="text-foreground">{item.item_name}</span>
                </div>
                <span className="font-semibold text-foreground">
                  ₹{Number(item.total_price || item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Item Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₹{order.delivery_fee}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Packaging & Taxes</span>
              <span>₹15</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t">
              <span>Total Paid</span>
              <span className="text-orange-600">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
