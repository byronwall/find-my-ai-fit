import { query } from "@solidjs/router";
import { z } from "zod";
import {
  getGenerationRecord,
  listGenerationRecords,
} from "~/lib/ai/generation-store";

export const getGenerationList = query(async () => {
  "use server";
  return listGenerationRecords();
}, "admin-generation-list");

export const getGenerationById = query(async (rawId: string) => {
  "use server";
  const parsed = z.uuid().safeParse(rawId);
  return parsed.success ? getGenerationRecord(parsed.data) : null;
}, "admin-generation-detail");
