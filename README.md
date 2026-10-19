# e2e-iframe

A card checkout built from nested iframes, used as an example of end-to-end testing iframe-heavy UIs with [e2e](https://www.npmjs.com/package/e2e).

![Checkout page after a successful payment](docs/screenshot.png)

## How it works

The page is set up like a hosted payment form such as Stripe Elements:

- **Host page** (`app/page.tsx`) embeds the card form in an iframe and shows the payment result.
- **Card form** (`app/embed/card`) handles validation, submission, and the Pay button.
- **Card fields** (`app/embed/field/[field]`): each input (name, number, expiry, CVC) is rendered in its own nested iframe.

The frames talk to each other with same-origin `postMessage` calls. The message types are defined in `lib/checkout-messages.ts`.

### Test cards

| Card number           | Result   |
| --------------------- | -------- |
| `4242 4242 4242 4242` | Accepted |
| `4000 0000 0000 0002` | Declined |

Use any future expiry date (`MM/YY`) and a 3–4 digit CVC.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## End-to-end tests

The tests in `tests/checkout.e2e.ts` combine `agent.act` / `agent.assert` steps with exact Playwright locators that reach into the iframes.

The agent model goes through the Vercel AI Gateway, so set `AI_GATEWAY_API_KEY` (or link a Vercel project). Then, with the dev server running:

```bash
npm run test:e2e
```

To test a different URL, set `APP_URL`. Configuration lives in `e2e.config.ts`.

## Scripts

| Command            | Description          |
| ------------------ | -------------------- |
| `npm run dev`      | Start the dev server |
| `npm run build`    | Build for production |
| `npm run lint`     | Run ESLint           |
| `npm run format`   | Format with Prettier |
| `npm run test:e2e` | Run the e2e tests    |
