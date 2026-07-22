import type { APIEvent } from "@solidjs/start/server";
import { z } from "zod";

const eventSchema = z.object({
  event: z.string().min(1).max(80),
  detail: z.record(z.string(), z.union([z.string().max(160), z.number()])),
  occurredAt: z.iso.datetime(),
});

export async function POST(event: APIEvent) {
  try {
    const payload = eventSchema.parse(await event.request.json());
    console.info("use-case-grid:event", payload);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Invalid analytics event" }, { status: 400 });
  }
}

