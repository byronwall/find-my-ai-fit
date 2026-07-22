import { LayoutGrid, RotateCcw } from "lucide-solid";
import { Show } from "solid-js";
import { Button } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

export function AppHeader() {
  const grid = useUseCaseGrid();
  const contextLabel = () => {
    if (grid.state.source === "example") return "HR Business Partner example";
    if (grid.state.profile) return grid.state.profile.roles[0] ?? "Personalized grid";
    return null;
  };

  return (
    <header class={styles.header}>
      <div class={styles.brand}>
        <span class={styles.brandMark} aria-hidden="true">
          <LayoutGrid size={20} />
        </span>
        <span class={styles.brandName}>AI Use Case Grid</span>
        <Show when={contextLabel()}>
          {(label) => <span class={styles.headerContext}>{label()}</span>}
        </Show>
      </div>
      <Show when={grid.state.screen !== "landing"}>
        <Button variant="outline" size="sm" onClick={grid.reset}>
          <RotateCcw size={15} />
          Start over
        </Button>
      </Show>
    </header>
  );
}

