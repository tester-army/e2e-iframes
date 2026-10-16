export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export const CART: CartItem[] = [
  { id: "keyboard", name: "Mechanical keyboard", quantity: 1, price: 129 },
  { id: "desk-mat", name: "Desk mat", quantity: 1, price: 24 },
  { id: "cable", name: "USB-C cable", quantity: 2, price: 6 },
];

export const CART_TOTAL = CART.reduce((sum, item) => sum + item.price * item.quantity, 0);

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatUsd(amount: number): string {
  return usd.format(amount);
}
