import { createContext, createSignal, onMount, useContext, type ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { fileToBase64, loadSavedIdeas, postJson, savedIdeasKey, storeSavedIdeas, track } from "./client-utils";
import {
  cellKey,
  createLocalBrief,
  type ColumnId,
  type GridOutput,
  type Intent,
  type Brief,
  type FocusedOutput,
  type ProfileDirections,
  type Direction,
  type RowId,
  type UseCase,
} from "./domain";
import { exampleDirections, exampleFocus, exampleGrid, exampleIntent } from "./example-data";
import { initialState, type GridContextValue, type GridState, type Screen } from "./context-types";

const GridContext = createContext<GridContextValue>();

export function UseCaseGridProvider(props: ParentProps) {
  const [state, setState] = createStore<GridState>(initialState());
  const [file, setFileSignal] = createSignal<File | null>(null);
  const generateProfileDirections = (input: unknown) =>
    postJson<ProfileDirections>("/api/use-case-grid/profile-directions", input);
  const generateGrid = (input: unknown) => postJson<GridOutput>("/api/use-case-grid/generate", input);
  const focusCell = (input: unknown) => postJson<FocusedOutput>("/api/use-case-grid/focus", input);
  const createBrief = (input: unknown) => postJson<Brief>("/api/use-case-grid/brief", input);

  onMount(() => {
    try {
      setState("savedIdeas", loadSavedIdeas());
    } catch {
      localStorage.removeItem(savedIdeasKey);
    }
  });

  const persistSavedIdeas = (ideas: UseCase[]) => {
    setState("savedIdeas", ideas);
    storeSavedIdeas(ideas);
  };

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
      savedIdeas: state.savedIdeas,
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

    setState({ pending: "profile", error: null, notice: null });
    const result = await generateProfileDirections({
      filename: selectedFile.name,
      mediaType: "application/pdf",
      base64: await fileToBase64(selectedFile),
      intent: state.intent,
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      track("profile_analysis_failed");
      return;
    }
    setState({
      pending: null,
      source: "profile-upload",
      profile: result.data.profile,
      directions: result.data.directions,
      selectedDirectionIds: [],
      screen: "profile-review",
    });
    setFileSignal(null);
    track("profile_analyzed", { directions: result.data.directions.length });
  };

  const updateProfileSummary = (summary: string) => {
    if (!state.profile) return;
    setState("profile", { ...state.profile, summary });
  };

  const toggleDirection = (id: string) => {
    const selected = state.selectedDirectionIds.includes(id);
    setState(
      "selectedDirectionIds",
      selected
        ? state.selectedDirectionIds.filter((directionId) => directionId !== id)
        : [...state.selectedDirectionIds, id],
    );
  };

  const selectAllDirections = () => {
    const allSelected = state.selectedDirectionIds.length === state.directions.length;
    setState("selectedDirectionIds", allSelected ? [] : state.directions.map((item) => item.id));
  };

  const continueToGrid = async () => {
    if (!state.profile) return;
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
    const previousTitles = state.generationHistory.flatMap((generation) =>
      generation.useCases.map((item) => item.title),
    );
    setState({ pending: "regenerate", error: null, notice: null });
    const result = await generateGrid({
      profile: state.profile,
      intent: state.intent,
      directions: state.directions,
      previousTitles,
      refinementAnswers,
      feedback: feedback.trim() || undefined,
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      track("grid_regeneration_failed");
      return false;
    }

    const knownIds = new Set(
      state.generationHistory.flatMap((generation) =>
        generation.useCases.map((item) => item.id),
      ),
    );
    const round = state.generationHistory.length + 1;
    const uniqueUseCases = result.data.useCases.map((item, index) => {
      if (!knownIds.has(item.id)) {
        knownIds.add(item.id);
        return item;
      }
      let id = `${item.id}-round-${round}`;
      let suffix = index + 2;
      while (knownIds.has(id)) {
        id = `${item.id}-round-${round}-${suffix}`;
        suffix += 1;
      }
      knownIds.add(id);
      return { ...item, id };
    });
    const nextGeneration = { ...result.data, useCases: uniqueUseCases };
    const nextHistory = [...state.generationHistory, nextGeneration];
    setState({
      pending: null,
      useCases: nextGeneration.useCases,
      generationHistory: nextHistory,
      generationIndex: nextHistory.length - 1,
      activeUseCaseId: null,
      dismissedIds: [],
      notice: "A fresh set of 18 ideas is ready. Your earlier selections are still in the brief.",
    });
    track("grid_regenerated", {
      ideas: nextGeneration.useCases.length,
      round: nextHistory.length,
    });
    return true;
  };

  const showGeneration = (index: number) => {
    const generation = state.generationHistory[index];
    if (!generation || index === state.generationIndex) return;
    setState({
      generationIndex: index,
      useCases: generation.useCases,
      activeUseCaseId: null,
      dismissedIds: [],
      notice: `Showing idea set ${index + 1} of ${state.generationHistory.length}.`,
    });
    track("grid_history_viewed", { round: index + 1 });
  };

  const reset = () => {
    const savedIdeas = state.savedIdeas;
    setState({ ...initialState(), savedIdeas });
    setFileSignal(null);
  };

  const visibleUseCases = () =>
    state.screen === "focus" && state.focus ? state.focus.useCases : state.useCases;

  const activeUseCase = () =>
    visibleUseCases().find((item) => item.id === state.activeUseCaseId) ?? null;

  const openUseCase = (id: string) => {
    setState("activeUseCaseId", id);
    track("suggestion_opened", { id });
  };
  const closeUseCase = () => setState("activeUseCaseId", null);
  const isSelected = (id: string) => state.selectedIds.includes(id);
  const isSaved = (id: string) => state.savedIdeas.some((item) => item.id === id);

  const toggleSelected = (id: string) => {
    const wasSelected = isSelected(id);
    const next = wasSelected
      ? state.selectedIds.filter((item) => item !== id)
      : [...state.selectedIds, id];
    setState("selectedIds", next);
    track(wasSelected ? "suggestion_unselected" : "suggestion_selected", { id });
  };

  const dismiss = (id: string) => {
    if (!state.dismissedIds.includes(id)) {
      setState("dismissedIds", [...state.dismissedIds, id]);
      setState("activeUseCaseId", null);
      track("suggestion_dismissed", { id });
    }
  };

  const restoreDismissed = () => setState("dismissedIds", []);

  const toggleSaved = (id: string) => {
    const useCase = visibleUseCases().find((item) => item.id === id);
    if (!useCase) return;
    const wasSaved = isSaved(id);
    const next = wasSaved
      ? state.savedIdeas.filter((item) => item.id !== id)
      : [...state.savedIdeas, useCase].slice(-30);
    persistSavedIdeas(next);
    setState("notice", wasSaved ? "Removed from saved ideas." : "Saved for later on this device.");
    track(wasSaved ? "suggestion_unsaved" : "suggestion_saved", { id });
  };

  const exploreCell = async (rowId: RowId, columnId: ColumnId) => {
    if (!state.profile) return;
    setState({ activeCell: { rowId, columnId }, activeUseCaseId: null, error: null });
    if (state.source === "example" && cellKey(rowId, columnId) === "deliver:decisions") {
      setState({ screen: "focus", focus: exampleFocus, focusChoice: null });
      track("cell_focused", { cell: cellKey(rowId, columnId) });
      return;
    }

    setState("pending", "focus");
    const result = await focusCell({
      profile: state.profile,
      intent: state.intent,
      rowId,
      columnId,
      selectedTitles: selectedUseCases().map((item) => item.title),
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      return;
    }
    setState({ pending: null, screen: "focus", focus: result.data, focusChoice: null });
    track("cell_focused", { cell: cellKey(rowId, columnId) });
  };

  const chooseFocus = (choice: string) => setState("focusChoice", choice);

  const generateMore = async () => {
    if (!state.profile || !state.activeCell || !state.focus) return;
    if (state.source === "example") {
      const extras = exampleGrid.useCases.filter(
        (item) =>
          item.rowId === state.activeCell?.rowId &&
          item.columnId === state.activeCell?.columnId &&
          !state.focus?.useCases.some((focused) => focused.id === item.id),
      );
      if (extras.length > 0) {
        setState("focus", "useCases", [...state.focus.useCases, ...extras]);
        setState("notice", `${extras.length} more example ${extras.length === 1 ? "idea" : "ideas"} added to this area.`);
      } else {
        setState("notice", "All example ideas for this area are already shown.");
      }
      return;
    }
    setState({ pending: "focus", error: null });
    const result = await focusCell({
      profile: state.profile,
      intent: state.intent,
      rowId: state.activeCell.rowId,
      columnId: state.activeCell.columnId,
      selectedTitles: [
        ...selectedUseCases().map((item) => item.title),
        ...state.focus.useCases.map((item) => item.title),
      ],
      direction: state.focusChoice
        ? `Prioritize: ${state.focusChoice}. Generate a fresh batch and avoid duplicate ideas.`
        : "Generate a fresh batch and avoid duplicate ideas.",
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      return;
    }
    setState({ pending: null, focus: result.data });
    track("more_generated", { cell: cellKey(state.activeCell.rowId, state.activeCell.columnId) });
  };

  const backToGrid = () => {
    setState({ screen: "grid", activeCell: null, focus: null, focusChoice: null, activeUseCaseId: null });
  };

  function selectedUseCases() {
    const combined = [
      ...state.generationHistory.flatMap((generation) => generation.useCases),
      ...(state.focus?.useCases ?? []),
    ];
    const byId = new Map(combined.map((item) => [item.id, item]));
    return state.selectedIds.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    });
  }

  const buildBrief = async () => {
    if (!state.profile || state.selectedIds.length === 0) return;
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

  const backFromBrief = () => setState("screen", state.focus ? "focus" : "grid");

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
    openUseCase,
    closeUseCase,
    toggleSelected,
    dismiss,
    restoreDismissed,
    toggleSaved,
    exploreCell,
    chooseFocus,
    generateMore,
    backToGrid,
    buildBrief,
    backFromBrief,
    selectedUseCases,
    activeUseCase,
    isSelected,
    isSaved,
  };

  return <GridContext.Provider value={value}>{props.children}</GridContext.Provider>;
}

export const useUseCaseGrid = () => {
  const context = useContext(GridContext);
  if (!context) throw new Error("useUseCaseGrid must be used inside UseCaseGridProvider");
  return context;
};
