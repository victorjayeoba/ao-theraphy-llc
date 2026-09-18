// Run: node --experimental-strip-types src/lib/payment.check.ts
import assert from "node:assert/strict";
import {
  calculateTotals,
  luhn,
  cardBrand,
  formatCardNumber,
  formatExpiry,
  validExpiry,
  validCvc,
} from "./payment.ts";

// --- Luhn: these are the standard gateway test numbers, all valid.
for (const n of ["4242424242424242", "5555555555554444", "378282246310005", "6011111111111117"]) {
  assert.ok(luhn(n), `should pass Luhn: ${n}`);
}
assert.ok(luhn("4242 4242 4242 4242"), "spaces must be ignored");
assert.ok(!luhn("4242424242424243"), "bad checksum must fail");
assert.ok(!luhn("4242"), "too short must fail");
assert.ok(!luhn(""), "empty must fail");

// --- Brands
assert.equal(cardBrand("4242424242424242"), "visa");
assert.equal(cardBrand("5555555555554444"), "mastercard");
assert.equal(cardBrand("2223003122003222"), "mastercard");
assert.equal(cardBrand("378282246310005"), "amex");
assert.equal(cardBrand("6011111111111117"), "discover");
assert.equal(cardBrand("9999999999999999"), "unknown");

// --- Formatting
assert.equal(formatCardNumber("4242424242424242"), "4242 4242 4242 4242");
assert.equal(formatCardNumber("378282246310005"), "3782 822463 10005");
assert.equal(formatCardNumber("42a42"), "4242");
assert.equal(formatExpiry("1229"), "12/29");
assert.equal(formatExpiry("1"), "1");

// --- Expiry, pinned to a fixed "now" so the check never rots.
const now = new Date(2026, 5, 15); // June 2026
assert.ok(validExpiry("07/26", now), "next month is valid");
assert.ok(validExpiry("06/26", now), "current month is valid through month end");
assert.ok(!validExpiry("05/26", now), "last month is expired");
assert.ok(!validExpiry("13/29", now), "month 13 is invalid");
assert.ok(!validExpiry("00/29", now), "month 00 is invalid");
assert.ok(!validExpiry("1229", now), "must be MM/YY");

// --- CVC
assert.ok(validCvc("123"));
assert.ok(!validCvc("12"));
assert.ok(!validCvc("1234"), "3-digit brands reject 4 digits");
assert.ok(validCvc("1234", "amex"));
assert.ok(!validCvc("123", "amex"));
assert.ok(!validCvc("12a"));

// --- Totals: shipping is free at the threshold, tax applies to subtotal only.
const under = calculateTotals(50);
assert.equal(under.shipping, 7.99);
assert.equal(under.tax, 3.5);
assert.equal(under.total, 61.49);

assert.equal(calculateTotals(75).shipping, 0, "free shipping at the threshold");
assert.equal(calculateTotals(100).shipping, 0);
assert.equal(calculateTotals(0).total, 0, "empty cart costs nothing");

// Money must not drift into float dust.
const odd = calculateTotals(19.99 * 3);
assert.equal(odd.total, Number(odd.total.toFixed(2)), `float leak: ${odd.total}`);

// --- Order numbers are unique

console.log("payment ok — luhn, brands, expiry, cvc, totals all pass");
