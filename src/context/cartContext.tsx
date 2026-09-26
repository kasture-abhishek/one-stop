import React, { createContext, useContext, useEffect, useState } from "react";
import type { MenuItem, Provider } from "@/types/db";
import { DELIVERY_FEE } from "@/config/features";
import { toast } from "sonner";

export type CartItem = {
  item: MenuItem;
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  provider: Provider | null;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  addItem: (item: MenuItem, provider: Provider) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  pendingConflict: { item: MenuItem; provider: Provider } | null;
  resolveConflict: (replace: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = "onestop_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingConflict, setPendingConflict] = useState<{ item: MenuItem; provider: Provider } | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.items && parsed.provider) {
          setItems(parsed.items);
          setProvider(parsed.provider);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (items.length === 0) {
        localStorage.removeItem(LOCAL_CART_KEY);
      } else {
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify({ items, provider }));
      }
    } catch {
      // ignore
    }
  }, [items, provider]);

  const addItem = (item: MenuItem, itemProvider: Provider) => {
    // Check if cart has items from another provider
    if (provider && provider.id !== itemProvider.id && items.length > 0) {
      setPendingConflict({ item, provider: itemProvider });
      return;
    }

    setProvider(itemProvider);
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) => (ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`Added "${item.name}" to cart`);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const next = prev.filter((ci) => ci.item.id !== itemId);
      if (next.length === 0) setProvider(null);
      return next;
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      const next = prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const q = ci.quantity + delta;
            return q > 0 ? { ...ci, quantity: q } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];

      if (next.length === 0) setProvider(null);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    setProvider(null);
    localStorage.removeItem(LOCAL_CART_KEY);
  };

  const resolveConflict = (replace: boolean) => {
    if (replace && pendingConflict) {
      setProvider(pendingConflict.provider);
      setItems([{ item: pendingConflict.item, quantity: 1 }]);
      toast.info(`Cart replaced with items from ${pendingConflict.provider.name}`);
    }
    setPendingConflict(null);
  };

  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = items.reduce((sum, ci) => sum + Number(ci.item.price) * ci.quantity, 0);
  const packagingFee = items.length > 0 ? 15 : 0;
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + packagingFee + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        provider,
        itemCount,
        subtotal,
        deliveryFee,
        packagingFee,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        pendingConflict,
        resolveConflict,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
