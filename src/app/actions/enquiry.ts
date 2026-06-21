"use server";

import { createClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validation";

export type SubmitEnquiryResult =
  | { ok: true }
  | { ok: false; fieldErrors: Partial<Record<string, string>>; formError?: string };

export async function submitEnquiry(formData: FormData): Promise<SubmitEnquiryResult> {
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    trip_id: formData.get("trip_id"),
    group_type: formData.get("group_type"),
    preferred_month: formData.get("preferred_month"),
    trip_feeling: formData.get("trip_feeling") ?? "",
  };

  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();

  // Re-check the trip is still open server-side. A trip closing between
  // page load and submit should not silently create a lead against it.
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, status")
    .eq("id", parsed.data.trip_id)
    .single();

  if (tripError || !trip) {
    return { ok: false, fieldErrors: {}, formError: "We could not find that trip. Refresh and try again." };
  }
  if (trip.status !== "open") {
    return {
      ok: false,
      fieldErrors: {},
      formError: "This trip just closed. Pick another open trip below.",
    };
  }

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    trip_id: parsed.data.trip_id,
    group_type: parsed.data.group_type,
    preferred_month: parsed.data.preferred_month,
    trip_feeling: parsed.data.trip_feeling,
  });

  if (error) {
    return {
      ok: false,
      fieldErrors: {},
      formError: "Something went wrong on our end. Please try again in a moment.",
    };
  }

  return { ok: true };
}
