# Configuration

Signal Lab reads configuration from the runtime environment. The repository never contains provider keys, session secrets, or database credentials.

| Variable group | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection used by Drizzle. |
| `JWT_SECRET` | Session signing secret. |
| `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` | Authentication flow configuration. |
| `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Server-side model gateway configuration. |
| `VITE_APP_TITLE` | Browser title and product identity. |

For local development, configure these values through the environment manager used by your deployment platform. Do not commit `.env` files, paste secrets into README examples, or expose server-only keys through `VITE_` variables.

The browser only calls typed server procedures. Model requests and database access stay behind the server boundary.
