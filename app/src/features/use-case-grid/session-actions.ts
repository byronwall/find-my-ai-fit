import { action } from "@solidjs/router";

const startProfileSession = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).startProfileSession(rawInput);
};

const setSessionDirections = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).setSessionDirections(rawInput);
};

const setSessionProfileSummary = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).setSessionProfileSummary(rawInput);
};

const startSessionGrid = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).startSessionGrid(rawInput);
};

const regenerateSessionGrid = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).regenerateSessionGrid(rawInput);
};

const setSessionSelections = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).setSessionSelections(rawInput);
};

const startSessionBrief = async (rawInput: unknown) => {
  "use server";
  return (await import("./session-actions.server")).startSessionBrief(rawInput);
};

export const startProfileSessionAction = action(
  startProfileSession,
  "start-use-case-profile-session",
);

export const setSessionDirectionsAction = action(
  setSessionDirections,
  "set-use-case-session-directions",
);

export const setSessionProfileSummaryAction = action(
  setSessionProfileSummary,
  "set-use-case-session-profile-summary",
);

export const startSessionGridAction = action(
  startSessionGrid,
  "start-use-case-session-grid",
);

export const regenerateSessionGridAction = action(
  regenerateSessionGrid,
  "regenerate-use-case-session-grid",
);

export const setSessionSelectionsAction = action(
  setSessionSelections,
  "set-use-case-session-selections",
);

export const startSessionBriefAction = action(
  startSessionBrief,
  "start-use-case-session-brief",
);
