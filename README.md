# AlgoVision

Interactive DSA Algorithm Visualizer & Line-by-Line Debugger

## Features

- Interactive visualizers for sorting, searching, graph traversal, and arrays
- Step-by-step execution with code-line highlighting and variable tracking
- Previous / Next / Reset controls
- User authentication and dashboard-based learning progress

## Tech Stack

React
TypeScript
Vite
Tailwind CSS

## MySQL-backed authentication and learning progress

The Flask API in `backend/` authenticates users with opaque, revocable session
cookies (`HttpOnly`, `SameSite`, and `Secure` in production). Completed
activities and UTC completion dates are stored in MySQL, keyed to the user
identified by the server-side session. The client never chooses a user ID for
progress reads or writes.

### Local setup

1. Create or update the MySQL schema with `backend/schema.sql`. Existing
   installations should run this file to add the `auth_sessions` and
   `activity_completions` tables.
2. Copy `backend/.env.example` to `backend/.env` and set a dedicated MySQL
   account and password. Do not use the example values in a deployment.
3. Install backend dependencies with
   `python -m pip install -r backend/requirements.txt`.
4. Start the API with `python backend/app.py`.
5. Set `VITE_API_URL` if the API is not at `http://127.0.0.1:5000`, then run
   `npm run dev`.

### Production configuration

- Set `APP_ENV=production`, `COOKIE_SECURE=true`, and a MySQL TLS CA path in
  `DB_SSL_CA`. The API verifies the database certificate and hostname.
- Set `FRONTEND_ORIGINS` to the exact deployed frontend origins (comma-separated,
  scheme included). Never use a wildcard origin with credentialed cookies.
- Use `COOKIE_SAMESITE=Lax` when the frontend and API share a site. For a
  cross-site deployment, use `COOKIE_SAMESITE=None` with HTTPS and
  `COOKIE_SECURE=true`.
- When the API is reverse-proxied under the frontend origin at `/api`, leave
  `VITE_API_URL` unset. Otherwise, set the frontend build variable to the HTTPS
  API origin.
- Configure the frontend server to proxy `/api` to the Flask API, or configure
  the API’s `FRONTEND_ORIGINS` allowlist for the exact frontend origin.
- Deploy the Flask API with a production WSGI server, for example from
  `backend/`: `gunicorn --bind 0.0.0.0:$PORT app:app`.
- Keep `backend/.env` and all database credentials in the deployment secret
  manager. Run schema changes as a controlled database migration before
  releasing the API.

The dashboard shows progress loading, service errors with retry, a genuine
zero-progress state, and sign-in/session verification states. Completion write
failures are surfaced with a retry action.
