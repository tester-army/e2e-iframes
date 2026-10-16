export type CardToHostMessage =
  | { type: "card:ready"; height: number }
  | { type: "card:resize"; height: number }
  | { type: "card:submit" }
  | { type: "card:success"; last4: string; name: string }
  | { type: "card:error"; message: string };

export type HostToCardMessage =
  | { type: "host:ping" }
  | { type: "host:amount"; amount: number; currency: "USD" };

function hasType(data: unknown): data is { type: string } {
  return typeof data === "object" && data !== null && typeof (data as { type: unknown }).type === "string";
}

export function isCardToHostMessage(data: unknown): data is CardToHostMessage {
  return hasType(data) && data.type.startsWith("card:");
}

export function isHostToCardMessage(data: unknown): data is HostToCardMessage {
  return hasType(data) && data.type.startsWith("host:");
}
