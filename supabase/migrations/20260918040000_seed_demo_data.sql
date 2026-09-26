ṇ-- ============================================================
-- ONE STOP – Demo Seed Data (Phase 1)
-- Mirrors src/data/seedData.ts so the app uses real Supabase
-- data instead of localStorage fallback.
-- Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

-- ─── PROVIDERS ───────────────────────────────────────────────
INSERT INTO public.providers (id, name, description, provider_type, cuisine, image_url, rating, review_count, latitude, longitude, address, city, price_range, is_open, is_verified, owner_id)
VALUES
  (
    'p1111111-1111-1111-1111-111111111111',
    'Aai''s Gharachi Rasoi',
    'Authentic homestyle Maharashtrian meals cooked with motherly love. Pure spices, fresh bhakri, and comforting poli bhaji.',
    'home_kitchen', 'Maharashtrian, Homestyle, Thali',
    'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    4.9, 142, 18.5085, 73.8090,
    'B-402, Shivshankar Niwas, Mayur Colony, Kothrud', 'Pune',
    '₹80 - ₹180', true, true,
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'p2222222-2222-2222-2222-222222222222',
    'Desi Tiffin Hub',
    'Wholesome corporate and student dabba service. Balanced nutrition with daily rotating seasonal sabzis and warm rotis.',
    'home_kitchen', 'North Indian, Punjabi, Healthy',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    4.8, 98, 18.5020, 73.8050,
    'Shop 12, Guruprasad Complex, Paud Road', 'Pune',
    '₹90 - ₹220', true, true,
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    'p3333333-3333-3333-3333-333333333333',
    'Dakshin Delights & Tiffins',
    'Authentic South Indian filter coffee, crispy ghee roasts, steamed idlis, and traditional Tamil-style lunch sadhya.',
    'restaurant', 'South Indian, Coastal, Breakfast',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    4.7, 215, 18.5120, 73.8130,
    'Near Karve Statue, Kothrud', 'Pune',
    '₹60 - ₹160', true, true,
    '00000000-0000-0000-0000-000000000003'
  ),
  (
    'p4444444-4444-4444-4444-444444444444',
    'Rasoi Magic by Neeta',
    'Pure Jain and Gujarati satvik bhojan. Zero onion, zero garlic options prepared in a spotless vegetarian home kitchen.',
    'home_kitchen', 'Gujarati, Jain, Vegetarian',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    4.9, 86, 18.5140, 73.8020,
    'Flat 101, Shanti Niketan, Dahanukar Colony', 'Pune',
    '₹100 - ₹240', true, true,
    '00000000-0000-0000-0000-000000000004'
  ),
  (
    'p5555555-5555-5555-5555-555555555555',
    'Maa Ki Dal & Paratha Co.',
    'Rich Dal Makhani slow-cooked overnight, stuffed Amritsari parathas, and homestyle Rajma Chawal with mint chutney.',
    'home_kitchen', 'Punjabi, North Indian, Comfort',
    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80',
    4.6, 174, 18.5190, 73.8180,
    'Sector 3, Rambaug Colony, Kothrud', 'Pune',
    '₹90 - ₹210', true, true,
    '00000000-0000-0000-0000-000000000005'
  ),
  (
    'p6666666-6666-6666-6666-666666666666',
    'The Healthy Bowl & Millet Kitchen',
    'Nutritionist-curated diabetic-friendly bowls, foxtail millet khichdi, high-protein sprout salads, and cold pressed juices.',
    'home_baker', 'Healthy, Fitness, Salads',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    4.8, 64, 18.5010, 73.8120,
    'Plot 18, Vanaz Corner, Kothrud', 'Pune',
    '₹120 - ₹260', true, true,
    '00000000-0000-0000-0000-000000000006'
  ),
  (
    'p7777777-7777-7777-7777-777777777777',
    'Sweet N Crumbs Bakery',
    'Eggless artisanal cakes, festive besan laddoos, homemade nankhatai, and customized celebrations baked fresh to order.',
    'cake_vendor', 'Bakery, Desserts, Sweets',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    4.9, 112, 18.5050, 73.8030,
    'Row House 4, Ideal Colony, Kothrud', 'Pune',
    '₹150 - ₹500', true, true,
    '00000000-0000-0000-0000-000000000007'
  ),
  (
    'p8888888-8888-8888-8888-888888888888',
    'Coastal Spice House',
    'Flavourful Malvani and Konkani home specials: Sol Kadhi, Surmai Rava Fry, spicy kombdi vade, and steamed rice.',
    'home_kitchen', 'Malvani, Konkani, Seafood',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    4.7, 89, 18.5160, 73.8210,
    'Near Cummins College, Karve Nagar', 'Pune',
    '₹140 - ₹320', true, true,
    '00000000-0000-0000-0000-000000000008'
  )
ON CONFLICT (id) DO NOTHING;


-- ─── MENU CATEGORIES ─────────────────────────────────────────
INSERT INTO public.menu_categories (id, provider_id, name, sort_order)
VALUES
  ('cat-1', 'p1111111-1111-1111-1111-111111111111', 'Special Thalis',       1),
  ('cat-2', 'p1111111-1111-1111-1111-111111111111', 'Bhakri & Poli Combos', 2),
  ('cat-3', 'p1111111-1111-1111-1111-111111111111', 'Snacks & Sweets',      3),
  ('cat-4', 'p2222222-2222-2222-2222-222222222222', 'Daily Dabba Specials', 1),
  ('cat-5', 'p2222222-2222-2222-2222-222222222222', 'Parathas & Curd',      2),
  ('cat-6', 'p3333333-3333-3333-3333-333333333333', 'Tiffin & Breakfast',   1),
  ('cat-7', 'p3333333-3333-3333-3333-333333333333', 'South Indian Sadhya',  2)
ON CONFLICT (id) DO NOTHING;


-- ─── MENU ITEMS ──────────────────────────────────────────────
INSERT INTO public.menu_items (id, provider_id, category_id, name, description, price, image_url, is_available, is_best_seller, is_todays_special, is_veg)
VALUES
  ('m1', 'p1111111-1111-1111-1111-111111111111', 'cat-1',
   'Special Puran Poli Thali',
   '2 Hot Ghee Puran Polis, Katachi Amti, Matki Usal, 2 Phulkas, Indrayani Rice, Koshimbir & Papad.',
   180, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80',
   true, true, true, true),

  ('m2', 'p1111111-1111-1111-1111-111111111111', 'cat-1',
   'Daily Homestyle Veg Thali',
   'Seasonal Sukhi Bhaji, Dal Tadka, 3 Chapati with fresh ghee, Steamed Rice, Pickle & Salad.',
   130, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
   true, true, false, true),

  ('m3', 'p1111111-1111-1111-1111-111111111111', 'cat-2',
   'Jowar Bhakri with Pithla & Thecha',
   '2 Freshly made warm Jowar Bhakris, hot Besan Pithla, pungent green chilli thecha, and raw onion.',
   110, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
   true, false, true, true),

  ('m4', 'p1111111-1111-1111-1111-111111111111', 'cat-2',
   'Bharli Vangi (Stuffed Brinjal) Combo',
   'Traditional spicy peanut gravy stuffed baby eggplants with 3 fresh wheat rotis.',
   120, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
   true, false, false, true),

  ('m5', 'p1111111-1111-1111-1111-111111111111', 'cat-3',
   'Ukadiche Modak (Pack of 2)',
   'Steamed rice flour dumplings filled with grated fresh coconut, organic jaggery, and cardamom with pure desi ghee drizzle.',
   90, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=500&q=80',
   true, true, true, true),

  ('m6', 'p2222222-2222-2222-2222-222222222222', 'cat-4',
   'Deluxe Punjabi Dabba Meal',
   'Paneer Butter Masala, Slow-cooked Yellow Dal Tadka, Jeera Rice, 4 Butter Phulkas, Boondi Raita & Gulab Jamun.',
   170, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80',
   true, true, true, true),

  ('m7', 'p2222222-2222-2222-2222-222222222222', 'cat-4',
   'Standard Student Mini Dabba',
   'Seasonal Aloo Gobi / Bhindi, Homestyle Dal, 3 Rotis, Steamed Basmati Rice & Pickle.',
   99, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
   true, true, false, true),

  ('m8', 'p2222222-2222-2222-2222-222222222222', 'cat-5',
   'Amritsari Aloo Pyaaz Paratha (2 Pcs)',
   'Served hot with homemade white butter, fresh curd, and mixed mango pickle.',
   110, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=80',
   true, false, true, true),

  ('m9', 'p3333333-3333-3333-3333-333333333333', 'cat-6',
   'Crispy Ghee Podi Masala Dosa',
   'Golden rice crepe smeared with fragrant gun powder podi, spiced potato masala, coconut chutney & hot sambar.',
   120, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
   true, true, true, true),

  ('m10', 'p3333333-3333-3333-3333-333333333333', 'cat-6',
   'Steamed Button Idli Vada Combo',
   '4 Melt-in-mouth steamed idlis and 1 crispy medu vada with hot drumstick sambar and tomato chutney.',
   85, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
   true, false, false, true),

  ('m11', 'p3333333-3333-3333-3333-333333333333', 'cat-7',
   'Traditional Tamil Sadhya Lunch Box',
   'Sona Masoori Rice, Poriyal, Avial, Pepper Rasam, Sambar, Appalam & Sweet Payasam.',
   160, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80',
   true, true, true, true)

ON CONFLICT (id) DO NOTHING;


-- ─── TIFFIN PLANS ────────────────────────────────────────────
INSERT INTO public.tiffin_plans (id, provider_id, name, description, frequency, price, meals_per_day, delivery_area, is_active)
VALUES
  ('plan-1', 'p1111111-1111-1111-1111-111111111111',
   'Aai''s Monthly Maharashtrian Dabba',
   'Nutritious homestyle lunch delivered warm every weekday. 2 Sabzis (1 dry + 1 gravy), 4 Wheat Chapati, Dal, Indrayani Rice & Salad.',
   'monthly', 2800, 1,
   'Kothrud, Karve Nagar, Erandwane, Deccan (within 5 km)',
   true),

  ('plan-2', 'p1111111-1111-1111-1111-111111111111',
   'Weekly Homestyle Trial Plan',
   'Test out authentic home cooking for 6 consecutive days. Perfect for newcomers and visiting professionals.',
   'weekly', 750, 1,
   'Kothrud, Karve Nagar, Deccan',
   true),

  ('plan-3', 'p2222222-2222-2222-2222-222222222222',
   'Executive Twin Meal Monthly (Lunch + Dinner)',
   'Complete daily nutrition for working professionals and students. Hot lunch at 1:00 PM and fresh dinner at 8:00 PM.',
   'monthly', 4900, 2,
   'Paud Road, Kothrud, Viman Nagar, Baner',
   true),

  ('plan-4', 'p2222222-2222-2222-2222-222222222222',
   'Daily Flexi Meal Box',
   'Order day-to-day when you need lunch without binding commitments. Book before 10:30 AM for 1:00 PM delivery.',
   'daily', 110, 1,
   'Kothrud, Paud Road',
   true),

  ('plan-5', 'p4444444-4444-4444-4444-444444444444',
   'Satvik Jain Monthly Bhojan',
   'Strictly vegetarian, root-vegetable free, pure sattvic meals cooked in ghee and groundnut oil.',
   'monthly', 3100, 1,
   'Kothrud, Dahanukar Colony, Erandwane',
   true),

  ('plan-6', 'p6666666-6666-6666-6666-666666666666',
   'High-Protein Fitness Monthly Tiffin',
   'Calorie-tracked balanced meals with paneer/soya/egg options, millet rotis, green salad & lentils.',
   'monthly', 4200, 1,
   'All Pune Core Areas',
   true)

ON CONFLICT (id) DO NOTHING;
