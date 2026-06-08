import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created. If email confirmation is required, check your inbox.");
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-10">
      <div className="rounded-2xl bg-card p-6" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <div
          className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-center text-xl font-bold">Admin {mode === "signin" ? "Login" : "Sign Up"}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Restricted area. Authorized admins only.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
          </div>
          <Button type="submit" disabled={busy} className="h-11 w-full text-base">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 block w-full text-center text-xs text-muted-foreground underline"
        >
          {mode === "signin" ? "First admin? Create account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}