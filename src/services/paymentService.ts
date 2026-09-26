import { supabase } from "@/integrations/supabase/client";

export type PaymentRequest = {
  userId: string;
  amount: number;
  orderId?: string;
  subscriptionId?: string;
  method?: string;
};

export type PaymentResult = {
  success: boolean;
  reference: string;
  simulated: boolean;
};

/**
 * Payment abstraction. The MVP uses a simulated gateway — no real money moves.
 * A Razorpay/Cashfree implementation can replace `charge` without touching callers.
 */
export const paymentService = {
  isSimulated: true,

  async charge(req: PaymentRequest): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 900));
    const reference = `SIM-${Date.now().toString(36).toUpperCase()}`;
    await supabase.from("payments").insert({
      user_id: req.userId,
      order_id: req.orderId ?? null,
      subscription_id: req.subscriptionId ?? null,
      amount: req.amount,
      method: req.method ?? "simulated",
      status: "paid",
      reference,
    });
    return { success: true, reference, simulated: true };
  },
};
