import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const analyticsDetailValueSchema = z.union([z.string(), z.number()]);

const analyticsRequestRecordSchema = z.object({
  id: z.uuid(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
  method: z.string(),
  path: z.string(),
  query: z.string(),
  status: z.number().int(),
  durationMs: z.number().nonnegative(),
  requestBytes: z.number().nonnegative(),
  responseBytes: z.number().nonnegative(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  referer: z.string().optional(),
  contentType: z.string().optional(),
  responseContentType: z.string().optional(),
});

const analyticsEventRecordSchema = z.object({
  id: z.uuid(),
  event: z.string(),
  detail: z.record(z.string(), analyticsDetailValueSchema),
  occurredAt: z.iso.datetime(),
  receivedAt: z.iso.datetime(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

const analyticsStoreSchema = z.object({
  schemaVersion: z.literal(2),
  requests: z.array(analyticsRequestRecordSchema),
  events: z.array(analyticsEventRecordSchema),
});

export type AnalyticsRequestRecord = z.infer<typeof analyticsRequestRecordSchema>;
export type AnalyticsEventRecord = z.infer<typeof analyticsEventRecordSchema>;

export type AnalyticsMetric = {
  label: string;
  value: number;
  averageDurationMs: number;
  errorCount: number;
};

export type AnalyticsTrendPoint = {
  startedAt: string;
  requests: number;
  events: number;
  visitors: number;
  errors: number;
};

export type AnalyticsView = {
  from?: string;
  totals: {
    visitors: number;
    identifiedUsers: number;
    requests: number;
    events: number;
    errors: number;
    averageDurationMs: number;
    successRate: number;
  };
  trend: AnalyticsTrendPoint[];
  topPaths: AnalyticsMetric[];
  topEvents: AnalyticsMetric[];
  topVisitors: AnalyticsMetric[];
  recentRequests: AnalyticsRequestRecord[];
  recentEvents: AnalyticsEventRecord[];
};

export type AnalyticsSnapshot = {
  generatedAt: string;
  firstActivityAt?: string;
  lastActivityAt?: string;
  retainedRequestCount: number;
  retainedEventCount: number;
  views: {
    day: AnalyticsView;
    week: AnalyticsView;
    month: AnalyticsView;
    all: AnalyticsView;
  };
};

type AnalyticsStore = z.infer<typeof analyticsStoreSchema>;
type AnalyticsRecord = AnalyticsRequestRecord | AnalyticsEventRecord;

const maxRetainedRecords = 10_000;
let analyticsWriteQueue = Promise.resolve();

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

const getStorePath = () => path.join(getRuntimeDataDir(), "analytics/store.json");

const fileExists = async (filePath: string) => {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
};

const emptyStore = (): AnalyticsStore => ({
  schemaVersion: 2,
  requests: [],
  events: [],
});

const parseRecordList = <T>(
  values: unknown,
  schema: z.ZodType<T>,
) =>
  Array.isArray(values)
    ? values.flatMap((value) => {
        const parsed = schema.safeParse(value);
        return parsed.success ? [parsed.data] : [];
      })
    : [];

const readStore = async (): Promise<AnalyticsStore> => {
  const storePath = getStorePath();
  if (!(await fileExists(storePath))) return emptyStore();
  try {
    const raw = JSON.parse(await readFile(storePath, "utf8")) as {
      requests?: unknown;
      events?: unknown;
    };
    return analyticsStoreSchema.parse({
      schemaVersion: 2,
      requests: parseRecordList(raw.requests, analyticsRequestRecordSchema),
      events: parseRecordList(raw.events, analyticsEventRecordSchema),
    });
  } catch (error) {
    console.error("[analytics] store could not be read; using an empty snapshot", error);
    return emptyStore();
  }
};

const writeStore = async (store: AnalyticsStore) => {
  const storePath = getStorePath();
  await mkdir(path.dirname(storePath), { recursive: true });
  const tempPath = `${storePath}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(tempPath, storePath);
};

const queueStoreUpdate = (update: (store: AnalyticsStore) => void) => {
  analyticsWriteQueue = analyticsWriteQueue
    .then(async () => {
      const store = await readStore();
      update(store);
      store.requests = store.requests.slice(-maxRetainedRecords);
      store.events = store.events.slice(-maxRetainedRecords);
      await writeStore(store);
    })
    .catch((error) => {
      console.error("[analytics] record write failed", error);
    });
  return analyticsWriteQueue;
};

export const shouldTrackAnalyticsPath = (pathName: string) =>
  !pathName.startsWith("/_build/") &&
  !pathName.startsWith("/admin") &&
  !pathName.startsWith("/api/admin") &&
  !pathName.startsWith("/favicon") &&
  !pathName.startsWith("/apple-touch-icon") &&
  !pathName.startsWith("/site.webmanifest");

export const logAnalyticsRequest = (
  record: Omit<AnalyticsRequestRecord, "id">,
) =>
  queueStoreUpdate((store) => {
    store.requests.push({ id: randomUUID(), ...record });
  });

export const logAnalyticsEvent = (
  record: Omit<AnalyticsEventRecord, "id" | "receivedAt">,
) =>
  queueStoreUpdate((store) => {
    store.events.push({
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
      ...record,
    });
  });

const visitorId = (record: AnalyticsRecord) =>
  record.userId ? `user:${record.userId}` : record.ip ? `ip:${record.ip}` : undefined;

const visitorLabel = (record: AnalyticsRecord) =>
  record.userEmail ?? record.ip ?? "Anonymous / unknown";

const groupRecords = (
  records: AnalyticsRecord[],
  getLabel: (record: AnalyticsRecord) => string,
  limit: number,
) =>
  Array.from(
    records.reduce((groups, record) => {
      const label = getLabel(record) || "Unknown";
      const metric =
        groups.get(label) ??
        ({
          label,
          value: 0,
          averageDurationMs: 0,
          errorCount: 0,
          durationTotal: 0,
        } as AnalyticsMetric & { durationTotal: number });
      metric.value += 1;
      if ("durationMs" in record) {
        metric.durationTotal += record.durationMs;
        if (record.status >= 400) metric.errorCount += 1;
      }
      groups.set(label, metric);
      return groups;
    }, new Map<string, AnalyticsMetric & { durationTotal: number }>()),
  )
    .map(([, metric]) => metric)
    .map(({ durationTotal, ...metric }) => ({
      ...metric,
      averageDurationMs: metric.value ? Math.round(durationTotal / metric.value) : 0,
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, limit);

const startOfHour = (value: number) => {
  const date = new Date(value);
  date.setUTCMinutes(0, 0, 0);
  return date.getTime();
};

const startOfDay = (value: number) => {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
};

const buildTrend = (
  requests: AnalyticsRequestRecord[],
  events: AnalyticsEventRecord[],
  fromMs: number | undefined,
) => {
  const now = Date.now();
  const useHours = fromMs !== undefined && now - fromMs <= 26 * 60 * 60 * 1000;
  const stepMs = useHours ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const floor = useHours ? startOfHour : startOfDay;
  const activityTimes = [
    ...requests.map((record) => new Date(record.startedAt).getTime()),
    ...events.map((record) => new Date(record.occurredAt).getTime()),
  ];
  const firstMs = fromMs ?? Math.min(...activityTimes, now);
  const firstBucket = floor(firstMs);
  const lastBucket = floor(now);
  const buckets = new Map<number, AnalyticsTrendPoint & { visitorIds: Set<string> }>();
  for (let bucket = firstBucket; bucket <= lastBucket; bucket += stepMs) {
    buckets.set(bucket, {
      startedAt: new Date(bucket).toISOString(),
      requests: 0,
      events: 0,
      visitors: 0,
      errors: 0,
      visitorIds: new Set(),
    });
  }
  for (const request of requests) {
    const point = buckets.get(floor(new Date(request.startedAt).getTime()));
    if (!point) continue;
    point.requests += 1;
    if (request.status >= 400) point.errors += 1;
    const id = visitorId(request);
    if (id) point.visitorIds.add(id);
  }
  for (const event of events) {
    const point = buckets.get(floor(new Date(event.occurredAt).getTime()));
    if (!point) continue;
    point.events += 1;
    const id = visitorId(event);
    if (id) point.visitorIds.add(id);
  }
  return Array.from(buckets.values()).map(({ visitorIds, ...point }) => ({
    ...point,
    visitors: visitorIds.size,
  }));
};

const buildView = (
  allRequests: AnalyticsRequestRecord[],
  allEvents: AnalyticsEventRecord[],
  fromMs?: number,
): AnalyticsView => {
  const requests = fromMs
    ? allRequests.filter((record) => new Date(record.startedAt).getTime() >= fromMs)
    : allRequests;
  const events = fromMs
    ? allEvents.filter((record) => new Date(record.occurredAt).getTime() >= fromMs)
    : allEvents;
  const allRecords: AnalyticsRecord[] = [...requests, ...events];
  const visitors = new Set(allRecords.map(visitorId).filter(Boolean));
  const identifiedUsers = new Set(
    allRecords.map((record) => record.userId).filter(Boolean),
  );
  const errors = requests.filter((record) => record.status >= 400).length;
  const durationTotal = requests.reduce(
    (total, record) => total + record.durationMs,
    0,
  );
  const successful = requests.filter((record) => record.status < 400).length;

  return {
    from: fromMs ? new Date(fromMs).toISOString() : undefined,
    totals: {
      visitors: visitors.size,
      identifiedUsers: identifiedUsers.size,
      requests: requests.length,
      events: events.length,
      errors,
      averageDurationMs: requests.length
        ? Math.round(durationTotal / requests.length)
        : 0,
      successRate: requests.length
        ? Math.round((successful / requests.length) * 10_000) / 100
        : 100,
    },
    trend: buildTrend(requests, events, fromMs),
    topPaths: groupRecords(
      requests,
      (record) => "path" in record ? `${record.method} ${record.path}` : "",
      8,
    ),
    topEvents: groupRecords(
      events,
      (record) => "event" in record ? record.event : "",
      8,
    ),
    topVisitors: groupRecords(allRecords, visitorLabel, 8),
    recentRequests: requests.slice(-40).reverse(),
    recentEvents: events.slice(-40).reverse(),
  };
};

export const getAnalyticsSnapshot = async (): Promise<AnalyticsSnapshot> => {
  await analyticsWriteQueue;
  const store = await readStore();
  const requests = [...store.requests].sort((left, right) =>
    left.startedAt.localeCompare(right.startedAt),
  );
  const events = [...store.events].sort((left, right) =>
    left.occurredAt.localeCompare(right.occurredAt),
  );
  const activity = [
    ...requests.map((record) => record.startedAt),
    ...events.map((record) => record.occurredAt),
  ].sort();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return {
    generatedAt: new Date(now).toISOString(),
    firstActivityAt: activity[0],
    lastActivityAt: activity.at(-1),
    retainedRequestCount: requests.length,
    retainedEventCount: events.length,
    views: {
      day: buildView(requests, events, now - dayMs),
      week: buildView(requests, events, now - 7 * dayMs),
      month: buildView(requests, events, now - 30 * dayMs),
      all: buildView(requests, events),
    },
  };
};
