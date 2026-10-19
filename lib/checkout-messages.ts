import type { CardFieldKey } from "@/lib/card-fields";

export type CardToHostMessage =
  | { type: "card:ready"; height: number }
  | { type: "card:resize"; height: number }
  | { type: "card:submit" }
  | { type: "card:success"; last4: string; name: string }
  | { type: "card:error"; message: string };

export type HostToCardMessage =
  | { type: "host:ping" }
  | { type: "host:amount"; amount: number; currency: "USD" };

export type FieldToFormMessage =
  | { type: "field:ready"; field: CardFieldKey }
  | { type: "field:change"; field: CardFieldKey; value: string }
  | { type: "field:enter"; field: CardFieldKey };

export type FormToFieldMessage =
  | { type: "form:state"; disabled: boolean; invalid: boolean }
  | { type: "form:focus" };

function hasType(data: unknown): data is { type: string } {
  return typeof data === "object" && data !== null && typeof (data as { type: unknown }).type === "string";
}

export function isCardToHostMessage(data: unknown): data is CardToHostMessage {
  return hasType(data) && data.type.startsWith("card:");
}

export function isHostToCardMessage(data: unknown): data is HostToCardMessage {
  return hasType(data) && data.type.startsWith("host:");
}

export function isFieldToFormMessage(data: unknown): data is FieldToFormMessage {
  return hasType(data) && data.type.startsWith("field:");
}

export function isFormToFieldMessage(data: unknown): data is FormToFieldMessage {
  return hasType(data) && data.type.startsWith("form:");
}
