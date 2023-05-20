[![Deployment](https://github.com/pataruco/birthday-party/actions/workflows/deploy.yml/badge.svg)](https://github.com/pataruco/birthday-party/actions/workflows/deploy.yml)

# Birthday party 🎂

## What is it?

Vanilla, HTML, CSS, JavaScript static [website](https://pataruco.github.io/gracias-totales/) to invite to my ~~41~~ ~~43~~ ~~44~~ 45 birthday party 🎂 using:

- [DOM Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)
- [Google Maps directions API](https://developers.google.com/maps/documentation/javascript/directions)
- [Google Calendar API](https://developers.google.com/calendar/v3/reference)

Build it with Vite on TypeScript and deploy on GitHub pages

## How to run it?

- Install dependencies

  ```sh
  pnpm install
  ```

- Development

  ```sh
  pnpm dev
  ```

- Local build

  ```sh
  pnpm build
  ```

## Deployment

Create a tagged release

```sh
git tag R.<release name>
```

- Push tag
  ```sh
  git push --tags
  ```

## Notes

I followed these [steps](https://medium.com/@pablo127/google-api-authentication-with-oauth-2-on-the-example-of-gmail-a103c897fd98) to get the OAuth token and refresh the token for Google API
