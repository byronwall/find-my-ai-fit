import { ArrowRight, Eye, RotateCcw, Sparkles } from "lucide-solid";
import { createMemo, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Box, HStack, VStack } from "styled-system/jsx";
import { Button, Text } from "~/components/ui";
import { useUseCaseGrid } from "./context";
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
import { UseCaseDetail } from "./UseCaseDetail";

type CellProps = {
  rowId: RowId;
  columnId: ColumnId;
  useCases: UseCase[];
};

function CellContent(props: CellProps) {
  const grid = useUseCaseGrid();
  const visible = () => props.useCases.filter((item) => !grid.state.dismissedIds.includes(item.id)).slice(0, 2);

  return (
    <>
      <For each={visible()}>
        {(useCase) => (
          <UseCaseCard
            useCase={useCase}
            selected={grid.isSelected(useCase.id)}
            saved={grid.isSaved(useCase.id)}
            onOpen={() => grid.openUseCase(useCase.id)}
            onToggleSelected={() => grid.toggleSelected(useCase.id)}
            onToggleSaved={() => grid.toggleSaved(useCase.id)}
            onDismiss={() => grid.dismiss(useCase.id)}
          />
        )}
      </For>
      <Button
        class={styles.exploreButton}
        size="sm"
        variant="plain"
        loading={grid.state.pending === "focus" && grid.state.activeCell?.rowId === props.rowId && grid.state.activeCell?.columnId === props.columnId}
        loadingText="Exploring…"
        onClick={() => void grid.exploreCell(props.rowId, props.columnId)}
      >
        <Sparkles size={15} /> Explore this area <ArrowRight size={15} />
      </Button>
    </>
  );
}

export function GridScreen() {
  const grid = useUseCaseGrid();
  const groups = createMemo(() => groupUseCases(grid.state.useCases));
  const [mobileColumns, setMobileColumns] = createStore<Record<RowId, ColumnId>>({
    individual: "faster",
    team: "decisions",
    organization: "faster",
  });
  const active = () => grid.activeUseCase();

  return (
    <main class={styles.page}>
      <VStack alignItems="stretch" gap="2" mb="6">
        <span class={styles.eyebrow}><Sparkles size={16} /> Personalized opportunity map</span>
        <Box as="h1" fontFamily="Georgia, serif" fontSize={{ base: "4xl", md: "5xl" }} lineHeight="1.05">
          Your AI use case grid
        </Box>
        <Text color="brand.muted" maxW="3xl" fontSize="lg">
          Scan the whole space, mark what feels relevant, and explore one intersection when you want narrower ideas.
        </Text>
      </VStack>

      <div class={styles.summaryBar}>
        <HStack gap="4" flexWrap="wrap">
          <HStack gap="2"><Eye size={18} color="var(--colors-brand-green)" /><Text fontWeight="semibold">{grid.state.useCases.length} personalized opportunities</Text></HStack>
          <Text color="brand.muted">{grid.state.selectedIds.length} selected · {grid.state.savedIdeas.length} saved for later</Text>
        </HStack>
        <HStack gap="2" flexWrap="wrap">
          <Show when={grid.state.dismissedIds.length > 0}>
            <Button size="sm" variant="plain" onClick={grid.restoreDismissed}><RotateCcw size={15} /> Restore dismissed</Button>
          </Show>
          <Button
            variant="solid"
            disabled={grid.state.selectedIds.length === 0}
            loading={grid.state.pending === "brief"}
            loadingText="Building your brief…"
            onClick={() => void grid.buildBrief()}
          >
            Build my next-step brief <ArrowRight size={16} />
          </Button>
        </HStack>
      </div>

      <Show when={grid.state.notice}>{(notice) => <div class={styles.notice} role="status">{notice()}</div>}</Show>
      <Show when={grid.state.error}>{(error) => <div class={styles.error} role="alert">{error()}</div>}</Show>

      <div class={active() ? styles.workspace : styles.workspaceSingle}>
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
                        <CellContent rowId={rowId} columnId={columnId} useCases={groups().get(cellKey(rowId, columnId)) ?? []} />
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
                          style={{ background: mobileColumns[rowId] === columnId ? "#dcebdc" : undefined, color: mobileColumns[rowId] === columnId ? "#075c3b" : undefined }}
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
                      rowId={rowId}
                      columnId={mobileColumns[rowId]}
                      useCases={groups().get(cellKey(rowId, mobileColumns[rowId])) ?? []}
                    />
                  </Box>
                </section>
              )}
            </For>
          </div>
        </section>

        <Show when={active()}>
          {(useCase) => (
            <UseCaseDetail
              useCase={useCase()}
              selected={grid.isSelected(useCase().id)}
              saved={grid.isSaved(useCase().id)}
              onClose={grid.closeUseCase}
              onToggleSelected={() => grid.toggleSelected(useCase().id)}
              onToggleSaved={() => grid.toggleSaved(useCase().id)}
              onDismiss={() => grid.dismiss(useCase().id)}
            />
          )}
        </Show>
      </div>
    </main>
  );
}
