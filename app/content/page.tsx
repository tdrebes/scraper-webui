import Header from "@/components/Header";
import { db, scrapedContent } from "@/lib/db";
import { desc, sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

import ContentTable from "./ContentTable";

export type ScrapedContentRecord = {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  capturedAt: string;
  tags: string[];
  rawText: string;
};

type ScrapedContentRow = InferSelectModel<typeof scrapedContent>;

async function loadScrapedContent(): Promise<ScrapedContentRecord[]> {
  noStore();

  if (!db) {
    console.warn("DATABASE_URL is not set. Returning an empty scraped content list.");
    return [];
  }

  try {
    const rows = await db
      .select()
      .from(scrapedContent)
      .orderBy(sql`${scrapedContent.capturedAt} DESC NULLS LAST`, desc(scrapedContent.id))
      .limit(200);

    return rows.map(transformRowToRecord);
  } catch (error) {
    console.error("Failed to load scraped content from Postgres", error);
    return [];
  }
}

function transformRowToRecord(row: ScrapedContentRow): ScrapedContentRecord {
  const capturedAtValue =
    row.capturedAt instanceof Date
      ? row.capturedAt
      : row.capturedAt
      ? new Date(row.capturedAt)
      : null;

  const tagsSource = row.tags;
  const tags = Array.isArray(tagsSource)
    ? tagsSource
    : typeof tagsSource === "string"
    ? tagsSource.split(",")
    : [];

  const fallbackId =
    row.sourceUrl ??
    row.title ??
    row.summary ??
    (capturedAtValue ? capturedAtValue.toISOString() : undefined) ??
    `row-${Math.random().toString(36).slice(2)}`;

  return {
    id: row.id ?? fallbackId,
    title: row.title ?? "Untitled capture",
    summary: row.summary ?? "",
    sourceUrl: row.sourceUrl ?? "",
    capturedAt: capturedAtValue ? capturedAtValue.toLocaleString() : "Unknown",
    tags: tags.map((tag) => tag.trim()).filter(Boolean),
    rawText: row.rawText ?? "",
  };
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
                Check latest scraped content.
              </h1>
              <p className="max-w-2xl text-lg text-neutral-600">
                Browse recent captures and use the filters to focus on what matters.
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

        <ContentTable content={scrapedContent} />
      </main>
    </div>
  );
}
