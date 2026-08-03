import { createServerFn } from "@tanstack/react-start";
import { createServerAuthClient, supabaseAdmin } from "@/integrations/supabase/client.server";
import { getCookie, setCookie, deleteCookie, getRequestHeader } from "@tanstack/react-start/server";

// Security Constants
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours

export const initializeSessionSecurityFn = createServerFn({ method: "POST" })
  .handler(
    async () => {
      // Initialize session security timestamps
      const now = Date.now().toString();
      const isProd = process.env.NODE_ENV === "production";
      setCookie("session_start", now, { httpOnly: true, secure: isProd, sameSite: "lax" });
      setCookie("session_last_active", now, { httpOnly: true, secure: isProd, sameSite: "lax" });

      return { success: true };
    },
  );

export const logoutServerFn = createServerFn({ method: "POST" })
  .handler(async () => {
  const supabase = createServerAuthClient();
  const { error } = await supabase.auth.signOut();

  deleteCookie("session_start");
  deleteCookie("session_last_active");

  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
});

export const globalLogoutServerFn = createServerFn({ method: "POST" })
  .handler(async () => {
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
export const checkAdminSessionFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = createServerAuthClient();

    // 1. Check for Bearer token attached by middleware in request header
    const authHeader = getRequestHeader("authorization") || getRequestHeader("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    let user: any = null;

    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    // 2. Fall back to cookie-based session if no Bearer token
    if (!user) {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user) {
      return false;
    }

    // 3. Verify user role in user_roles table using supabaseAdmin (bypasses RLS for security check)
    const { data: roles, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || !roles) {
      // Fallback: Check if user.email matches site admin email if user_roles entry doesn't exist yet
      if (user.email === "edapt.me@gmail.com" || user.email === "1millionaisuperstars2026@gmail.com") {
        return true;
      }
      return false;
    }

    return roles.role === "admin";
  });
