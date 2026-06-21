import Link from "next/link";
import { NomichiLogo } from "@/components/NomichiLogo";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-ink">
          <NomichiLogo />
        </Link>
        <nav className="flex items-center gap-5 text-sm text-ink/70">
          <Link href="/#trips" className="hover:text-ink transition-colors">
            Trips
          </Link>
          <Link
            href="/admin"
            className="hidden sm:inline hover:text-ink transition-colors"
          >
            Team login
          </Link>
        </nav>
      </div>
    </header>
  );
}
