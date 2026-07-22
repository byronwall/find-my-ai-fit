import { ArrowLeft, ArrowRight, ChevronRight, Sparkles } from "lucide-solid";
import { For, Show } from "solid-js";
import { cx } from "styled-system/css";
import { Box, HStack } from "styled-system/jsx";
import { Button, Text } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { columnLabels, rowLabels } from "./domain";
import { styles } from "./styles";
import { UseCaseCard } from "./UseCaseCard";
import { UseCaseDetail } from "./UseCaseDetail";

export function FocusScreen() {
  const grid = useUseCaseGrid();
  const activeCell = () => grid.state.activeCell;
  const active = () => grid.activeUseCase();

  return (
    <main class={styles.page}>
      <div class={styles.breadcrumb} aria-label="Grid location">
        <button type="button" onClick={grid.backToGrid}>All opportunities</button>
        <ChevronRight size={14} aria-hidden="true" />
        <span>{activeCell() ? rowLabels[activeCell()!.rowId] : "Focused area"}</span>
        <ChevronRight size={14} aria-hidden="true" />
        <span>{activeCell() ? columnLabels[activeCell()!.columnId] : "Refinement"}</span>
      </div>

      <div class={styles.focusHeader}>
        <Box as="h1" fontFamily="Georgia, serif" fontSize={{ base: "4xl", md: "5xl" }} lineHeight="1.05">
          {activeCell() ? columnLabels[activeCell()!.columnId] : "Focused ideas"}
        </Box>
        <Text color="brand.muted" fontSize="lg" maxW="4xl">
          {grid.state.focus?.focusSummary}
        </Text>
      </div>

      <Show when={grid.state.focus}>
        {(focus) => (
          <>
            <Box class={styles.panel} mb="5">
              <Text fontFamily="Georgia, serif" fontSize="xl" fontWeight="bold" mb="3">
                {focus().refinementQuestion}
              </Text>
              <div class={styles.choices} role="group" aria-label="Refinement direction">
                <For each={focus().choices}>
                  {(choice) => (
                    <button
                      type="button"
                      aria-pressed={grid.state.focusChoice === choice}
                      class={cx(styles.choice, grid.state.focusChoice === choice && styles.choiceActive)}
                      onClick={() => grid.chooseFocus(choice)}
                    >
                      {choice}
                    </button>
                  )}
                </For>
              </div>
            </Box>

            <Show when={grid.state.notice}>{(notice) => <div class={styles.notice} role="status">{notice()}</div>}</Show>
            <Show when={grid.state.error}>{(error) => <div class={styles.error} role="alert">{error()}</div>}</Show>

            <div class={active() ? styles.workspace : styles.workspaceSingle}>
              <section>
                <div class={styles.focusGrid}>
                  <For each={focus().useCases.filter((item) => !grid.state.dismissedIds.includes(item.id))}>
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
                </div>
                <HStack mt="5" gap="3" justifyContent="space-between" flexWrap="wrap">
                  <Button variant="plain" onClick={grid.backToGrid}><ArrowLeft size={16} /> Back to full grid</Button>
                  <HStack gap="2" flexWrap="wrap">
                    <Button
                      variant="outline"
                      loading={grid.state.pending === "focus"}
                      loadingText="Generating a fresh batch…"
                      onClick={() => void grid.generateMore()}
                    >
                      <Sparkles size={16} /> Generate more here
                    </Button>
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
                </HStack>
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
          </>
        )}
      </Show>
    </main>
  );
}
