export function formatINR(amountInWholeRupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInWholeRupees);
}

export function formatDateRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  const dayFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric" });
  const monthYearFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "short" });

  if (sameMonth) {
    return `${dayFmt.format(start)}–${monthYearFmt.format(end)}`;
  }
  return `${dayFmt.format(start)} ${monthFmt.format(start)} – ${monthYearFmt.format(end)}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso)
  );
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso);
}

// Indian mobile numbers: optional +91 / 0 prefix, then 10 digits starting 6-9.
const PHONE_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;

export function isValidIndianPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s-]/g, "");
  return PHONE_REGEX.test(cleaned);
}

export function nextMonths(count: number): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(d);
    out.push({ value: label, label });
  }
  return out;
}
