import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const scrapedContent = pgTable("scraped_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  summary: text("summary"),
  sourceUrl: text("source_url"),
  capturedAt: timestamp("captured_at", { withTimezone: true }).defaultNow(),
  tags: text("tags").array(),
  rawText: text("raw_text"),
});

export const urls = pgTable("urls", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  active: boolean("active").default(true).notNull(),
});
