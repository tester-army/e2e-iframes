// The card form plays the payment provider, so it is served from a different origin than the shop that embeds it.
// One dev server answers on both hostnames; the browser treats them as separate sites.
export const HOST_ORIGIN = new URL(process.env.NEXT_PUBLIC_HOST_ORIGIN ?? "http://localhost:3000").origin;
export const CARD_ORIGIN = new URL(process.env.NEXT_PUBLIC_CARD_ORIGIN ?? "http://127.0.0.1:3000").origin;
