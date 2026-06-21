"use client";

import { useState, useTransition } from "react";
import { Textarea, Input, Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { addLeadNote } from "@/app/admin/(authenticated)/leads/[id]/actions";

interface NoteWithAuthor {
  id: string;
  body: string;
  next_action: string | null;
  created_at: string;
  author: { full_name: string } | null;
}

export function CallLog({ leadId, notes }: { leadId: string; notes: NoteWithAuthor[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addLeadNote(leadId, formData);
      if (!result.ok) setError(result.error);
      else {
        const form = document.getElementById("note-form") as HTMLFormElement | null;
        form?.reset();
      }
    });
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-cream p-5">
      <p className="text-sm font-medium text-ink">Call log</p>

      <form id="note-form" action={handleSubmit} className="mt-4 flex flex-col gap-3">
        {error && <p className="text-xs text-rust">{error}</p>}
        <Field label="What was said" htmlFor="body">
          <Textarea id="body" name="body" placeholder="Called, she is free in September..." className="min-h-20" />
        </Field>
        <Field label="Next action" htmlFor="next_action" hint="Optional">
          <Input id="next_action" name="next_action" placeholder="Send vibe check tomorrow" />
        </Field>
        <Button type="submit" variant="secondary" disabled={isPending} className="self-start">
          {isPending ? "Saving..." : "Add note"}
        </Button>
      </form>

      <div className="mt-5 flex flex-col gap-4 border-t border-ink/10 pt-5">
        {notes.length === 0 ? (
          <p className="text-sm text-ink/50">No touchpoints logged yet. Add the first one above.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="text-sm">
              <div className="flex items-center justify-between text-xs text-ink/50">
                <span>{note.author?.full_name ?? "Team"}</span>
                <span>{formatDateTime(note.created_at)}</span>
              </div>
              <p className="mt-1 text-ink/85">{note.body}</p>
              {note.next_action && (
                <p className="mt-1 text-xs font-medium text-rust">Next: {note.next_action}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
