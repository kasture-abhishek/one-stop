import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cartContext";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Bike } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    provider,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    packagingFee,
    total,
    setIsCheckoutOpen,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              Your Cart
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                onClick={clearCart}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
          {provider && (
            <SheetDescription className="text-left text-xs text-muted-foreground">
              Ordering freshly made homestyle food from{" "}
              <span className="font-semibold text-foreground">{provider.name}</span>
            </SheetDescription>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-foreground">Your cart is empty</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Good food is always cooking nearby! Explore local kitchens and authentic tiffin meals.
              </p>
            </div>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white mt-2"
              onClick={() => setIsCartOpen(false)}
            >
              Browse Nearby Kitchens
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/60 shadow-xs"
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          (item as any).is_veg !== false ? "bg-emerald-600" : "bg-red-600"
                        }`}
                        title={(item as any).is_veg !== false ? "Vegetarian" : "Non-Vegetarian"}
                      />
                      <span className="font-medium text-sm line-clamp-1">{item.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                      ₹{Number(item.price)} each
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border rounded-md bg-background px-1 py-0.5 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-muted rounded text-orange-600 hover:text-orange-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-14 text-right font-semibold text-sm">
                      ₹{Number(item.price) * quantity}
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
                <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hot & fresh homestyle packaging guaranteed within 30-40 mins.</span>
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-4 border-t bg-muted/20 space-y-2.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Eco-friendly Packaging</span>
                  <span>₹{packagingFee}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>To Pay</span>
                  <span className="text-orange-600 text-base">₹{total}</span>
                </div>
              </div>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-5 text-sm shadow-md"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
