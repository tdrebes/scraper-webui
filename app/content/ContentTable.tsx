"use client";

import { useMemo, useState } from "react";

import type { ScrapedContentRecord } from "./page";

type ContentTableProps = {
  content: ScrapedContentRecord[];
};

export default function ContentTable({ content }: ContentTableProps) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const noContentAvailable = content.length === 0;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const item of content) {
      for (const tag of item.tags) {
        if (tag.trim()) {
          tags.add(tag.trim());
        }
      }
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [content]);

  const filteredContent = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedSelectedTags = selectedTags.map((tag) => tag.toLowerCase());
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end && !Number.isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
    }

    return content.filter((item) => {
      const matchesSearch = normalizedSearch
        ? [item.title, item.summary, item.rawText, item.sourceUrl]
            .join("\n")
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      const matchesTags = normalizedSelectedTags.length
        ? normalizedSelectedTags.every((tag) =>
            item.tags.some((itemTag) => itemTag.toLowerCase() === tag),
          )
        : true;

      const capturedDate = new Date(item.capturedAt);
      const isCapturedValid = !Number.isNaN(capturedDate.getTime());

      const matchesStart = start && !Number.isNaN(start.getTime())
        ? isCapturedValid && capturedDate >= start
        : true;

      const matchesEnd = end && !Number.isNaN(end.getTime())
        ? isCapturedValid && capturedDate <= end
        : true;

      return matchesSearch && matchesTags && matchesStart && matchesEnd;
    });
  }, [content, search, selectedTags, startDate, endDate]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((existing) => existing !== tag)
        : [...current, tag],
    );
  };

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedTags.length > 0 ||
    startDate !== "" ||
    endDate !== "";

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setStartDate("");
    setEndDate("");
  };

  const emptyStateMessage = noContentAvailable && !hasActiveFilters
    ? "No captures yet. Configure URLs and run your scraper to see results here."
    : "No captures match your filters. Try adjusting your search or tag selection.";

  return (
    <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">

        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Search
          </label>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, summary, raw text..."
            className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Tags
            </label>
            <span className="text-xs text-neutral-400">{allTags.length}</span>
          </div>
          {allTags.length === 0 ? (
            <p className="text-sm text-neutral-400">No tags available yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        isActive
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      {tag}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Captured between
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <span className="text-xs font-medium text-neutral-500">Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                max={endDate || undefined}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-medium text-neutral-500">End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                min={startDate || undefined}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-300"
        >
          Clear filters
        </button>
      </aside>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-neutral-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Latest captures</h2>
            <p className="text-sm text-neutral-500">
              Showing {filteredContent.length} of {content.length} entries
            </p>
          </div>
          {hasActiveFilters && (
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Filters active
            </span>
          )}
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
              {filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-neutral-500">
                    {emptyStateMessage}
                  </td>
                </tr>
              ) : (
                filteredContent.map((contentItem) => (
                  <tr key={contentItem.id} className="align-top transition hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-900">{contentItem.title}</td>
                    <td className="px-6 py-4 text-neutral-700">{contentItem.summary}</td>
                    <td className="px-6 py-4 text-neutral-500">
                      {contentItem.sourceUrl ? (
                        <a
                          className="break-all text-neutral-700 underline-offset-2 transition hover:text-neutral-900 hover:underline"
                          href={contentItem.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {contentItem.sourceUrl}
                        </a>
                      ) : (
                        <span className="text-neutral-400">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{contentItem.capturedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {contentItem.tags.map((tag) => (
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
                        {contentItem.rawText}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
