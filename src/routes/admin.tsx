import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useIsAdmin, useSession } from "@/lib/auth";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — AutoEndri" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { session, loading } = useSession();
  const isAdmin = useIsAdmin(session?.user?.id);
  const [signingOut, setSigningOut] = useState(false);

  // refresh state when sign-out flag changes
  useEffect(() => { if (signingOut) setSigningOut(false); }, [session, signingOut]);

  if (loading || (session && isAdmin === null)) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-10 text-center text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <AdminLogin />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-4 py-10 text-center">
          <h1 className="text-lg font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({session.user.email}) is not an admin. Ask a project owner to grant the admin role.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="mt-6 text-sm text-primary underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <AdminDashboard />
    </div>
  );
}