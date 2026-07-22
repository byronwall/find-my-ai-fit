import type { APIEvent } from "@solidjs/start/server";
import { generateGrid } from "~/features/use-case-grid/actions";

export async function POST(event: APIEvent) {
  const startedAt = Date.now();
  const result = await generateGrid(await event.request.json());
  console.info("use-case-grid:generate-complete", { ok: result.ok, elapsedMs: Date.now() - startedAt });
  return Response.json(result);
}
