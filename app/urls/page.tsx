import Header from "@/components/Header";
import { db, urls as urlsTable } from "@/lib/db";
import type { InferSelectModel } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

type UrlRow = InferSelectModel<typeof urlsTable>;

type UrlRecord = {
  id: string;
  url: string;
  active: boolean;
};

async function loadUrls(): Promise<UrlRecord[]> {
  noStore();

  if (!db) {
    console.warn("DATABASE_URL is not set. Returning an empty URL list.");
    return [];
  }

  try {
    const rows = await db.select().from(urlsTable).orderBy(urlsTable.url);
    return rows.map(transformRowToRecord);
  } catch (error) {
    console.error("Failed to load URLs from Postgres", error);
    return [];
  }
}

function transformRowToRecord(row: UrlRow): UrlRecord {
  return {
    id: row.id ?? `url-${Math.random().toString(36).slice(2)}`,
    url: row.url?.trim() ?? "",
    active: Boolean(row.active ?? true),
  };
}

export default async function UrlsPage() {
  const urlRecords = await loadUrls();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            URL Monitor
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Add URLs to monitor for new content.
          </h1>
          <p className="max-w-2xl text-lg text-neutral-600">
            Keep track of changes on your favorite websites by adding URLs to your monitoring list. Get notified when new content is detected, so you never miss an update.
          </p>
        </section>

        <section className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-neutral-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Tracked URLs</h2>
                <p className="text-sm text-neutral-500">
                  Monitoring {urlRecords.length} URL{urlRecords.length === 1 ? "" : "s"}.
                </p>
              </div>
              <button className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
                Add URL
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {urlRecords.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-10 text-center text-neutral-500">
                        No URLs being tracked yet. Add your first URL to start monitoring.
                      </td>
                    </tr>
                  ) : (
                    urlRecords.map((record) => (
                      <tr key={record.id} className="align-top transition hover:bg-neutral-50">
                        <td className="px-6 py-4 text-neutral-700">
                          {record.url ? (
                            <a
                              href={record.url}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-neutral-900 underline-offset-2 transition hover:text-neutral-700 hover:underline"
                            >
                              {record.url}
                            </a>
                          ) : (
                            <span className="text-neutral-400">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              record.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {record.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">
              Configure alerts
            </button>
            <button className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">
              Manage scraping rules
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
