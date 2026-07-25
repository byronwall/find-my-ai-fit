import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  getAnalyticsSnapshot,
  logAnalyticsEvent,
  logAnalyticsRequest,
  shouldTrackAnalyticsPath,
} from "./analytics";

const originalDataDir = process.env.APP_DATA_DIR;
let dataDir = "";

beforeAll(async () => {
  dataDir = await mkdtemp(path.join(os.tmpdir(), "find-my-ai-fit-analytics-"));
  process.env.APP_DATA_DIR = dataDir;
});

afterAll(async () => {
  if (originalDataDir === undefined) delete process.env.APP_DATA_DIR;
  else process.env.APP_DATA_DIR = originalDataDir;
  await rm(dataDir, { recursive: true, force: true });
});

describe("analytics store", () => {
  it("combines request, visitor, and event activity into dashboard views", async () => {
    const occurredAt = new Date().toISOString();
    await Promise.all([
      logAnalyticsRequest({
        startedAt: occurredAt,
        completedAt: occurredAt,
        method: "GET",
        path: "/",
        query: "",
        status: 200,
        durationMs: 24,
        requestBytes: 0,
        responseBytes: 1200,
        ip: "203.0.113.8",
      }),
      logAnalyticsEvent({
        event: "profile_uploaded",
        detail: { filename: "resume.pdf" },
        occurredAt,
        ip: "203.0.113.8",
      }),
    ]);

    const persisted = JSON.parse(
      await readFile(path.join(dataDir, "analytics/store.json"), "utf8"),
    ) as { requests: unknown[]; events: unknown[] };
    expect(persisted.requests).toHaveLength(1);
    expect(persisted.events).toHaveLength(1);

    const snapshot = await getAnalyticsSnapshot();

    expect(snapshot.views.day.totals).toMatchObject({
      visitors: 1,
      requests: 1,
      events: 1,
      errors: 0,
    });
    expect(snapshot.views.day.topPaths[0]).toMatchObject({
      label: "GET /",
      value: 1,
    });
    expect(snapshot.views.day.topEvents[0]).toMatchObject({
      label: "profile_uploaded",
      value: 1,
    });
  });

  it("does not count admin activity as product usage", () => {
    expect(shouldTrackAnalyticsPath("/")).toBe(true);
    expect(shouldTrackAnalyticsPath("/admin")).toBe(false);
    expect(shouldTrackAnalyticsPath("/admin/generations")).toBe(false);
    expect(shouldTrackAnalyticsPath("/api/admin/analytics")).toBe(false);
  });
});
