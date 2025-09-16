# Local Postgres with Docker Compose

This setup provisions a Postgres instance configured for the web UI to read scraped content.

## Usage

1. Navigate to this folder and start the database:
   ```bash
   cd docker
   docker compose up -d
   ```
2. Export the connection string (or add it to your `.env.local`):
   ```bash
   export DATABASE_URL="postgres://scraper:scraper_password@localhost:5433/scraper"
   ```
3. Run the Next.js app as usual. The `app/content/page.tsx` loader will automatically reuse the pool when `DATABASE_URL` is set.

The container publishes port `5433` on the host to avoid conflicts with a local Postgres install. Schema changes can be applied by editing the SQL files in `initdb/` and recreating the volume (`docker compose down -v && docker compose up`).
