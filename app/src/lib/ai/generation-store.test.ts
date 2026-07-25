import { mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  completeGenerationRecord,
  failGenerationRecord,
  getGenerationRecord,
  listGenerationRecords,
  startGenerationRecord,
} from "./generation-store";

let testDataDir: string | undefined;
const originalDataDir = process.env.APP_DATA_DIR;

const useTemporaryDataDir = async () => {
  testDataDir = await mkdtemp(path.join(tmpdir(), "generation-store-"));
  process.env.APP_DATA_DIR = testDataDir;
  return testDataDir;
};

afterEach(async () => {
  if (testDataDir) await rm(testDataDir, { recursive: true, force: true });
  testDataDir = undefined;
  if (originalDataDir === undefined) delete process.env.APP_DATA_DIR;
  else process.env.APP_DATA_DIR = originalDataDir;
});

describe("generation store", () => {
  it("persists and reloads a completed generation by UUID", async () => {
    const dataDir = await useTemporaryDataDir();
    const sessionId = crypto.randomUUID();
    const roundId = crypto.randomUUID();
    const pending = await startGenerationRecord({
      kind: "use-case-grid",
      model: "test-model",
      request: { prompt: "Build a grid", base64: "pdf-data" },
      sessionId,
      roundId,
    });
    await completeGenerationRecord(pending, {
      output: { useCases: [] },
      usage: { inputTokens: 12, outputTokens: 4 },
    });

    const reloaded = await getGenerationRecord(pending.id);
    expect(reloaded).toMatchObject({
      id: pending.id,
      sessionId,
      roundId,
      status: "completed",
      model: "test-model",
      response: { output: { useCases: [] } },
    });
    const stored = await readFile(
      path.join(dataDir, "generations", `${pending.id}.json`),
      "utf8",
    );
    expect(stored).toContain("[redacted base64 payload: 8 characters]");
    expect(stored).not.toContain("pdf-data");
  });

  it("retains failed and pending attempts in newest-first listings", async () => {
    await useTemporaryDataDir();
    const pending = await startGenerationRecord({
      kind: "focused-cell",
      model: "test-model",
      request: { prompt: "Refine" },
    });
    const failed = await startGenerationRecord({
      kind: "execution-brief",
      model: "test-model",
      request: { prompt: "Summarize" },
    });
    await failGenerationRecord(failed, new Error("Provider unavailable"));

    const listed = await listGenerationRecords();
    expect(listed).toHaveLength(2);
    expect(listed.find((record) => record.id === failed.id)).toMatchObject({
      status: "failed",
      error: { name: "Error", message: "Provider unavailable" },
    });
    expect(listed.find((record) => record.id === pending.id)?.status).toBe("pending");
    expect(await getGenerationRecord("not-a-uuid")).toBeNull();
  });

  it("accepts the profile-direction stage as a traceable generation kind", async () => {
    await useTemporaryDataDir();
    const pending = await startGenerationRecord({
      kind: "profile-directions",
      model: "test-model",
      request: { input: { base64: "[redacted PDF: profile.pdf]" } },
    });

    expect(await getGenerationRecord(pending.id)).toMatchObject({
      kind: "profile-directions",
      request: { input: { base64: "[redacted PDF: profile.pdf]" } },
    });
  });
});
