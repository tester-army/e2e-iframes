import type { CardFieldKey } from "@/lib/card-fields";

export type CardToHostMessage =
  | { type: "card:ready"; height: number }
  | { type: "card:resize"; height: number }
  | { type: "card:submit" }
  | { type: "card:success"; last4: string }
  | { type: "card:error"; message: string };

export type HostToCardMessage = { type: "host:ping" } | { type: "host:amount"; amount: number };

export type FieldToFormMessage =
  | { type: "field:ready"; field: CardFieldKey }
  | { type: "field:change"; field: CardFieldKey; value: string }
  | { type: "field:enter"; field: CardFieldKey };

export type FormToFieldMessage = { type: "form:state"; disabled: boolean; invalid: boolean } | { type: "form:focus" };

function hasTypePrefix(data: unknown, prefix: string): data is { type: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as { type: unknown }).type === "string" &&
    (data as { type: string }).type.startsWith(prefix)
  );
}

export const isCardToHostMessage = (data: unknown): data is CardToHostMessage => hasTypePrefix(data, "card:");
export const isHostToCardMessage = (data: unknown): data is HostToCardMessage => hasTypePrefix(data, "host:");
export const isFieldToFormMessage = (data: unknown): data is FieldToFormMessage => hasTypePrefix(data, "field:");
export const isFormToFieldMessage = (data: unknown): data is FormToFieldMessage => hasTypePrefix(data, "form:");

export function isSameOrigin(event: MessageEvent): boolean {
  return event.origin === window.location.origin;
}

// Fields talk to the card form on their own origin; only the card form talks across origins to the host.
export function postToParent(message: CardToHostMessage | FieldToFormMessage, targetOrigin = window.location.origin) {
  if (window.parent === window) return;
  window.parent.postMessage(message, targetOrigin);
}

export function postToFrame(
  frame: HTMLIFrameElement | null,
  message: HostToCardMessage | FormToFieldMessage,
  targetOrigin = window.location.origin,
) {
  frame?.contentWindow?.postMessage(message, targetOrigin);
}

// The host passes its origin in the iframe URL hash, which never reaches the server.
export function cardSrc(cardOrigin: string, hostOrigin: string): string {
  return `${cardOrigin}/embed/card#origin=${encodeURIComponent(hostOrigin)}`;
}

export function readHostOrigin(hash: string): string | null {
  const value = new URLSearchParams(hash.slice(1)).get("origin");
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
