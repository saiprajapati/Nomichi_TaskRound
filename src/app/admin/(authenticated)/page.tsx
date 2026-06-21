import Link from "next/link";
import { getLeads, getTeamMembers } from "@/lib/data/leads";
import { getAllTrips } from "@/lib/data/trips";
import { StatusPill } from "@/components/ui/StatusPill";
import { LEAD_STATUSES, GROUP_TYPE_LABELS } from "@/types/database";
import type { LeadStatus } from "@/types/database";
import { formatRelativeTime } from "@/lib/format";
import { LeadFiltersBar } from "@/components/admin/LeadFiltersBar";

export const revalidate = 0;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; trip?: string; owner?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status as LeadStatus | undefined;

  const [leads, trips, teamMembers] = await Promise.all([
    getLeads({
      status: status && LEAD_STATUSES.includes(status) ? status : undefined,
      tripId: params.trip || undefined,
      ownerId: params.owner || undefined,
      search: params.q || undefined,
    }),
    getAllTrips(),
    getTeamMembers(),
  ]);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-ink/60">
            {leads.length} {leads.length === 1 ? "lead" : "leads"} matching your filters
          </p>
        </div>
        <Link
          href="/admin/trips"
          className="text-sm font-medium text-rust hover:underline"
        >
          Manage trips →
        </Link>
      </div>

      <div className="mt-6">
        <LeadFiltersBar trips={trips} teamMembers={teamMembers} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="font-display text-lg text-ink">No leads match this view.</p>
            <p className="text-sm text-ink/60">Try clearing a filter, or wait for the next enquiry to land.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-ink/[0.03] text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3 font-medium">Traveller</th>
                <th className="px-5 py-3 font-medium">Trip</th>
                <th className="px-5 py-3 font-medium">Group</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="group transition-colors hover:bg-ink/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <p className="font-medium text-ink group-hover:text-rust">{lead.name}</p>
                      <p className="text-xs text-ink/50">{lead.phone}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink/70">{lead.trip?.name ?? "—"}</td>
                  <td className="px-5 py-4 text-ink/70">{GROUP_TYPE_LABELS[lead.group_type]}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={lead.status} />
                  </td>
                  <td className="px-5 py-4 text-ink/70">{lead.owner?.full_name ?? "Unassigned"}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-ink/50">
                    {formatRelativeTime(lead.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
