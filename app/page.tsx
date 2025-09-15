import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Build reliable web scrapers without wrestling with infrastructure.
          </h1>
          <p className="text-lg text-neutral-600">
            Scraper streamlines data extraction workflows with high-quality scheduling,
            monitoring, and data delivery tools so your team can focus on insights instead of
            brittle scripts.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
              Start building
            </button>
            <button className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">
              View documentation
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
