import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { providerService } from "@/services/providerService";
import { SEED_PROVIDERS } from "@/data/seedData";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ShieldAlert,
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  Truck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { registrationService, type RegistrationRequest, type RegistrationStatus } from "@/services/registrationService";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { role, switchDemoRole } = useAuth();
  const [providers, setProviders] = useState(SEED_PROVIDERS);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);

  // Route guard
  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            This portal is restricted to platform administrators only. Switch to the Admin demo persona to explore.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => switchDemoRole("admin")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-5 rounded-xl shadow"
          >
            <ShieldAlert className="w-4 h-4 mr-2" /> Switch to Admin Demo
          </Button>
          <Button variant="outline" asChild className="px-6 py-5 rounded-xl">
            <Link to="/">Back to Discovery</Link>
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    async function load() {
      try {
        const list = await providerService.listProviders(null);
        if (list.length > 0) setProviders(list as any);
        setRequests(await registrationService.listRequests());
      } catch (err) {
        console.error("Failed to load providers in admin", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const toggleVerify = async (providerId: string) => {
    const target = providers.find((p) => p.id === providerId);
    if (!target) return;
    const next = !target.is_verified;

    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, is_verified: next } : p))
    );

    try {
      await providerService.updateProvider(providerId, { is_verified: next });
      toast.success(`Updated verification for ${target.name}: ${next ? "VERIFIED" : "UNVERIFIED"}`);
    } catch {
      toast.error("Failed to update verification status in database.");
    }
  };

  const updateRequest = async (request: RegistrationRequest, status: RegistrationStatus) => {
    const note = status === "needs_changes" ? "Please provide the missing verification documents or correct the highlighted details." : undefined;
    const updated = status === "approved"
      ? await registrationService.approveRequest(request)
      : await registrationService.updateRequest(request.id, status, note);
    if (updated) setRequests((current) => current.map((item) => item.id === request.id ? updated : item));
    toast.success(`${request.requester_name}'s ${request.request_type} request is ${status.replace("_", " ")}.`);
  };

  const requestLabel = (type: RegistrationRequest["request_type"]) =>
    type === "kitchen" ? "Home Kitchen" : type === "vehicle" ? "Vehicle / Driver" : "Student Stay / PG";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-600" />
              <h1 className="text-2xl font-black text-foreground">Platform Admin Portal</h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                SIH Operations
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Platform-level visibility into registered home kitchens, order throughput, and logistics.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/">Exit to Customer View</Link>
          </Button>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <Store className="w-3.5 h-3.5 text-orange-600" /> Total Kitchens
            </div>
            <div className="text-2xl font-black text-foreground">{providers.length}</div>
            <div className="text-[11px] text-emerald-700 font-semibold">
              {providers.filter((p) => p.is_verified).length} Verified Kitchens
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-blue-600" /> Active Customers
            </div>
            <div className="text-2xl font-black text-foreground">348</div>
            <div className="text-[11px] text-muted-foreground">Pune & Mumbai clusters</div>
          </div>

          <div className="p-4 rounded-xl border bg-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" /> Monthly Orders
            </div>
            <div className="text-2xl font-black text-foreground">1,240</div>
            <div className="text-[11px] text-muted-foreground">Food + Tiffin dabbas</div>
          </div>

          <div className="p-4 rounded-xl border bg-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Platform GMV
            </div>
            <div className="text-2xl font-black text-emerald-700">₹2,84,500</div>
            <div className="text-[11px] text-muted-foreground">Gross merchandise value</div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Registration Requests</h2>
              <p className="text-xs text-muted-foreground">Review identity, license, and listing details before anything goes public.</p>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">{requests.filter((request) => request.status === "pending" || request.status === "under_review").length} awaiting review</span>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">No registration requests yet.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-foreground">{request.requester_name}</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">{requestLabel(request.request_type)}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${request.status === "approved" ? "bg-emerald-100 text-emerald-800" : request.status === "rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{request.status.replace("_", " ")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{request.requester_email} · Submitted {new Date(request.created_at).toLocaleString()}</div>
                      <div className="grid gap-x-5 gap-y-1 rounded-xl bg-muted/40 p-3 text-xs sm:grid-cols-2">
                        {Object.entries(request.submitted_data).filter(([key]) => key !== "notes").map(([key, value]) => <div key={key}><span className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}: </span><span className="text-muted-foreground">{value}</span></div>)}
                      </div>
                      {request.submitted_data.notes && <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Applicant note:</span> {request.submitted_data.notes}</p>}
                      {request.admin_notes && <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-900"><span className="font-semibold">Admin note:</span> {request.admin_notes}</p>}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
                      <Button size="sm" variant="outline" onClick={() => updateRequest(request, "under_review")} disabled={request.status === "under_review"}>Review</Button>
                      <Button size="sm" variant="outline" className="border-amber-300 text-amber-800" onClick={() => updateRequest(request, "needs_changes")}>Need Changes</Button>
                      <Button size="sm" variant="outline" className="border-rose-300 text-rose-700" onClick={() => updateRequest(request, "rejected")}>Reject</Button>
                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => updateRequest(request, "approved")}>Approve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Kitchen Management & Verification */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Kitchen Quality & Verification</h2>
            <span className="text-xs text-muted-foreground">FSSAI & Hygiene Audits</span>
          </div>

          <div className="border rounded-2xl bg-card overflow-hidden divide-y">
            {providers.map((p) => (
              <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image_url ?? "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=150&q=80"}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span>{p.name}</span>
                      {p.is_verified && (
                        <span title="Verified">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.cuisine} • {p.city}</div>
                    <div className="text-[11px] text-muted-foreground">Rating: ⭐ {p.rating} ({p.review_count} reviews)</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Verified Badge:</span>
                    <Switch
                      checked={p.is_verified}
                      onCheckedChange={() => toggleVerify(p.id)}
                    />
                  </div>
                  <Button asChild variant="outline" size="sm" className="text-xs">
                    <Link to={`/provider/${p.id}` as any}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
