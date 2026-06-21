"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, Copy, Check } from "lucide-react";
import { draftWhatsappMessage, summarizeCallLog, suggestVibeFit } from "@/app/admin/(authenticated)/leads/[id]/ai-actions";

type Tool = "whatsapp" | "summary" | "vibe";

export function AiAssistPanel({ leadId }: { leadId: string }) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [whatsappMsg, setWhatsappMsg] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [vibe, setVibe] = useState<{ fit: string; reason: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function run(tool: Tool) {
    setActiveTool(tool);
    setError(null);
    startTransition(async () => {
      if (tool === "whatsapp") {
        const r = await draftWhatsappMessage(leadId);
        if (r.ok) setWhatsappMsg(r.message);
        else setError(r.error);
      } else if (tool === "summary") {
        const r = await summarizeCallLog(leadId);
        if (r.ok) setSummary(r.summary);
        else setError(r.error);
      } else {
        const r = await suggestVibeFit(leadId);
        if (r.ok) setVibe({ fit: r.fit, reason: r.reason });
        else setError(r.error);
      }
    });
  }

  function copyWhatsapp() {
    if (!whatsappMsg) return;
    navigator.clipboard.writeText(whatsappMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-rust/20 bg-rust/[0.03] p-5">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-rust" />
        <p className="text-sm font-medium text-ink">AI assist</p>
      </div>
      <p className="mt-1 text-xs text-ink/50">Drafts and suggestions. Always read before you send.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => run("whatsapp")} disabled={isPending}>
          Draft WhatsApp message
        </Button>
        <Button variant="secondary" size="sm" onClick={() => run("summary")} disabled={isPending}>
          Summarise call log
        </Button>
        <Button variant="secondary" size="sm" onClick={() => run("vibe")} disabled={isPending}>
          Read the vibe
        </Button>
      </div>

      {isPending && <p className="mt-4 text-sm text-ink/50">Thinking...</p>}

      {!isPending && error && activeTool && (
        <p className="mt-4 text-sm text-rust">{error}</p>
      )}

      {!isPending && activeTool === "whatsapp" && whatsappMsg && (
        <div className="mt-4 rounded-xl border border-ink/10 bg-cream p-4">
          <p className="whitespace-pre-wrap text-sm text-ink/85">{whatsappMsg}</p>
          <button
            onClick={copyWhatsapp}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-rust hover:underline"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy to send on WhatsApp"}
          </button>
        </div>
      )}

      {!isPending && activeTool === "summary" && summary && (
        <div className="mt-4 rounded-xl border border-ink/10 bg-cream p-4">
          <p className="text-sm text-ink/85">{summary}</p>
        </div>
      )}

      {!isPending && activeTool === "vibe" && vibe && (
        <div className="mt-4 rounded-xl border border-ink/10 bg-cream p-4">
          <p className="text-sm font-medium text-ink">{vibe.fit}</p>
          <p className="mt-1 text-sm text-ink/70">{vibe.reason}</p>
          <p className="mt-2 text-xs text-ink/40">A suggestion only. Use your own judgement.</p>
        </div>
      )}
    </div>
  );
}
