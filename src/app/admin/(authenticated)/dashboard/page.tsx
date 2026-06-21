import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUSES, type LeadStatus } from "@/types/database";
import { StatusPill } from "@/components/ui/StatusPill";

export const revalidate = 0;

type LeadStatusAndTrip = {
  status: LeadStatus;
  trip_id: string | null;
  trips: { name: string } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data } = await supabase.from("leads").select("status, trip_id, trips(name)");
  const leads = (data ?? []) as unknown as LeadStatusAndTrip[];

  const total = leads.length;

  const byStatus = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));

  const tripCounts = new Map<string, number>();
  for (const lead of leads) {
    const tripName = lead.trips?.name ?? "No trip";
    tripCounts.set(tripName, (tripCounts.get(tripName) ?? 0) + 1);
  }
  const byTrip = Array.from(tripCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl text-ink sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">The numbers worth a glance each morning.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-cream p-6">
          <p className="text-xs uppercase tracking-wide text-ink/50">Total leads</p>
          <p className="font-display mt-2 text-4xl text-ink">{total}</p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-cream p-6 sm:col-span-1 lg:col-span-2">
          <p className="text-xs uppercase tracking-wide text-ink/50">By pipeline stage</p>
          <div className="mt-3 flex flex-col gap-2">
            {byStatus.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between gap-3">
                <StatusPill status={status} />
                <span className="font-display text-lg text-ink">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-cream p-6">
        <p className="text-xs uppercase tracking-wide text-ink/50">Leads per trip</p>
        {byTrip.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No leads yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {byTrip.map(([tripName, count]) => (
              <div key={tripName} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink/80">{tripName}</span>
                <span className="font-display text-base text-ink">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
