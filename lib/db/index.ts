import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

type GlobalWithDb = typeof globalThis & {
  pgPool?: Pool;
  drizzleDb?: NodePgDatabase<typeof schema>;
};

const globalForDb = globalThis as GlobalWithDb;
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? globalForDb.pgPool ??
    new Pool({
      connectionString,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : undefined;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

const db: NodePgDatabase<typeof schema> | undefined = pool
  ? globalForDb.drizzleDb ?? drizzle(pool, { schema })
  : undefined;

if (db && process.env.NODE_ENV !== "production") {
  globalForDb.drizzleDb = db;
}

export { db, pool };
export type Database = NodePgDatabase<typeof schema>;
export * from "./schema";
