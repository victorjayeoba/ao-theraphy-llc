# Shop Demo: Cart, Accounts, Checkout & Ratings

Everything here runs **entirely in the browser**. No new backend endpoints, no new
database tables, no new npm dependencies. The existing Laravel API is still the only
source of products.

Built so the shop can be demoed end to end before any payment provider or real auth
is wired up.

---

## What works

| Feature | Where | State lives in |
|---|---|---|
| Add to cart, quantities, remove, clear | Shop cards, product page, cart drawer | `localStorage["ao-cart"]` |
| Register / sign in / sign out | `/auth` | `localStorage["ao-demo-users"]`, `["ao-demo-session"]` |
| Checkout with card validation | `/checkout` | `localStorage["ao-demo-orders"]` |
| Star ratings (4.5 – 5.0) | Shop cards, product page | Derived, nothing stored |

The cart and the signed-in session both survive a page reload.

---

## New files

```
src/lib/ratings.ts          demo rating generator
src/lib/ratings.check.ts    its self-check
src/lib/payment.ts          totals, Luhn, card brand, expiry/CVC validation
src/lib/payment.check.ts    its self-check
src/components/StarRating.tsx
src/context/AuthContext.tsx demo accounts
src/pages/AuthPage.tsx      login + register tabs
src/pages/CheckoutPage.tsx  checkout form, summary, confirmation
```

Modified: `App.tsx` (routes + `AuthProvider`), `Header.tsx`, `ProductCard.tsx`,
`ProductDetails.tsx`, `CartSidebar.tsx`, `CartContext.tsx`.

---

## Ratings

`ratingFor(key)` hashes the product slug (FNV-1a) into a value in the **4.5 – 5.0**
range, plus a review count of 18–282.

Because it is a hash and not `Math.random()`, a product shows the *same* rating on
every reload, on every device, for every visitor. A random value would reshuffle on
each render and look broken.

```ts
ratingFor("sensory-swing")      // { rating: 4.8, reviewCount: 73 }
ratingFor("therapy-putty-set")  // { rating: 4.5, reviewCount: 144 }
```

If the API ever returns a real `rating` field, that wins automatically — the demo
value is only the fallback:

```ts
const stars = rating ? { rating, reviewCount } : ratingFor(slug ?? id);
```

`StarRating` clips a gold overlay to the exact percentage, so 4.7 renders as 4.7
rather than being rounded down to 4 stars.

---

## Accounts (demo)

Register with name / email / password; sign in with email + password.

It is **not** a security boundary — anyone can read or edit localStorage, and there
is no server verifying anything. Two things are still done properly so the demo
doesn't teach the wrong habit:

- Passwords are **never stored in plaintext**. Each account gets a random 16-byte
  salt and only the SHA-256 of `salt:password` is kept, via the browser's built-in
  `crypto.subtle` (no dependency).
- Wrong password and unknown account return the **same** message, so the form can't
  be used to discover which emails have accounts.

Rules: name required, valid email, password ≥ 8 characters, no duplicate emails,
emails normalised to lowercase.

**To make it real:** replace the three functions in `AuthContext.tsx` with calls to
the existing `backend/app/Http/Controllers/AuthController.php`. Nothing else in the
UI needs to change.

---

## Checkout (demo)

`/checkout` collects delivery details and card details, then simulates a ~1.4s
authorisation and shows an order confirmation with an order number.

**No card is charged and no card number is stored** — the saved order keeps only the
last 4 digits, the way a receipt would.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

The validation is real, not decorative:

- **Luhn checksum** on the card number (the same check a gateway runs first)
- **Brand detection** — Visa / Mastercard / Amex / Discover, with Amex formatted
  4-6-5 and requiring a 4-digit CVC
- **Expiry** must be a real month and not in the past (valid through the last day of
  the expiry month)
- Email, name, address, city and ZIP all required

Totals: **7% tax**, **$7.99 shipping**, free over **$75**. All in `payment.ts` as
constants — change them in one place.

Signing in is optional; the form prefills from the account if you are signed in, and
guests can check out.

**To make it real:** swap the simulated delay in `handleSubmit` for Stripe Elements.
The totals and validation already match what a gateway expects.

---

## Running the checks

The two modules holding real logic each have a runnable self-check. No test
framework, no config — Node 22 runs the TypeScript directly:

```bash
cd frontend
node --experimental-strip-types src/lib/ratings.check.ts
node --experimental-strip-types src/lib/payment.check.ts
```

Expected:

```
ratings ok: sensory-swing=4.8 foam-roller=4.6 42=5 (empty)=4.6 therapy-putty-set=4.5
payment ok — luhn, brands, expiry, cvc, totals all pass
```

The payment check pins "now" to a fixed date, so the expiry tests won't start
failing as time passes.

---

## Bugs fixed along the way

- **Cart thumbnails were broken.** `ProductCard` passed `picture`, but `CartItem`
  expects `image`, so every cart row rendered a blank thumbnail. The card now passes
  a fully-resolved absolute URL.
- **The same product could occupy two cart rows.** The API sends ids as numbers while
  the product page passed a string, so `23` and `"23"` were treated as different
  products — two rows, duplicate React keys, wrong totals. Ids are now normalised
  inside `CartContext.addItem`, so every caller gets it right rather than each one
  having to remember.
- Cart, header cart buttons and the ratings block were all fully written but
  commented out. They are now enabled.

---

## Before this goes live

1. Replace demo auth with the Laravel `AuthController` (real sessions/tokens).
2. Replace the simulated payment with Stripe — **never** accept real card numbers
   through this form as it stands.
3. Move orders from localStorage to a real `orders` table.
4. Confirm the tax rate and shipping rule with the business; the current numbers are
   placeholders.
5. Swap `ratingFor` for real review data — showing invented ratings on products you
   actually sell is fine for a demo, but not for a live store.
