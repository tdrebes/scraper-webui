import Header from "@/components/Header";
import { unstable_noStore as noStore } from "next/cache";
import { Pool } from "pg";

type ScrapedContentRecord = {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  capturedAt: string;
  tags: string[];
  rawText: string;
};

type GlobalWithPgPool = typeof globalThis & {
  pgPool?: Pool;
};

const globalForPg = globalThis as GlobalWithPgPool;
const connectionString = process.env.DATABASE_URL;

const pool =
  connectionString &&
  (globalForPg.pgPool ??
    new Pool({
      connectionString,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
    }));

if (pool && process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

async function loadScrapedContent(): Promise<ScrapedContentRecord[]> {
  noStore();

  if (!pool) {
    console.warn("DATABASE_URL is not set. Returning an empty scraped content list.");
    return [];
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query<{
      id: string | null;
      title: string | null;
      summary: string | null;
      source_url: string | null;
      captured_at: string | Date | null;
      tags: string[] | string | null;
      raw_text: string | null;
    }>(
      `
        SELECT
          id::text AS id,
          title,
          summary,
          source_url,
          captured_at,
          tags,
          raw_text
        FROM scraped_content
        ORDER BY captured_at DESC NULLS LAST, id DESC
        LIMIT 200
      `,
    );

    return rows.map((row) => {
      const capturedAtValue =
        row.captured_at instanceof Date
          ? row.captured_at
          : row.captured_at
          ? new Date(row.captured_at)
          : null;

      const tagsSource = row.tags;
      const tags = Array.isArray(tagsSource)
        ? tagsSource
        : typeof tagsSource === "string"
        ? tagsSource.split(",")
        : [];

      const fallbackId =
        row.source_url ??
        row.title ??
        row.summary ??
        (capturedAtValue ? capturedAtValue.toISOString() : undefined) ??
        `row-${Math.random().toString(36).slice(2)}`;

      return {
        id: row.id ?? fallbackId,
        title: row.title ?? "Untitled capture",
        summary: row.summary ?? "",
        sourceUrl: row.source_url ?? "",
        capturedAt: capturedAtValue
          ? capturedAtValue.toLocaleString()
          : "Unknown",
        tags: tags.map((tag) => tag.trim()).filter(Boolean),
        rawText: row.raw_text ?? "",
      };
    });
  } catch (error) {
    console.error("Failed to load scraped content from Postgres", error);
    return [];
  } finally {
    client.release();
  }
}

export default async function ContentPage() {
  const scrapedContent = await loadScrapedContent();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Scraped Content
          </p>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Review what your configured URLs have captured.
              </h1>
              <p className="max-w-2xl text-lg text-neutral-600">
                Every entry pulls directly from the monitored URLs on the URLs page. Inspect the
                captured text, confirm timestamps, and browse tag metadata to keep your downstream
                systems aligned.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
                Export all
              </button>
              <button className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">
                Manage URLs
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">Latest captures</h2>
            <span className="text-sm text-neutral-500">
              {scrapedContent.length} configured URLs
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Summary
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Source URL
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Captured at
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Raw text
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {scrapedContent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                      No captures yet. Configure URLs and run your scraper to see results here.
                    </td>
                  </tr>
                ) : (
                  scrapedContent.map((content) => (
                    <tr key={content.id} className="align-top transition hover:bg-neutral-50">
                      <td className="px-6 py-4 text-neutral-900">{content.title}</td>
                      <td className="px-6 py-4 text-neutral-700">{content.summary}</td>
                      <td className="px-6 py-4 text-neutral-500">
                        {content.sourceUrl ? (
                          <a
                            className="break-all text-neutral-700 underline-offset-2 transition hover:text-neutral-900 hover:underline"
                            href={content.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {content.sourceUrl}
                          </a>
                        ) : (
                          <span className="text-neutral-400">Not provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{content.capturedAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {content.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-xl text-sm text-neutral-700">
                          {content.rawText}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
