import type { Trip } from "@/types/database";
import { formatDateRange, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TripCard({
  trip,
  selected,
  onSelect,
}: {
  trip: Trip;
  selected?: boolean;
  onSelect?: (trip: Trip) => void;
}) {
  const seatsLeftLabel = trip.total_seats <= 4 ? `${trip.total_seats} seats` : "Open";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(trip)}
      className={cn(
        "group flex w-full flex-col gap-3 rounded-2xl border bg-cream p-5 text-left transition-all duration-150",
        selected
          ? "border-rust shadow-[0_0_0_1px_#D55D27] ring-2 ring-rust/20"
          : "border-ink/10 hover:border-ink/30 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rust">{trip.destination}</p>
          <h3 className="font-display text-xl text-ink">{trip.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-olive/10 px-2.5 py-1 text-xs font-medium text-olive">
          {seatsLeftLabel}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ink/70 line-clamp-2">{trip.description}</p>

      <div className="mt-1 flex items-center justify-between border-t border-ink/10 pt-3">
        <span className="text-sm text-ink/60">{formatDateRange(trip.start_date, trip.end_date)}</span>
        <span className="font-display text-lg text-ink">{formatINR(trip.price_inr_gst)}</span>
      </div>
      <p className="text-[11px] text-ink/40">Price includes GST, per person</p>
    </button>
  );
}
