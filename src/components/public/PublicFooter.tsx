export function PublicFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink py-10 text-cream/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg text-cream">Travel that finds you.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span>Nomichi Explorers Private Limited</span>
          <span>thenomichi.com</span>
          <span>@thenomichi</span>
        </div>
      </div>
    </footer>
  );
}
