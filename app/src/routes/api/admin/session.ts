import type { APIEvent } from "@solidjs/start/server";
import { z } from "zod";
import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "~/lib/admin/session";

const signInSchema = z.object({
  password: z.string().min(1).max(512),
});

export async function POST(event: APIEvent) {
  if (!isAdminPasswordConfigured()) {
    return Response.json(
      { error: "Admin access is not configured. Set ADMIN_PASSWORD and restart the app." },
      { status: 503 },
    );
  }
  const input = signInSchema.safeParse(await event.request.json().catch(() => null));
  if (!input.success || !verifyAdminPassword(input.data.password)) {
    return Response.json(
      { error: "That admin password is not correct." },
      { status: 401 },
    );
  }
  return Response.json(
    { ok: true },
    { headers: { "set-cookie": createAdminSessionCookie() } },
  );
}

export async function DELETE() {
  return Response.json(
    { ok: true },
    { headers: { "set-cookie": clearAdminSessionCookie() } },
  );
}
