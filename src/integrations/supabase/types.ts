export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string | null
          created_at: string
          id: string
          is_default: boolean
          label: string
          latitude: number | null
          longitude: number | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line: string
          city?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      backhaul_matches: {
        Row: {
          created_at: string
          id: string
          match_score: number | null
          shipment_id: string | null
          status: string
          trip_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_score?: number | null
          shipment_id?: string | null
          status?: string
          trip_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_score?: number | null
          shipment_id?: string | null
          status?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backhaul_matches_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "backhaul_matches_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          created_at: string
          delivered_at: string | null
          delivery_status: Database["public"]["Enums"]["delivery_status"]
          estimated_time: string | null
          id: string
          order_id: string
          picked_up_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          estimated_time?: string | null
          id?: string
          order_id: string
          picked_up_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          estimated_time?: string | null
          id?: string
          order_id?: string
          picked_up_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_available: boolean
          license_number: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_available?: boolean
          license_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_available?: boolean
          license_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          provider_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          provider_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          provider_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_best_seller: boolean
          is_todays_special: boolean
          is_veg: boolean
          name: string
          price: number
          provider_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_best_seller?: boolean
          is_todays_special?: boolean
          is_veg?: boolean
          name: string
          price?: number
          provider_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_best_seller?: boolean
          is_todays_special?: boolean
          is_veg?: boolean
          name?: string
          price?: number
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          menu_item_id: string | null
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          menu_item_id?: string | null
          order_id: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          menu_item_id?: string | null
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string
          customer_id: string
          delivery_fee: number
          id: string
          order_status: Database["public"]["Enums"]["order_status"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          provider_id: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          customer_id: string
          delivery_fee?: number
          id?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          provider_id: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          address_id?: string | null
          created_at?: string
          customer_id?: string
          delivery_fee?: number
          id?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          provider_id?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      parcels: {
        Row: {
          created_at: string
          description: string | null
          destination_city: string | null
          id: string
          origin_city: string | null
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination_city?: string | null
          id?: string
          origin_city?: string | null
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          destination_city?: string | null
          id?: string
          origin_city?: string | null
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          order_id: string | null
          reference: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "tiffin_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          cuisine: string | null
          description: string | null
          id: string
          image_url: string | null
          is_demo: boolean
          is_open: boolean
          is_verified: boolean
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          price_range: string | null
          provider_type: Database["public"]["Enums"]["provider_type"]
          rating: number
          review_count: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          is_open?: boolean
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          price_range?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"]
          rating?: number
          review_count?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          is_open?: boolean
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          price_range?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"]
          rating?: number
          review_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      ratings_reviews: {
        Row: {
          created_at: string
          customer_id: string
          customer_name: string | null
          id: string
          order_id: string | null
          provider_id: string
          rating: number
          review: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          customer_name?: string | null
          id?: string
          order_id?: string | null
          provider_id: string
          rating?: number
          review?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          customer_name?: string | null
          id?: string
          order_id?: string | null
          provider_id?: string
          rating?: number
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          created_at: string
          created_by: string
          destination: string | null
          id: string
          origin: string | null
          status: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          destination?: string | null
          id?: string
          origin?: string | null
          status?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          destination?: string | null
          id?: string
          origin?: string | null
          status?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      stays: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_demo: boolean
          latitude: number | null
          longitude: number | null
          monthly_rent: number | null
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          latitude?: number | null
          longitude?: number | null
          monthly_rent?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          latitude?: number | null
          longitude?: number | null
          monthly_rent?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tiffin_plans: {
        Row: {
          benefits: string[]
          created_at: string
          delivery_area: string | null
          description: string | null
          frequency: Database["public"]["Enums"]["tiffin_frequency"]
          id: string
          is_active: boolean
          meals_per_day: number
          name: string
          price: number
          provider_id: string
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          created_at?: string
          delivery_area?: string | null
          description?: string | null
          frequency?: Database["public"]["Enums"]["tiffin_frequency"]
          id?: string
          is_active?: boolean
          meals_per_day?: number
          name: string
          price?: number
          provider_id: string
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          created_at?: string
          delivery_area?: string | null
          description?: string | null
          frequency?: Database["public"]["Enums"]["tiffin_frequency"]
          id?: string
          is_active?: boolean
          meals_per_day?: number
          name?: string
          price?: number
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiffin_plans_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      tiffin_subscriptions: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address_id: string | null
          id: string
          meal_preference: string
          next_delivery_date: string | null
          plan_id: string
          provider_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address_id?: string | null
          id?: string
          meal_preference?: string
          next_delivery_date?: string | null
          plan_id: string
          provider_id: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address_id?: string | null
          id?: string
          meal_preference?: string
          next_delivery_date?: string | null
          plan_id?: string
          provider_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiffin_subscriptions_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiffin_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "tiffin_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiffin_subscriptions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          available_capacity_kg: number | null
          created_at: string
          departure_at: string | null
          destination: string | null
          driver_user_id: string
          id: string
          origin: string | null
          return_destination: string | null
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          available_capacity_kg?: number | null
          created_at?: string
          departure_at?: string | null
          destination?: string | null
          driver_user_id: string
          id?: string
          origin?: string | null
          return_destination?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          available_capacity_kg?: number | null
          created_at?: string
          departure_at?: string | null
          destination?: string | null
          driver_user_id?: string
          id?: string
          origin?: string | null
          return_destination?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity_kg: number | null
          created_at: string
          driver_id: string | null
          id: string
          owner_user_id: string
          registration_number: string | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          capacity_kg?: number | null
          created_at?: string
          driver_id?: string | null
          id?: string
          owner_user_id: string
          registration_number?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          capacity_kg?: number | null
          created_at?: string
          driver_id?: string | null
          id?: string
          owner_user_id?: string
          registration_number?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_order: { Args: { _order_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_provider: { Args: { _provider_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "provider" | "driver" | "admin"
      delivery_status:
        | "pending"
        | "assigned"
        | "picked_up"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      order_status:
        | "confirmed"
        | "preparing"
        | "picked_up"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      provider_type:
        | "home_kitchen"
        | "restaurant"
        | "cake_vendor"
        | "home_baker"
        | "local_business"
      subscription_status: "active" | "paused" | "cancelled" | "completed"
      tiffin_frequency: "daily" | "weekly" | "monthly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "provider", "driver", "admin"],
      delivery_status: [
        "pending",
        "assigned",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      order_status: [
        "confirmed",
        "preparing",
        "picked_up",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "failed", "refunded"],
      provider_type: [
        "home_kitchen",
        "restaurant",
        "cake_vendor",
        "home_baker",
        "local_business",
      ],
      subscription_status: ["active", "paused", "cancelled", "completed"],
      tiffin_frequency: ["daily", "weekly", "monthly"],
    },
  },
} as const
