import type { APIEvent } from "@solidjs/start/server";
import { z } from "zod";
import { SESSION_COOKIE, parseCookies } from "~/lib/account/session";
import { getUserBySessionId } from "~/lib/account/store";
import { logAnalyticsEvent } from "~/lib/admin/analytics";

const eventSchema = z.object({
  event: z.string().min(1).max(80),
  detail: z.record(z.string(), z.union([z.string().max(160), z.number()])),
  occurredAt: z.iso.datetime(),
});

export async function POST(event: APIEvent) {
  try {
    const payload = eventSchema.parse(await event.request.json());
    const user = await getUserBySessionId(
      parseCookies(event.request.headers.get("cookie")).get(SESSION_COOKIE),
    );
    const forwardedFor = event.request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      event.request.headers.get("x-real-ip") ||
      undefined;
    await logAnalyticsEvent({
      ...payload,
      ...(user ? { userId: user.id, userEmail: user.email } : {}),
      ip,
      userAgent: event.request.headers.get("user-agent") ?? undefined,
    });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Invalid analytics event" }, { status: 400 });
  }
}
