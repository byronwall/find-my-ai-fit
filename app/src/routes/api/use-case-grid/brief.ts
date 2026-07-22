import type { APIEvent } from "@solidjs/start/server";
import { buildUseCaseBrief } from "~/features/use-case-grid/actions";

export async function POST(event: APIEvent) {
  const startedAt = Date.now();
  const result = await buildUseCaseBrief(await event.request.json());
  console.info("use-case-grid:brief-complete", { ok: result.ok, elapsedMs: Date.now() - startedAt });
  return Response.json(result);
}
