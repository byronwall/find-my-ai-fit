import type { Accessor } from "solid-js";
import type { Brief, ColumnId, FocusedOutput, Intent, Profile, RowId, UseCase } from "./domain";

export type Screen = "landing" | "profile-review" | "grid" | "focus" | "brief";

export type GridState = {
  screen: Screen;
  source: "example" | "profile-upload" | null;
  intent: Intent;
  profile: Profile | null;
  useCases: UseCase[];
  selectedIds: string[];
  dismissedIds: string[];
  savedIdeas: UseCase[];
  activeUseCaseId: string | null;
  activeCell: { rowId: RowId; columnId: ColumnId } | null;
  focus: FocusedOutput | null;
  focusChoice: string | null;
  brief: Brief | null;
  pending: "grid" | "focus" | "brief" | null;
  error: string | null;
  notice: string | null;
};

export type GridContextValue = {
  state: GridState;
  file: Accessor<File | null>;
  setFile: (file: File | null) => void;
  setIntent: (patch: Partial<Intent>) => void;
  startExample: () => void;
  generatePersonalGrid: () => Promise<void>;
  updateProfileSummary: (summary: string) => void;
  continueToGrid: () => void;
  reset: () => void;
  openUseCase: (id: string) => void;
  closeUseCase: () => void;
  toggleSelected: (id: string) => void;
  dismiss: (id: string) => void;
  restoreDismissed: () => void;
  toggleSaved: (id: string) => void;
  exploreCell: (rowId: RowId, columnId: ColumnId) => Promise<void>;
  chooseFocus: (choice: string) => void;
  generateMore: () => Promise<void>;
  backToGrid: () => void;
  buildBrief: () => Promise<void>;
  backFromBrief: () => void;
  selectedUseCases: () => UseCase[];
  activeUseCase: () => UseCase | null;
  isSelected: (id: string) => boolean;
  isSaved: (id: string) => boolean;
};

export const initialState = (): GridState => ({
  screen: "landing",
  source: null,
  intent: {},
  profile: null,
  useCases: [],
  selectedIds: [],
  dismissedIds: [],
  savedIdeas: [],
  activeUseCaseId: null,
  activeCell: null,
  focus: null,
  focusChoice: null,
  brief: null,
  pending: null,
  error: null,
  notice: null,
});
