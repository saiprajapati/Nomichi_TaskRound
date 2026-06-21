"use client";

import { useState, useTransition } from "react";
import type { Trip } from "@/types/database";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function TripForm({
  trip,
  action,
}: {
  trip?: Trip;
  action: (formData: FormData) => Promise<{
    ok: true;
  } | {
    ok: false;
    fieldErrors: Partial<Record<string, string>>;
    formError?: string;
  }>;
}) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setFormError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await action(formData);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors);
        if (result.formError) setFormError(result.formError);
      }
      // on success, the action itself redirects
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {formError && (
        <div className="rounded-xl border border-rust/30 bg-rust/5 px-4 py-3 text-sm text-rust">{formError}</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Trip name" htmlFor="name" error={fieldErrors.name}>
          <Input id="name" name="name" defaultValue={trip?.name} placeholder="Spiti in Winter" />
        </Field>
        <Field label="Destination" htmlFor="destination" error={fieldErrors.destination}>
          <Input
            id="destination"
            name="destination"
            defaultValue={trip?.destination}
            placeholder="Spiti Valley, Himachal Pradesh"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start date" htmlFor="start_date" error={fieldErrors.start_date}>
          <Input id="start_date" name="start_date" type="date" defaultValue={trip?.start_date} />
        </Field>
        <Field label="End date" htmlFor="end_date" error={fieldErrors.end_date}>
          <Input id="end_date" name="end_date" type="date" defaultValue={trip?.end_date} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Price including GST (INR)" htmlFor="price_inr_gst" error={fieldErrors.price_inr_gst}>
          <Input
            id="price_inr_gst"
            name="price_inr_gst"
            type="number"
            min={0}
            defaultValue={trip?.price_inr_gst}
            placeholder="42500"
          />
        </Field>
        <Field label="Total seats" htmlFor="total_seats" error={fieldErrors.total_seats}>
          <Input
            id="total_seats"
            name="total_seats"
            type="number"
            min={1}
            defaultValue={trip?.total_seats}
            placeholder="8"
          />
        </Field>
      </div>

      <Field label="Status" htmlFor="status" error={fieldErrors.status}>
        <Select id="status" name="status" defaultValue={trip?.status ?? "open"}>
          <option value="open">Open — shows on the public page</option>
          <option value="closed">Closed — hidden from the public page</option>
        </Select>
      </Field>

      <Field label="Short description" htmlFor="description" error={fieldErrors.description}>
        <Textarea
          id="description"
          name="description"
          defaultValue={trip?.description}
          placeholder="Frozen rivers, quiet monasteries, and nights under more stars than you have seen at once."
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending} className="mt-2 self-start">
        {isPending ? "Saving..." : trip ? "Save changes" : "Create trip"}
      </Button>
    </form>
  );
}
