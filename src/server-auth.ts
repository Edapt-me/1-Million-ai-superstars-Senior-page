import { createServerFn } from "@tanstack/react-start";
import { createServerAuthClient, supabaseAdmin } from "@/integrations/supabase/client.server";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

// Security Constants
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours

export const loginServerFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(
    async ({ data: payload }) => {
      const supabase = createServerAuthClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Initialize session security timestamps
      const now = Date.now().toString();
      setCookie("session_start", now, { httpOnly: true, secure: true, sameSite: "lax" });
      setCookie("session_last_active", now, { httpOnly: true, secure: true, sameSite: "lax" });

    return { success: true };
  },
);

export const logoutServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = createServerAuthClient();
  const { error } = await supabase.auth.signOut();

  deleteCookie("session_start");
  deleteCookie("session_last_active");

  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
});

export const globalLogoutServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: true };

  const { error } = await supabaseAdmin.auth.admin.signOut(user.id, "global");
  if (error) {
    throw new Error(error.message);
  }

  deleteCookie("session_start");
  deleteCookie("session_last_active");
  await supabase.auth.signOut();
  return { success: true };
});

export const checkAdminSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // Session Security Enforcement
  const now = Date.now();
  const sessionStart = parseInt(getCookie("session_start") || "0", 10);
  const lastActive = parseInt(getCookie("session_last_active") || "0", 10);

  if (
    !sessionStart ||
    !lastActive ||
    now - lastActive > IDLE_TIMEOUT_MS ||
    now - sessionStart > ABSOLUTE_TIMEOUT_MS
  ) {
    // Session expired or tampered with
    await supabase.auth.signOut();
    deleteCookie("session_start");
    deleteCookie("session_last_active");
    return false;
  }

  // Update idle timer
  setCookie("session_last_active", now.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  // Verify role securely using the admin client
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return roles?.role === "admin";
});
