-- ENUMS
CREATE TYPE public.app_role AS ENUM ('customer','provider','driver','admin');
CREATE TYPE public.provider_type AS ENUM ('home_kitchen','restaurant','cake_vendor','home_baker','local_business');
CREATE TYPE public.tiffin_frequency AS ENUM ('daily','weekly','monthly');
CREATE TYPE public.subscription_status AS ENUM ('active','paused','cancelled','completed');
CREATE TYPE public.order_status AS ENUM ('confirmed','preparing','picked_up','out_for_delivery','delivered','cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded');
CREATE TYPE public.delivery_status AS ENUM ('pending','assigned','picked_up','out_for_delivery','delivered','cancelled');

-- UPDATED_AT TRIGGER FN
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  role public.app_role NOT NULL DEFAULT 'customer',
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- USER ROLES (authoritative)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- new user handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _role public.app_role;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'customer');
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'phone', _role)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_insert_self_nonadmin" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND role <> 'admin');

-- ADDRESSES
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'Home',
  address_line TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "addresses_own" ON public.addresses FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- PROVIDERS
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  provider_type public.provider_type NOT NULL DEFAULT 'home_kitchen',
  cuisine TEXT,
  image_url TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  city TEXT,
  price_range TEXT,
  is_open BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.providers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "providers_public_read" ON public.providers FOR SELECT USING (true);
CREATE POLICY "providers_owner_insert" ON public.providers FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "providers_owner_update" ON public.providers FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "providers_owner_delete" ON public.providers FOR DELETE TO authenticated USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.owns_provider(_provider_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.providers p WHERE p.id = _provider_id AND p.owner_id = auth.uid());
$$;

-- MENU CATEGORIES
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu_categories_public_read" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "menu_categories_owner_write" ON public.menu_categories FOR ALL TO authenticated
  USING (public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));

-- MENU ITEMS
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_todays_special BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "menu_items_public_read" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_owner_write" ON public.menu_items FOR ALL TO authenticated
  USING (public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));

-- TIFFIN PLANS
CREATE TABLE public.tiffin_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency public.tiffin_frequency NOT NULL DEFAULT 'monthly',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  meals_per_day INTEGER NOT NULL DEFAULT 1,
  delivery_area TEXT,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tiffin_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tiffin_plans TO authenticated;
GRANT ALL ON public.tiffin_plans TO service_role;
ALTER TABLE public.tiffin_plans ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tiffin_plans_updated BEFORE UPDATE ON public.tiffin_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "tiffin_plans_public_read" ON public.tiffin_plans FOR SELECT USING (true);
CREATE POLICY "tiffin_plans_owner_write" ON public.tiffin_plans FOR ALL TO authenticated
  USING (public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));

-- TIFFIN SUBSCRIPTIONS
CREATE TABLE public.tiffin_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.tiffin_plans(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_preference TEXT NOT NULL DEFAULT 'veg',
  delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  status public.subscription_status NOT NULL DEFAULT 'active',
  next_delivery_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.tiffin_subscriptions TO authenticated;
GRANT ALL ON public.tiffin_subscriptions TO service_role;
ALTER TABLE public.tiffin_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tiffin_subs_updated BEFORE UPDATE ON public.tiffin_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "tiffin_subs_customer_read" ON public.tiffin_subscriptions FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "tiffin_subs_customer_insert" ON public.tiffin_subscriptions FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "tiffin_subs_update" ON public.tiffin_subscriptions FOR UPDATE TO authenticated
  USING (customer_id = auth.uid() OR public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (customer_id = auth.uid() OR public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  order_status public.order_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "orders_read" ON public.orders FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders_customer_insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "orders_update" ON public.orders FOR UPDATE TO authenticated
  USING (customer_id = auth.uid() OR public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (customer_id = auth.uid() OR public.owns_provider(provider_id) OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.can_access_order(_order_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = _order_id
      AND (o.customer_id = auth.uid()
           OR EXISTS (SELECT 1 FROM public.providers p WHERE p.id = o.provider_id AND p.owner_id = auth.uid())
           OR public.has_role(auth.uid(),'admin'))
  );
$$;

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_read" ON public.order_items FOR SELECT TO authenticated USING (public.can_access_order(order_id));
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid()));

-- DELIVERIES
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  delivery_status public.delivery_status NOT NULL DEFAULT 'pending',
  estimated_time TEXT,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.deliveries TO authenticated;
GRANT ALL ON public.deliveries TO service_role;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_deliveries_updated BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "deliveries_read" ON public.deliveries FOR SELECT TO authenticated USING (public.can_access_order(order_id));
CREATE POLICY "deliveries_write" ON public.deliveries FOR INSERT TO authenticated WITH CHECK (public.can_access_order(order_id));
CREATE POLICY "deliveries_update" ON public.deliveries FOR UPDATE TO authenticated USING (public.can_access_order(order_id)) WITH CHECK (public.can_access_order(order_id));

-- RATINGS & REVIEWS
CREATE TABLE public.ratings_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ratings_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ratings_reviews TO authenticated;
GRANT ALL ON public.ratings_reviews TO service_role;
ALTER TABLE public.ratings_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.ratings_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_own_write" ON public.ratings_reviews FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "reviews_own_update" ON public.ratings_reviews FOR UPDATE TO authenticated USING (customer_id = auth.uid()) WITH CHECK (customer_id = auth.uid());
CREATE POLICY "reviews_own_delete" ON public.ratings_reviews FOR DELETE TO authenticated USING (customer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ROADMAP TABLES
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT,
  phone TEXT,
  license_number TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "drivers_own" ON public.drivers FOR ALL TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL,
  vehicle_type TEXT,
  registration_number TEXT,
  capacity_kg NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "vehicles_own" ON public.vehicles FOR ALL TO authenticated USING (owner_user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (owner_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_user_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  origin TEXT,
  destination TEXT,
  return_destination TEXT,
  available_capacity_kg NUMERIC(10,2),
  departure_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_trips_updated BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "trips_own" ON public.trips FOR ALL TO authenticated USING (driver_user_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (driver_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  origin TEXT,
  destination TEXT,
  weight_kg NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_shipments_updated BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "shipments_own" ON public.shipments FOR ALL TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.backhaul_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  match_score NUMERIC(5,2),
  status TEXT NOT NULL DEFAULT 'suggested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.backhaul_matches TO authenticated;
GRANT ALL ON public.backhaul_matches TO service_role;
ALTER TABLE public.backhaul_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "backhaul_admin_read" ON public.backhaul_matches FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.stays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  city TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  monthly_rent NUMERIC(10,2),
  image_url TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stays TO anon;
GRANT SELECT ON public.stays TO authenticated;
GRANT ALL ON public.stays TO service_role;
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_stays_updated BEFORE UPDATE ON public.stays FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "stays_public_read" ON public.stays FOR SELECT USING (true);

CREATE TABLE public.parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  description TEXT,
  origin_city TEXT,
  destination_city TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parcels TO authenticated;
GRANT ALL ON public.parcels TO service_role;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_parcels_updated BEFORE UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "parcels_own" ON public.parcels FOR ALL TO authenticated USING (sender_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (sender_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.tiffin_subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT 'simulated',
  status public.payment_status NOT NULL DEFAULT 'paid',
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_own_read" ON public.payments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "payments_own_insert" ON public.payments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- INDEXES
CREATE INDEX idx_menu_items_provider ON public.menu_items(provider_id);
CREATE INDEX idx_menu_categories_provider ON public.menu_categories(provider_id);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_provider ON public.orders(provider_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_subs_customer ON public.tiffin_subscriptions(customer_id);
CREATE INDEX idx_subs_provider ON public.tiffin_subscriptions(provider_id);

-- REALTIME
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.deliveries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;