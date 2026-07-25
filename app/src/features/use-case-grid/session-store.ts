import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { intentSchema, type Intent } from "./domain";
import {
  analysisSessionSchema,
  type AnalysisSession,
} from "./session-domain";

const sessionQueues = new Map<string, Promise<void>>();

const getWorkspaceRoot = () => {
  const cwd = process.cwd();
  return path.basename(cwd) === "app" ? path.dirname(cwd) : cwd;
};

const getRuntimeDataDir = () => {
  const configured = process.env.APP_DATA_DIR?.trim();
  if (!configured) return path.join(getWorkspaceRoot(), "app/data");
  return path.isAbsolute(configured)
    ? configured
    : path.join(getWorkspaceRoot(), configured);
};

const getSessionDir = () => path.join(getRuntimeDataDir(), "use-case-sessions");
const getSessionPath = (id: string) => path.join(getSessionDir(), `${id}.json`);

const writeSession = async (session: AnalysisSession) => {
  const directory = getSessionDir();
  await mkdir(directory, { recursive: true });
  const targetPath = getSessionPath(session.id);
  const temporaryPath = `${targetPath}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(session, null, 2)}\n`, "utf8");
  await rename(temporaryPath, targetPath);
};

const withSessionLock = async <T>(id: string, work: () => Promise<T>) => {
  const previous = sessionQueues.get(id) ?? Promise.resolve();
  let release = () => {};
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.then(() => current);
  sessionQueues.set(id, queued);
  await previous;
  try {
    return await work();
  } finally {
    release();
    if (sessionQueues.get(id) === queued) sessionQueues.delete(id);
  }
};

export const createAnalysisSession = async (input: {
  filename: string;
  intent: Intent;
}) => {
  const now = new Date().toISOString();
  const session = analysisSessionSchema.parse({
    schemaVersion: 1,
    id: randomUUID(),
    revision: 0,
    createdAt: now,
    updatedAt: now,
    filename: input.filename,
    source: "profile-upload",
    intent: intentSchema.parse(input.intent),
    profile: null,
    directions: [],
    selectedDirectionIds: [],
    rounds: [],
    selectedIds: [],
    brief: null,
    pending: "profile",
    pendingRoundId: null,
    profileGenerationId: null,
    error: null,
    notice: null,
  });
  await writeSession(session);
  return session;
};

export const getAnalysisSession = async (id: string) => {
  if (!z.uuid().safeParse(id).success) return null;
  try {
    return analysisSessionSchema.parse(
      JSON.parse(await readFile(getSessionPath(id), "utf8")),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
};

export const updateAnalysisSession = async (
  id: string,
  update: (session: AnalysisSession) => AnalysisSession,
) =>
  withSessionLock(id, async () => {
    const current = await getAnalysisSession(id);
    if (!current) return null;
    const next = analysisSessionSchema.parse({
      ...update(current),
      id: current.id,
      schemaVersion: current.schemaVersion,
      createdAt: current.createdAt,
      revision: current.revision + 1,
      updatedAt: new Date().toISOString(),
    });
    await writeSession(next);
    return next;
  });
