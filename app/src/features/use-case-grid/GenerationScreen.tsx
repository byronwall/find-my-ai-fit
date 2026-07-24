import { Check, LoaderCircle, Sparkles } from "lucide-solid";
import { For } from "solid-js";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

const profileSteps = [
  "Reading the work in your profile",
  "Separating facts from cautious inferences",
  "Finding nine promising directions",
];

const gridSteps = [
  "Aiming at your chosen direction",
  "Looking across nine opportunity areas",
  "Removing repeats and sizing first experiments",
];

export function GenerationScreen() {
  const grid = useUseCaseGrid();
  const isProfile = () => grid.state.pending === "profile";
  const steps = () => (isProfile() ? profileSteps : gridSteps);

  return (
    <main class={styles.generationPage} aria-live="polite" aria-busy="true">
      <section class={styles.generationPanel}>
        <span class={styles.generationMark} aria-hidden="true">
          <Sparkles size={26} />
        </span>
        <div>
          <p class={styles.generationKicker}>
            {isProfile() ? "First, find the useful direction" : "Now, build the opportunity map"}
          </p>
          <h1 class={styles.generationTitle}>
            {isProfile() ? "Reading your work—not guessing at a solution." : "Building ideas around what you chose."}
          </h1>
          <p class={styles.generationCopy}>
            {isProfile()
              ? "You’ll get nine glanceable choices before we spend time generating the full grid."
              : "This is the heavier step. Your profile PDF is no longer part of the request."}
          </p>
        </div>
        <div class={styles.generationSteps}>
          <For each={steps()}>
            {(step, index) => (
              <div class={styles.generationStep}>
                <span aria-hidden="true">
                  {index() === 0 ? <LoaderCircle class={styles.generationSpinner} size={17} /> : <Check size={17} />}
                </span>
                <span>{step}</span>
              </div>
            )}
          </For>
        </div>
        <div class={styles.generationSkeleton} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
