import { supabase } from "@/integrations/supabase/client";

export type RegistrationType = "kitchen" | "vehicle" | "pg";
export type RegistrationStatus = "pending" | "under_review" | "approved" | "rejected" | "needs_changes";

export type RegistrationRequest = {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_email: string;
  request_type: RegistrationType;
  status: RegistrationStatus;
  submitted_data: Record<string, string>;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const STORAGE_KEY = "onestop_registration_requests";

const DEMO_REQUESTS: RegistrationRequest[] = [
  {
    id: "request-demo-kitchen",
    requester_id: "demo-applicant-1",
    requester_name: "Meera Kulkarni",
    requester_email: "meera.kitchen@example.com",
    request_type: "kitchen",
    status: "pending",
    submitted_data: {
      kitchenName: "Meera's Maharashtrian Kitchen",
      phone: "+91 98765 44321",
      city: "Pune",
      address: "Karve Nagar, Pune",
      cuisine: "Maharashtrian, Vegetarian",
      licenseNumber: "FSSAI-2026-8842",
    },
    admin_notes: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
  },
  {
    id: "request-demo-vehicle",
    requester_id: "demo-applicant-2",
    requester_name: "Rohan Jadhav",
    requester_email: "rohan.transport@example.com",
    request_type: "vehicle",
    status: "under_review",
    submitted_data: {
      vehicleNumber: "MH12 AB 7421",
      vehicleType: "14-ft Truck",
      capacity: "1800 kg",
      phone: "+91 98230 11122",
      route: "Pune to Mumbai",
      licenseNumber: "DL-0420267788",
    },
    admin_notes: "RC document received. Insurance certificate is being checked.",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
  },
];

function readLocal(): RegistrationRequest[] {
  if (typeof window === "undefined") return DEMO_REQUESTS;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_REQUESTS));
      return DEMO_REQUESTS;
    }
    return JSON.parse(stored) as RegistrationRequest[];
  } catch {
    return DEMO_REQUESTS;
  }
}

function writeLocal(requests: RegistrationRequest[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export const registrationService = {
  async listRequests(): Promise<RegistrationRequest[]> {
    try {
      const { data, error } = await (supabase as any)
        .from("registration_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as RegistrationRequest[];
    } catch {
      // Demo fallback
    }
    return readLocal().sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async listMyRequests(requesterId: string) {
    const requests = await this.listRequests();
    return requests.filter((request) => request.requester_id === requesterId);
  },

  async submitRequest(input: {
    requesterId: string;
    requesterName: string;
    requesterEmail: string;
    requestType: RegistrationType;
    submittedData: Record<string, string>;
  }) {
    const payload = {
      requester_id: input.requesterId,
      requester_name: input.requesterName,
      requester_email: input.requesterEmail,
      request_type: input.requestType,
      submitted_data: input.submittedData,
      status: "pending" as const,
    };

    try {
      const { data, error } = await (supabase as any).from("registration_requests").insert(payload).select().single();
      if (!error && data) return data as RegistrationRequest;
    } catch {
      // Demo fallback
    }

    const request: RegistrationRequest = {
      id: `request-${Date.now().toString(36)}`,
      ...payload,
      admin_notes: null,
      created_at: new Date().toISOString(),
      reviewed_at: null,
    };
    writeLocal([request, ...readLocal()]);
    return request;
  },

  async updateRequest(id: string, status: RegistrationStatus, adminNotes?: string) {
    try {
      const { data, error } = await (supabase as any)
        .from("registration_requests")
        .update({ status, admin_notes: adminNotes || null, reviewed_at: status === "pending" ? null : new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as RegistrationRequest;
    } catch {
      // Demo fallback
    }
    const next = readLocal().map((request) =>
      request.id === id
        ? { ...request, status, admin_notes: adminNotes || null, reviewed_at: status === "pending" ? null : new Date().toISOString() }
        : request,
    );
    writeLocal(next);
    return next.find((request) => request.id === id) ?? null;
  },

  async approveRequest(request: RegistrationRequest) {
    const updated = await this.updateRequest(request.id, "approved");
    if (!updated) return null;

    try {
      if (request.request_type === "kitchen") {
        const data = request.submitted_data;
        await (supabase as any).from("providers").insert({
          owner_id: request.requester_id,
          name: data.kitchenName || "Verified Home Kitchen",
          provider_type: "home_kitchen",
          cuisine: data.cuisine || null,
          address: data.address || null,
          city: data.city || null,
          is_verified: true,
          is_demo: false,
        });
      }

      if (request.request_type === "vehicle") {
        const data = request.submitted_data;
        const { data: driver } = await (supabase as any)
          .from("drivers")
          .insert({ user_id: request.requester_id, full_name: request.requester_name, phone: data.phone || null, license_number: data.licenseNumber || null })
          .select()
          .single();
        await (supabase as any).from("vehicles").insert({
          driver_id: driver?.id || null,
          owner_user_id: request.requester_id,
          vehicle_type: data.vehicleType || null,
          registration_number: data.vehicleNumber || null,
          capacity_kg: Number.parseFloat(data.capacity || "0") || null,
        });
      }
    } catch {
      // The request remains approved in demo mode even when operational tables are unavailable.
    }

    return updated;
  },
};