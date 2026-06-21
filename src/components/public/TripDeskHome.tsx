"use client";

import { useState } from "react";
import type { Trip } from "@/types/database";
import { TripCard } from "@/components/public/TripCard";
import { EnquiryForm } from "@/components/public/EnquiryForm";

export function TripDeskHome({ trips }: { trips: Trip[] }) {
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id ?? "");

  function handleSelect(trip: Trip) {
    setSelectedTripId(trip.id);
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="bg-ink py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-sm font-medium uppercase tracking-wide text-rust">Wander · Connect · Belong</p>
          <h1 className="font-display mt-4 max-w-2xl text-4xl leading-tight text-cream sm:text-6xl">
            Travel that finds you.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Slow, offbeat, small-group journeys, run end to end by our own team. Browse what is open
            right now and tell us a little about what you are looking for.
          </p>
        </div>
      </section>

      <section id="trips" className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-20">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Open trips</h2>
        <p className="mt-2 text-sm text-ink/60">Pick one below, then send us your enquiry.</p>

        {trips.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink/20 p-10 text-center">
            <p className="font-display text-lg text-ink">No open trips right now.</p>
            <p className="mt-2 text-sm text-ink/60">We are between batches. Check back soon.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                selected={trip.id === selectedTripId}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </section>

      <section id="enquiry-form" className="bg-sand/15 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Send an enquiry</h2>
          <p className="mt-2 text-sm text-ink/60">
            Tell us a little about you. A real person on our team will call within a day.
          </p>
          <div className="mt-8">
            <EnquiryForm trips={trips} selectedTripId={selectedTripId} onTripChange={setSelectedTripId} />
          </div>
        </div>
      </section>
    </>
  );
}
