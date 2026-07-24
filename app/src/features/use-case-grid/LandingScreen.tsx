import { ArrowRight, ChevronDown, FileText, LockKeyhole, Upload } from "lucide-solid";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { HStack, VStack } from "styled-system/jsx";
import {
  Button,
  FileUpload,
  Field,
  SimpleSelect,
  Text,
  Textarea,
} from "~/components/ui";
import { useUseCaseGrid } from "./context";
import { styles } from "./styles";

const previewIdeas = [
  "Policy answer prep",
  "Case pattern review",
  "Personal HR playbook",
  "Manager conversation prep",
  "Manager issue triage",
  "Practice simulator",
  "Workforce update drafting",
  "Grievance theme analysis",
  "Agreement navigator",
];

const previewRows = [
  { label: "Prepare + synthesize", ideas: previewIdeas.slice(0, 3) },
  { label: "Deliver + communicate", ideas: previewIdeas.slice(3, 6) },
  { label: "Review + improve", ideas: previewIdeas.slice(6, 9) },
];

const goalItems = [
  { label: "Improve my current role", value: "Improve my current role" },
  { label: "Prepare for another role", value: "Prepare for another role" },
  { label: "Support a job search", value: "Support a job search" },
  { label: "Learn and experiment", value: "Learn and experiment" },
  { label: "Explore something else", value: "Explore something else" },
];

const horizonItems = [
  { label: "This week", value: "week" },
  { label: "This quarter", value: "quarter" },
  { label: "Longer term", value: "longer-term" },
];

const recommendedDetailLength = 100;
const maxProfileFileSize = 10_000_000;
const overlayCells = Array.from({ length: 9 });

const hasDraggedFiles = (event: DragEvent) =>
  Array.from(event.dataTransfer?.types ?? []).includes("Files");

const getProfileDropError = (files: File[]) => {
  if (files.length > 1) return "Drop one PDF at a time.";
  const file = files[0];
  if (!file) return "Drop a PDF file to continue.";
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "That file is not a PDF. Drop a PDF to continue.";
  if (file.size > maxProfileFileSize) {
    return "That PDF is over 10 MB. Choose a smaller file and try again.";
  }
  return null;
};

export function LandingScreen() {
  const grid = useUseCaseGrid();
  const [isPageDragging, setIsPageDragging] = createSignal(false);
  const [dropError, setDropError] = createSignal<string | null>(null);
  const fileLabel = () =>
    grid.file()?.name ?? "Drop your LinkedIn PDF (or any other resume) here";
  const detailLength = () => grid.state.intent.notes?.length ?? 0;
  const hasRecommendedDetail = () => detailLength() >= recommendedDetailLength;

  onMount(() => {
    const handleDragEnter = (event: DragEvent) => {
      if (!hasDraggedFiles(event)) return;
      event.preventDefault();
      setIsPageDragging(true);
    };
    const handleDragOver = (event: DragEvent) => {
      if (!hasDraggedFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      setIsPageDragging(true);
    };
    const handleDragLeave = (event: DragEvent) => {
      if (event.relatedTarget === null) setIsPageDragging(false);
    };
    const handleDrop = (event: DragEvent) => {
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length === 0) return;
      event.preventDefault();
      event.stopPropagation();
      setIsPageDragging(false);
      const error = getProfileDropError(files);
      setDropError(error);
      if (!error) grid.setFile(files[0]);
    };

    document.addEventListener("dragenter", handleDragEnter, true);
    document.addEventListener("dragover", handleDragOver, true);
    document.addEventListener("dragleave", handleDragLeave, true);
    document.addEventListener("drop", handleDrop, true);

    onCleanup(() => {
      document.removeEventListener("dragenter", handleDragEnter, true);
      document.removeEventListener("dragover", handleDragOver, true);
      document.removeEventListener("dragleave", handleDragLeave, true);
      document.removeEventListener("drop", handleDrop, true);
    });
  });

  return (
    <>
      <Show when={isPageDragging()}>
        <div class={styles.pageDropOverlay} role="status" aria-live="assertive">
          <div class={styles.pageDropOverlayInner}>
            <div class={styles.pageDropOverlayTop}>
              <span class={styles.pageDropKicker}><Upload size={20} /> Profile PDF</span>
              <div class={styles.pageDropGrid} aria-hidden="true">
                <For each={overlayCells}>{() => <span />}</For>
              </div>
            </div>
            <div class={styles.pageDropMessage}>
              <p class={styles.pageDropTitle}>
                <span>Drop</span>
                <span>anywhere.</span>
              </p>
              <p class={styles.pageDropCopy}>Release to build your opportunity map.</p>
            </div>
            <div class={styles.pageDropFooter}>
              <span>PDF only</span>
              <span>Up to 10 MB</span>
            </div>
          </div>
        </div>
      </Show>

      <main class={styles.landing}>
        <section class={styles.landingHero}>
          <div class={styles.heroContent}>
            <span class={styles.eyebrow}><span class={styles.eyebrowDot} /> A practical map for your actual work</span>
            <h1 class={styles.heroTitle}>Your work already has AI opportunities.</h1>
            <p class={styles.heroCopy}>
              Find the useful ones. We organize tailored ideas around the work you do, the decisions you make, and the capabilities worth testing.
            </p>

            <div class={styles.outcomePath} aria-label="How the experience works">
              <span>Map the work</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span>Mark what fits</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span>Take one next step</span>
            </div>

          </div>

          <div class={styles.actionStack}>
            <div class={styles.profileFlow}>
              <div class={styles.intakeHeader}>
                <span class={styles.intakeKicker}>Start here</span>
                <div>
                  <Text class={styles.intakeTitle}>Build your opportunity map</Text>
                  <Text class={styles.intakeCopy}>
                    Use your LinkedIn PDF (or any other resume) as the starting context.
                  </Text>
                </div>
              </div>

              <FileUpload.Root
                class={styles.upload}
                maxFiles={1}
                maxFileSize={maxProfileFileSize}
                accept={{ "application/pdf": [".pdf"] }}
                onFileChange={(details) => {
                  setDropError(null);
                  grid.setFile(details.acceptedFiles[0] ?? null);
                }}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone
                  class={styles.dropzone}
                  aria-label="Upload a LinkedIn profile or any other resume as a PDF"
                >
                  <VStack gap="2">
                    <span class={styles.uploadIcon}><Upload size={24} /></span>
                    <Text fontWeight="800">{fileLabel()}</Text>
                    <Text color="brand.muted" textStyle="sm">PDF only · up to 10 MB · click or drag and drop</Text>
                  </VStack>
                </FileUpload.Dropzone>
              </FileUpload.Root>

              <div class={styles.profilePrimaryAction}>
                <Button
                  size="lg"
                  variant="solid"
                  loading={grid.state.pending === "profile"}
                  loadingText="Finding useful directions…"
                  disabled={!grid.file()}
                  onClick={() => void grid.generatePersonalGrid()}
                >
                  <Show when={grid.file()} fallback={<>Upload a PDF to continue <Upload size={17} /></>}>
                    Find my best directions <ArrowRight size={17} />
                  </Show>
                </Button>
                <Text class={styles.uploadPrompt}>First you’ll get nine concise choices. The full grid comes after you refine—or continue broadly.</Text>
              </div>

              <details class={styles.intentPanel}>
                <summary class={styles.intentSummary}>
                  <HStack gap="2" color="brand.ink">
                    <FileText size={17} />
                    <Text fontWeight="800">Shape the result</Text>
                    <span class={styles.optionalTag}>Optional</span>
                  </HStack>
                  <ChevronDown size={17} aria-hidden="true" />
                </summary>
                <div class={styles.intentBody}>
                  <div class={styles.intentGrid}>
                    <SimpleSelect
                      label="What are you trying to do?"
                      items={goalItems}
                      value={grid.state.intent.goal}
                      onChange={(goal) => grid.setIntent({ goal })}
                      placeholder="Choose a goal"
                      skipPortal
                    />
                    <SimpleSelect
                      label="Time horizon"
                      items={horizonItems}
                      value={grid.state.intent.timeHorizon}
                      onChange={(value) => grid.setIntent({ timeHorizon: value as "week" | "quarter" | "longer-term" })}
                      placeholder="Choose a horizon"
                      skipPortal
                    />
                  </div>
                  <Field.Root>
                    <Field.Label>Anything else that would change the result?</Field.Label>
                    <Textarea
                      rows={3}
                      maxLength={800}
                      value={grid.state.intent.notes ?? ""}
                      onInput={(event) => grid.setIntent({ notes: event.currentTarget.value })}
                      placeholder="For example: I want ideas I can test without access to production systems."
                    />
                    <Show when={!grid.file()}>
                      <div class={styles.detailMeter} aria-live="polite">
                        <span>
                          {hasRecommendedDetail()
                            ? "Good detail—add more only if it changes the result."
                            : "Add more detail to get better results."}
                        </span>
                        <strong aria-label={`${detailLength()} of 100 recommended characters`}>
                          {detailLength()}/100
                        </strong>
                      </div>
                    </Show>
                  </Field.Root>
                </div>
              </details>
            </div>

            <Show when={dropError()}>
              {(error) => <div class={styles.error} role="alert">{error()}</div>}
            </Show>
            <Show when={grid.state.error}>
              {(error) => <div class={styles.error} role="alert">{error()}</div>}
            </Show>
          </div>

          <div class={styles.heroFootnotes}>
            <div class={styles.privacy}>
              <LockKeyhole size={17} />
              <span>Your PDF is used for this generation and is not saved by this site.</span>
            </div>
            <div class={styles.exampleFallback}>
              <span>No profile handy?</span>
              <Button size="sm" variant="plain" onClick={grid.startExample}>
                Preview the HR example <ArrowRight size={15} />
              </Button>
            </div>
          </div>
        </section>

        <section class={styles.previewFrame} aria-label="Example opportunity grid preview">
          <div class={styles.previewHeader}>
            <Text class={styles.previewTitle}>See your whole AI opportunity space at a glance.</Text>
          </div>
          <p class={styles.previewMobileHint}>Swipe to scan all nine opportunity areas <ArrowRight size={14} /></p>
          <div class={styles.previewScroller}>
            <div class={styles.previewBoard}>
              <div class={styles.previewAxis} aria-hidden="true">
                <span />
                <span>Work faster</span>
                <span>Decide better</span>
                <span>Build capability</span>
              </div>
              <div class={styles.previewRows}>
                <For each={previewRows}>
                  {(row, rowIndex) => (
                    <div class={styles.previewRow}>
                      <div class={styles.previewRowLabel}>
                        <span>{row.label}</span>
                      </div>
                      <div class={styles.previewRowCells}>
                        <For each={row.ideas}>
                          {(idea, ideaIndex) => {
                            const selected = () => rowIndex() === 1 && ideaIndex() === 1;
                            return (
                              <div class={selected() ? styles.previewCellSelected : styles.previewCell}>
                                <Text>{idea}</Text>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
