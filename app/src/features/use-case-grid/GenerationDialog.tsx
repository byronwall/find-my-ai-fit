import { Sparkles } from "lucide-solid";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { Button, SimpleDialog, Textarea } from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

type GenerationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GenerationDialog(props: GenerationDialogProps) {
  const grid = useUseCaseGrid();
  const [draft, setDraft] = createStore({
    answers: {} as Record<string, string>,
    feedback: "",
  });
  const questions = () =>
    grid.state.generationHistory[grid.state.generationIndex]?.refinementQuestions ?? [];

  const resetDraft = () => setDraft({ answers: {}, feedback: "" });
  const handleOpenChange = (open: boolean) => {
    if (!open && grid.state.pending !== "regenerate") resetDraft();
    props.onOpenChange(open);
  };
  const generate = async () => {
    const generated = await grid.regenerateGrid({
      refinementAnswers: draft.answers,
      feedback: draft.feedback,
    });
    if (generated) {
      resetDraft();
      props.onOpenChange(false);
    }
  };
  const answerCount = () => Object.keys(draft.answers).length;

  return (
    <SimpleDialog
      open={props.open}
      onOpenChange={handleOpenChange}
      title="Where should the next set go?"
      description="Choose any directions that feel useful, then add your own steer. We’ll replace the grid with a fresh set and keep this one in history."
      maxW="900px"
      contentClass={styles.generationDialog}
      scrollBehavior="inside"
      closeLabel="Close idea generation"
      footer={
        <div class={styles.dialogFooter}>
          <span class={styles.dialogFooterNote}>
            {answerCount() > 0
              ? `${answerCount()} direction${answerCount() === 1 ? "" : "s"} selected`
              : "Choices are optional—your written feedback can lead."}
          </span>
          <Button
            class={styles.generationAction}
            loading={grid.state.pending === "regenerate"}
            loadingText="Generating a fresh set…"
            onClick={() => void generate()}
          >
            <Sparkles size={16} />
            Generate now
          </Button>
        </div>
      }
    >
      <div class={styles.generationForm}>
        <div class={styles.questionList}>
          <For each={questions()}>
            {(question, index) => (
              <section class={styles.questionBlock} aria-labelledby={`generation-question-${question.id}`}>
                <h3 id={`generation-question-${question.id}`} class={styles.questionLabel}>
                  <span class={styles.questionNumber} aria-hidden="true">{index() + 1}</span>
                  <span>{question.question}</span>
                </h3>
                <div class={styles.choiceGrid} role="radiogroup" aria-labelledby={`generation-question-${question.id}`}>
                  <For each={question.choices}>
                    {(choice) => {
                      const selected = () => draft.answers[question.id] === choice;
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={selected()}
                          class={selected() ? styles.generationOptionSelected : styles.generationOption}
                          onClick={() => setDraft("answers", question.id, choice)}
                        >
                          {choice}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </section>
            )}
          </For>
        </div>

        <div class={styles.feedbackBlock}>
          <label class={styles.feedbackLabel} for="generation-feedback">
            What should we change or explore?
          </label>
          <p id="generation-feedback-hint" class={styles.feedbackHint}>
            Mention work you want more of, ideas that felt too generic, constraints, audiences, tools, or a completely different angle.
          </p>
          <Textarea
            id="generation-feedback"
            class={styles.feedbackInput}
            aria-describedby="generation-feedback-hint"
            value={draft.feedback}
            maxLength={1200}
            placeholder="For example: Go broader than HR operations. Show me ideas that help managers learn from recurring questions, but keep everything individual-startable and low-risk."
            onInput={(event) => setDraft("feedback", event.currentTarget.value)}
          />
        </div>
      </div>
    </SimpleDialog>
  );
}
