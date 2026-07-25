import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { z } from "zod";
import { hasValidAdminSession } from "~/lib/admin/session";
import {
  getGenerationRecord,
  listGenerationRecords,
} from "~/lib/ai/generation-store";

const requireAdminSession = () => {
  const request = getRequestEvent()?.request;
  if (!request || !hasValidAdminSession(request)) throw redirect("/admin");
};

export const getGenerationList = query(async () => {
  "use server";
  requireAdminSession();
  return listGenerationRecords();
}, "admin-generation-list");

export const getGenerationById = query(async (rawId: string) => {
  "use server";
  requireAdminSession();
  const parsed = z.uuid().safeParse(rawId);
  return parsed.success ? getGenerationRecord(parsed.data) : null;
}, "admin-generation-detail");
