import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Package, Loader2, AlertCircle } from "lucide-react";

interface MyOrder {
  number: string;
  status: string;
  status_label: string;
  placed_at: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  carrier: string | null;
  tracking: string | null;
  tracking_url: string | null;
}

const STATUS_TONE: Record<string, string> = {
  paid: "bg-secondary text-secondary-foreground",
  ordered: "bg-secondary text-secondary-foreground",
  shipped: "bg-accent/15 text-accent-foreground",
  delivered: "bg-accent/15 text-accent-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

const MyOrdersPage = () => {
  const { user, ready, authFetch } = useAuth();
  const [orders, setOrders] = useState<MyOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch("/api/customer/orders");
        if (!res.ok) throw new Error("We couldn't load your orders just now.");
        const data = await res.json();
        if (!cancelled) setOrders(data.orders);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authFetch]);

  if (!ready) {
    return (
      <div className="min-h-screen py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" state={{ from: "/orders" }} replace />;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your orders</h1>
        <p className="text-muted-foreground mb-8">Signed in as {user.email}</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!orders && !error && (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
          </div>
        )}

        {orders?.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-14 h-14 text-muted-foreground/50 mx-auto mb-5" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Orders you place while signed in will appear here.
            </p>
            <Button className="btn-accent" asChild>
              <Link to="/shop">Browse products</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-6">
              Ordered as a guest? <Link to="/track" className="underline">Track it here</Link> with
              your order number.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {orders?.map((order) => (
            <Card key={order.number}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-mono font-semibold">{order.number}</p>
                    <p className="text-xs text-muted-foreground">Placed {order.placed_at}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_TONE[order.status] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status_label}
                  </span>
                </div>

                <Separator />

                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} <span className="text-xs">× {item.quantity}</span>
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold">${Number(order.total).toFixed(2)}</span>
                  {order.tracking && (
                    <span className="text-xs text-muted-foreground">
                      {order.carrier} {order.tracking}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/track?number=${encodeURIComponent(order.number)}&email=${encodeURIComponent(user.email)}`}>
                      View details
                    </Link>
                  </Button>
                  {order.tracking_url && (
                    <Button size="sm" className="btn-accent" asChild>
                      <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                        Track parcel
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
