import { NomichiLogo } from "@/components/NomichiLogo";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm rounded-2xl border border-cream/10 bg-cream p-8">
        <NomichiLogo className="text-ink" />
        <h1 className="font-display mt-6 text-2xl text-ink">Team login</h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to the trip desk.</p>
        <div className="mt-6">
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
    </main>
  );
}
