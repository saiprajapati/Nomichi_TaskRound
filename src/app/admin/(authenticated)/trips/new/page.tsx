import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TripForm } from "@/components/admin/TripForm";
import { createTrip } from "../actions";

export default function NewTripPage() {
  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/trips" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={15} />
        Back to trips
      </Link>

      <h1 className="font-display mt-4 text-2xl text-ink sm:text-3xl">New trip</h1>
      <p className="mt-1 text-sm text-ink/60">
        Set this to open once you are ready, it will appear on the public page right away.
      </p>

      <div className="mt-8 max-w-2xl">
        <TripForm action={createTrip} />
      </div>
    </div>
  );
}
