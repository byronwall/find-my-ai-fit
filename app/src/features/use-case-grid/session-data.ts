import { query } from "@solidjs/router";

const loadUseCaseSession = async (rawId: string) => {
  "use server";
  return (await import("./session-data.server")).loadUseCaseSession(rawId);
};

export const getUseCaseSession = query(
  loadUseCaseSession,
  "use-case-session",
);
