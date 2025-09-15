import Header from "@/components/Header";

export default function UrlsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            URL Monitor
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Keep a pulse on every page you scrape.
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            Track URL health, detect structural changes, and surface the endpoints that power
            your scrapers. This page will evolve into a detailed view of monitored locations.
          </p>
        </section>

        <section className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">
            No URLs being tracked
          </h2>
          <p className="mt-2 text-neutral-600">
            Once you connect sources, their target pages will show up here for monitoring.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
              Add URL
            </button>
            <button className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">
              Configure alerts
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
