import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const generationKindSchema = z.enum([
  "profile-directions",
  "use-case-grid",
  "focused-cell",
  "execution-brief",
]);
const generationStatusSchema = z.enum(["pending", "completed", "failed"]);

const generationErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
  stack: z.string().optional(),
});

export const generationRecordSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  kind: generationKindSchema,
  status: generationStatusSchema,
  model: z.string(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime().optional(),
  durationMs: z.number().nonnegative().optional(),
  request: z.unknown(),
  response: z.unknown().optional(),
  error: generationErrorSchema.optional(),
});

export type GenerationKind = z.infer<typeof generationKindSchema>;
export type GenerationRecord = z.infer<typeof generationRecordSchema>;

export type GenerationSummary = Pick<
  GenerationRecord,
  "id" | "kind" | "status" | "model" | "startedAt" | "completedAt" | "durationMs" | "error"
>;

const getWorkspaceRoot = () => {
  const cwd = process.cwd();
  return path.basename(cwd) === "app" ? path.dirname(cwd) : cwd;
};

const getRuntimeDataDir = () => {
  const configured = process.env.APP_DATA_DIR?.trim();
  if (!configured) return path.join(getWorkspaceRoot(), "app/data");
  return path.isAbsolute(configured) ? configured : path.join(getWorkspaceRoot(), configured);
};

const getGenerationDir = () => path.join(getRuntimeDataDir(), "generations");
const getGenerationPath = (id: string) => path.join(getGenerationDir(), `${id}.json`);

const jsonSafe = (value: unknown): unknown => {
  if (value === undefined) return null;
  return JSON.parse(
    JSON.stringify(value, (key, item) => {
      if (key === "base64" && typeof item === "string") {
        return item.startsWith("[redacted ")
          ? item
          : `[redacted base64 payload: ${item.length} characters]`;
      }
      return typeof item === "bigint" ? item.toString() : item;
    }),
  );
};

const writeRecord = async (record: GenerationRecord) => {
  const directory = getGenerationDir();
  await mkdir(directory, { recursive: true });
  const targetPath = getGenerationPath(record.id);
  const temporaryPath = `${targetPath}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  await rename(temporaryPath, targetPath);
};

export const startGenerationRecord = async (input: {
  kind: GenerationKind;
  model: string;
  request: unknown;
}) => {
  const record = generationRecordSchema.parse({
    schemaVersion: 1,
    id: randomUUID(),
    kind: input.kind,
    status: "pending",
    model: input.model,
    startedAt: new Date().toISOString(),
    request: jsonSafe(input.request),
  });
  await writeRecord(record);
  return record;
};

export const completeGenerationRecord = async (
  record: GenerationRecord,
  response: unknown,
) => {
  const completedAt = new Date();
  const completed = generationRecordSchema.parse({
    ...record,
    status: "completed",
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - new Date(record.startedAt).getTime(),
    response: jsonSafe(response),
  });
  await writeRecord(completed);
  return completed;
};

export const failGenerationRecord = async (
  record: GenerationRecord,
  error: unknown,
  response?: unknown,
) => {
  const completedAt = new Date();
  const failed = generationRecordSchema.parse({
    ...record,
    status: "failed",
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - new Date(record.startedAt).getTime(),
    response: response === undefined ? undefined : jsonSafe(response),
    error: {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
  });
  await writeRecord(failed);
  return failed;
};

export const getGenerationRecord = async (id: string) => {
  if (!z.uuid().safeParse(id).success) return null;
  try {
    return generationRecordSchema.parse(JSON.parse(await readFile(getGenerationPath(id), "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
};

export const listGenerationRecords = async (): Promise<GenerationSummary[]> => {
  let filenames: string[];
  try {
    filenames = await readdir(getGenerationDir());
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const records = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".json"))
      .map((filename) => getGenerationRecord(filename.slice(0, -5))),
  );
  return records
    .filter((record): record is GenerationRecord => record !== null)
    .map(({ id, kind, status, model, startedAt, completedAt, durationMs, error }) => ({
      id,
      kind,
      status,
      model,
      startedAt,
      completedAt,
      durationMs,
      error,
    }))
    .sort(
      (left, right) =>
        right.startedAt.localeCompare(left.startedAt) || right.id.localeCompare(left.id),
    );
};
