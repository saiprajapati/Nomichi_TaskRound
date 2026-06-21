import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/database";
import { LEAD_STATUS_LABELS } from "@/types/database";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-sand/40 text-ink border-sand",
  contacted: "bg-rust/10 text-rust border-rust/30",
  qualified: "bg-olive/10 text-olive border-olive/30",
  vibe_check_sent: "bg-yellow/40 text-ink border-yellow",
  confirmed: "bg-olive text-cream border-olive",
  not_a_fit: "bg-ink/5 text-ink/50 border-ink/15",
};

export function StatusPill({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        statusStyles[status],
        className
      )}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
