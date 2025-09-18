# Scraper WebUI

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and adjust values as needed:
   ```bash
   cp .env.example .env.local
   ```
3. Start the bundled Postgres instance from the `docker/` folder:
   ```bash
   cd docker
   docker compose up -d
   ```
   The service listens on `localhost:5433` using the credentials in `.env.example`. Export
   the connection string (or keep it in `.env.local`) before starting the app:
   ```bash
   export DATABASE_URL="postgres://scraper:scraper_password@localhost:5433/scraper"
   ```
   Seed data is loaded automatically from `docker/initdb/`. If you modify those files,
   recreate the volume: `docker compose down -v && docker compose up -d`.
4. Launch the Next.js dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the UI during development.

## Production Image

The repository includes a multi-stage Dockerfile that produces an optimized standalone
Next.js build. Build the image and tag it for reuse:

```bash
docker build -t scraper-webui .
```

Run the container, publishing port 3000 and providing the required environment:

```bash
docker run --rm -p 3000:3000 --env-file .env scraper-webui
```

The container serves the app with `node server.js` (generated via `npm run build`) and
binds to `0.0.0.0:3000` for production deployments.
