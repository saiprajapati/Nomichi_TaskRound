"use client";

import { useState, useTransition } from "react";
import type { Trip } from "@/types/database";
import { GROUP_TYPE_LABELS } from "@/types/database";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { nextMonths } from "@/lib/format";
import { submitEnquiry } from "@/app/actions/enquiry";

const MONTHS = nextMonths(8);

export function EnquiryForm({
  trips,
  selectedTripId,
  onTripChange,
}: {
  trips: Trip[];
  selectedTripId: string;
  onTripChange: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (trips.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-cream p-8 text-center">
        <p className="font-display text-lg text-ink">No open trips right now.</p>
        <p className="mt-2 text-sm text-ink/60">
          We are between batches. Leave your email with us on WhatsApp or check back soon.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-olive/30 bg-olive/5 p-8 text-center">
        <p className="font-display text-2xl text-olive">Got it. We will call you soon.</p>
        <p className="mt-2 text-sm text-ink/70">
          Someone from our team usually reaches out within a day. Keep your phone close.
        </p>
        <Button
          variant="secondary"
          className="mt-5"
          onClick={() => {
            setSubmitted(false);
            setFieldErrors({});
            setFormError(null);
          }}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  function handleSubmit(formData: FormData) {
    setFormError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await submitEnquiry(formData);
      if (result.ok) {
        setSubmitted(true);
      } else {
        setFieldErrors(result.fieldErrors);
        if (result.formError) setFormError(result.formError);
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="trip_id" value={selectedTripId} />

      {formError && (
        <div className="rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">
          {formError}
        </div>
      )}

      <Field label="Which trip" htmlFor="trip_select" error={fieldErrors.trip_id}>
        <Select
          id="trip_select"
          value={selectedTripId}
          onChange={(e) => onTripChange(e.target.value)}
          invalid={Boolean(fieldErrors.trip_id)}
        >
          <option value="" disabled>
            Choose a trip
          </option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name} — {trip.destination}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={fieldErrors.name}>
          <Input id="name" name="name" placeholder="Ananya Rao" invalid={Boolean(fieldErrors.name)} />
        </Field>
        <Field label="Phone number" htmlFor="phone" error={fieldErrors.phone} hint="10 digits, we will call this number">
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="98765 43210"
            invalid={Boolean(fieldErrors.phone)}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" error={fieldErrors.email}>
        <Input id="email" name="email" type="email" placeholder="you@example.com" invalid={Boolean(fieldErrors.email)} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Who is travelling" htmlFor="group_type" error={fieldErrors.group_type}>
          <Select id="group_type" name="group_type" defaultValue="solo" invalid={Boolean(fieldErrors.group_type)}>
            {Object.entries(GROUP_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Preferred month" htmlFor="preferred_month" error={fieldErrors.preferred_month}>
          <Select
            id="preferred_month"
            name="preferred_month"
            defaultValue=""
            invalid={Boolean(fieldErrors.preferred_month)}
          >
            <option value="" disabled>
              Pick a month
            </option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="What are you hoping this trip feels like"
        htmlFor="trip_feeling"
        error={fieldErrors.trip_feeling}
        hint="A few honest lines help us more than a perfect paragraph"
      >
        <Textarea
          id="trip_feeling"
          name="trip_feeling"
          placeholder="Quiet, a little wild, somewhere we can switch off..."
          invalid={Boolean(fieldErrors.trip_feeling)}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="mt-2">
        {isPending ? "Sending..." : "Send enquiry"}
      </Button>
    </form>
  );
}
