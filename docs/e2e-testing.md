# E2E Testing (Playwright)

This project includes an end-to-end test that reproduces the drag-and-drop regression and verifies it stays fixed. The test uses Playwright to drive a real browser against the running Vite dev server and a real Firebase account.

## What the test covers

- Signs in with email/password.
- Ensures there are at least two lanes.
- Renames the first two lanes to stable E2E names.
- Adds a card in the WIP row of the first lane and marks it done.
- Moves a different card in the second lane from Planned to WIP.
- Asserts the done card stays in the Done row and remains completed.
- Validates automatic lane ordering by WIP, then Planned, then empty lanes, and cleans up E2E lanes.

## Prerequisites

- A test Firebase user with email/password auth enabled.
- Local dev server (Playwright can start it for you).
- Set required env vars in `.env` (see `.env.example` for placeholders).
- If the password contains `#`, wrap it in quotes or escape it so dotenv parses it correctly.
- Admin dashboard tests require an `admin` custom claim on the test user (see below).

## Install and run

```bash
npm install
npx playwright install
E2E_EMAIL=you@example.com E2E_PASSWORD=secret npm run test:e2e
```

If you rely on `.env`, make sure values with `#` are quoted, for example:

```bash
E2E_PASSWORD="XjnAXR8@e4X#PR"
```

## Optional configuration

- `PLAYWRIGHT_BASE_URL` to point tests at an already-running server.
- `npm run test:e2e:ui` to use Playwright UI mode.

## Notes

- The test creates cards and renames the first two lanes for stability.
- Use a dedicated test account to avoid polluting real data.
- Admin dashboard checks are gated by an `admin` custom claim on the user.
- Keep service account JSON outside the repo (e.g., `~/.config/firebase/`) and never commit it.

## Admin Claim Flow

The admin dashboard is now gated by a Firebase Auth custom claim named `admin`.

1) Grant the claim (requires a Firebase service account):

```bash
FIREBASE_SERVICE_ACCOUNT=/path/to/serviceAccount.json npm run admin:claim -- <uid> grant
```

2) Revoke the claim when done:

```bash
FIREBASE_SERVICE_ACCOUNT=/path/to/serviceAccount.json npm run admin:claim -- <uid> revoke
```

After changing claims, sign out/in (or refresh) so the client receives the updated token.
