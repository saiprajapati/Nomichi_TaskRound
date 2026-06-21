"use server";

import { createClient } from "@/lib/supabase/server";
import { leadNoteSchema } from "@/lib/validation";
import type { LeadStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function assignOwner(leadId: string, ownerId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ owner_id: ownerId }).eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function addLeadNote(leadId: string, formData: FormData) {
  const raw = {
    body: formData.get("body"),
    next_action: formData.get("next_action") ?? "",
  };
  const parsed = leadNoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid note." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("lead_notes").insert({
    lead_id: leadId,
    author_id: userData.user?.id ?? null,
    body: parsed.data.body,
    next_action: parsed.data.next_action || null,
  });

  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true as const };
}
