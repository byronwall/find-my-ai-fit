import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
} from "lucide-solid";
import { For, Show } from "solid-js";
import { Button, Field, Text, Textarea } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

export function ProfileReviewScreen() {
  const grid = useUseCaseGrid();
  const selectedCount = () => grid.state.selectedDirectionIds.length;
  const allSelected = () =>
    grid.state.directions.length > 0 &&
    selectedCount() === grid.state.directions.length;
  const continueLabel = () =>
    selectedCount() === 0
      ? "Continue with a broad scan"
      : `Continue with ${selectedCount()} ${selectedCount() === 1 ? "priority" : "priorities"}`;

  return (
    <main class={styles.page}>
      <section class={styles.profileReview}>
        <header class={styles.reviewHeader}>
          <span class={styles.eyebrow}>
            <ShieldCheck size={16} /> Profile read complete
          </span>
          <h1 class={styles.reviewTitle}>Here’s the work we found.</h1>
          <p class={styles.reviewIntro}>
            Continue now for a broad opportunity map, or refine the result with any of the priorities below.
          </p>
        </header>

        <section class={styles.profileSummary} aria-labelledby="profile-summary-heading">
          <span class={styles.profileSummaryLabel}>Profile summary</span>
          <Text id="profile-summary-heading" class={styles.profileSummaryText}>
            {grid.state.profile?.summary}
          </Text>
          <div class={styles.reviewPrimaryActions}>
            <Button variant="outline" onClick={grid.reset}>Use another profile</Button>
            <Button size="lg" variant="solid" onClick={() => void grid.continueToGrid()}>
              {continueLabel()} <ArrowRight size={17} />
            </Button>
          </div>
        </section>

        <a class={styles.refineCue} href="#refine-directions">
          <ArrowDown size={18} />
          Refine the results
          <small>Optional · choose any number, including all nine</small>
        </a>

        <section id="refine-directions" aria-labelledby="direction-heading">
          <div class={styles.directionHeader}>
            <div>
              <Text id="direction-heading" fontSize="2xl" fontWeight="850" letterSpacing="tight">
                What should the map emphasize?
              </Text>
              <Text mt="1" color="brand.muted">
                Choose any useful themes. Leave all unselected for the broadest scan.
              </Text>
            </div>
            <div class={styles.directionControls}>
              <span class={styles.directionCount}>
                {selectedCount() === 0 ? "Broad scan" : `${selectedCount()} of 9 selected`}
              </span>
              <Button size="sm" variant="plain" onClick={grid.selectAllDirections}>
                {allSelected() ? "Clear all" : "Select all"}
              </Button>
            </div>
          </div>

          <div class={styles.directionGrid} role="group" aria-labelledby="direction-heading">
            <For each={grid.state.directions}>
              {(direction) => {
                const selected = () => grid.state.selectedDirectionIds.includes(direction.id);
                return (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selected()}
                    class={selected() ? styles.directionChoiceSelected : styles.directionChoice}
                    onClick={() => grid.toggleDirection(direction.id)}
                  >
                    <span class={styles.directionChoiceMark} aria-hidden="true">
                      {selected() ? <Check size={15} /> : null}
                    </span>
                    <span class={styles.directionChoiceCopy}>
                      <strong>{direction.title}</strong>
                      <span>{direction.description}</span>
                    </span>
                  </button>
                );
              }}
            </For>
          </div>
          <div class={styles.directionContinue}>
            <Button size="lg" variant="solid" onClick={() => void grid.continueToGrid()}>
              {continueLabel()} <ArrowRight size={17} />
            </Button>
          </div>
        </section>

        <section class={styles.profileEvidence} aria-labelledby="profile-evidence-heading">
          <div class={styles.evidenceHeader}>
            <Text id="profile-evidence-heading" fontSize="xl" fontWeight="850">
              What informed these choices
            </Text>
            <Text color="brand.muted" fontSize="sm">
              Source-backed facts and model inferences are separated deliberately.
            </Text>
          </div>
          <div class={styles.evidenceGrid}>
            <div class={styles.evidenceFacts}>
              <div class={styles.evidenceLabel}>
                <CheckCircle2 size={18} /> Profile facts
              </div>
              <ul>
                <For each={grid.state.profile?.facts ?? []}>{(fact) => <li>{fact}</li>}</For>
              </ul>
            </div>
            <div class={styles.evidenceInferences}>
              <div class={styles.evidenceLabel}>
                <Lightbulb size={18} /> Cautious inferences
              </div>
              <ul>
                <For each={grid.state.profile?.inferences ?? []}>{(item) => <li>{item}</li>}</For>
              </ul>
            </div>
          </div>
        </section>

        <section class={styles.profileEdit} aria-labelledby="edit-summary-heading">
          <Field.Root>
            <Field.Label id="edit-summary-heading">Edit the profile summary</Field.Label>
            <Field.HelperText>
              Optional. Correct anything that would materially change the generated ideas.
            </Field.HelperText>
            <Textarea
              rows={5}
              value={grid.state.profile?.summary ?? ""}
              onInput={(event) => grid.updateProfileSummary(event.currentTarget.value)}
            />
          </Field.Root>
        </section>

        <Show when={grid.state.error}>
          {(error) => <div class={styles.error} role="alert">{error()}</div>}
        </Show>

        <div class={styles.reviewFooter}>
          <span>
            {selectedCount() === 0
              ? "No refinements selected—the map will scan broadly."
              : `${selectedCount()} ${selectedCount() === 1 ? "priority" : "priorities"} will guide the map.`}
          </span>
          <Button size="lg" variant="solid" onClick={() => void grid.continueToGrid()}>
            {continueLabel()} <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </main>
  );
}
