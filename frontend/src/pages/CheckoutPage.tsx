import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  calculateTotals,
  luhn,
  cardBrand,
  formatCardNumber,
  formatExpiry,
  validExpiry,
  validCvc,
  FREE_SHIPPING_OVER,
} from "@/lib/payment";
import { CreditCard, Lock, ShoppingBag, CheckCircle2, Loader2, Info, AlertCircle } from "lucide-react";

interface Placed {
  number: string;
  total: number;
  email: string;
}

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    card: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Prefill from the signed-in account, without clobbering anything already typed.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      email: f.email || user.email,
      name: f.name || user.name,
    }));
  }, [user]);

  const totals = useMemo(() => calculateTotals(totalPrice), [totalPrice]);
  const brand = cardBrand(form.card);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value =
      key === "card" ? formatCardNumber(raw)
      : key === "expiry" ? formatExpiry(raw)
      : key === "cvc" ? raw.replace(/\D/g, "").slice(0, 4)
      : raw;
    setForm((f) => ({ ...f, [key]: value }));
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
    if (!form.name.trim()) next.name = "Enter the delivery name.";
    if (!form.address.trim()) next.address = "Enter a street address.";
    if (!form.city.trim()) next.city = "Enter a city.";
    if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) next.zip = "Enter a valid ZIP code.";
    if (!luhn(form.card)) next.card = "Enter a valid card number.";
    if (!validExpiry(form.expiry)) next.expiry = "Enter a valid future date (MM/YY).";
    if (!validCvc(form.cvc, brand))
      next.cvc = brand === "amex" ? "Amex CVC is 4 digits." : "CVC is 3 digits.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    setSubmitError(null);
    try {
      // No gateway yet: the server records the order (pricing it from the DB) and it
      // shows up in the admin dashboard. Card details never leave the page — only the last 4.
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
          card_last4: form.card.replace(/\D/g, "").slice(-4),
          items: items.map((i) => ({ id: Number(i.id), quantity: i.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Order failed (${res.status}).`);
      setPlaced({ number: data.number, total: Number(data.total), email: data.email });
      clearCart(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(
        err instanceof TypeError
          ? "We couldn't reach the store. Check your connection and try again."
          : (err as Error).message
      );
    } finally {
      setProcessing(false);
    }
  };

  if (placed) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-lg text-center" data-aos="fade-up">
          <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">Order confirmed</h1>
          <p className="text-muted-foreground mb-8">
            Thank you. A confirmation is on its way to{" "}
            <span className="font-medium text-foreground">{placed.email}</span>.
          </p>
          <Card className="text-left mb-8">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order number</span>
                <span className="font-mono font-semibold">{placed.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order total</span>
                <span className="font-semibold">${placed.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Alert className="mb-8 text-left">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Online payment isn&apos;t live yet, so no card was charged.
            </AlertDescription>
          </Alert>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <Button className="btn-accent" asChild>
              <Link to="/">Back Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

  const field = (
    id: string,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={form[id as keyof typeof form]}
        onChange={set(id)}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        {...props}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-aos="fade-up">
          Checkout
        </h1>
        <p className="text-muted-foreground mb-8" data-aos="fade-up">
          {items.length} item{items.length === 1 ? "" : "s"} in your order
        </p>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6" noValidate>
            {!user && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <Link to="/auth" state={{ from: "/checkout" }} className="underline font-medium">
                    Sign in
                  </Link>{" "}
                  to save your details, or continue as a guest below.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {field("email", "Email", { type: "email", placeholder: "you@example.com" })}
                {field("name", "Full Name", { placeholder: "Jane Doe" })}
                {field("address", "Street Address", { placeholder: "123 Main St" })}
                <div className="grid grid-cols-2 gap-4">
                  {field("city", "City", { placeholder: "Chicago" })}
                  {field("zip", "ZIP Code", { placeholder: "60601", inputMode: "numeric" })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                  {brand !== "unknown" && (
                    <span className="text-xs font-normal capitalize text-muted-foreground ml-auto">
                      {brand}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Demo checkout &mdash; no card is charged. Test with{" "}
                    <span className="font-mono">4242 4242 4242 4242</span>, any future
                    expiry and any CVC.
                  </AlertDescription>
                </Alert>
                {field("card", "Card Number", {
                  placeholder: "4242 4242 4242 4242",
                  inputMode: "numeric",
                  autoComplete: "cc-number",
                })}
                <div className="grid grid-cols-2 gap-4">
                  {field("expiry", "Expiry (MM/YY)", {
                    placeholder: "12/29",
                    inputMode: "numeric",
                    autoComplete: "cc-exp",
                  })}
                  {field("cvc", "CVC", {
                    placeholder: brand === "amex" ? "1234" : "123",
                    inputMode: "numeric",
                    autoComplete: "cc-csc",
                  })}
                </div>
              </CardContent>
            </Card>

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full btn-accent"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ${totals.total.toFixed(2)}
                </>
              )}
            </Button>
          </form>

          {/* Summary */}
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
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
                  <span>
                    {totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
              </div>

              {totals.shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add ${(FREE_SHIPPING_OVER - totals.subtotal).toFixed(2)} more for free
                  shipping.
                </p>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
