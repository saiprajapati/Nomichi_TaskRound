import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById, getLeadNotes, getTeamMembers } from "@/lib/data/leads";
import { ArrowLeft } from "lucide-react";
import { GROUP_TYPE_LABELS } from "@/types/database";
import { formatDateRange, formatINR, formatDateTime } from "@/lib/format";
import { PipelineStepper } from "@/components/admin/PipelineStepper";
import { OwnerAssign } from "@/components/admin/OwnerAssign";
import { CallLog } from "@/components/admin/CallLog";
import { AiAssistPanel } from "@/components/admin/AiAssistPanel";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";

export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, notes, teamMembers] = await Promise.all([
    getLeadById(id),
    getLeadNotes(id),
    getTeamMembers(),
  ]);

  if (!lead) notFound();

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={15} />
        Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{lead.name}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {lead.phone} · {lead.email}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <PipelineStepper leadId={lead.id} currentStatus={lead.status} />
          <AiAssistPanel leadId={lead.id} />
          <CallLog leadId={lead.id} notes={notes as Parameters<typeof CallLog>[0]["notes"]} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-ink/10 bg-cream p-5">
            <p className="text-sm font-medium text-ink">Enquiry details</p>
            <dl className="mt-3 flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-xs text-ink/50">Trip</dt>
                <dd className="text-ink/85">
                  {lead.trip ? `${lead.trip.name}, ${lead.trip.destination}` : "—"}
                </dd>
              </div>
              {lead.trip && "start_date" in lead.trip && (
                <div>
                  <dt className="text-xs text-ink/50">Dates and price</dt>
                  <dd className="text-ink/85">
                    {formatDateRange(
                      (lead.trip as unknown as { start_date: string }).start_date,
                      (lead.trip as unknown as { end_date: string }).end_date
                    )}{" "}
                    · {formatINR((lead.trip as unknown as { price_inr_gst: number }).price_inr_gst)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-ink/50">Group</dt>
                <dd className="text-ink/85">{GROUP_TYPE_LABELS[lead.group_type]}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/50">Preferred month</dt>
                <dd className="text-ink/85">{lead.preferred_month}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink/50">What they are hoping for</dt>
                <dd className="text-ink/85 italic">
                  {lead.trip_feeling || "Not shared"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink/50">Received</dt>
                <dd className="text-ink/85">{formatDateTime(lead.created_at)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-cream p-5">
            <OwnerAssign leadId={lead.id} currentOwnerId={lead.owner_id} teamMembers={teamMembers} />
          </div>

          <ActivityTimeline leadId={lead.id} />
        </div>
      </div>
    </div>
  );
}
