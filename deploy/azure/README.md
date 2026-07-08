# Azure Static Web Apps deployment

Deploy the React frontend to Azure Static Web Apps (free tier works for demos).

## Prerequisites

1. Backend deployed with `API_KEY` and `CORS_ALLOWED_ORIGINS` set to your SWA URL
2. Azure Static Web Apps resource linked to this GitHub repo

## Environment variables (build time)

Set in Azure Portal → Static Web App → **Configuration** → **Application settings**, or as GitHub Actions secrets:

| Variable | Example |
|---|---|
| `VITE_API_BASE_URL` | `https://nltoregex-web.azurecontainerapps.io` |
| `VITE_API_KEY` | Same value as backend `API_KEY` |

These are embedded at build time — changing them requires a rebuild.

## Backend CORS

In the Django backend `.env`:

```bash
CORS_ALLOWED_ORIGINS=https://<your-app>.azurestaticapps.net
CORS_ALLOW_ALL_ORIGINS=false
API_KEY=<same as VITE_API_KEY>
```

## Manual deploy

```bash
cp .env.production.example .env.production
# Edit VITE_API_BASE_URL and VITE_API_KEY

npm ci
npm run build
# Upload dist/ via SWA CLI or GitHub Actions
```

## GitHub Actions

The workflow at `.github/workflows/azure-static-web-apps.yml` builds with Vite (output: `dist/`) and deploys with `skip_app_build: true`.

If Azure auto-generated a workflow when you created the Static Web App, **delete the duplicate** — it may expect `build/` (Create React App) instead of `dist/` (Vite).

Required repository secrets:

| Secret | Purpose |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_*` | Auto-created by Azure when you link SWA to GitHub (e.g. `..._BLACK_PLANT_0EFFD6B00`) |
| `VITE_API_BASE_URL` | Backend URL |
| `VITE_API_KEY` | Shared API key |

## Security note

`VITE_API_KEY` is visible in the browser bundle. This is acceptable for a demo/assessment with a shared secret. For a public production app, use Azure API Management, Easy Auth, or a server-side BFF instead.
