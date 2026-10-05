import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface OrderSummary {
  number: string;
  status: string;
  total: number;
  email: string;
}

/**
 * Where Stripe sends the customer after paying.
 *
 * Payment is confirmed by our webhook, which is a separate call from Stripe to our server and
 * can land just after this page loads. So a "pending" order here means "not confirmed yet",
 * not "failed" — we poll briefly before saying anything is wrong.
 */
const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 6; // ~12s, then stop and tell them the email is the confirmation

const CheckoutSuccessPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stillWaiting, setStillWaiting] = useState(false);
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing payment reference.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/orders/by-session/${encodeURIComponent(sessionId)}`
        );
        if (!res.ok) throw new Error(`We couldn't find that order (${res.status}).`);
        const data: OrderSummary = await res.json();
        if (cancelled) return;

        setOrder(data);

        // The payment went through, so the cart is done with — whatever the webhook's state.
        if (!cleared.current) {
          cleared.current = true;
          clearCart(true);
        }

        if (data.status !== "paid" && ++attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else if (data.status !== "paid") {
          setStillWaiting(true);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <AlertCircle className="w-14 h-14 text-destructive mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-3">We couldn&apos;t load your order</h1>
          <p className="text-muted-foreground mb-8">
            {error} If you were charged, your confirmation email is on its way and your order is
            safe. Contact us and we&apos;ll sort it out.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/contact">Contact us</Link>
            </Button>
            <Button className="btn-accent" asChild>
              <Link to="/shop">Back to shop</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Confirming your payment…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-lg text-center" data-aos="fade-up">
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Thank you for your order</h1>
        <p className="text-muted-foreground mb-8">
          A confirmation is on its way to{" "}
          <span className="font-medium text-foreground">{order.email}</span>.
        </p>

        <Card className="text-left mb-8">
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-mono font-semibold">{order.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order total</span>
              <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {stillWaiting && (
          <Alert className="mb-8 text-left">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription className="text-xs">
              Your payment is still being confirmed by our payment provider. This usually takes a
              moment — your confirmation email will arrive once it&apos;s done.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
          <Button className="btn-accent" asChild>
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
