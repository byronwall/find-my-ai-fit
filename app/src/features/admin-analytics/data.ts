import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getAnalyticsSnapshot } from "~/lib/admin/analytics";
import {
  hasValidAdminSession,
  isAdminPasswordConfigured,
} from "~/lib/admin/session";

export const getAdminDashboard = query(async () => {
  "use server";
  const request = getRequestEvent()?.request;
  if (!request || !hasValidAdminSession(request)) {
    return {
      status: "signed-out" as const,
      configured: isAdminPasswordConfigured(),
    };
  }
  return {
    status: "authenticated" as const,
    snapshot: await getAnalyticsSnapshot(),
  };
}, "admin-dashboard");
