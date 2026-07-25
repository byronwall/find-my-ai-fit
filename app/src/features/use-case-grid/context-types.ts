import type { Accessor } from "solid-js";
import type {
  Brief,
  Direction,
  GridOutput,
  Intent,
  Profile,
  UseCase,
} from "./domain";

export type Screen = "landing" | "profile-review" | "grid" | "brief";

export type GridState = {
  screen: Screen;
  source: "example" | "profile-upload" | null;
  intent: Intent;
  profile: Profile | null;
  directions: Direction[];
  selectedDirectionIds: string[];
  useCases: UseCase[];
  generationHistory: GridOutput[];
  generationIndex: number;
  selectedIds: string[];
  brief: Brief | null;
  pending: "profile" | "grid" | "regenerate" | "brief" | null;
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
  toggleDirection: (id: string) => void;
  selectAllDirections: () => void;
  continueToGrid: () => Promise<void>;
  regenerateGrid: (input: {
    refinementAnswers: Record<string, string>;
    feedback: string;
  }) => Promise<boolean>;
  showGeneration: (index: number) => void;
  reset: () => void;
  toggleSelected: (id: string) => void;
  buildBrief: () => Promise<void>;
  backFromBrief: () => void;
  selectedUseCases: () => UseCase[];
  isSelected: (id: string) => boolean;
};

export const initialState = (): GridState => ({
  screen: "landing",
  source: null,
  intent: {},
  profile: null,
  directions: [],
  selectedDirectionIds: [],
  useCases: [],
  generationHistory: [],
  generationIndex: 0,
  selectedIds: [],
  brief: null,
  pending: null,
  error: null,
  notice: null,
});
