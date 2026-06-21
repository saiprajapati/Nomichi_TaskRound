import { createClient } from "@/lib/supabase/server";
import type { Trip } from "@/types/database";

export async function getAllTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trips").select("*").order("start_date", { ascending: true });
  if (error) {
    console.error("getAllTrips error", error);
    return [];
  }
  return data ?? [];
}

export async function getTripById(id: string): Promise<Trip | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trips").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
