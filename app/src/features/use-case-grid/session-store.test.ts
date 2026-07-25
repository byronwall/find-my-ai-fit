import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createLocalBrief } from "./domain";
import {
  exampleDirections,
  exampleGrid,
  exampleIntent,
} from "./example-data";
import {
  createAnalysisSession,
  getAnalysisSession,
  updateAnalysisSession,
} from "./session-store";

let testDataDir: string | undefined;
const originalDataDir = process.env.APP_DATA_DIR;

const useTemporaryDataDir = async () => {
  testDataDir = await mkdtemp(path.join(tmpdir(), "use-case-session-store-"));
  process.env.APP_DATA_DIR = testDataDir;
  return testDataDir;
};

afterEach(async () => {
  if (testDataDir) await rm(testDataDir, { recursive: true, force: true });
  testDataDir = undefined;
  if (originalDataDir === undefined) delete process.env.APP_DATA_DIR;
  else process.env.APP_DATA_DIR = originalDataDir;
});

describe("use-case session store", () => {
  it("creates an atomic refresh-safe session without retaining a PDF body", async () => {
    const dataDir = await useTemporaryDataDir();
    const session = await createAnalysisSession({
      filename: "profile.pdf",
      intent: exampleIntent,
    });

    expect(await getAnalysisSession(session.id)).toMatchObject({
      id: session.id,
      filename: "profile.pdf",
      pending: "profile",
      rounds: [],
    });
    const stored = await readFile(
      path.join(dataDir, "use-case-sessions", `${session.id}.json`),
      "utf8",
    );
    expect(stored).not.toContain("base64");
    expect(stored).not.toContain("pdf-data");
  });

  it("persists generation rounds, cross-round selections, and a brief snapshot", async () => {
    await useTemporaryDataDir();
    const session = await createAnalysisSession({
      filename: "profile.pdf",
      intent: exampleIntent,
    });
    const roundId = randomUUID();
    const generationId = randomUUID();
    const selected = exampleGrid.useCases[0];

    await updateAnalysisSession(session.id, (current) => ({
      ...current,
      profile: exampleGrid.profile,
      directions: exampleDirections,
      selectedDirectionIds: [exampleDirections[0].id],
      rounds: [
        {
          id: roundId,
          createdAt: new Date().toISOString(),
          generationId,
          sourceRoundId: null,
          refinementAnswers: {},
          feedback: null,
          output: exampleGrid,
        },
      ],
      selectedIds: [selected.id],
      brief: {
        createdAt: new Date().toISOString(),
        selectedIds: [selected.id],
        stale: false,
        output: createLocalBrief(exampleGrid.profile, [selected]),
      },
      pending: null,
      pendingRoundId: null,
    }));

    expect(await getAnalysisSession(session.id)).toMatchObject({
      revision: 1,
      selectedIds: [selected.id],
      rounds: [{ id: roundId, generationId }],
      brief: {
        selectedIds: [selected.id],
        stale: false,
      },
    });
  });

  it("serializes concurrent mutations and rejects invalid ids", async () => {
    await useTemporaryDataDir();
    const session = await createAnalysisSession({
      filename: "profile.pdf",
      intent: {},
    });
    await Promise.all([
      updateAnalysisSession(session.id, (current) => ({
        ...current,
        notice: "first",
      })),
      updateAnalysisSession(session.id, (current) => ({
        ...current,
        error: "second",
      })),
    ]);

    expect(await getAnalysisSession(session.id)).toMatchObject({
      revision: 2,
      notice: "first",
      error: "second",
    });
    expect(await getAnalysisSession("not-a-uuid")).toBeNull();
  });
});
