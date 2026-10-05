import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calculateTotals, FREE_SHIPPING_OVER } from "@/lib/payment";
import { Lock, ShoppingBag, Loader2, AlertCircle } from "lucide-react";

/**
 * Collects who is buying, then hands off to Stripe Checkout for payment.
 * Card details are entered on Stripe's page, never here, and the delivery address is
 * collected there too. The order is only marked paid by our Stripe webhook.
 */
const CheckoutPage = () => {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({ email: "", name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [redirecting, setRedirecting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Prefill from the signed-in account, without clobbering anything already typed.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, email: f.email || user.email, name: f.name || user.name }));
  }, [user]);

  const totals = useMemo(() => calculateTotals(totalPrice), [totalPrice]);
  const cancelled = params.get("cancelled") === "1";

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _drop, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.name.trim()) next.name = "Enter your name.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setRedirecting(true);
    setSubmitError(null);
    try {
      // The server re-prices every line from the database, so these ids and quantities
      // are all it needs — a price sent from here would be ignored.
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/checkout/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          name: form.name.trim(),
          items: items.map((i) => ({ id: Number(i.id), quantity: i.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message || `Checkout failed (${res.status}).`);

      window.location.href = data.url; // leave the SPA: Stripe's hosted payment page
    } catch (err) {
      setSubmitError(
        err instanceof TypeError
          ? "We couldn't reach the store. Check your connection and try again."
          : (err as Error).message
      );
      setRedirecting(false); // on success we never get here, the page is already leaving
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add a few therapeutic tools before checking out.
          </p>
          <Button className="btn-accent" onClick={() => navigate("/shop")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {cancelled && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment was cancelled, so you haven&apos;t been charged. Your cart is still here
              whenever you&apos;re ready.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Who is buying */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={set("name")}
                    aria-invalid={!!errors.name}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  <p className="text-xs text-muted-foreground">
                    Your order confirmation goes here.
                  </p>
                </div>

                <Separator />

                <p className="text-sm text-muted-foreground">
                  You&apos;ll enter your card and delivery address on Stripe&apos;s secure
                  payment page, then come straight back here.
                </p>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full btn-accent" size="lg" disabled={redirecting}>
                  {redirecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Taking you to Stripe…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${totals.total.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Payments are processed by Stripe. We never see or store your card details.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Order summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
              </div>

              {totals.shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add ${(FREE_SHIPPING_OVER - totals.subtotal).toFixed(2)} more for free shipping.
                </p>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/shop">Keep shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
