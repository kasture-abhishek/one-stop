import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/context/cartContext";
import { Utensils } from "lucide-react";

export const CartConflictDialog: React.FC = () => {
  const { pendingConflict, resolveConflict, provider } = useCart();

  if (!pendingConflict) return null;

  return (
    <AlertDialog open={!!pendingConflict} onOpenChange={(open) => !open && resolveConflict(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-2">
            <Utensils className="h-6 w-6" />
          </div>
          <AlertDialogTitle className="text-center">Replace items already in cart?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your cart already contains delicious food from <span className="font-semibold text-foreground">{provider?.name}</span>.
            Ordering from multiple kitchens in a single order is not supported.
            <br className="my-2" />
            Would you like to discard your previous cart and add items from <span className="font-semibold text-foreground">{pendingConflict.provider.name}</span> instead?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel onClick={() => resolveConflict(false)}>Keep Existing Cart</AlertDialogCancel>
          <AlertDialogAction
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => resolveConflict(true)}
          >
            Yes, Start New Cart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
