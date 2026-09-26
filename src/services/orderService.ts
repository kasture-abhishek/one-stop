import { supabase } from "@/integrations/supabase/client";
import type { Order, OrderItem, Delivery, OrderStatus } from "@/types/db";
import { DEMO_SAMPLE_ORDERS, SEED_PROVIDERS } from "@/data/seedData";

export type OrderWithDetails = Order & {
  items: OrderItem[];
  delivery?: Delivery | null;
  provider_name?: string | null;
  provider_image?: string | null;
};

// Local storage key for demo orders persistence across reloads
const LOCAL_ORDERS_KEY = "onestop_demo_orders";

function getLocalOrders(): OrderWithDetails[] {
  if (typeof window === "undefined") return DEMO_SAMPLE_ORDERS as any;
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(DEMO_SAMPLE_ORDERS));
      return DEMO_SAMPLE_ORDERS as any;
    }
    return JSON.parse(data);
  } catch {
    return DEMO_SAMPLE_ORDERS as any;
  }
}

function saveLocalOrders(orders: OrderWithDetails[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn("Failed to save local orders", e);
    }
  }
}

export const orderService = {
  async createOrder(params: {
    customerId: string;
    providerId: string;
    addressId: string;
    items: { menuItemId: string; name: string; quantity: number; unitPrice: number }[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod?: string;
  }): Promise<OrderWithDetails> {
    const provider = SEED_PROVIDERS.find((p) => p.id === params.providerId);
    
    // Try Supabase first
    try {
      const validUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const safeCustomerId = validUuidRegex.test(params.customerId)
        ? params.customerId
        : "00000000-0000-0000-0000-000000000099";
      const safeAddressId = validUuidRegex.test(params.addressId)
        ? params.addressId
        : null;

      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_id: safeCustomerId,
          provider_id: params.providerId,
          address_id: safeAddressId,
          subtotal: params.subtotal,
          delivery_fee: params.deliveryFee,
          total: params.total,
          order_status: "confirmed",
          payment_status: "paid",
        })
        .select()
        .single();

      if (!orderErr && orderData) {
        // Insert items
        const itemRows = params.items.map((i) => ({
          order_id: orderData.id,
          menu_item_id: validUuidRegex.test(i.menuItemId) ? i.menuItemId : null,
          item_name: i.name,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          total_price: i.unitPrice * i.quantity,
        }));
        await supabase.from("order_items").insert(itemRows);

        // Insert initial delivery record
        const { data: deliveryData } = await supabase
          .from("deliveries")
          .insert({
            order_id: orderData.id,
            delivery_status: "pending",
            estimated_time: "25 - 35 mins",
          })
          .select()
          .single();

        return {
          ...orderData,
          items: itemRows as any,
          delivery: deliveryData,
          provider_name: provider?.name ?? "Home Kitchen",
          provider_image: provider?.image_url ?? null,
        };
      }
    } catch (e) {
      console.warn("Supabase order creation falling back to high-fidelity demo state:", e);
    }

    // High fidelity fallback
    const newId = `ord-${Date.now().toString(36)}`;
    const newOrder: OrderWithDetails = {
      id: newId,
      customer_id: params.customerId,
      provider_id: params.providerId,
      address_id: params.addressId,
      subtotal: params.subtotal,
      delivery_fee: params.deliveryFee,
      total: params.total,
      payment_status: "paid",
      order_status: "confirmed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider_name: provider?.name ?? "Aai's Gharachi Rasoi",
      provider_image: provider?.image_url ?? "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
      items: params.items.map((i, idx) => ({
        id: `item-${idx}-${Date.now()}`,
        order_id: newId,
        menu_item_id: i.menuItemId,
        item_name: i.name,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        total_price: i.unitPrice * i.quantity,
        created_at: new Date().toISOString(),
      })),
      delivery: {
        id: `del-${newId}`,
        order_id: newId,
        delivery_status: "pending",
        estimated_time: "25 - 35 mins",
        picked_up_at: null,
        delivered_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    const current = getLocalOrders();
    saveLocalOrders([newOrder, ...current]);
    return newOrder;
  },

  async getOrder(orderId: string): Promise<OrderWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*),
          deliveries (*),
          providers (name, image_url)
        `)
        .eq("id", orderId)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          items: (data as any).order_items ?? [],
          delivery: (data as any).deliveries?.[0] ?? null,
          provider_name: (data as any).providers?.name ?? null,
          provider_image: (data as any).providers?.image_url ?? null,
        };
      }
    } catch {
      // Fallback below
    }

    const local = getLocalOrders();
    return local.find((o) => o.id === orderId) ?? null;
  },

  async listCustomerOrders(customerId: string): Promise<OrderWithDetails[]> {
    try {
      const validUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const safeCustId = validUuidRegex.test(customerId)
        ? customerId
        : "00000000-0000-0000-0000-000000000099";

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*),
          deliveries (*),
          providers (name, image_url)
        `)
        .eq("customer_id", safeCustId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          ...d,
          items: d.order_items ?? [],
          delivery: d.deliveries?.[0] ?? null,
          provider_name: d.providers?.name ?? null,
          provider_image: d.providers?.image_url ?? null,
        }));
      }
    } catch {
      // fallback
    }

    return getLocalOrders();
  },

  async listProviderOrders(providerId: string): Promise<OrderWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*),
          deliveries (*)
        `)
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          ...d,
          items: d.order_items ?? [],
          delivery: d.deliveries?.[0] ?? null,
        }));
      }
    } catch {
      // fallback
    }

    const local = getLocalOrders();
    return local.filter((o) => o.provider_id === providerId || o.provider_id === "11111111-1111-1111-1111-111111111111");
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      await supabase
        .from("orders")
        .update({ order_status: status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (status === "delivered") {
        await supabase
          .from("deliveries")
          .update({ delivery_status: "delivered", delivered_at: new Date().toISOString() })
          .eq("order_id", orderId);
      } else if (status === "picked_up" || status === "out_for_delivery") {
        await supabase
          .from("deliveries")
          .update({ delivery_status: "out_for_delivery", picked_up_at: new Date().toISOString() })
          .eq("order_id", orderId);
      }
    } catch {
      // Update local storage
    }

    const local = getLocalOrders();
    const target = local.find((o) => o.id === orderId);
    if (target) {
      target.order_status = status;
      target.updated_at = new Date().toISOString();
      if (target.delivery) {
        if (status === "delivered") {
          target.delivery.delivery_status = "delivered";
          target.delivery.delivered_at = new Date().toISOString();
        } else if (status === "out_for_delivery" || status === "picked_up") {
          target.delivery.delivery_status = "out_for_delivery";
          target.delivery.picked_up_at = new Date().toISOString();
        }
      }
      saveLocalOrders([...local]);
    }
  },
};
