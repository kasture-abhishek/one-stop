import React, { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, FileCheck2, Home, MapPin, Truck, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { registrationService, type RegistrationType } from "@/services/registrationService";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const options: { type: RegistrationType; label: string; description: string; icon: React.ReactNode }[] = [
  { type: "kitchen", label: "Home Kitchen", description: "Sell verified home-cooked food and tiffin plans.", icon: <Utensils className="h-5 w-5" /> },
  { type: "vehicle", label: "Vehicle / Driver", description: "Offer verified return-load transport capacity.", icon: <Truck className="h-5 w-5" /> },
  { type: "pg", label: "Student Stay / PG", description: "List a verified PG or student accommodation.", icon: <Home className="h-5 w-5" /> },
];

function RegisterPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [requestType, setRequestType] = useState<RegistrationType>("kitchen");
  const [form, setForm] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const fields = requestType === "kitchen"
    ? [["kitchenName", "Kitchen name"], ["phone", "Contact phone"], ["city", "City"], ["address", "Kitchen address"], ["cuisine", "Cuisine and food type"], ["licenseNumber", "FSSAI license number"]]
    : requestType === "vehicle"
      ? [["vehicleNumber", "Vehicle registration number"], ["vehicleType", "Vehicle type"], ["capacity", "Capacity"], ["phone", "Contact phone"], ["route", "Usual route"], ["licenseNumber", "Driving license number"]]
      : [["pgName", "PG / property name"], ["phone", "Contact phone"], ["city", "City"], ["address", "Property address"], ["rent", "Monthly rent range"], ["amenities", "Amenities and room types"]];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await registrationService.submitRequest({
        requesterId: user?.id ?? "anonymous-demo-user",
        requesterName: profile?.full_name ?? "Demo Applicant",
        requesterEmail: profile?.email ?? "demo@example.com",
        requestType,
        submittedData: form,
      });
      setSubmitted(true);
      toast.success("Application submitted for admin verification.");
    } catch {
      toast.error("Could not submit the application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <CheckCircle2 className="h-14 w-14 text-emerald-600" />
      <h1 className="text-2xl font-black">Application submitted</h1>
      <p className="text-sm text-muted-foreground">The admin team will verify your documents and contact details before publishing your listing.</p>
      <div className="flex gap-2"><Button onClick={() => setSubmitted(false)}>Submit another</Button><Button variant="outline" onClick={() => router.navigate({ to: "/" })}>Back to discovery</Button></div>
    </div>;
  }

  return <div className="min-h-screen bg-background px-4 py-8 pb-24 sm:px-6">
    <div className="mx-auto max-w-4xl space-y-6">
      <div><Link to="/" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link><h1 className="text-3xl font-black">Register with ONE STOP</h1><p className="mt-1 text-sm text-muted-foreground">Submit your details once. Listings go live only after admin verification.</p></div>
      <div className="grid gap-3 md:grid-cols-3">{options.map((option) => <button key={option.type} type="button" onClick={() => { setRequestType(option.type); setForm({}); }} className={`rounded-2xl border p-4 text-left transition ${requestType === option.type ? "border-orange-500 bg-orange-50" : "bg-card hover:border-orange-200"}`}><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">{option.icon}</div><div className="font-bold">{option.label}</div><div className="mt-1 text-xs text-muted-foreground">{option.description}</div></button>)}</div>
      <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7"><div className="mb-5 flex items-center gap-2 border-b pb-4 text-sm font-bold"><FileCheck2 className="h-5 w-5 text-orange-600" /> Verification details</div><div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="space-y-1.5 text-xs font-semibold">{label}<Input required value={form[key] ?? ""} onChange={(event) => update(key, event.target.value)} placeholder={label} /></label>)}</div><label className="mt-4 block space-y-1.5 text-xs font-semibold">Additional notes<textarea className="min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-sm font-normal" value={form.notes ?? ""} onChange={(event) => update("notes", event.target.value)} placeholder="Tell the admin anything important about this registration." /></label><label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><input required type="checkbox" className="mt-0.5" /> I confirm that the information and documents I provide are genuine.</label><Button disabled={isSubmitting} className="mt-5 w-full bg-orange-600 font-bold hover:bg-orange-700">{isSubmitting ? "Submitting..." : "Submit for verification"}</Button></form>
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><MapPin className="h-4 w-4 shrink-0" /> Admin approval is required before your kitchen, vehicle, or PG appears publicly.</div>
    </div>
  </div>;
}