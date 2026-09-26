import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
type E = Database["public"]["Enums"];

export type Profile = T["profiles"]["Row"];
export type Address = T["addresses"]["Row"];
export type Provider = T["providers"]["Row"];
export type MenuCategory = T["menu_categories"]["Row"];
export type MenuItem = T["menu_items"]["Row"];
export type TiffinPlan = T["tiffin_plans"]["Row"];
export type TiffinSubscription = T["tiffin_subscriptions"]["Row"];
export type Order = T["orders"]["Row"];
export type OrderItem = T["order_items"]["Row"];
export type Delivery = T["deliveries"]["Row"];
export type Review = T["ratings_reviews"]["Row"];
export type Notification = T["notifications"]["Row"];

export type AppRole = E["app_role"];
export type ProviderType = E["provider_type"];
export type OrderStatus = E["order_status"];
export type PaymentStatus = E["payment_status"];
export type TiffinFrequency = E["tiffin_frequency"];
export type SubscriptionStatus = E["subscription_status"];

export type ProviderWithDistance = Provider & { distanceKm: number | null };

export const PROVIDER_TYPE_LABEL: Record<ProviderType, string> = {
  home_kitchen: "Home Kitchen",
  restaurant: "Restaurant",
  cake_vendor: "Cake Vendor",
  home_baker: "Home Baker",
  local_business: "Local Business",
};

export const ORDER_FLOW: OrderStatus[] = [
  "confirmed",
  "preparing",
  "picked_up",
  "out_for_delivery",
  "delivered",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  picked_up: "Picked Up",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
