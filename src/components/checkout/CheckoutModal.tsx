import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";
import { DEMO_ADDRESSES } from "@/data/seedData";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, provider, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"details" | "processing" | "success">("details");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(DEMO_ADDRESSES[0]?.id ?? "addr-1");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const selectedAddress = DEMO_ADDRESSES.find((a) => a.id === selectedAddressId) ?? DEMO_ADDRESSES[0];

  const handlePlaceOrder = async () => {
    if (!provider || items.length === 0) return;

    setStep("processing");

    try {
      // 1. Charge via simulated payment service
      const paymentRes = await paymentService.charge({
        userId: user?.id ?? "demo-cust-0001",
        amount: total,
        method: paymentMethod,
      });

      // 2. Persist order in Supabase / Demo state
      const order = await orderService.createOrder({
        customerId: user?.id ?? "demo-cust-0001",
        providerId: provider.id,
        addressId: selectedAddress?.id ?? "addr-1",
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        items: items.map((i) => ({
          menuItemId: i.item.id,
          name: i.item.name,
          quantity: i.quantity,
          unitPrice: Number(i.item.price),
        })),
      });

      setCreatedOrderId(order.id);
      setStep("success");
      clearCart();
      toast.success("Order confirmed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process order. Please try again.");
      setStep("details");
    }
  };

  const handleTrackOrder = () => {
    setIsCheckoutOpen(false);
    setStep("details");
    if (createdOrderId) {
      router.navigate({ to: `/order/${createdOrderId}` as any });
    } else {
      router.navigate({ to: "/orders" as any });
    }
  };

  return (
    <Dialog
      open={isCheckoutOpen}
      onOpenChange={(open) => {
        if (step !== "processing") setIsCheckoutOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {step === "details" && (
          <>
            <DialogHeader className="p-5 border-b bg-muted/20">
              <DialogTitle className="text-xl flex items-center justify-between">
                <span>Checkout</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Checkout
                </span>
              </DialogTitle>
              <DialogDescription>
                Confirm your delivery address and simulated payment details.
              </DialogDescription>
            </DialogHeader>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Delivery Address */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-600" /> Delivery Address
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {DEMO_ADDRESSES.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/50 shadow-xs"
                            : "border-border hover:border-orange-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-foreground uppercase">{addr.label}</span>
                          {addr.is_default && (
                            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{addr.address_line}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {addr.city}, {addr.pincode}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order Summary ({items.length} dishes from {provider?.name})
                </div>
                <div className="space-y-1 text-xs">
                  {items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-foreground">
                        {quantity}x {item.name}
                      </span>
                      <span className="font-medium">₹{Number(item.price) * quantity}</span>
                    </div>
                  ))}
                  <Separator className="my-1" />
                  <div className="flex justify-between font-bold text-sm text-foreground pt-1">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-orange-600" /> Payment Method (Simulated for SIH)
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                      paymentMethod === "upi"
                        ? "border-orange-500 bg-orange-50/80 text-orange-950 font-semibold"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-orange-600" />
                    <span>UPI / QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50/80 text-orange-950 font-semibold"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-orange-500 bg-orange-50/80 text-orange-950 font-semibold"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Lock className="w-4 h-4 text-orange-600" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                      paymentMethod === "cod"
                        ? "border-orange-500 bg-orange-50/80 text-orange-950 font-semibold"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-orange-600" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded bg-blue-50 border border-blue-200 text-[11px] text-blue-800">
                  <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Simulated gateway: no real card or bank funds are debited. Supabase records the transaction instantly.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Total Payable</span>
                <span className="text-lg font-bold text-foreground">₹{total}</span>
              </div>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-5 shadow-md"
                onClick={handlePlaceOrder}
              >
                Place Order & Pay
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Processing Simulated Payment...</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Authorizing order with {provider?.name} and notifying delivery fleet.
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Order Confirmed!</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Your order has been sent to{" "}
                <span className="font-semibold text-foreground">{provider?.name}</span>. The kitchen is preparing your homestyle feast!
              </p>
              {createdOrderId && (
                <div className="inline-block mt-2 px-3 py-1 bg-muted rounded font-mono text-xs text-muted-foreground">
                  Order ID: {createdOrderId}
                </div>
              )}
            </div>

            <div className="w-full space-y-2 pt-2">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 shadow-md"
                onClick={handleTrackOrder}
              >
                Track Live Order Status
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep("details");
                }}
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
