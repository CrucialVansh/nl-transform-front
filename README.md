# NL Transform Frontend

React + Vite UI for the NL-to-regex data processing platform. Talks to the Django backend for file upload, async job polling, and paginated results.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Run the Django backend on `http://127.0.0.1:8000`. The Vite dev server proxies `/api` and `/llm` to it — leave `VITE_API_BASE_URL` empty.

If the backend has `API_KEY` set, add the same value to `.env.local`:

```bash
VITE_API_KEY=your-local-api-key
```

## Production build

Environment variables are baked in at build time:

```bash
cp .env.production.example .env.production
# Set VITE_API_BASE_URL and VITE_API_KEY

npm ci
npm run build
npm run preview   # smoke test at http://localhost:4173
```

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Full backend URL (e.g. Azure Container App) |
| `VITE_API_KEY` | Must match backend `API_KEY` |

All API requests send `Authorization: Bearer <VITE_API_KEY>` when the key is set.

## Azure deployment

See **`deploy/azure/README.md`** for Static Web Apps setup, required secrets, and backend CORS configuration.

Quick checklist:

1. Deploy Django backend with `API_KEY` and `CORS_ALLOWED_ORIGINS=https://<your-swa>.azurestaticapps.net`
2. Create Azure Static Web Apps resource
3. Set GitHub secrets: `AZURE_STATIC_WEB_APPS_API_TOKEN`, `VITE_API_BASE_URL`, `VITE_API_KEY`
4. Push to `main` — GitHub Actions builds and deploys `dist/`

## Optional Docker static hosting

```bash
npm run build
docker build -t nl-transform-front .
docker run -p 8080:80 nl-transform-front
```

Serve behind nginx with the included `nginx.conf` (SPA fallback).

## API endpoints used

| Endpoint | Purpose |
|---|---|
| `GET /api/uploads` | List uploads and jobs |
| `POST /api/upload` | Upload CSV/XLSX |
| `GET /api/uploads/:id/status` | Poll until columns ready |
| `POST /llm/invoke` | Start transform job |
| `GET /llm/check_status_view/:id` | Poll job progress |
| `POST /llm/jobs/:id/cancel` | Cancel job |
| `GET /api/jobs/:id/results` | Paginated results |
