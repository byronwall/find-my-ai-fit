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
  type RowId,
  type UseCase,
} from "./domain";
import { exampleFocus, exampleGrid, exampleIntent } from "./example-data";
import { initialState, type GridContextValue, type GridState, type Screen } from "./context-types";

const GridContext = createContext<GridContextValue>();

export function UseCaseGridProvider(props: ParentProps) {
  const [state, setState] = createStore<GridState>(initialState());
  const [file, setFileSignal] = createSignal<File | null>(null);
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
  ) => {
    setState({
      ...initialState(),
      savedIdeas: state.savedIdeas,
      source,
      profile: output.profile,
      useCases: output.useCases,
      intent,
      screen,
    });
  };

  const startExample = () => {
    loadGrid("example", exampleGrid, exampleIntent, "grid");
    track("example_started");
  };

  const generatePersonalGrid = async () => {
    const selectedFile = file();
    if (!selectedFile) {
      setState("error", "Choose a LinkedIn profile PDF first.");
      return;
    }
    if (selectedFile.type !== "application/pdf" || selectedFile.size > 10_000_000) {
      setState("error", "Use a PDF smaller than 10 MB.");
      return;
    }

    setState({ pending: "grid", error: null, notice: null });
    const result = await generateGrid({
      filename: selectedFile.name,
      mediaType: "application/pdf",
      base64: await fileToBase64(selectedFile),
      intent: state.intent,
    });
    if (!result.ok) {
      setState({ pending: null, error: result.error });
      track("grid_generation_failed");
      return;
    }
    loadGrid("profile-upload", result.data, state.intent, "profile-review");
    setFileSignal(null);
    track("grid_generated", { ideas: result.data.useCases.length });
  };

  const updateProfileSummary = (summary: string) => {
    if (!state.profile) return;
    setState("profile", { ...state.profile, summary });
  };

  const continueToGrid = () => setState("screen", "grid");

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
    if (state.source === "example" && cellKey(rowId, columnId) === "team:decisions") {
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
    const combined = [...state.useCases, ...(state.focus?.useCases ?? [])];
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
    continueToGrid,
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
