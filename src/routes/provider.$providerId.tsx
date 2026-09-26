import React, { useState, useEffect } from "react";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { providerService } from "@/services/providerService";
import { menuService } from "@/services/menuService";
import { useCart } from "@/context/cartContext";
import { useLocation } from "@/context/locationContext";
import type { Provider, MenuCategory, MenuItem, Review } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  ArrowLeft,
  Flame,
  Award,
  CalendarCheck2,
  Share2,
  MessageSquarePlus,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/provider/$providerId")({
  component: ProviderStorefront,
});

function ProviderStorefront() {
  const { providerId } = useParams({ from: "/provider/$providerId" });
  const { coords } = useLocation();
  const { items, addItem, updateQuantity, setIsCartOpen } = useCart();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prov, cats, dishes, revs] = await Promise.all([
          providerService.getProvider(providerId),
          menuService.listCategories(providerId),
          menuService.listItems(providerId),
          providerService.listReviews(providerId),
        ]);

        setProvider(prov);
        setCategories(cats);
        setMenuItems(dishes);
        setReviews(revs);
      } catch (err) {
        console.error("Failed to load provider details", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [providerId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-6 border rounded-2xl bg-card">
        <h2 className="text-xl font-bold">Kitchen Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested home kitchen could not be found.</p>
        <Button asChild className="bg-orange-600 text-white">
          <Link to="/">Back to Discover</Link>
        </Button>
      </div>
    );
  }

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      toast.error("Please enter a short review.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const added = await providerService.addReview({
        providerId,
        customerName: reviewerName.trim() || "Verified Foodie",
        rating: newRating,
        review: newReviewText.trim(),
      });
      setReviews((prev) => [added, ...prev]);
      setIsReviewModalOpen(false);
      setNewReviewText("");
      setReviewerName("");
      toast.success("Thank you! Your review has been added.");
    } catch {
      toast.error("Failed to post review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const found = items.find((ci) => ci.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const filteredDishes = menuItems.filter((dish) => {
    const matchesCat = activeCategory === "all" || dish.category_id === activeCategory;
    const matchesVeg = !vegOnly || dish.is_veg;
    return matchesCat && matchesVeg;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Banner & Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-muted">
        <img
          src={provider.image_url ?? "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80"}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="absolute top-4 left-4 z-10">
          <Button asChild variant="secondary" size="sm" className="rounded-full shadow-md backdrop-blur-md bg-white/80 hover:bg-white text-xs">
            <Link to="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Link>
          </Button>
        </div>

        {/* Provider Title Info on Banner */}
        <div className="absolute bottom-6 left-4 right-4 max-w-5xl mx-auto text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {provider.is_verified && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> FSSAI Certified Home Kitchen
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium capitalize">
              {provider.provider_type.replace("_", " ")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{provider.name}</h1>
              <p className="text-xs sm:text-sm text-orange-200 mt-1">{provider.cuisine}</p>
              <p className="text-xs text-zinc-300 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                {provider.address}, {provider.city}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10 shrink-0">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="text-lg font-black text-white">{provider.rating}</span>
              </div>
              <div className="text-left border-l border-white/20 pl-2 text-[10px] text-zinc-300">
                <div>{provider.review_count} Reviews</div>
                <div className="text-emerald-400 font-semibold">Open Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Description & Tiffin Link Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-4 rounded-xl border bg-card/60 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About Kitchen</h3>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{provider.description}</p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-muted-foreground border-t">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" /> 11:30 AM - 3:30 PM, 7:00 PM - 10:30 PM
              </span>
              <span className="font-semibold text-foreground">Average: {provider.price_range}</span>
            </div>
          </div>

          {/* Tiffin Link Box */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-sm">
                <CalendarCheck2 className="w-4 h-4 text-amber-700" />
                <span>Offers Monthly Tiffin</span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Looking for regular lunch or dinner dabba? Subscribe to this kitchen's monthly meal plans.
              </p>
            </div>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs w-full">
              <Link to="/tiffin">View Tiffin Plans</Link>
            </Button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-bold text-foreground">Homestyle Menu</h2>
            <span className="text-xs text-muted-foreground">{menuItems.length} freshly prepared items</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-orange-600 text-white shadow-xs font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Dishes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-orange-600 text-white shadow-xs font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name}
              </button>
            ))}

            <div className="h-4 border-r mx-1" />

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                vegOnly
                  ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDishes.map((dish) => {
              const qty = getItemQuantity(dish.id);
              return (
                <div
                  key={dish.id}
                  className="flex gap-4 p-4 rounded-xl border bg-card hover:border-orange-200 transition-all shadow-2xs"
                >
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Veg / Non-veg indicator */}
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            (dish as any).is_veg !== false ? "bg-emerald-600" : "bg-red-600"
                          }`}
                          title={(dish as any).is_veg !== false ? "Vegetarian" : "Non-Vegetarian"}
                        />
                        <h4 className="font-bold text-sm sm:text-base text-foreground">{dish.name}</h4>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-1.5 mt-1">
                        {dish.is_best_seller && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-700" /> Best Seller
                          </span>
                        )}
                        {dish.is_todays_special && (
                          <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-900 text-[10px] font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-600" /> Today's Special
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-extrabold text-foreground">₹{Number(dish.price)}</span>

                      {/* Quantity or Add Button */}
                      {qty > 0 ? (
                        <div className="flex items-center border border-orange-500 rounded-lg bg-orange-50 px-1 py-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(dish.id, -1)}
                            className="p-1 hover:bg-orange-100 rounded text-orange-800"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-orange-950">{qty}</span>
                          <button
                            onClick={() => updateQuantity(dish.id, 1)}
                            className="p-1 hover:bg-orange-100 rounded text-orange-800"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-8 px-4 font-semibold shadow-xs"
                          onClick={() => addItem(dish, provider)}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Dish Image */}
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img
                      src={dish.image_url ?? "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80"}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Customer Experiences ({reviews.length})</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsReviewModalOpen(true)}
              className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" /> Write a Review
            </Button>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center border rounded-xl bg-card/40 space-y-2">
              <Star className="w-8 h-8 text-amber-400 mx-auto fill-amber-100" />
              <p className="text-sm font-semibold text-foreground">Be the first to review this kitchen!</p>
              <p className="text-xs text-muted-foreground">Share your culinary experience with the neighborhood.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">{r.customer_name ?? "Verified Customer"}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{r.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">"{r.review}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review Dialog */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">Share Your Experience</DialogTitle>
              <DialogDescription className="text-xs">
                Reviewing {provider.name}. Your honest feedback helps home chefs and hungry neighbors!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Your Name</label>
                <Input
                  placeholder="e.g. Aarav Sharma"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 rounded hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating
                            ? "fill-amber-400 text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-700 ml-2">{newRating} of 5 Stars</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Your Review</label>
                <textarea
                  rows={3}
                  placeholder="Describe the taste, freshness, spice level, and packaging..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingReview}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isSubmittingReview ? "Posting..." : "Publish Review"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
