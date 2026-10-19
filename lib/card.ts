export const DECLINED_CARD = "4000000000000002";

export type CardFields = {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
};

export type CardErrors = Partial<Record<keyof CardFields, string>>;

const NON_DIGITS = /\D/g;
const CARD_NUMBER_GROUPS = /(\d{4})(?=\d)/g;
const EXPIRY_PATTERN = /^(\d{2})\/(\d{2})$/;
const CVC_PATTERN = /^\d{3,4}$/;

export function digitsOnly(value: string): string {
  return value.replace(NON_DIGITS, "");
}

export function formatCardNumber(value: string): string {
  return digitsOnly(value).slice(0, 16).replace(CARD_NUMBER_GROUPS, "$1 ");
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function passesLuhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

function validateExpiry(expiry: string, now: Date): string | undefined {
  const match = EXPIRY_PATTERN.exec(expiry);
  if (!match) return "Use MM/YY.";

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "Month must be 01 to 12.";

  const currentYear = now.getFullYear();
  if (year < currentYear || (year === currentYear && month < now.getMonth() + 1)) return "Card has expired.";
  return undefined;
}

export function validateCard(fields: CardFields, now: Date): CardErrors {
  const errors: CardErrors = {};

  if (fields.name.trim().length < 2) errors.name = "Enter the name on the card.";

  const number = digitsOnly(fields.number);
  if (number.length !== 16) errors.number = "Card number must be 16 digits.";
  else if (!passesLuhn(number)) errors.number = "Card number is invalid.";

  const expiryError = validateExpiry(fields.expiry, now);
  if (expiryError) errors.expiry = expiryError;

  if (!CVC_PATTERN.test(fields.cvc)) errors.cvc = "CVC must be 3 or 4 digits.";

  return errors;
}
