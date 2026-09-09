// Run: node --experimental-strip-types src/lib/ratings.check.ts
import assert from "node:assert/strict";
import { ratingFor } from "./ratings.ts";

const keys = ["sensory-swing", "foam-roller", "42", "", "therapy-putty-set"];

for (const k of keys) {
  const { rating, reviewCount } = ratingFor(k);
  assert.ok(rating >= 4.5 && rating <= 5.0, `${k} rating out of range: ${rating}`);
  assert.equal(rating, Number(rating.toFixed(1)), `${k} rating not 1dp: ${rating}`);
  assert.ok(reviewCount >= 18 && reviewCount <= 282, `${k} count out of range`);
}

// Deterministic: same key must always give the same value.
assert.deepEqual(ratingFor("foam-roller"), ratingFor("foam-roller"));
// Number and string keys agree, since the API sends ids either way.
assert.deepEqual(ratingFor(42), ratingFor("42"));
// Not every product collapses to one value.
assert.ok(new Set(keys.map((k) => ratingFor(k).rating)).size > 1, "no spread");

console.log("ratings ok:", keys.map((k) => `${k || "(empty)"}=${ratingFor(k).rating}`).join(" "));
