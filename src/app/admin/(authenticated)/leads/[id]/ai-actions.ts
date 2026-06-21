"use server";

import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { GROUP_TYPE_LABELS, type Lead } from "@/types/database";
import { formatDateRange, formatINR } from "@/lib/format";

const NOMICHI_VOICE = `You write in Nomichi's voice: warm, honest, specific, still. Second person.
Short sentences. Never use exclamation marks. Never use em-dashes. Never use words like
"unlock", "elevate", "embark", "journey" as a verb, or other inflated marketing language.
Prefer a concrete detail over an abstract feeling.`;

type LeadWithTrip = Lead & {
  trip: {
    name: string;
    destination: string;
    start_date: string;
    end_date: string;
    price_inr_gst: number;
    description: string;
  } | null;
};

type NoteForSummary = {
  body: string;
  next_action: string | null;
  created_at: string;
};

async function loadLeadContext(leadId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(`*, trip:trips ( name, destination, start_date, end_date, price_inr_gst, description )`)
    .eq("id", leadId)
    .single();

  if (error || !data) return null;
  const lead = data as unknown as LeadWithTrip;

  const { data: notesData } = await supabase
    .from("lead_notes")
    .select("body, next_action, created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  const notes = (notesData ?? []) as unknown as NoteForSummary[];

  return { lead, notes };
}

export async function draftWhatsappMessage(leadId: string) {
  const context = await loadLeadContext(leadId);
  if (!context) return { ok: false as const, error: "Could not load this lead." };
  const { lead } = context;
  const trip = lead.trip;

  const prompt = `Write a first WhatsApp message to a traveller who just sent us an enquiry.

Traveller: ${lead.name}, travelling ${GROUP_TYPE_LABELS[lead.group_type]}.
What they told us they want this trip to feel like: "${lead.trip_feeling || "(left blank)"}"
Preferred month: ${lead.preferred_month}

Trip they enquired about: ${trip ? `${trip.name}, ${trip.destination}, ${formatDateRange(trip.start_date, trip.end_date)}, ${formatINR(trip.price_inr_gst)} per person including GST. ${trip.description}` : "Trip details unavailable."}

Keep it under 80 words. Open by referencing something specific they told us, not a generic greeting.
End with one easy question that moves the conversation forward, not a hard sell.
Do not mention price unless they specifically asked about it. Sign off as "Team Nomichi" only if a sign-off feels natural, otherwise skip it.
Output only the message text, nothing else.`;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: NOMICHI_VOICE,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    return { ok: true as const, message: text.trim() };
  } catch (err) {
    console.error("draftWhatsappMessage error", err);
    return { ok: false as const, error: "Could not generate a draft right now. Try again shortly." };
  }
}

export async function summarizeCallLog(leadId: string) {
  const context = await loadLeadContext(leadId);
  if (!context) return { ok: false as const, error: "Could not load this lead." };
  const { lead, notes } = context;

  if (notes.length === 0) {
    return { ok: false as const, error: "No call log entries yet. Add a note first." };
  }

  const notesText = notes
    .map(
      (n, i) =>
        `${i + 1}. ${new Date(n.created_at).toLocaleDateString("en-IN")}: ${n.body}${
          n.next_action ? ` (Next: ${n.next_action})` : ""
        }`
    )
    .join("\n");

  const prompt = `Here is the call log for a lead named ${lead.name}, currently at status "${lead.status}".

${notesText}

Summarise this into exactly one line: where this stands right now and what to do next.
Plain, factual, no filler. Under 25 words. Output only that one line.`;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 100,
      system: NOMICHI_VOICE,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    return { ok: true as const, summary: text.trim() };
  } catch (err) {
    console.error("summarizeCallLog error", err);
    return { ok: false as const, error: "Could not summarise right now. Try again shortly." };
  }
}

export async function suggestVibeFit(leadId: string) {
  const context = await loadLeadContext(leadId);
  if (!context) return { ok: false as const, error: "Could not load this lead." };
  const { lead } = context;

  if (!lead.trip_feeling || lead.trip_feeling.trim().length < 5) {
    return { ok: false as const, error: "Not enough in their answer to read yet." };
  }

  const prompt = `Nomichi runs slow, offbeat, small-group trips for people who want a trip to feel personal,
not a packed sightseeing itinerary and not a party trip.

A traveller named ${lead.name} answered "what are you hoping this trip feels like" with:
"${lead.trip_feeling}"

They are travelling: ${GROUP_TYPE_LABELS[lead.group_type]}.

Based only on this answer, suggest whether they look like a fit for Nomichi's style of travel.
Respond in exactly this format on two lines:
FIT: <one of "Likely fit", "Worth a call", "Possibly not a fit">
REASON: <one short, specific sentence, under 20 words, referencing what they actually said>

This is a suggestion for a human to use their own judgement with, never an automatic decision.`;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 150,
      system: NOMICHI_VOICE,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    const fitMatch = text.match(/FIT:\s*(.+)/i);
    const reasonMatch = text.match(/REASON:\s*(.+)/i);
    return {
      ok: true as const,
      fit: fitMatch?.[1]?.trim() ?? "Worth a call",
      reason: reasonMatch?.[1]?.trim() ?? text.trim(),
    };
  } catch (err) {
    console.error("suggestVibeFit error", err);
    return { ok: false as const, error: "Could not read the vibe right now. Try again shortly." };
  }
}
