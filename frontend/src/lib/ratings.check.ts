// Run: node --experimental-strip-types src/lib/ratings.check.ts
import assert from "node:assert/strict";
import { productRating } from "./ratings.ts";

// Laravel sends snake_case, and decimals may arrive as strings.
assert.deepEqual(productRating({ rating: "4.6", review_count: 128 }), { rating: 4.6, reviewCount: 128 });
// 0 is a real rating, not "missing".
assert.deepEqual(productRating({ rating: 0 }), { rating: 0, reviewCount: 0 });
// No rating means no stars: never a made-up value.
assert.equal(productRating({ rating: null }), null);
assert.equal(productRating({ rating: "" }), null);
assert.equal(productRating({}), null);

console.log("ratings ok");
