"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NomichiLogo } from "@/components/NomichiLogo";
import { LayoutDashboard, Users, Map, LogOut } from "lucide-react";
import { logout } from "@/app/admin/login/actions";

const links = [
  { href: "/admin", label: "Leads", icon: Users },
  { href: "/admin/trips", label: "Trips", icon: Map },
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ink/10 bg-cream">
      <div className="flex items-center gap-2 px-6 py-6">
        <NomichiLogo className="text-ink" />
      </div>

      <nav className="flex-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-ink text-cream" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink/10 px-4 py-4">
        <p className="truncate px-2 text-xs text-ink/50">{userEmail}</p>
        <form action={logout}>
          <button
            type="submit"
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink/60 hover:bg-ink/5 hover:text-ink"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
