// DEMO PAYMENT. Nothing here talks to a gateway and no card data ever leaves the
// page or gets stored. The validation is real (so the form behaves like the real
// thing) but authorisation is simulated. Swap for Stripe Elements before launch.

export const FREE_SHIPPING_OVER = 75;
export const SHIPPING_FLAT = 7.99;
export const TAX_RATE = 0.07;

export interface Totals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const calculateTotals = (subtotal: number): Totals => {
  const shipping = subtotal <= 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const tax = round2(subtotal * TAX_RATE);
  return {
    subtotal: round2(subtotal),
    shipping,
    tax,
    total: round2(round2(subtotal) + shipping + tax),
  };
};

/** Luhn checksum — the same check a real gateway runs before charging. */
export const luhn = (value: string): boolean => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
};

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export const cardBrand = (value: string): CardBrand => {
  const d = value.replace(/\D/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^6(?:011|5)/.test(d)) return "discover";
  return "unknown";
};

/** Amex is 4-6-5, everything else is groups of 4. */
export const formatCardNumber = (value: string): string => {
  const d = value.replace(/\D/g, "").slice(0, 16);
  if (cardBrand(d) === "amex") {
    const a = d.slice(0, 15);
    return [a.slice(0, 4), a.slice(4, 10), a.slice(10, 15)].filter(Boolean).join(" ");
  }
  return (d.match(/.{1,4}/g) ?? []).join(" ");
};

export const formatExpiry = (value: string): string => {
  const d = value.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/** MM/YY must be a real month and not already past. */
export const validExpiry = (value: string, now = new Date()): boolean => {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  // Card is valid through the last day of its expiry month.
  return new Date(year, month, 1) > now;
};

export const validCvc = (value: string, brand: CardBrand = "unknown"): boolean =>
  new RegExp(`^\\d{${brand === "amex" ? 4 : 3}}$`).test(value.trim());
