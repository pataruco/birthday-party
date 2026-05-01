[![Deployment](https://github.com/pataruco/birthday-party/actions/workflows/deploy.yml/badge.svg)](https://github.com/pataruco/birthday-party/actions/workflows/deploy.yml)

# Birthday party 🎂

## What is it?

Vanilla, HTML, CSS, JavaScript static [website](https://pataruco.github.io/gracias-totales/) to invite to my ~~41~~ ~~43~~ ~~44~~ 45 birthday party 🎂 using:

- [DOM Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
- [Google Maps directions API](https://developers.google.com/maps/documentation/javascript/directions)
- [Google Calendar API](https://developers.google.com/calendar/v3/reference)

Build it with Vite on TypeScript and deploy it on GitHub pages

## How to run it?

Install dependencies

```sh
pnpm install
```

Development

```sh
pnpm dev
```

Local build

```sh
pnpm build
```

## Environment variables

Copy `.env.example` to `.env` and populate it:

| Variable             | What it is                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `VITE_CLIENT_ID`     | OAuth2 client ID from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=gracias-totales-1560947364062) |
| `VITE_CLIENT_SECRET` | OAuth2 client secret (same place)                                                         |
| `VITE_CALENDAR_ID`   | The calendar's email address (usually your Gmail)                                         |
| `VITE_EVENT_ID`      | The event ID — see [Extracting the event ID](#extracting-the-event-id)                    |
| `VITE_REFRESH_TOKEN` | Long-lived OAuth refresh token — see [Minting a refresh token](#minting-a-refresh-token)  |

The OAuth client must have `http://localhost` registered as an authorised redirect URI for the refresh-token flow below to work.

## Minting a refresh token

The refresh token is the credential `update-event.ts` uses to call the Calendar API on your behalf. It is long-lived (does not expire as long as it is used at least once every 6 months) and is invalidated only when you revoke the app or rotate the client secret.

A `justfile` automates the three OAuth2 steps. Requires [`just`](https://github.com/casey/just), `curl`, and `jq` on your PATH.

```sh
just                        # list recipes
just auth-url               # 1. print the auth URL
just refresh-token '<CODE>' # 2. exchange the auth code for a refresh token
just verify                 # 3. confirm the saved refresh token still works
```

### Walkthrough

1. **`just auth-url`** — prints a Google OAuth authorisation URL. Open it in a browser, sign in, and authorise the app.
2. The browser redirects to `http://localhost/?code=...&scope=...`. The page itself fails to load — that is expected, nothing is listening on port 80. Copy the `code` query parameter from the address bar.
3. **`just refresh-token '<CODE>'`** — wrap the code in single quotes (it contains `/`). The recipe POSTs the code to Google's token endpoint and prints a JSON response.
4. Copy the `refresh_token` field into `VITE_REFRESH_TOKEN` in your `.env`.
5. **`just verify`** — exchanges the refresh token for a fresh access token to confirm the credential is wired up correctly.

If the JSON from step 3 is missing the `refresh_token` field, you have already authorised this client before. The `auth-url` recipe includes `prompt=consent` to force a re-consent, which should always return one — but if it still fails, revoke the app at <https://myaccount.google.com/permissions> and start over.

## Extracting the event ID

Open the event in Google Calendar's edit view. The URL looks like:

```
https://calendar.google.com/calendar/u/0/r/eventedit/<BASE64>?pli=1
```

Base64-decode the path segment to get `<event_id> <calendar_id>`:

```sh
echo '<BASE64>' | base64 -d
# 0l86v1btqd2ms9b12sib66id0q pataruco@m
```

The first space-separated token is what goes into `VITE_EVENT_ID`. The calendar segment (`pataruco@m`) is a Google-internal short form — use your actual calendar email (e.g. `pataruco@gmail.com`) for `VITE_CALENDAR_ID`, **not** the decoded suffix.

## Deployment

Create a tagged release

```sh
git tag R.<release name>
```

Push tag

```sh
git push --tags
```
