import type { GenerationRecord } from "~/lib/ai/generation-store";

export type DataRecord = Record<string, unknown>;

export const asRecord = (value: unknown): DataRecord | undefined =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as DataRecord
    : undefined;

export const asRecords = (value: unknown): DataRecord[] =>
  Array.isArray(value)
    ? value.map(asRecord).filter((item): item is DataRecord => item !== undefined)
    : [];

export const asStrings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

export const readString = (record: DataRecord | undefined, key: string) =>
  typeof record?.[key] === "string" ? record[key] as string : undefined;

export const readNumber = (record: DataRecord | undefined, key: string) =>
  typeof record?.[key] === "number" ? record[key] as number : undefined;

export const getRequest = (generation: GenerationRecord) =>
  asRecord(generation.request);

export const getInput = (generation: GenerationRecord) =>
  asRecord(getRequest(generation)?.input);

export const getResponse = (generation: GenerationRecord) =>
  asRecord(generation.response);

export const getOutput = (generation: GenerationRecord) => {
  const response = getResponse(generation);
  return asRecord(response?.normalizedOutput) ?? asRecord(response?.output);
};

export const getUsage = (generation: GenerationRecord) =>
  asRecord(getResponse(generation)?.usage);

export const kindLabels: Record<GenerationRecord["kind"], string> = {
  "profile-directions": "Profile directions",
  "use-case-grid": "Use-case grid",
  "focused-cell": "Focused exploration",
  "execution-brief": "Execution brief",
};

export const formatCount = (value: number | undefined) =>
  value === undefined ? "—" : value.toLocaleString("en-US");

export const formatDuration = (value: number | undefined) => {
  if (value === undefined) return "In progress";
  if (value < 1_000) return `${value} ms`;
  if (value < 60_000) return `${(value / 1_000).toFixed(1)} sec`;
  const minutes = Math.floor(value / 60_000);
  const seconds = Math.round((value % 60_000) / 1_000);
  return `${minutes}m ${seconds}s`;
};

export const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));

export const prettyJson = (value: unknown) =>
  JSON.stringify(
    value,
    (key, item) => {
      if (key === "base64" && typeof item === "string") {
        return item.startsWith("[redacted PDF:")
          ? item
          : `[legacy base64 payload; ${item.length.toLocaleString("en-US")} characters omitted]`;
      }
      return item;
    },
    2,
  );
