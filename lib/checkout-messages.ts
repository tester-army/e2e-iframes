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

export function postToParent(message: CardToHostMessage | FieldToFormMessage) {
  if (window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
}

export function postToFrame(frame: HTMLIFrameElement | null, message: HostToCardMessage | FormToFieldMessage) {
  frame?.contentWindow?.postMessage(message, window.location.origin);
}
