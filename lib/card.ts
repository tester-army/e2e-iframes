export const DECLINED_CARD = "4000000000000002";

export type CardFields = {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
};

export type CardErrors = Partial<Record<keyof CardFields, string>>;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value: string): string {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function passesLuhn(digits: string): boolean {
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

export function validateCard(fields: CardFields, now: Date): CardErrors {
  const errors: CardErrors = {};

  if (fields.name.trim().length < 2) errors.name = "Enter the name on the card.";

  const number = digitsOnly(fields.number);
  if (number.length !== 16) errors.number = "Card number must be 16 digits.";
  else if (!passesLuhn(number)) errors.number = "Card number is invalid.";

  const match = /^(\d{2})\/(\d{2})$/.exec(fields.expiry);
  if (!match) {
    errors.expiry = "Use MM/YY.";
  } else {
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) errors.expiry = "Month must be 01 to 12.";
    else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1))
      errors.expiry = "Card has expired.";
  }

  if (!/^\d{3,4}$/.test(fields.cvc)) errors.cvc = "CVC must be 3 or 4 digits.";

  return errors;
}
