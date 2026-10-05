// Run: node --experimental-strip-types src/lib/payment.check.ts
import assert from "node:assert/strict";
import { calculateTotals, FREE_SHIPPING_OVER, SHIPPING_FLAT } from "./payment.ts";

// Under the threshold: flat shipping plus 7% tax.
assert.deepEqual(calculateTotals(50), { subtotal: 50, shipping: 7.99, tax: 3.5, total: 61.49 });

// The threshold itself is free shipping, not just above it.
assert.equal(calculateTotals(FREE_SHIPPING_OVER).shipping, 0);
assert.equal(calculateTotals(FREE_SHIPPING_OVER - 0.01).shipping, SHIPPING_FLAT);

// Empty cart: no phantom shipping charge.
assert.deepEqual(calculateTotals(0), { subtotal: 0, shipping: 0, tax: 0, total: 0 });

// Money stays at 2dp — 0.1 + 0.2 arithmetic must not leak into a total.
const t = calculateTotals(19.99);
assert.equal(t.total, Number(t.total.toFixed(2)));
assert.equal(t.total, 29.38);

console.log("payment ok");
