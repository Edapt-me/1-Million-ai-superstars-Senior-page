import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAdminSessionFn } from "@/server-auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const isAdmin = await checkAdminSessionFn();
    if (!isAdmin) {
      throw redirect({ to: "/auth", replace: true });
    }
  },
  component: () => <Outlet />,
});
