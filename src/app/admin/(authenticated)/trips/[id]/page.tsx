import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTripById } from "@/lib/data/trips";
import { TripForm } from "@/components/admin/TripForm";
import { updateTrip, deleteTrip } from "../actions";
import { Button } from "@/components/ui/Button";

export const revalidate = 0;

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();

  const updateWithId = updateTrip.bind(null, id);
  const deleteWithId = deleteTrip.bind(null, id);

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/trips" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={15} />
        Back to trips
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{trip.name}</h1>
          <p className="mt-1 text-sm text-ink/60">{trip.destination}</p>
        </div>
        <form action={deleteWithId}>
          <Button variant="danger" size="sm" type="submit">
            Delete trip
          </Button>
        </form>
      </div>

      <div className="mt-8 max-w-2xl">
        <TripForm trip={trip} action={updateWithId} />
      </div>
    </div>
  );
}
