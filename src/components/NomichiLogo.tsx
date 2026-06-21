import { cn } from "@/lib/utils";

// A simplified recreation of the Nomichi wordmark: blocky letterforms with
// a mountain-and-sun glyph swapped in for the O in "NOMICHI". Drawn fresh
// in SVG so it scales cleanly and can take the brand colour as currentColor.
export function NomichiLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 36"
      className={cn("h-7 w-auto", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nomichi"
      role="img"
    >
      <text
        x="0"
        y="27"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="1"
        fill="currentColor"
      >
        N
      </text>
      <g transform="translate(27, 4)">
        <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2.4" fill="none" />
        <path d="M5 18 L11 9 L15 14 L19 8 L23 18 Z" fill="currentColor" />
      </g>
      <text
        x="56"
        y="27"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="1"
        fill="currentColor"
      >
        MICHI
      </text>
    </svg>
  );
}
