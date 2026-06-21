import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, LeadWithRelations } from "@/types/database";

export interface LeadFilters {
  status?: LeadStatus;
  tripId?: string;
  ownerId?: string | "unassigned";
  search?: string;
}

export async function getLeads(filters: LeadFilters = {}): Promise<LeadWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select(
      `*,
      trip:trips ( id, name, destination ),
      owner:team_members ( id, full_name )`
    )
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.tripId) {
    query = query.eq("trip_id", filters.tripId);
  }
  if (filters.ownerId === "unassigned") {
    query = query.is("owner_id", null);
  } else if (filters.ownerId) {
    query = query.eq("owner_id", filters.ownerId);
  }
  if (filters.search) {
    const term = filters.search.trim();
    if (term) {
      query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("getLeads error", error);
    return [];
  }
  return (data ?? []) as unknown as LeadWithRelations[];
}

export async function getLeadById(id: string): Promise<LeadWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      `*,
      trip:trips ( id, name, destination, start_date, end_date, price_inr_gst ),
      owner:team_members ( id, full_name )`
    )
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as LeadWithRelations;
}

export async function getLeadNotes(leadId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_notes")
    .select(`*, author:team_members ( id, full_name )`)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_members").select("*").order("full_name");
  if (error) return [];
  return data;
}
