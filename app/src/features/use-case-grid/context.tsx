import {
  createContext,
  createEffect,
  createSignal,
  untrack,
  useContext,
  type ParentProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import { postJson, track } from "./client-utils";
import {
  createLocalBrief,
  type GridOutput,
  type Intent,
  type Brief,
  type Direction,
} from "./domain";
import { exampleDirections, exampleGrid, exampleIntent } from "./example-data";
import {
  appendUniqueGeneration,
  collectSelectedUseCases,
  generationTitles,
} from "./generation-history";
import { useSessionClient } from "./session-client";
import type {
  AnalysisSession,
  SessionRouteView,
} from "./session-domain";
import { createSessionGridState } from "./session-state";
import { initialState, type GridContextValue, type GridState, type Screen } from "./context-types";

const GridContext = createContext<GridContextValue>();

type UseCaseGridProviderProps = ParentProps<{
  session?: AnalysisSession;
  sessionView?: SessionRouteView;
  routeRoundId?: string;
}>;

export function UseCaseGridProvider(props: UseCaseGridProviderProps) {
  const [state, setState] = createStore<GridState>(
    untrack(() =>
      props.session
        ? createSessionGridState(
            props.session,
            props.sessionView ?? "review",
            props.routeRoundId,
          )
        : initialState(),
    ),
  );
  const [file, setFileSignal] = createSignal<File | null>(null);
  const generateGrid = (input: unknown) => postJson<GridOutput>("/api/use-case-grid/generate", input);
  const createBrief = (input: unknown) => postJson<Brief>("/api/use-case-grid/brief", input);
  const sessionClient = useSessionClient({
    session: () => props.session,
    state,
    setState,
    setFile: setFileSignal,
  });

  createEffect(() => {
    const session = props.session;
    if (!session) return;
    setState(
      createSessionGridState(
        session,
        props.sessionView ?? "review",
        props.routeRoundId,
      ),
    );
  });

  const setFile = (nextFile: File | null) => {
    setFileSignal(nextFile);
    setState("error", null);
    if (nextFile) track("upload_completed", { size: nextFile.size });
  };

  const setIntent = (patch: Partial<Intent>) => {
    setState("intent", (current) => ({ ...current, ...patch }));
  };

  const loadGrid = (
    source: GridState["source"],
    output: GridOutput,
    intent: Intent,
    screen: Screen,
    directions: Direction[] = [],
  ) => {
    setState({
      ...initialState(),
      source,
      profile: output.profile,
      directions,
      useCases: output.useCases,
      generationHistory: [output],
      generationIndex: 0,
      intent,
      screen,
    });
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    }
  };

  const startExample = () => {
    loadGrid("example", exampleGrid, exampleIntent, "grid", exampleDirections);
    track("example_started");
  };

  const generatePersonalGrid = async () => {
    const selectedFile = file();
    if (!selectedFile) {
      setState("error", "Choose a LinkedIn profile or another resume as a PDF first.");
      return;
    }
    if (selectedFile.type !== "application/pdf" || selectedFile.size > 10_000_000) {
      setState("error", "Use a PDF smaller than 10 MB.");
      return;
    }

    await sessionClient.startProfile(selectedFile, state.intent);
  };

  const updateProfileSummary = (summary: string) => {
    if (!state.profile) return;
    setState("profile", { ...state.profile, summary });
    sessionClient.saveSummarySoon(summary);
  };

  const toggleDirection = (id: string) => {
    const selected = state.selectedDirectionIds.includes(id);
    const next = selected
      ? state.selectedDirectionIds.filter((directionId) => directionId !== id)
      : [...state.selectedDirectionIds, id];
    setState("selectedDirectionIds", next);
    sessionClient.saveDirections(next);
  };

  const selectAllDirections = () => {
    const allSelected = state.selectedDirectionIds.length === state.directions.length;
    const next = allSelected ? [] : state.directions.map((item) => item.id);
    setState("selectedDirectionIds", next);
    sessionClient.saveDirections(next);
  };

  const continueToGrid = async () => {
    if (!state.profile) return;
    if (props.session) {
      await sessionClient.startGrid();
      return;
    }
    const selectedDirections = state.directions.filter(
      (item) => state.selectedDirectionIds.includes(item.id),
    );
    const directions = selectedDirections.length > 0 ? selectedDirections : state.directions;
    if (directions.length === 0) {
      setState("error", "We could not find any directions to build from. Try another profile.");
      return;
    }

    setState({ pending: "grid", error: null, notice: null });
    const result = await generateGrid({
      profile: state.profile,
      intent: state.intent,
      directions,
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      track("grid_generation_failed");
      return;
    }
    loadGrid("profile-upload", result.data, state.intent, "grid", directions);
    track("grid_generated", { ideas: result.data.useCases.length });
  };

  const regenerateGrid: GridContextValue["regenerateGrid"] = async ({
    refinementAnswers,
    feedback,
  }) => {
    if (!state.profile || state.directions.length === 0) return false;
    if (props.session) {
      return sessionClient.regenerate({ refinementAnswers, feedback });
    }
    setState({ pending: "regenerate", error: null, notice: null });
    const result = await generateGrid({
      profile: state.profile,
      intent: state.intent,
      directions: state.directions,
      previousTitles: generationTitles(state.generationHistory),
      refinementAnswers,
      feedback: feedback.trim() || undefined,
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      track("grid_regeneration_failed");
      return false;
    }

    const { generation: nextGeneration, history: nextHistory } =
      appendUniqueGeneration(state.generationHistory, result.data);
    setState({
      pending: null,
      useCases: nextGeneration.useCases,
      generationHistory: nextHistory,
      generationIndex: nextHistory.length - 1,
      notice: "A fresh set of 18 ideas is ready. Your earlier selections are still in the brief.",
    });
    track("grid_regenerated", {
      ideas: nextGeneration.useCases.length,
      round: nextHistory.length,
    });
    return true;
  };

  const showGeneration = (index: number) => {
    if (sessionClient.showGeneration(index)) return;
    const generation = state.generationHistory[index];
    if (!generation || index === state.generationIndex) return;
    setState({
      generationIndex: index,
      useCases: generation.useCases,
      notice: `Showing idea set ${index + 1} of ${state.generationHistory.length}.`,
    });
    track("grid_history_viewed", { round: index + 1 });
  };

  const reset = () => {
    if (sessionClient.reset()) return;
    setState(initialState());
    setFileSignal(null);
  };

  const isSelected = (id: string) => state.selectedIds.includes(id);

  const toggleSelected = (id: string) => {
    const wasSelected = isSelected(id);
    const next = wasSelected
      ? state.selectedIds.filter((item) => item !== id)
      : [...state.selectedIds, id];
    setState("selectedIds", next);
    sessionClient.saveSelections(next);
    track(wasSelected ? "suggestion_unselected" : "suggestion_selected", { id });
  };

  function selectedUseCases() {
    return collectSelectedUseCases(state.generationHistory, [], state.selectedIds);
  }

  const buildBrief = async () => {
    if (!state.profile || state.selectedIds.length === 0) return;
    if (props.session) {
      await sessionClient.buildBrief();
      return;
    }
    const selected = selectedUseCases();
    setState({ pending: "brief", error: null });
    if (state.source === "example") {
      setState({ pending: null, screen: "brief", brief: createLocalBrief(state.profile, selected) });
      track("brief_generated", { selected: selected.length });
      return;
    }
    const result = await createBrief({ profile: state.profile, intent: state.intent, selected });
    if (!result.ok) {
      setState({ pending: null, screen: "brief", brief: createLocalBrief(state.profile, selected), notice: "The live synthesis was unavailable, so we built a private local brief from your selections." });
      return;
    }
    setState({ pending: null, screen: "brief", brief: result.data });
    track("brief_generated", { selected: selected.length });
  };

  const backFromBrief = () => {
    if (sessionClient.backToIdeas()) return;
    setState("screen", "grid");
  };

  const value: GridContextValue = {
    state,
    file,
    setFile,
    setIntent,
    startExample,
    generatePersonalGrid,
    updateProfileSummary,
    toggleDirection,
    selectAllDirections,
    continueToGrid,
    regenerateGrid,
    showGeneration,
    reset,
    toggleSelected,
    buildBrief,
    backFromBrief,
    selectedUseCases,
    isSelected,
  };

  return <GridContext.Provider value={value}>{props.children}</GridContext.Provider>;
}

export const useUseCaseGrid = () => {
  const context = useContext(GridContext);
  if (!context) throw new Error("useUseCaseGrid must be used inside UseCaseGridProvider");
  return context;
};
