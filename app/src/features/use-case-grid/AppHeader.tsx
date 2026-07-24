import { A } from "@solidjs/router";
import { ArrowRight, Eye } from "lucide-solid";
import { Show } from "solid-js";
import { Button } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

export function AppHeader() {
  const grid = useUseCaseGrid();
  const isGrid = () => grid.state.screen === "grid";
  const contextLabel = () => {
    if (grid.state.source === "example") return "HR Business Partner example";
    if (grid.state.profile) return grid.state.profile.roles[0] ?? "Personalized grid";
    return null;
  };

  return (
    <header class={styles.header} aria-label="Find My AI Fit">
      <div class={styles.brand}>
        <A
          href="/"
          class={styles.brandHomeLink}
          aria-label="Find My AI Fit home"
          onClick={() => {
            if (grid.state.screen !== "landing") grid.reset();
          }}
        >
          <span class={styles.brandMark} aria-hidden="true">
            <img class={styles.brandMarkImage} src="/find-my-ai-fit-mark.svg" alt="" />
          </span>
          <span class={styles.brandName}>Find My AI Fit</span>
        </A>
        <Show when={contextLabel()}>
          {(label) => <span class={styles.headerContext}>{label()}</span>}
        </Show>
      </div>
      <Show when={isGrid()}>
        <div class={styles.headerStats}>
          <span class={styles.headerStatStrong}>
            <Eye size={16} /> {grid.state.useCases.length} opportunities
          </span>
          <span>{grid.state.selectedIds.length} interesting</span>
          <Show when={grid.state.notice}>
            {(notice) => <span class={styles.headerNotice}>{notice()}</span>}
          </Show>
        </div>
      </Show>
      <Show when={isGrid()}>
        <div class={styles.headerActions}>
          <Button
            size="sm"
            variant="solid"
            disabled={grid.state.selectedIds.length === 0}
            loading={grid.state.pending === "brief"}
            loadingText="Building…"
            onClick={() => void grid.buildBrief()}
          >
            <span class={styles.headerMobileLabel}>Brief</span>
            <span class={styles.headerDesktopLabel}>Build brief</span>
            <ArrowRight size={15} />
          </Button>
        </div>
      </Show>
      <Show when={grid.state.notice}>
        {(notice) => <span class={styles.srOnly} role="status">{notice()}</span>}
      </Show>
    </header>
  );
}
