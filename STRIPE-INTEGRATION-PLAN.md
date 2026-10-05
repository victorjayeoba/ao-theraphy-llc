# Stripe Checkout Integration Plan

A&O Therapy LLC shop — 5 October 2026

---

## 1. Goal and scope

Replace the demo checkout with real card payments through **Stripe Checkout** (Stripe's hosted
payment page).

**In scope**

- Customer pays by card on Stripe's hosted page.
- Paid orders appear in the admin dashboard.
- Customer receives a confirmation email; the admin receives a notification.

**Out of scope for now** (deliberately, add later)

- Delivery addresses and shipping logistics.
- Refunds from the dashboard (do them in the Stripe dashboard for now).
- Customer accounts tied to orders, saved cards, subscriptions.
- Proper per-state sales tax (see decision 2).

---

## 2. How the flow works

```
 Cart
   │  customer clicks Checkout
   ▼
 POST /api/checkout/session        ← our server
   │  • re-reads every price from the database
   │  • creates order, status = pending
   │  • creates a Stripe Checkout Session
   │  returns the session URL
   ▼
 Stripe's hosted payment page      ← card details are entered HERE, never on our site
   │
   ├── customer pays ──────────────┐
   │                               │
   ▼                               ▼
 redirect to /checkout/success   POST /api/stripe/webhook   ← Stripe calls us
   │  • clears the cart             │  • verifies the signature
   │  • shows the order number      │  • order status = paid
   │  (display only)                │  • sends both emails
   │                                ▼
   │                           order shows as paid in the admin dashboard
   ▼
 done
```

### The one rule that matters

**An order is marked paid by the webhook, and only by the webhook.**

The redirect back to our site is not proof of payment. A customer can close the tab before being
redirected, lose signal, or type the success URL by hand. The webhook is a server-to-server call
from Stripe, signed with a secret only Stripe and our server know. It is the only trustworthy
signal that money actually moved.

This cuts both ways: the webhook can also arrive *before* the customer gets redirected. The
success page must handle "not paid yet" gracefully rather than assuming.

---

## 3. Why hosted Checkout rather than card fields on our own page

- **Card details never touch our server or our code.** That keeps us in Stripe's simplest
  compliance category (SAQ-A). Hosting our own card fields means taking on obligations for
  handling card data, which is not worth it for this shop.
- **Apple Pay, Google Pay, 3-D Secure, receipts and card error handling** come for free and stay
  maintained by Stripe.
- **No new frontend dependency.** We redirect to a URL Stripe gives us. No Stripe JavaScript
  library, no extra bundle weight.
- **Less code than we have today.** The fake card form and the Luhn validation in
  `frontend/src/lib/payment.ts` get deleted.

Trade-off: the customer briefly leaves our site, and the page is Stripe's, with limited branding
(logo and colours only). Worth it.

---

## 4. What already exists

The groundwork is done, which is why this is mostly wiring.

| Piece | State | Where |
|---|---|---|
| Server-side price calculation | Done — prices come from the database, never the client | `backend/app/Http/Controllers/OrderController.php` |
| Orders table | Done — items stored as a JSON snapshot, so later product edits don't rewrite history | `backend/database/migrations/2026_09_18_000001_create_orders_table.php` |
| Admin orders page | Done | `backend/resources/views/orders.blade.php` |
| Email sending | Done — Resend, already used for consultations | `backend/app/Mail/`, `MAIL_MAILER=resend` |
| Cart | Done — persists across reloads | `frontend/src/context/CartContext.tsx` |
| Checkout page | Demo only — fake card form, to be replaced | `frontend/src/pages/CheckoutPage.tsx` |

The existing `POST /api/orders` endpoint already does the hard part: it validates the cart, looks
up each product, and recomputes the totals server-side. The new session endpoint reuses that logic
rather than duplicating it.

---

## 5. Decisions needed before starting

**1. Delivery addresses.** Recommendation: let Stripe collect the shipping address on its own page
(one setting, `shipping_address_collection`), and make our `address` / `city` / `zip` columns
nullable. Enabling delivery later is then a config change, not a new form. Alternative: skip
addresses entirely for now.

**2. Tax.** Currently a flat 7%. Recommendation: keep it exactly as is so totals don't change.
Be aware it will be wrong for some customers, since US sales tax varies by state and city, and
it is the business's liability. Stripe Tax calculates it correctly but adds a per-transaction
fee. Fine to start flat and revisit.

**3. Test mode first.** Build and verify with test keys (`sk_test_...`) and Stripe's test cards.
Going live is then an environment-variable change. Strongly recommended.

---

## 6. Phase 1 — Database and configuration

**Migration** (`add_stripe_to_orders_table`):

| Column | Type | Why |
|---|---|---|
| `stripe_session_id` | string, nullable, unique | Links our order to the Stripe session; the success page looks the order up by it |
| `stripe_payment_intent` | string, nullable | The actual payment, for refunds and dashboard lookups |
| `status` | default changes `paid` → `pending` | Nothing is paid until the webhook says so |
| `address`, `city`, `zip` | become nullable | Not collected up front any more (decision 1) |

**Environment** (`backend/.env`, server only, never committed):

```
STRIPE_SECRET=sk_test_...          # then sk_live_... at go-live
STRIPE_WEBHOOK_SECRET=whsec_...    # from the Stripe dashboard when the endpoint is created
```

Add a `config/services.php` entry for both so Laravel reads them through `config()` and they work
with config caching. The **publishable key is not needed at all** with hosted Checkout, and the
secret key must never reach the frontend.

**Package:** `composer require stripe/stripe-php`

---

## 7. Phase 2 — Create the Checkout Session

New endpoint: `POST /api/checkout/session`

1. Validate the incoming cart (same rules as the current `POST /api/orders`).
2. Load the products and **recompute every price from the database**. The client sends product IDs
   and quantities only. A price sent by the browser is never trusted.
3. Create the order row with `status = pending`.
4. Build the Stripe session:
   - One line item per product, priced from the database.
   - Shipping as a shipping option (free over $75, otherwise $7.99).
   - Tax as its own line item at 7% (per decision 2).
   - `success_url` → `/checkout/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url` → back to the cart, contents intact.
   - `metadata.order_id` → so the webhook can find the order.
5. Save `stripe_session_id` on the order, return the session URL.

**Money is handled in integer cents.** Stripe requires it, and it avoids floating-point rounding
errors on totals. Convert once, at the boundary.

**Deliberate consequence:** every started checkout creates a pending order, so abandoned carts
appear in the dashboard. That is useful information, as long as the admin page shows status
clearly (phase 6).

---

## 8. Phase 3 — The webhook

New endpoint: `POST /api/stripe/webhook`

- **Verify the signature** against `STRIPE_WEBHOOK_SECRET` on the raw request body, before parsing
  anything. An unsigned or badly signed request is rejected. Without this check, anyone who finds
  the URL could mark orders paid.
- Must be **exempt from CSRF and authentication** — it is Stripe calling, not a logged-in user.
- Handle `checkout.session.completed`: find the order via `metadata.order_id`, set `status = paid`,
  store the payment intent, send both emails.
- **Be idempotent.** Stripe retries failed deliveries, and the same event can arrive more than
  once. If the order is already paid, acknowledge and do nothing. Otherwise customers get
  duplicate confirmation emails.
- **Always return 200 quickly.** A non-200 makes Stripe retry. If an email fails to send, that
  must not fail the webhook — the payment already happened. Log the failure instead.

Also worth handling: `checkout.session.expired` → mark the order `abandoned`, so pending rows
don't pile up forever.

---

## 9. Phase 4 — Confirmation emails

Two mailables, copying the structure of the existing consultation mail:

- **`OrderConfirmationMail`** → to the customer. Order number, items with quantities and prices,
  subtotal, shipping, tax, total. Plain and clear; this is also their receipt.
- **`OrderAdminNotificationMail`** → to `MAIL_ADMIN_ADDRESS`. Same details, so an order can be
  fulfilled without logging into the dashboard.

Sent from the webhook, after the order is marked paid. Wrapped so a mail failure is logged rather
than thrown. Stripe also emails its own payment receipt, which is separate from ours.

---

## 10. Phase 5 — Frontend

- **Checkout button** → calls `POST /api/checkout/session`, then `window.location = url`. A full
  redirect, not a React route change.
- **New `/checkout/success` page** → reads `session_id` from the URL, calls
  `GET /api/orders/by-session/{id}`, clears the cart, shows the order number and a "check your
  email" line. If the webhook hasn't landed yet, show "payment confirming…" and retry a couple of
  times rather than claiming failure.
- **Cancel** → returns to the cart with everything still in it.
- **Delete**: the fake card form in `CheckoutPage.tsx`, `lib/payment.ts` and `lib/payment.check.ts`
  (Luhn validation, brand detection, the simulated authorisation). Stripe handles all of it.

Keep collecting the customer's **email and name** on our side before redirecting, so we can email
them even if they abandon the Stripe page — or let Stripe collect the email and simplify further.
Worth deciding during this phase.

---

## 11. Phase 6 — Admin dashboard

The orders page exists; it needs:

- A **status badge**: pending (grey), paid (green), abandoned (faded).
- **Default to paid orders**, with a filter to show the rest. Otherwise abandoned carts bury the
  real ones.
- A **link to the payment in Stripe**, built from the payment intent ID, for refunds and disputes.

---

## 12. Testing

**Local webhook forwarding** — Stripe can't reach `localhost`, so during development:

```
stripe login
stripe listen --forward-to http://127.0.0.1:8000/api/stripe/webhook
```

That command prints a `whsec_...` secret for local use. Keep it separate from the server's.

**Test cards** (test mode only):

| Card | Behaviour |
|---|---|
| `4242 4242 4242 4242` | Succeeds |
| `4000 0000 0000 0002` | Declined |
| `4000 0025 0000 3155` | Requires 3-D Secure authentication |

Any future expiry date, any CVC.

**Cases to verify**

1. Successful payment → order paid, both emails arrive, shows in dashboard.
2. Declined card → order stays pending, no email, cart intact.
3. Cancel on the Stripe page → back to the cart, nothing lost.
4. **Webhook replay** (`stripe events resend`) → no duplicate emails, no double-processing.
5. **Tampered cart** — send a modified price in the request → server ignores it and charges the
   database price.
6. Success page loaded before the webhook arrives → shows "confirming", then resolves.
7. Totals in the dashboard match what Stripe actually charged, to the cent.

---

## 13. Go-live checklist

1. **Fix the API certificate.** `api.aotherapyllc.com` had an expired Let's Encrypt certificate.
   **Stripe will not deliver webhooks over an invalid certificate**, so payments would be taken
   and orders never marked paid. This is a blocker, not a nicety. Also fix the auto-renewal, since
   one expiring means renewal is already broken.
2. Swap `STRIPE_SECRET` to the live key on the server.
3. Create the **live webhook endpoint** in the Stripe dashboard pointing at
   `https://api.aotherapyllc.com/api/stripe/webhook`, subscribed to `checkout.session.completed`
   and `checkout.session.expired`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
4. `php artisan config:cache` after changing env values, or the old ones stay loaded.
5. Confirm the Stripe account is fully activated and payouts are set up.
6. **Make one real payment** with a real card, confirm the emails and the dashboard, then refund
   it from Stripe.
7. Keep an eye on the webhook delivery log in the Stripe dashboard for the first few orders.

---

## 14. Risks and deferred items

| Risk | Handling |
|---|---|
| Webhook missed or failing | Stripe retries for up to ~3 days and logs every attempt in the dashboard. The delivery log is the place to look when an order looks stuck on pending. |
| Flat 7% tax is wrong for some states | Accepted for now; it is the business's liability. Stripe Tax when it matters. |
| Prices change between adding to cart and paying | The session is built from database prices at that moment, so the customer is always charged the current price. The order stores a snapshot. |
| Abandoned pending orders accumulate | `checkout.session.expired` marks them abandoned; the dashboard filters them out by default. |
| Keys leaking | Server `.env` only, never committed, never sent to the frontend. Rotate immediately if exposed. |
| Refunds | Done in the Stripe dashboard for now. A dashboard button can come later. |

**Deliberately left for later:** delivery addresses and shipping logistics, refunds from our
dashboard, order history for logged-in customers, inventory and stock levels, discount codes.

---

## Sequence and effort

| Phase | Work | Rough effort |
|---|---|---|
| 1 | Migration, config, package | 30 min |
| 2 | Session endpoint | 1–2 h |
| 3 | Webhook | 1–2 h |
| 4 | Emails | 1 h |
| 5 | Frontend redirect, success page, deletions | 1–2 h |
| 6 | Admin status | 30 min |
| 7 | End-to-end testing | 1–2 h |

About a day in total. Each phase is testable on its own, and phases 1–4 can be verified with the
Stripe CLI before any frontend work.

**To start:** answer the three decisions in section 5, and put the keys in `backend/.env` as
`STRIPE_SECRET` and `STRIPE_WEBHOOK_SECRET` — not in chat, not in the repo.
