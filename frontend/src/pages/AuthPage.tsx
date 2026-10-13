import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cameFrom = (location.state as { from?: string })?.from;
  // Coming from a page that bounced them (e.g. /orders) sends them back there. Otherwise a
  // returning customer is usually here to check an order, while a brand new account has none.
  const afterLogin = cameFrom ?? "/orders";
  const afterRegister = cameFrom ?? "/shop";

  const [tab, setTab] = useState("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const failure = await login(loginForm.email, loginForm.password);
    setBusy(false);
    if (failure) {
      setError(failure);
      return;
    }
    toast({ title: "Welcome back", description: "You are now signed in." });
    navigate(afterLogin, { replace: true });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupForm.password !== signupForm.confirm) {
      return setError("Passwords do not match.");
    }
    setBusy(true);
    const failure = await register(signupForm.name, signupForm.email, signupForm.password);
    setBusy(false);
    if (failure) {
      setError(failure);
      return;
    }
    toast({
      title: "Account created",
      description: "You are signed in. Orders you place now will show under My orders.",
    });
    navigate(afterRegister, { replace: true });
  };

  const switchTab = (value: string) => {
    setTab(value);
    setError(null);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-md">
        <Card data-aos="fade-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Account</CardTitle>
            <CardDescription>
              Sign in to see your orders and track deliveries.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={tab} onValueChange={switchTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      placeholder="Your password"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-accent" disabled={busy}>
                    {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign In
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    No account yet?{" "}
                    <button
                      type="button"
                      className="text-primary underline"
                      onClick={() => switchTab("register")}
                    >
                      Register here
                    </button>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      required
                      autoComplete="name"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, name: e.target.value })
                      }
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, password: e.target.value })
                      }
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={signupForm.confirm}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, confirm: e.target.value })
                      }
                      placeholder="Repeat your password"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-accent" disabled={busy}>
                    {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Account
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By registering you agree to our{" "}
                    <Link to="/terms" className="underline">Terms</Link> and{" "}
                    <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground text-center mt-6">
              Ordered as a guest?{" "}
              <Link to="/track" className="underline hover:text-foreground">
                Track your order
              </Link>{" "}
              with your order number instead.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
