import Link from "next/link";
import { getAllTrips } from "@/lib/data/trips";
import { formatDateRange, formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const revalidate = 0;

export default async function TripsListPage() {
  const trips = await getAllTrips();

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Trips</h1>
          <p className="mt-1 text-sm text-ink/60">Create and edit the trips travellers can enquire about.</p>
        </div>
        <Link href="/admin/trips/new">
          <Button>
            <Plus size={16} />
            New trip
          </Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 p-10 text-center">
          <p className="font-display text-lg text-ink">No trips yet.</p>
          <p className="mt-2 text-sm text-ink/60">Create your first trip to see it on the public page.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/admin/trips/${trip.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-cream p-5 transition-colors hover:border-ink/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-rust">{trip.destination}</p>
                  <h3 className="font-display text-lg text-ink">{trip.name}</h3>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    trip.status === "open" ? "bg-olive/10 text-olive" : "bg-ink/10 text-ink/50"
                  )}
                >
                  {trip.status === "open" ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-ink/70">
                <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                <span className="font-display text-base text-ink">{formatINR(trip.price_inr_gst)}</span>
              </div>
              <p className="text-xs text-ink/50">{trip.total_seats} total seats</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
