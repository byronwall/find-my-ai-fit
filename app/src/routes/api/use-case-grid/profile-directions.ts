import type { APIEvent } from "@solidjs/start/server";
import { generateProfileDirections } from "~/features/use-case-grid/profile-actions";

export async function POST(event: APIEvent) {
  const startedAt = Date.now();
  const result = await generateProfileDirections(await event.request.json());
  console.info("use-case-grid:profile-directions-complete", {
    ok: result.ok,
    elapsedMs: Date.now() - startedAt,
  });
  return Response.json(result);
}
