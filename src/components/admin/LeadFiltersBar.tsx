"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Trip, TeamMember } from "@/types/database";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types/database";
import { Select, Input } from "@/components/ui/Field";
import { Search } from "lucide-react";

export function LeadFiltersBar({ trips, teamMembers }: { trips: Trip[]; teamMembers: TeamMember[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.push(`/admin?${params.toString()}`));
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateParam("q", e.target.value);
          }}
          placeholder="Search name, phone, email"
          className="w-64 pl-9"
        />
      </div>

      <Select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="w-44"
      >
        <option value="">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {LEAD_STATUS_LABELS[s]}
          </option>
        ))}
      </Select>

      <Select
        defaultValue={searchParams.get("trip") ?? ""}
        onChange={(e) => updateParam("trip", e.target.value)}
        className="w-48"
      >
        <option value="">All trips</option>
        {trips.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </Select>

      <Select
        defaultValue={searchParams.get("owner") ?? ""}
        onChange={(e) => updateParam("owner", e.target.value)}
        className="w-44"
      >
        <option value="">All owners</option>
        <option value="unassigned">Unassigned</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name}
          </option>
        ))}
      </Select>
    </div>
  );
}
