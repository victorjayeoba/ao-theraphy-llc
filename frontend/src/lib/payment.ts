// Display totals for the cart and checkout summary.
//
// These mirror the constants in backend/app/Http/Controllers/CheckoutController.php — keep the
// two in step. The server recomputes everything from the database before charging, so what is
// here is for showing the customer, never the source of truth for what they pay.
//
// Card validation used to live here; Stripe's hosted page handles all of that now.

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
