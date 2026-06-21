import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUS_LABELS, type LeadStatusEvent } from "@/types/database";
import { formatDateTime } from "@/lib/format";

export async function ActivityTimeline({ leadId }: { leadId: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lead_status_events")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  const events = data ?? [];

  if (events.length === 0) return null;

  return (
    <div className="rounded-2xl border border-ink/10 bg-cream p-5">
      <p className="text-sm font-medium text-ink">Activity</p>
      <div className="mt-4 flex flex-col gap-3">
        {events.map((event: LeadStatusEvent) => (
          <div key={event.id} className="flex items-start gap-3 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" />
            <div>
              <p className="text-ink/80">
                {event.from_status ? (
                  <>
                    Moved from <span className="font-medium">{LEAD_STATUS_LABELS[event.from_status]}</span> to{" "}
                    <span className="font-medium">{LEAD_STATUS_LABELS[event.to_status]}</span>
                  </>
                ) : (
                  <>
                    Lead created as <span className="font-medium">{LEAD_STATUS_LABELS[event.to_status]}</span>
                  </>
                )}
              </p>
              <p className="text-xs text-ink/40">{formatDateTime(event.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
