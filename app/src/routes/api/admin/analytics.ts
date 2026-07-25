import type { APIEvent } from "@solidjs/start/server";
import { getAnalyticsSnapshot } from "~/lib/admin/analytics";
import { hasValidAdminSession } from "~/lib/admin/session";

export async function GET(event: APIEvent) {
  if (!hasValidAdminSession(event.request)) {
    return Response.json({ error: "Admin sign-in required." }, { status: 401 });
  }
  return Response.json(await getAnalyticsSnapshot());
}
