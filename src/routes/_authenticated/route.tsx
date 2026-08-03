import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAdminSessionFn } from "@/server-auth";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const isAdmin = await checkAdminSessionFn();
    if (!isAdmin) {
      throw redirect({ to: "/auth", replace: true });
    }
  },
  component: () => <Outlet />,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">Authentication Error</h2>
      <p className="mb-6 text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <a href="/auth" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-white">
        <LogOut className="h-4 w-4" /> Go to Login
      </a>
    </div>
  ),
});
