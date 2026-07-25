import { initialState, type GridState, type Screen } from "./context-types";
import type { AnalysisSession, SessionRouteView } from "./session-domain";

export const createSessionGridState = (
  session: AnalysisSession,
  view: SessionRouteView,
  routeRoundId?: string,
): GridState => {
  const requestedIndex = routeRoundId
    ? session.rounds.findIndex((round) => round.id === routeRoundId)
    : session.rounds.length - 1;
  const generationIndex =
    requestedIndex >= 0 ? requestedIndex : Math.max(0, session.rounds.length - 1);
  const round = session.rounds[generationIndex] ?? null;
  const screen: Screen =
    view === "review"
      ? session.profile
        ? "profile-review"
        : "landing"
      : view === "brief"
        ? "brief"
        : session.rounds.length === 0 && !session.pending
          ? "profile-review"
          : "grid";

  return {
    ...initialState(),
    source: "profile-upload",
    intent: session.intent,
    profile: session.profile,
    directions: session.directions,
    selectedDirectionIds: session.selectedDirectionIds,
    useCases: round?.output.useCases ?? [],
    generationHistory: session.rounds.map((item) => item.output),
    generationIndex,
    selectedIds: session.selectedIds,
    brief: session.brief?.output ?? null,
    pending: session.pending,
    error: session.error,
    notice: session.notice,
    screen,
  };
};

export const sessionIdeasUrl = (sessionId: string, roundId?: string) =>
  roundId
    ? `/sessions/${sessionId}/ideas/${roundId}`
    : `/sessions/${sessionId}/ideas`;
