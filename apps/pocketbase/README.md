# PocketBase Migrations

This folder contains schema migration helpers for PocketBase used by the HACRO Labs project.

Usage

- Manual run:

```bash
cd apps/pocketbase
POCKETBASE_URL=http://127.0.0.1:8090 \
POCKETBASE_ADMIN_EMAIL=you@example.com \
POCKETBASE_ADMIN_PASSWORD=yourpassword \
node migrate-conferences.js
```

- Automatic on API start:

Set `POCKETBASE_AUTO_MIGRATE=true` in `apps/api/.env` (or environment) and ensure `POCKETBASE_ADMIN_EMAIL`/`POCKETBASE_ADMIN_PASSWORD` or `POCKETBASE_ADMIN_TOKEN` are set.

Collections created (idempotent):
- `conferences`
- `conference_memberships`
- `conference_messages`
- `conference_voice_notes`
- `conference_reactions`
- `breakout_rooms`

Security

Do not commit admin credentials. Use environment variables or a short-lived `POCKETBASE_ADMIN_TOKEN`. Rotate credentials after initial setup.
