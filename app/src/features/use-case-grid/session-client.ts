import { revalidate, useAction, useNavigate } from "@solidjs/router";
import { onCleanup, type Accessor, type Setter } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { GridState } from "./context-types";
import type { Intent } from "./domain";
import {
  regenerateSessionGridAction,
  setSessionDirectionsAction,
  setSessionProfileSummaryAction,
  setSessionSelectionsAction,
  startProfileSessionAction,
  startSessionBriefAction,
  startSessionGridAction,
} from "./session-actions";
import { getUseCaseSession } from "./session-data";
import type { AnalysisSession } from "./session-domain";
import { sessionIdeasUrl } from "./session-state";
import { fileToBase64, track } from "./client-utils";

type SessionClientOptions = {
  session: Accessor<AnalysisSession | undefined>;
  state: GridState;
  setState: SetStoreFunction<GridState>;
  setFile: Setter<File | null>;
};

type SessionSaveResult = { ok: true } | { ok: false; error: string };

export const useSessionClient = (options: SessionClientOptions) => {
  const navigate = useNavigate();
  const startProfileSession = useAction(startProfileSessionAction);
  const setSessionDirections = useAction(setSessionDirectionsAction);
  const setSessionProfileSummary = useAction(setSessionProfileSummaryAction);
  const startSessionGrid = useAction(startSessionGridAction);
  const regenerateSessionGrid = useAction(regenerateSessionGridAction);
  const setSessionSelections = useAction(setSessionSelectionsAction);
  const startSessionBrief = useAction(startSessionBriefAction);
  let summarySaveTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (summarySaveTimer) clearTimeout(summarySaveTimer);
  });

  const persistMutation = async (
    operation: Promise<SessionSaveResult>,
    fallbackError: string,
  ) => {
    try {
      const result = await operation;
      if (!result.ok) options.setState("error", result.error);
    } catch {
      options.setState("error", fallbackError);
    }
  };

  const startProfile = async (file: File, intent: Intent) => {
    options.setState({ pending: "profile", error: null, notice: null });
    const result = await startProfileSession({
      filename: file.name,
      mediaType: "application/pdf",
      base64: await fileToBase64(file),
      intent,
    });
    if (!result.ok) {
      options.setState({ pending: null, error: result.error });
      track("profile_analysis_failed");
      return false;
    }
    options.setFile(null);
    track("profile_analysis_started", { sessionId: result.sessionId });
    navigate(`/sessions/${result.sessionId}/review`);
    return true;
  };

  const saveSummarySoon = (summary: string) => {
    const session = options.session();
    if (!session || summary.length < 20) return;
    if (summarySaveTimer) clearTimeout(summarySaveTimer);
    summarySaveTimer = setTimeout(() => {
      void persistMutation(
        setSessionProfileSummary({ sessionId: session.id, summary }),
        "Your profile edit could not be saved. Check your connection and try again.",
      );
    }, 350);
  };

  const saveDirections = (selectedDirectionIds: string[]) => {
    const session = options.session();
    if (!session) return;
    void persistMutation(
      setSessionDirections({
        sessionId: session.id,
        selectedDirectionIds,
      }),
      "Your priorities could not be saved. Check your connection and try again.",
    );
  };

  const startGrid = async () => {
    const session = options.session();
    const profile = options.state.profile;
    if (!session || !profile) return false;
    options.setState({ pending: "grid", error: null, notice: null });
    const result = await startSessionGrid({
      sessionId: session.id,
      summary: profile.summary,
      selectedDirectionIds: options.state.selectedDirectionIds,
    });
    if (!result.ok) {
      options.setState({ pending: null, error: result.error });
      return false;
    }
    await revalidate(getUseCaseSession.keyFor(session.id));
    navigate(sessionIdeasUrl(session.id, result.roundId));
    track("grid_generation_started", {
      sessionId: session.id,
      ...(result.roundId ? { roundId: result.roundId } : {}),
    });
    return true;
  };

  const regenerate = async (input: {
    refinementAnswers: Record<string, string>;
    feedback: string;
  }) => {
    const session = options.session();
    const sourceRound =
      session?.rounds[options.state.generationIndex] ?? session?.rounds.at(-1);
    if (!session || !sourceRound) return false;
    options.setState({
      pending: "regenerate",
      error: null,
      notice: "Generating a fresh idea set…",
    });
    const result = await regenerateSessionGrid({
      sessionId: session.id,
      sourceRoundId: sourceRound.id,
      ...input,
    });
    if (!result.ok) {
      options.setState({ pending: null, error: result.error });
      return false;
    }
    await revalidate(getUseCaseSession.keyFor(session.id));
    navigate(sessionIdeasUrl(session.id, result.roundId));
    track("grid_regeneration_started", {
      sessionId: session.id,
      ...(result.roundId ? { roundId: result.roundId } : {}),
      round: session.rounds.length + 1,
    });
    return true;
  };

  const showGeneration = (index: number) => {
    const session = options.session();
    const round = session?.rounds[index];
    if (!session || !round) return false;
    navigate(sessionIdeasUrl(session.id, round.id));
    track("grid_history_viewed", { round: index + 1 });
    return true;
  };

  const saveSelections = (selectedIds: string[]) => {
    const session = options.session();
    if (!session) return;
    void persistMutation(
      setSessionSelections({ sessionId: session.id, selectedIds }),
      "Your selections could not be saved. Check your connection and try again.",
    );
  };

  const buildBrief = async () => {
    const session = options.session();
    if (!session) return false;
    options.setState({ pending: "brief", error: null });
    const result = await startSessionBrief({ sessionId: session.id });
    if (!result.ok) {
      options.setState({ pending: null, error: result.error });
      return false;
    }
    await revalidate(getUseCaseSession.keyFor(session.id));
    navigate(`/sessions/${session.id}/brief`);
    track("brief_generation_started", {
      sessionId: session.id,
      selected: options.state.selectedIds.length,
    });
    return true;
  };

  const backToIdeas = () => {
    const session = options.session();
    if (!session) return false;
    const round =
      session.rounds[options.state.generationIndex] ?? session.rounds.at(-1);
    navigate(sessionIdeasUrl(session.id, round?.id));
    return true;
  };

  const reset = () => {
    if (!options.session()) return false;
    navigate("/");
    return true;
  };

  return {
    backToIdeas,
    buildBrief,
    regenerate,
    reset,
    saveDirections,
    saveSelections,
    saveSummarySoon,
    showGeneration,
    startGrid,
    startProfile,
  };
};
