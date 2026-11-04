import { digitsOnly, formatCardNumber, formatExpiry, type CardFields } from "@/lib/card";

export type CardFieldKey = keyof CardFields;

type CardFieldConfig = {
  label: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: "numeric";
  format: (value: string) => string;
};

export const CARD_FIELDS: Record<CardFieldKey, CardFieldConfig> = {
  name: { label: "name on card", placeholder: "Ada Lovelace", autoComplete: "cc-name", format: (value) => value },
  number: {
    label: "card number",
    placeholder: "4242 4242 4242 4242",
    autoComplete: "cc-number",
    inputMode: "numeric",
    format: formatCardNumber,
  },
  expiry: {
    label: "expiry",
    placeholder: "mm/yy",
    autoComplete: "cc-exp",
    inputMode: "numeric",
    format: formatExpiry,
  },
  cvc: {
    label: "cvc",
    placeholder: "123",
    autoComplete: "cc-csc",
    inputMode: "numeric",
    format: (value) => digitsOnly(value).slice(0, 4),
  },
};

export const CARD_FIELD_KEYS = Object.keys(CARD_FIELDS) as CardFieldKey[];

export function isCardFieldKey(value: string): value is CardFieldKey {
  return Object.hasOwn(CARD_FIELDS, value);
}

export function fieldSrc(field: CardFieldKey): string {
  return `/embed/field/${field}`;
}
