"use client";

import { useState, useTransition } from "react";
import type { TeamMember } from "@/types/database";
import { Select } from "@/components/ui/Field";
import { assignOwner } from "@/app/admin/(authenticated)/leads/[id]/actions";

export function OwnerAssign({
  leadId,
  currentOwnerId,
  teamMembers,
}: {
  leadId: string;
  currentOwnerId: string | null;
  teamMembers: TeamMember[];
}) {
  const [ownerId, setOwnerId] = useState(currentOwnerId ?? "");
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    setOwnerId(value);
    startTransition(() => {
      void assignOwner(leadId, value || null);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="owner" className="text-sm font-medium text-ink">
        Owner
      </label>
      <Select
        id="owner"
        value={ownerId}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
      >
        <option value="">Unassigned</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name}
          </option>
        ))}
      </Select>
    </div>
  );
}
