"use client";

import { useState, useTransition } from "react";
import { LEAD_STATUS_LABELS } from "@/types/database";
import type { LeadStatus } from "@/types/database";
import { cn } from "@/lib/utils";
import { updateLeadStatus } from "@/app/admin/(authenticated)/leads/[id]/actions";

const MAIN_PIPELINE: LeadStatus[] = ["new", "contacted", "qualified", "vibe_check_sent", "confirmed"];

export function PipelineStepper({ leadId, currentStatus }: { leadId: string; currentStatus: LeadStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const isNotAFit = status === "not_a_fit";

  function handleChange(next: LeadStatus) {
    setStatus(next);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, next);
      if (!result.ok) setStatus(currentStatus);
    });
  }

  const currentIndex = MAIN_PIPELINE.indexOf(status);

  return (
    <div className="rounded-2xl border border-ink/10 bg-cream p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Pipeline stage</p>
        {isPending && <span className="text-xs text-ink/40">Saving...</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {MAIN_PIPELINE.map((s, i) => {
          const reached = !isNotAFit && i <= currentIndex;
          return (
            <button
              key={s}
              onClick={() => handleChange(s)}
              disabled={isPending}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                reached
                  ? "border-olive bg-olive text-cream"
                  : "border-ink/15 bg-transparent text-ink/50 hover:border-ink/30"
              )}
            >
              {LEAD_STATUS_LABELS[s]}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handleChange("not_a_fit")}
        disabled={isPending}
        className={cn(
          "mt-3 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          isNotAFit ? "border-rust bg-rust text-cream" : "border-ink/15 text-ink/50 hover:border-rust/40 hover:text-rust"
        )}
      >
        Mark not a fit
      </button>
    </div>
  );
}
