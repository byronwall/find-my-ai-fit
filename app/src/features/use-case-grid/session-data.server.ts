import { z } from "zod";
import { getAnalysisSession } from "./session-store";

export const loadUseCaseSession = async (rawId: string) => {
  const id = z.uuid().safeParse(rawId);
  return id.success ? getAnalysisSession(id.data) : null;
};
