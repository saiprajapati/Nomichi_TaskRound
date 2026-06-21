"use server";

import { createClient } from "@/lib/supabase/server";
import { tripSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type TripActionResult =
  | { ok: true }
  | { ok: false; fieldErrors: Partial<Record<string, string>>; formError?: string };

function parseTripForm(formData: FormData) {
  return tripSchema.safeParse({
    name: formData.get("name"),
    destination: formData.get("destination"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    price_inr_gst: formData.get("price_inr_gst"),
    total_seats: formData.get("total_seats"),
    status: formData.get("status"),
    description: formData.get("description") ?? "",
  });
}

export async function createTrip(formData: FormData): Promise<TripActionResult> {
  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("trips").insert(parsed.data);

  if (error) {
    return { ok: false, fieldErrors: {}, formError: "Could not save this trip. Try again." };
  }

  revalidatePath("/admin/trips");
  revalidatePath("/");
  redirect("/admin/trips");
}

export async function updateTrip(tripId: string, formData: FormData): Promise<TripActionResult> {
  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("trips").update(parsed.data).eq("id", tripId);

  if (error) {
    return { ok: false, fieldErrors: {}, formError: "Could not save this trip. Try again." };
  }

  revalidatePath("/admin/trips");
  revalidatePath("/");
  redirect("/admin/trips");
}

export async function deleteTrip(tripId: string) {
  const supabase = await createClient();
  await supabase.from("trips").delete().eq("id", tripId);
  revalidatePath("/admin/trips");
  revalidatePath("/");
  redirect("/admin/trips");
}
