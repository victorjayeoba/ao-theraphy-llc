// Run: node --experimental-strip-types src/lib/payment.check.ts
import assert from "node:assert/strict";
import { calculateTotals, FREE_SHIPPING_OVER, SHIPPING_FLAT } from "./payment.ts";

// Under the threshold: product plus flat shipping, no tax.
assert.deepEqual(calculateTotals(50), { subtotal: 50, shipping: 7.99, total: 57.99 });

// The threshold itself is free shipping, not just above it.
assert.equal(calculateTotals(FREE_SHIPPING_OVER).shipping, 0);
assert.equal(calculateTotals(FREE_SHIPPING_OVER - 0.01).shipping, SHIPPING_FLAT);
assert.equal(calculateTotals(FREE_SHIPPING_OVER).total, FREE_SHIPPING_OVER);

// Empty cart: no phantom shipping charge.
assert.deepEqual(calculateTotals(0), { subtotal: 0, shipping: 0, total: 0 });

// Money stays at 2dp — 0.1 + 0.2 arithmetic must not leak into a total.
const t = calculateTotals(19.99);
assert.equal(t.total, Number(t.total.toFixed(2)));
assert.equal(t.total, 27.98);

console.log("payment ok");
