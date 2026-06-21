import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { TripDeskHome } from "@/components/public/TripDeskHome";
import type { Trip } from "@/types/database";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "open")
    .order("start_date", { ascending: true });

  const trips: Trip[] = error ? [] : data ?? [];

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <TripDeskHome trips={trips} />
      </main>
      <PublicFooter />
    </>
  );
}
