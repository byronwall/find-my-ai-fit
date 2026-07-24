import { ChevronLeft, ChevronRight, Sparkles } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Box } from "styled-system/jsx";
import { Button, Tooltip } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { GenerationDialog } from "./GenerationDialog";
import {
  cellKey,
  columnIds,
  columnLabels,
  groupUseCases,
  rowIds,
  rowLabels,
  type ColumnId,
  type RowId,
  type UseCase,
} from "./domain";
import { styles } from "./styles";
import { UseCaseCard } from "./UseCaseCard";

type CellProps = {
  useCases: UseCase[];
};

function CellContent(props: CellProps) {
  const grid = useUseCaseGrid();
  const visible = () => props.useCases.slice(0, 2);

  return (
    <>
      <For each={visible()}>
        {(useCase) => (
          <UseCaseCard
            useCase={useCase}
            selected={grid.isSelected(useCase.id)}
            onToggleSelected={() => grid.toggleSelected(useCase.id)}
          />
        )}
      </For>
    </>
  );
}

export function GridScreen() {
  const grid = useUseCaseGrid();
  const [generationOpen, setGenerationOpen] = createSignal(false);
  const groups = createMemo(() => groupUseCases(grid.state.useCases));
  const [mobileColumns, setMobileColumns] = createStore<Record<RowId, ColumnId>>({
    prepare: "faster",
    deliver: "decisions",
    improve: "faster",
  });
  return (
    <main class={`${styles.page} ${styles.gridPage}`}>
      <div class={styles.gridIntro}>
        <div>
          <span class={styles.eyebrow}><Sparkles size={14} /> Personalized opportunity map</span>
          <h1 class={styles.gridTitle}>Your AI use case grid</h1>
        </div>
        <p class={styles.gridIntroCopy}>
          Check every idea that feels useful. Generate a fresh set when you want a broader or different angle.
        </p>
        <div class={styles.gridIntroActions}>
          <Show when={grid.state.generationHistory.length > 1}>
            <nav class={styles.historyNav} aria-label="Idea set history">
              <Tooltip
                content="Previous idea set"
                disabled={grid.state.generationIndex === 0}
              >
                <button
                  type="button"
                  class={styles.historyButton}
                  aria-label="Show previous idea set"
                  disabled={grid.state.generationIndex === 0}
                  onClick={() => grid.showGeneration(grid.state.generationIndex - 1)}
                >
                  <ChevronLeft size={17} />
                </button>
              </Tooltip>
              <span class={styles.historyCount} aria-live="polite">
                Set {grid.state.generationIndex + 1} of {grid.state.generationHistory.length}
              </span>
              <Tooltip
                content="Next idea set"
                disabled={grid.state.generationIndex === grid.state.generationHistory.length - 1}
              >
                <button
                  type="button"
                  class={styles.historyButton}
                  aria-label="Show next idea set"
                  disabled={grid.state.generationIndex === grid.state.generationHistory.length - 1}
                  onClick={() => grid.showGeneration(grid.state.generationIndex + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </Tooltip>
            </nav>
          </Show>
          <Button
            class={styles.generationAction}
            onClick={() => setGenerationOpen(true)}
          >
            <Sparkles size={16} />
            Generate more ideas…
          </Button>
        </div>
      </div>

      <Show when={grid.state.error}>{(error) => <div class={styles.error} role="alert">{error()}</div>}</Show>

      <div class={styles.workspaceSingle}>
        <section aria-label="AI use case matrix">
          <div class={styles.matrix}>
            <div class={styles.matrixHeader} aria-hidden="true" />
            <For each={columnIds}>
              {(columnId) => <div class={styles.matrixHeader}>{columnLabels[columnId]}</div>}
            </For>
            <For each={rowIds}>
              {(rowId) => (
                <>
                  <div class={styles.rowHeader}>{rowLabels[rowId]}</div>
                  <For each={columnIds}>
                    {(columnId) => (
                      <div class={styles.cell} data-cell={cellKey(rowId, columnId)}>
                        <CellContent useCases={groups().get(cellKey(rowId, columnId)) ?? []} />
                      </div>
                    )}
                  </For>
                </>
              )}
            </For>
          </div>

          <div class={styles.mobileRows}>
            <For each={rowIds}>
              {(rowId) => (
                <section class={styles.mobileRow}>
                  <h2 class={styles.mobileRowTitle}>{rowLabels[rowId]}</h2>
                  <div class={styles.mobileTabs} role="tablist" aria-label={`${rowLabels[rowId]} dimensions`}>
                    <For each={columnIds}>
                      {(columnId) => (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={mobileColumns[rowId] === columnId}
                          class={styles.mobileTab}
                          style={{ background: mobileColumns[rowId] === columnId ? "#daddff" : undefined, color: mobileColumns[rowId] === columnId ? "#151827" : undefined }}
                          onClick={() => setMobileColumns(rowId, columnId)}
                        >
                          {columnId === "faster" ? "Faster" : columnId === "decisions" ? "Decisions" : "New capability"}
                          <Box as="span" display="block" mt="1">{groups().get(cellKey(rowId, columnId))?.length ?? 0} ideas</Box>
                        </button>
                      )}
                    </For>
                  </div>
                  <Box p="4" display="grid" gap="3" bg="brand.sage">
                    <CellContent
                      useCases={groups().get(cellKey(rowId, mobileColumns[rowId])) ?? []}
                    />
                  </Box>
                </section>
              )}
            </For>
          </div>
        </section>
      </div>
      <GenerationDialog open={generationOpen()} onOpenChange={setGenerationOpen} />
    </main>
  );
}
