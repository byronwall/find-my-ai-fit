import type { APIEvent } from "@solidjs/start/server";
import { focusUseCaseCell } from "~/features/use-case-grid/actions";

export async function POST(event: APIEvent) {
  const startedAt = Date.now();
  const result = await focusUseCaseCell(await event.request.json());
  console.info("use-case-grid:focus-complete", { ok: result.ok, elapsedMs: Date.now() - startedAt });
  return Response.json(result);
}
