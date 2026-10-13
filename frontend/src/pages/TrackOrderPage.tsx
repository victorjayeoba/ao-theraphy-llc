import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Package, Loader2, AlertCircle, Truck, CheckCircle2, CreditCard } from "lucide-react";

interface TrackedOrder {
  number: string;
  status: string;
  status_label: string;
  placed_at: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  carrier: string | null;
  tracking: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
}

// The journey a paid order takes. Cancelled orders fall outside it and are shown plainly.
const STEPS = [
  { key: "paid", label: "Payment received", icon: CreditCard },
  { key: "ordered", label: "Preparing your order", icon: Package },
  { key: "shipped", label: "On its way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const TrackOrderPage = () => {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    number: params.get("number") ?? "",
    email: params.get("email") ?? "",
  });
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ number: form.number.trim(), email: form.email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "We couldn't look that order up just now.");
      setOrder(data);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "We couldn't reach the store. Check your connection and try again."
          : (err as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <Package className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Track your order</h1>
          <p className="text-muted-foreground">
            Enter your order number and the email you ordered with. No account needed.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Order number</Label>
                <Input
                  id="number"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                  placeholder="AO-XXXXXXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-accent" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Looking it up…
                  </>
                ) : (
                  "Track order"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {order && (
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="font-mono">{order.number}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Placed {order.placed_at}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.status === "cancelled" ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This order was cancelled. If that&apos;s unexpected, please get in touch.
                  </AlertDescription>
                </Alert>
              ) : (
                <ol className="space-y-4">
                  {STEPS.map((step, i) => {
                    const done = i <= stepIndex;
                    const Icon = step.icon;
                    return (
                      <li key={step.key} className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className={done ? "font-medium text-foreground" : "text-muted-foreground"}>
                          {step.label}
                          {step.key === "shipped" && order.shipped_at && (
                            <span className="text-muted-foreground font-normal"> · {order.shipped_at}</span>
                          )}
                          {step.key === "delivered" && order.delivered_at && (
                            <span className="text-muted-foreground font-normal"> · {order.delivered_at}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}

              {order.tracking && (
                <div className="bg-secondary/40 rounded-xl p-4 text-center">
                  {order.carrier && (
                    <p className="text-xs text-muted-foreground mb-1">{order.carrier}</p>
                  )}
                  <p className="font-mono font-semibold tracking-wide">{order.tracking}</p>
                  {order.tracking_url && (
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                        Track your parcel
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-xs">× {item.quantity}</span>
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Questions about this order? <Link to="/contact" className="underline">Contact us</Link>.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
